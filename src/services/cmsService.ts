import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

// Extend the existing types to include potentially new columns from migrations
type CourseRow = Database['public']['Tables']['courses']['Row'];
export type Course = CourseRow & {
    // Add any new columns here if they aren't in database.types.ts yet
};

export type CourseInsert = Database['public']['Tables']['courses']['Insert'];
export type CourseUpdate = Database['public']['Tables']['courses']['Update'];

export type CourseModule = Database['public']['Tables']['course_modules']['Row'];
export type CourseModuleInsert = Database['public']['Tables']['course_modules']['Insert'];
export type CourseModuleUpdate = Database['public']['Tables']['course_modules']['Update'];

// Extend Lesson type to include 'code_snippets' which we added in migration
type CourseLessonRow = Database['public']['Tables']['course_lessons']['Row'];
export type CourseLesson = CourseLessonRow & {
    code_snippets?: any; // JSONB
    content?: string | null; // For backward compatibility if needed, but we prefer content_markdown
};
export type CourseLessonInsert = Database['public']['Tables']['course_lessons']['Insert'] & {
    code_snippets?: any;
};
export type CourseLessonUpdate = Database['public']['Tables']['course_lessons']['Update'] & {
    code_snippets?: any;
};


// Helper to generate slug
const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
};

export const cmsService = {
    // Courses (Roadmaps)
    async getCourses() {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data as Course[];
    },

    async getCourse(id: string) {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data as Course;
    },

    async createCourse(course: Omit<CourseInsert, 'slug' | 'created_at' | 'created_by'>) {
        // Generate slug from title
        const slug = slugify(course.title) + '-' + Math.random().toString(36).substring(2, 7);

        const { data, error } = await supabase
            .from('courses')
            .insert({
                ...course,
                slug,
                // created_by should ideally be set from auth context or trigger
            } as any)
            .select()
            .single();
        if (error) throw error;
        return data as Course;
    },

    async updateCourse(id: string, updates: CourseUpdate) {
        // If title changes, maybe update slug? Let's keep slug stable for now unless explicitly asked.
        const { data, error } = await supabase
            .from('courses')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as Course;
    },

    async deleteCourse(id: string) {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Modules (Phases)
    async getModules(courseId: string) {
        const { data, error } = await supabase
            .from('course_modules')
            .select('*')
            .eq('course_id', courseId)
            .order('order_index', { ascending: true });
        if (error) throw error;
        return data as CourseModule[];
    },

    async createModule(module: CourseModuleInsert) {
        const { data, error } = await supabase
            .from('course_modules')
            .insert(module)
            .select()
            .single();
        if (error) throw error;
        return data as CourseModule;
    },

    async updateModule(id: string, updates: CourseModuleUpdate) {
        const { data, error } = await supabase
            .from('course_modules')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as CourseModule;
    },

    async deleteModule(id: string) {
        const { error } = await supabase
            .from('course_modules')
            .delete()
            .eq('id', id);
        if (error) throw error;
    },

    // Lessons (Topics)
    async getLessons(moduleId: string) {
        const { data, error } = await supabase
            .from('course_lessons')
            .select('*') // This will fetch code_snippets too if it exists
            .eq('module_id', moduleId)
            .order('order_index', { ascending: true });
        if (error) throw error;
        return data as CourseLesson[];
    },

    async createLesson(lesson: CourseLessonInsert) {
        const { data, error } = await supabase
            .from('course_lessons')
            .insert(lesson as any)
            .select()
            .single();
        if (error) throw error;
        return data as CourseLesson;
    },

    async updateLesson(id: string, updates: CourseLessonUpdate) {
        const { data, error } = await supabase
            .from('course_lessons')
            .update(updates as any)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data as CourseLesson;
    },

    async deleteLesson(id: string) {
        const { error } = await supabase
            .from('course_lessons')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};
