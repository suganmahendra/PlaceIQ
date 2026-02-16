import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export type Course = Database['public']['Tables']['courses']['Row'];
export type CourseModule = Database['public']['Tables']['course_modules']['Row'];
export type CourseLesson = Database['public']['Tables']['course_lessons']['Row'];

export type RoadmapFull = Course & {
    course_modules: (CourseModule & {
        course_lessons: CourseLesson[];
    })[];
};

export const roadmapService = {
    /**
     * Fetch all published roadmaps (courses)
     */
    async getRoadmaps() {
        const { data, error } = await supabase
            .from('courses')
            .select('*, course_modules (id)')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    /**
     * Fetch a single roadmap by slug with all content
     */
    async getRoadmapBySlug(slug: string) {
        const { data, error } = await supabase
            .from('courses')
            .select(`
                *,
                course_modules (
                    *,
                    course_lessons (*)
                )
            `)
            .eq('slug', slug)
            .single();

        if (error) throw error;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawData = data as any; // Cast to avoid deep type mismatch

        if (rawData) {
            const Roadmap = rawData as RoadmapFull;

            if (Roadmap.course_modules) {
                // Sort modules
                Roadmap.course_modules.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

                // Sort lessons within modules
                Roadmap.course_modules.forEach(module => {
                    if (module.course_lessons) {
                        module.course_lessons.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
                    }
                });
            }
            return Roadmap;
        }
        return null;
    },

    /**
     * Get enrollments for the current user to display progress
     */
    async getUserEnrollments(userId: string) {
        const { data, error } = await supabase
            .from('enrollments')
            .select('*')
            .eq('student_id', userId);

        if (error) throw error;
        return data;
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
     * Fetch all lesson progress for an enrollment
     */
    async getLessonProgress(enrollmentId: string) {
        const { data, error } = await supabase
            .from('lesson_progress')
            .select('*')
            .eq('enrollment_id', enrollmentId);

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
                last_watched_at: new Date().toISOString()
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
    }
};
