import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export type Quiz = Database['public']['Tables']['quizzes']['Row'];

export const quizService = {
    async getQuizByLessonId(lessonId: string) {
        // Prevent 400 Bad Request by ensuring lessonId is a valid UUID before querying
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!lessonId || !uuidRegex.test(lessonId)) return null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('lesson_id', lessonId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching quiz:', error);
            return null;
        }
        return data as Quiz | null;
    },

    async getQuizByModuleId(moduleId: string) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('related_module_id', moduleId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching quiz:', error);
            return null;
        }
        return data as Quiz | null;
    }
};
