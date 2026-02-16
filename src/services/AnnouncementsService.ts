import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export type Announcement = Database['public']['Tables']['announcements']['Row'];

export const announcementsService = {
    async getAnnouncements() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching announcements:', error);
            return [];
        }
        return data as Announcement[];
    },

    async createAnnouncement(announcement: {
        title: string;
        content: string;
        type: 'general' | 'alert' | 'event';
        created_by: string;
    }) {
        const { data, error } = await supabase
            .from('announcements')
            .insert([
                {
                    ...announcement,
                    is_active: true
                }
            ])
            .select()
            .single();

        if (error) throw error;
        return data as Announcement;
    }
};
