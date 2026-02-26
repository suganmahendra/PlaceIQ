import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Bell, User } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

interface Announcement {
    id: string;
    title: string;
    content: string;
    created_at: string;
    expires_at?: string | null;
    is_deleted?: boolean;
    type: 'general' | 'alert' | 'event';
    mentor: { full_name: string } | null;
}

export function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const prevCountRef = useRef(0);

    const fetchAnnouncements = async (showToast: boolean = false) => {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select(`*, mentor:mentors(full_name)`)
                .neq('is_deleted', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            const now = new Date();
            const valid = ((data as unknown as Announcement[]) || []).filter(
                a => !a.expires_at || new Date(a.expires_at) > now
            );

            if (showToast && valid.length > prevCountRef.current && prevCountRef.current > 0) {
                // New announcement arrived — TopBar will show the toast, just update
            }
            prevCountRef.current = valid.length;
            setAnnouncements(valid);
        } catch (err) {
            console.error('Error fetching announcements:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements(false);

        // Poll every 3 seconds — avoids competing WebSocket channels
        // The TopBar's single global channel handles the notification popup
        const intervalId = setInterval(() => fetchAnnouncements(true), 3000);

        // Also expire items locally every 30s without re-fetch
        const expireId = setInterval(() => {
            setAnnouncements(prev => {
                const now = new Date();
                const filtered = prev.filter(a => !a.expires_at || new Date(a.expires_at) > now);
                return filtered.length !== prev.length ? filtered : prev;
            });
        }, 30000);

        return () => {
            clearInterval(intervalId);
            clearInterval(expireId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderContentWithLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, i) =>
            part.match(urlRegex) ? (
                <a key={i} href={part} target="_blank" rel="noopener noreferrer"
                    className="text-primary font-semibold hover:underline break-all">
                    {part}
                </a>
            ) : part
        );
    };

    const getRelativeTime = (dateString: string, isExpiry = false) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffSec = Math.floor((date.getTime() - now.getTime()) / 1000);

        if (isExpiry) {
            if (diffSec <= 0) return 'Expired';
            if (diffSec < 60) return 'Expires in < 1 min';
            const m = Math.floor(diffSec / 60);
            if (m < 60) return `Expires in ${m}m`;
            const h = Math.floor(m / 60);
            if (h < 24) return `Expires in ${h}h`;
            return `Expires in ${Math.floor(h / 24)}d`;
        } else {
            const diff = -diffSec;
            if (diff < 60) return 'Just now';
            const m = Math.floor(diff / 60);
            if (m < 60) return `${m}m ago`;
            const h = Math.floor(m / 60);
            if (h < 24) return `${h}h ago`;
            const d = Math.floor(h / 24);
            return d === 1 ? 'Yesterday' : `${d}d ago`;
        }
    };

    const typeBadge = (type: string) => {
        if (type === 'alert') return <Badge variant="warning">Alert</Badge>;
        if (type === 'event') return <Badge variant="info">Event</Badge>;
        return <Badge>General</Badge>;
    };

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
                        <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start gap-4 mb-3">
                                <h3 className="text-base font-bold text-gray-900 leading-snug">{item.title}</h3>
                                <div className="flex-shrink-0">{typeBadge(item.type)}</div>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap" style={{ wordBreak: 'break-word' }}>
                                {renderContentWithLinks(item.content)}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-gray-400">
                                <span>{getRelativeTime(item.created_at)}</span>
                                {item.expires_at && (
                                    <span className="text-orange-500">• {getRelativeTime(item.expires_at, true)}</span>
                                )}
                                {item.mentor && (
                                    <span className="flex items-center gap-1 text-blue-500">
                                        • <User className="w-3 h-3" /> {item.mentor.full_name}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
