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
     * Fetch a single roadmap by ID (without deep relationships)
     */
    async getRoadmapById(id: string) {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();

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
     * Get active enrollments complete with attached course metadata
     */
    async getActiveEnrollmentsWithDetails(userId: string) {
        const { data, error } = await supabase
            .from('enrollments')
            // Using a join to instantly pull title, slug, duration, category, etc
            .select(`
                *,
                courses (*)
            `)
            .eq('student_id', userId)
            .eq('status', 'active')
            .order('enrolled_at', { ascending: false });

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
     * Update lesson progress and handle XP
     */
    async updateLessonProgress(
        enrollmentId: string,
        lessonId: string,
        watchTimeSeconds: number,
        isCompleted: boolean = false
    ) {
        // Check previous state to prevent infinite XP farming on same lesson
        const { data: previousState } = await supabase
            .from('lesson_progress')
            .select('is_completed')
            .eq('enrollment_id', enrollmentId)
            .eq('lesson_id', lessonId)
            .maybeSingle();

        const wasAlreadyCompleted = previousState?.is_completed === true;

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

        if (isCompleted && !wasAlreadyCompleted) {
            await this.recalculateCourseProgress(enrollmentId);

            // Fetch student_id from enrollment
            const { data: enrollment } = await supabase
                .from('enrollments')
                .select('student_id')
                .eq('id', enrollmentId)
                .single();

            if (enrollment?.student_id) {
                const XP_PER_LESSON = 10;

                // Lookup actual user_id from students table since RPC expects it
                const { data: studentData } = await supabase
                    .from('students')
                    .select('user_id, xp')
                    .eq('id', enrollment.student_id)
                    .single();

                if (studentData?.user_id) {
                    // Helper: XP → level label (matches DB enum)
                    const getLevelFromXp = (xp: number) => {
                        if (xp >= 150) return 'Advanced' as const;
                        if (xp >= 50) return 'Intermediate' as const;
                        return 'Beginner' as const;
                    };

                    let newXp = (studentData.xp ?? 0) + XP_PER_LESSON;

                    // Try RPC first; fall back to direct update if RPC doesn't exist
                    const { error: rpcError } = await supabase.rpc('increment_xp', {
                        user_id: studentData.user_id,
                        amount: XP_PER_LESSON
                    });

                    if (rpcError) {
                        // Fallback: direct update
                        const { error: updateError } = await supabase
                            .from('students')
                            .update({ xp: newXp, level: getLevelFromXp(newXp) })
                            .eq('id', enrollment.student_id);

                        if (updateError) console.warn('[XP] students update failed:', updateError.message);
                        else console.log(`[XP] Awarded ${XP_PER_LESSON} XP → student ${enrollment.student_id}, total: ${newXp}`);
                    } else {
                        // RPC succeeded — re-read new XP to recalc level securely
                        const { data: updatedStudent } = await supabase
                            .from('students')
                            .select('xp')
                            .eq('id', enrollment.student_id)
                            .single();

                        newXp = updatedStudent?.xp ?? newXp;
                        const { error: levelError } = await supabase
                            .from('students')
                            .update({ level: getLevelFromXp(newXp) })
                            .eq('id', enrollment.student_id);
                        if (levelError) console.warn('[XP] level update failed:', levelError.message);
                        console.log(`[XP] RPC awarded XP → student ${enrollment.student_id}, total: ${newXp}`);
                    }

                    // Log to xp_history — non-blocking

                    try {
                        let reason = 'Lesson Completed';
                        const { data: lessonData } = await supabase
                            .from('course_lessons')
                            .select('title')
                            .eq('id', lessonId)
                            .single();
                        
                        if (lessonData?.title) {
                            reason = `Completed: ${lessonData.title}`;
                        }

                        const { error: historyError } = await supabase.from('xp_history').insert({
                            student_id: enrollment.student_id,
                            amount: XP_PER_LESSON,
                            reason: reason
                        });
                        if (historyError) {
                            console.warn('[XP] xp_history log failed (add RLS INSERT policy):', historyError.message);
                        }
                    } catch {
                        // Non-critical — history table inaccessible, XP was still saved above
                    }
                }
            }
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
