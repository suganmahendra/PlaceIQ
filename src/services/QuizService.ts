import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export type Quiz = Database['public']['Tables']['quizzes']['Row'];

export const quizService = {
    async getQuizByLessonId(lessonId: string) {
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
