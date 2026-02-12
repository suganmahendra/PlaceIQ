import { supabase } from '../lib/supabase';

export const courseService = {
    /**
     * Fetch all published courses
     */
    async getCourses() {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    /**
     * Fetch a single course by slug with its modules and lessons
     */
    async getCourseBySlug(slug: string) {
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select(`
        *,
        course_modules (
          *,
          course_lessons (
            *
          )
        )
      `)
            .eq('slug', slug)
            .single();

        if (courseError) throw courseError;
        return course;
    },

    /**
     * Enroll a student in a course
     */
    async enrollStudent(studentId: string, courseId: string) {
        const { data, error } = await supabase
            .from('enrollments')
            .insert({
                student_id: studentId,
                course_id: courseId,
                status: 'active',
                progress_percent: 0
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Check if a student is enrolled in a course
     */
    async checkEnrollment(studentId: string, courseId: string) {
        const { data, error } = await supabase
            .from('enrollments')
            .select('*')
            .eq('student_id', studentId)
            .eq('course_id', courseId)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    /**
     * Update lesson progress
     */
    async updateLessonProgress(
        enrollmentId: string,
        lessonId: string,
        watchTimeSeconds: number,
        isCompleted: boolean = false
    ) {
        const { data, error } = await supabase
            .from('lesson_progress')
            .upsert({
                enrollment_id: enrollmentId,
                lesson_id: lessonId,
                watch_time_seconds: watchTimeSeconds,
                is_completed: isCompleted,
                last_watched_at: new RegExp('utc').test('utc') ? new Date().toISOString() : new Date().toISOString() // Simpler:
            }, {
                onConflict: 'enrollment_id,lesson_id'
            })
            .select()
            .single();

        if (error) throw error;

        // If completed, check if we need to update course overall progress
        if (isCompleted) {
            await this.recalculateCourseProgress(enrollmentId);
        }

        return data;
    },

    /**
     * Recalculate overall course progress based on completed lessons
     */
    async recalculateCourseProgress(enrollmentId: string) {
        // 1. Get enrollment to find the course
        const { data: enrollment } = await supabase
            .from('enrollments')
            .select('course_id')
            .eq('id', enrollmentId)
            .single();

        if (!enrollment) return;

        // 2. Count total lessons in course
        const { data: modules } = await supabase
            .from('course_modules')
            .select('id')
            .eq('course_id', enrollment.course_id);

        const moduleIds = modules?.map(m => m.id) || [];

        const { count: totalLessons } = await supabase
            .from('course_lessons')
            .select('*', { count: 'exact', head: true })
            .in('module_id', moduleIds);

        // 3. Count completed lessons for this enrollment
        const { count: completedLessons } = await supabase
            .from('lesson_progress')
            .select('*', { count: 'exact', head: true })
            .eq('enrollment_id', enrollmentId)
            .eq('is_completed', true);

        const progressPercent = totalLessons ? Math.round(((completedLessons || 0) / totalLessons) * 100) : 0;

        // 4. Update enrollment
        await supabase
            .from('enrollments')
            .update({
                progress_percent: progressPercent,
                status: progressPercent === 100 ? 'completed' : 'active',
                completed_at: progressPercent === 100 ? new Date().toISOString() : null
            })
            .eq('id', enrollmentId);

        return progressPercent;
    },

    /**
     * Fetch student's enrollments with course details
     */
    async getStudentEnrollments(studentId: string) {
        const { data, error } = await supabase
            .from('enrollments')
            .select(`
        *,
        courses (*)
      `)
            .eq('student_id', studentId);

        if (error) throw error;
        return data;
    },

    /**
     * Fetch all lesson progress for an enrollment
     */
    async getLessonProgress(enrollmentId: string) {
        const { data, error } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('enrollment_id', enrollmentId);

        if (error) throw error;
        return data;
    }
};
