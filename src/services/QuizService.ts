import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export type Quiz = Database['public']['Tables']['quizzes']['Row'];
export type QuizQuestion = Database['public']['Tables']['quiz_questions']['Row'];

export const quizService = {
    async getQuizByLessonId(lessonId: string) {
        // Prevent 400 Bad Request by ensuring lessonId is a valid UUID before querying
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!lessonId || !uuidRegex.test(lessonId)) return null;

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

    async getQuizById(quizId: string) {
        if (!quizId) return null;
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('id', quizId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching quiz by id:', error);
            return null;
        }
        return data as Quiz | null;
    },

    async getStandaloneQuizzes() {
        const { data, error } = await supabase
            .from('quizzes')
            .select('*')
            .is('lesson_id', null)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching standalone quizzes:', error);
            return [];
        }
        return data as Quiz[];
    },

    async getQuizByModuleId(moduleId: string) {
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
    },

    // --- Mentor Management ---
    async upsertQuiz(quiz: Partial<Quiz>) {
        const { data, error } = await supabase
            .from('quizzes')
            .upsert(quiz as any)
            .select()
            .single();

        if (error) throw error;
        return data as Quiz;
    },

    async deleteQuiz(quizId: string) {
        const { error } = await supabase
            .from('quizzes')
            .delete()
            .eq('id', quizId);

        if (error) throw error;
    },

    async getQuizQuestions(quizId: string) {
        const { data, error } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', quizId)
            .order('order_index', { ascending: true });

        if (error) throw error;
        return data as QuizQuestion[];
    },

    async upsertQuestion(question: Partial<QuizQuestion>) {
        const { data, error } = await supabase
            .from('quiz_questions')
            .upsert(question as any)
            .select()
            .single();

        if (error) throw error;
        return data as QuizQuestion;
    },

    async deleteQuestion(questionId: string) {
        const { error } = await supabase
            .from('quiz_questions')
            .delete()
            .eq('id', questionId);

        if (error) throw error;
    },

    // --- Student Execution ---
    async submitQuizAttempt(attempt: Omit<Database['public']['Tables']['quiz_attempts']['Insert'], 'attempted_at' | 'id'>) {
        const { data, error } = await supabase
            .from('quiz_attempts')
            .insert(attempt)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};
