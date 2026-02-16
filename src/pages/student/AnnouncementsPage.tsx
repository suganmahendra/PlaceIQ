import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Bell, Calendar, User } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

interface Announcement {
    id: string;
    title: string;
    content: string;
    created_at: string;
    type: 'general' | 'alert' | 'event';
    mentor: {
        full_name: string;
    } | null;
}

export function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data, error } = await supabase
                    .from('announcements')
                    .select(`
                        *,
                        mentor:mentors(full_name)
                    `)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setAnnouncements((data as any) || []);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
                    <p className="text-gray-500 text-sm">Stay updated with the latest news</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : announcements.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No announcements yet</h3>
                    <p className="text-gray-500">Check back later for updates.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {announcements.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                        {item.mentor && (
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                <span>{item.mentor.full_name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {item.type === 'alert' && (
                                    <Badge variant="warning">Alert</Badge>
                                )}
                                {item.type === 'event' && (
                                    <Badge variant="info">Event</Badge>
                                )}
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{item.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
