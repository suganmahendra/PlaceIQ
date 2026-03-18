import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

serve(async (_req: Request) => {
  try {
    // 1. Init Supabase with Service Role key — auto-injected, bypasses RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Fetch all students
    const { data: students, error: studentError } = await supabaseClient
      .from('students')
      .select('id, full_name, user_id, xp, readiness_score')

    if (studentError) throw studentError
    if (!students || students.length === 0) {
      return new Response(JSON.stringify({ message: "No students found" }), { status: 200 })
    }

    // 3. Fetch ALL mentors once (not per-student)
    const { data: mentors } = await supabaseClient
      .from('mentors')
      .select('id, user_id')

    let flaggedCount = 0
    const results: Array<{ name: string; risk: boolean; prob: number }> = []

    for (const student of students) {

      // --- Enrollments ---
      const { data: enrollments } = await supabaseClient
        .from('enrollments')
        .select('id')
        .eq('student_id', student.id)
        .neq('status', 'dropped')

      const enrolledCourses = enrollments?.length ?? 0
      const enrollmentIds = (enrollments ?? []).map((e: { id: string }) => e.id)

      let lessonsCompleted = 0
      let totalSeconds = 0
      let daysActive = 30 // default: assume inactive (worst case)

      if (enrollmentIds.length > 0) {
        const { data: lpData } = await supabaseClient
          .from('lesson_progress')
          .select('watch_time_seconds, is_completed, last_watched_at')
          .in('enrollment_id', enrollmentIds)
          .order('last_watched_at', { ascending: false })

        if (lpData && lpData.length > 0) {
          lessonsCompleted = lpData.filter((lp: { is_completed: boolean }) => lp.is_completed).length
          totalSeconds = lpData.reduce((sum: number, p: { watch_time_seconds: number }) => sum + (p.watch_time_seconds || 0), 0)
          if (lpData[0].last_watched_at) {
            const lastActive = new Date(lpData[0].last_watched_at)
            daysActive = Math.ceil(Math.abs(Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
          }
        }
      }

      const avg_hours_per_day = parseFloat((totalSeconds / 3600 / 7).toFixed(1))
      const total_weekly_hours = parseFloat((totalSeconds / 3600).toFixed(1))

      // --- Quiz Pass Rate → Focus Score ---
      const { data: quizzes } = await supabaseClient
        .from('quiz_attempts')
        .select('passed')
        .eq('student_id', student.id)

      let focusScore = 0
      if (quizzes && quizzes.length > 0) {
        focusScore = Math.round((quizzes.filter((q: { passed: boolean }) => q.passed).length / quizzes.length) * 100)
      }
      const distractScore = 100 - focusScore

      // --- Call Hugging Face Gradio API (2-step: POST → event_id → GET result) ---
      const ML_PAYLOAD = {
        data: [
          avg_hours_per_day,
          total_weekly_hours,
          daysActive,
          lessonsCompleted,
          focusScore,
          distractScore,
          student.readiness_score || 0,
          student.xp || 0,
          enrolledCourses
        ]
      }

      const HF_BASE = "https://Sugan145-placeiq-retention-predictor.hf.space/gradio_api"

      let isHighRisk = false
      let risk_prob = 0

      try {
        // Step 1: Submit the prediction job, get event_id
        const submitRes = await fetch(`${HF_BASE}/call/predict_dropout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ML_PAYLOAD)
        })
        if (!submitRes.ok) throw new Error(`HF submit failed: ${submitRes.status}`)
        const { event_id } = await submitRes.json()

        // Step 2: Poll the SSE stream to get the actual prediction result
        const resultRes = await fetch(`${HF_BASE}/call/predict_dropout/${event_id}`)
        if (!resultRes.ok) throw new Error(`HF result fetch failed: ${resultRes.status}`)
        const sseText = await resultRes.text()

        // Parse SSE: find the "data:" line after "event: complete"
        const lines = sseText.split('\n')
        let predictionData: { is_high_risk: boolean; risk_probability_percentage: number } | null = null
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('data:')) {
            try {
              const parsed = JSON.parse(lines[i].slice(5).trim())
              if (Array.isArray(parsed) && parsed[0]?.is_high_risk !== undefined) {
                predictionData = parsed[0]
              }
            } catch { /* ignore non-JSON data lines */ }
          }
        }

        if (predictionData) {
          isHighRisk = predictionData.is_high_risk
          risk_prob = predictionData.risk_probability_percentage
        }
      } catch (hfErr) {
        console.error(`HF API error for ${student.full_name}:`, hfErr)
        results.push({ name: student.full_name, risk: false, prob: 0 })
        continue
      }

      results.push({ name: student.full_name, risk: isHighRisk, prob: risk_prob })

      // --- If at risk, build rich structured notifications ---
      if (isHighRisk) {
        flaggedCount++

        // A) Mentor alert stored as JSON so the UI can render structured rows
        const mentorPayload = JSON.stringify({
          student_name: student.full_name,
          student_id: student.id,
          risk_prob,
          metrics: {
            weekly_hours: total_weekly_hours,
            avg_hours_per_day,
            focus_score: focusScore,
            distraction_score: distractScore,
            readiness_score: student.readiness_score || 0,
            lessons_completed: lessonsCompleted,
            xp: student.xp || 0,
            enrolled_courses: enrolledCourses,
            days_since_active: daysActive,
          }
        })

        for (const mentor of (mentors ?? [])) {
          await supabaseClient.from('notifications').insert({
            user_id: mentor.user_id,
            type: 'ai_alert',
            title: `${student.full_name} — ${risk_prob}% dropout risk`,
            message: mentorPayload,
            read: false,
            action_url: `/mentor/cms/explorer?student=${student.id}`
          })
        }

        // B) Student notification — clean personal feedback
        const studentIssues: string[] = []
        if (total_weekly_hours < 1) studentIssues.push("You haven't been studying much this week (less than 1 hour total)")
        if (focusScore < 50)        studentIssues.push("Your quiz performance is low — try revisiting recent lessons")
        if (daysActive > 7)         studentIssues.push(`You haven't been active on the platform in ${daysActive} days`)
        if (lessonsCompleted < 3)   studentIssues.push("You've completed very few lessons so far")
        if ((student.readiness_score || 0) < 30) studentIssues.push("Your overall readiness score is below the recommended level")

        const studentMsg = studentIssues.length > 0
          ? `Your mentor has been notified about your progress. Here's what needs attention:\n${studentIssues.map(i => `• ${i}`).join('\n')}\n\nDon't worry — your mentor will reach out soon. Keep going! 💪`
          : `Our AI is checking in on your progress. Your mentor has been notified to connect with you soon. Stay consistent! 💪`

        await supabaseClient.from('notifications').insert({
          user_id: student.user_id,
          type: 'system',
          title: '⚠️ Your mentor has been notified about your progress',
          message: studentMsg,
          read: false,
          action_url: `/student/analytics`
        })
      }
    }

    return new Response(JSON.stringify({
      message: "Retention scan complete",
      students_scanned: students.length,
      students_flagged: flaggedCount,
      results
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
