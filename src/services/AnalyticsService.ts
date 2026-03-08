import { supabase } from '../lib/supabase';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DailyActivity {
    day: string;       // 'Mon', 'Tue', …
    date: string;      // ISO date string (YYYY-MM-DD)
    videoHours: number;
    quizHours: number;
    total: number;
}

export interface SkillReadiness {
    skill: string;
    level: number;        // 0-100
    status: 'Bright' | 'Average' | 'Weak';
}

export interface XpHistoryEntry {
    date: string;
    amount: number;
    reason: string;
}

export interface AnalyticsData {
    weeklyActivity: DailyActivity[];
    totalWeeklyHours: number;
    avgHoursPerDay: number;
    focusScore: number;       // 0-100
    distractionScore: number; // 0-100
    skillReadiness: SkillReadiness[];
    xpHistory: XpHistoryEntry[];
    totalXp: number;
    readinessScore: number;
    level: string;
    quizzesPassed: number;
    quizzesAttempted: number;
    lessonsCompleted: number;
    enrolledCourses: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getWeekBounds() {
    const now = new Date();
    // Start of the current week = last Monday (ISO weeks start Mon)
    const dayOfWeek = now.getDay(); // 0 = Sun
    const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMon);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { monday, sunday };
}

function toDateStr(date: Date): string {
    return date.toISOString().split('T')[0];
}

function secsToHours(secs: number): number {
    return Math.round((secs / 3600) * 10) / 10;
}

function getSkillStatus(level: number): 'Bright' | 'Average' | 'Weak' {
    if (level >= 80) return 'Bright';
    if (level >= 50) return 'Average';
    return 'Weak';
}

// ─── Main Fetch ─────────────────────────────────────────────────────────────

export async function fetchStudentAnalytics(studentId: string): Promise<AnalyticsData> {
    const { monday, sunday } = getWeekBounds();
    const weekStart = monday.toISOString();
    const weekEnd = sunday.toISOString();

    // Build date array Mon→Sun
    const weekDays: { day: string; date: string }[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        weekDays.push({ day: DAYS[d.getDay()], date: toDateStr(d) });
    }

    // ── 1. Student profile ─────────────────────────────────────────────────
    const { data: studentData } = await supabase
        .from('students')
        .select('xp, readiness_score, level')
        .eq('id', studentId)
        .single();

    const totalXp = studentData?.xp ?? 0;
    const readinessScore = studentData?.readiness_score ?? 0;
    const level = studentData?.level ?? 'Beginner';

    // ── 2. Enrollments with course info ────────────────────────────────────
    const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
            id,
            course_id,
            progress_percent,
            status,
            courses (
                id,
                title,
                category,
                estimated_hours
            )
        `)
        .eq('student_id', studentId)
        .neq('status', 'dropped');

    const validEnrollments = enrollments ?? [];
    const enrolledCourses = validEnrollments.length;

    // ── 3. Lesson progress (this week) ─────────────────────────────────────
    // We need enrollment IDs to join lesson_progress
    const enrollmentIds = validEnrollments.map((e) => e.id);

    let lessonProgressRows: Array<{
        enrollment_id: string;
        watch_time_seconds: number;
        is_completed: boolean;
        last_watched_at: string;
    }> = [];

    let lessonsCompleted = 0;

    if (enrollmentIds.length > 0) {
        const { data: lpData } = await supabase
            .from('lesson_progress')
            .select('enrollment_id, watch_time_seconds, is_completed, last_watched_at')
            .in('enrollment_id', enrollmentIds);

        lessonProgressRows = lpData ?? [];
        lessonsCompleted = lessonProgressRows.filter((lp) => lp.is_completed).length;
    }

    // ── 4. Quiz attempts ───────────────────────────────────────────────────
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: quizData } = await supabase
        .from('quiz_attempts')
        .select('score, passed, attempted_at')
        .eq('student_id', studentId)
        .gte('attempted_at', thirtyDaysAgo.toISOString());

    const quizAttempts = quizData ?? [];
    const quizzesAttempted = quizAttempts.length;
    const quizzesPassed = quizAttempts.filter((q) => q.passed).length;

    // Focus score = pass rate, ensure minimum 50 if no data
    const focusScore = quizzesAttempted > 0
        ? Math.round((quizzesPassed / quizzesAttempted) * 100)
        : (readinessScore > 0 ? Math.min(readinessScore, 100) : 0);
    const distractionScore = 100 - focusScore;

    // ── 5. Weekly activity per day ─────────────────────────────────────────
    // Bucket lesson_progress rows by day (last_watched_at)
    const dailySecondsMap: Record<string, number> = {};
    weekDays.forEach(({ date }) => { dailySecondsMap[date] = 0; });

    lessonProgressRows.forEach((lp) => {
        if (!lp.last_watched_at) return;
        const dateStr = lp.last_watched_at.split('T')[0];
        if (dateStr >= weekDays[0].date && dateStr <= weekDays[6].date) {
            dailySecondsMap[dateStr] = (dailySecondsMap[dateStr] ?? 0) + lp.watch_time_seconds;
        }
    });

    // Quiz time contribution per day (each quiz attempt = ~0.25h of activity)
    const quizAttemptsByDay: Record<string, number> = {};
    weekDays.forEach(({ date }) => { quizAttemptsByDay[date] = 0; });
    quizAttempts.forEach((qa) => {
        if (!qa.attempted_at) return;
        const dateStr = qa.attempted_at.split('T')[0];
        if (dateStr >= weekDays[0].date && dateStr <= weekDays[6].date) {
            quizAttemptsByDay[dateStr] = (quizAttemptsByDay[dateStr] ?? 0) + 0.25;
        }
    });

    const weeklyActivity: DailyActivity[] = weekDays.map(({ day, date }) => {
        const videoHours = secsToHours(dailySecondsMap[date] ?? 0);
        const quizHours = Math.round((quizAttemptsByDay[date] ?? 0) * 10) / 10;
        const total = Math.round((videoHours + quizHours) * 10) / 10;
        return { day, date, videoHours, quizHours, total };
    });

    // ── 6. Total weekly hours & avg ────────────────────────────────────────
    const totalWeeklySecs = lessonProgressRows
        .filter((lp) => {
            if (!lp.last_watched_at) return false;
            const d = lp.last_watched_at;
            return d >= weekStart && d <= weekEnd;
        })
        .reduce((sum, lp) => sum + lp.watch_time_seconds, 0);

    const quizWeeklyHours = weekDays.reduce(
        (sum, { date }) => sum + (quizAttemptsByDay[date] ?? 0), 0
    );

    const totalWeeklyHours =
        Math.round((secsToHours(totalWeeklySecs) + quizWeeklyHours) * 10) / 10;
    const avgHoursPerDay = Math.round((totalWeeklyHours / 7) * 10) / 10;

    // ── 7. Skill readiness from enrollments ───────────────────────────────
    // Map progress of each enrolled course to a skill name
    const skillReadiness: SkillReadiness[] = validEnrollments
        .filter((e) => e.courses)
        .map((e) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const course = e.courses as any;
            const skillName = course.category
                ? course.category.charAt(0).toUpperCase() + course.category.slice(1)
                : course.title;
            const lvl = Math.round(e.progress_percent ?? 0);
            return {
                skill: skillName,
                level: lvl,
                status: getSkillStatus(lvl),
            };
        })
        // Deduplicate by skill name (keep highest level)
        .reduce((acc: SkillReadiness[], curr) => {
            const existing = acc.find((s) => s.skill === curr.skill);
            if (existing) {
                if (curr.level > existing.level) {
                    existing.level = curr.level;
                    existing.status = getSkillStatus(curr.level);
                }
            } else {
                acc.push(curr);
            }
            return acc;
        }, [])
        .sort((a, b) => b.level - a.level)
        .slice(0, 6); // Show max 6 skills

    // ── 8. XP history (last 14 days) ──────────────────────────────────────
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { data: xpData } = await supabase
        .from('xp_history')
        .select('amount, reason, created_at')
        .eq('student_id', studentId)
        .gte('created_at', fourteenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(20);

    const xpHistory: XpHistoryEntry[] = (xpData ?? []).map((x) => ({
        date: x.created_at.split('T')[0],
        amount: x.amount,
        reason: x.reason,
    }));

    return {
        weeklyActivity,
        totalWeeklyHours,
        avgHoursPerDay,
        focusScore,
        distractionScore,
        skillReadiness,
        xpHistory,
        totalXp,
        readinessScore,
        level,
        quizzesPassed,
        quizzesAttempted,
        lessonsCompleted,
        enrolledCourses,
    };
}
