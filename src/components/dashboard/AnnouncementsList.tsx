import { useEffect, useState } from 'react';
import { Megaphone, Info, Calendar, Trash2 } from 'lucide-react';
import { announcementsService, type Announcement } from '../../services/AnnouncementsService';
import toast from 'react-hot-toast';

export function AnnouncementsList({ showDelete = false, refreshTrigger = 0 }: { showDelete?: boolean, refreshTrigger?: number }) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnnouncements = async () => {
            const data = await announcementsService.getAnnouncements();
            const now = new Date();
            const validData = data.filter(a => !a.expires_at || new Date(a.expires_at) > now);
            setAnnouncements(validData);
            setLoading(false);
        };

        loadAnnouncements();

        // Poll every 3 seconds for fresh data (avoids competing WebSocket conflicts with TopBar global channel)
        const pollId = setInterval(loadAnnouncements, 3000);

        // Also auto-hide expired items locally every 10 seconds
        const expireId = setInterval(() => {
            setAnnouncements(prev => {
                const now = new Date();
                const filtered = prev.filter(a => !a.expires_at || new Date(a.expires_at) > now);
                return filtered.length !== prev.length ? filtered : prev;
            });
        }, 10000);

        return () => {
            clearInterval(pollId);
            clearInterval(expireId);
        };
    }, [refreshTrigger]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;

        try {
            await announcementsService.deleteAnnouncement(id);
            setAnnouncements(prev => prev.filter(a => a.id !== id));
            toast.success('Announcement deleted');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete announcement');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    if (announcements.length === 0) {
        return (
            <div className="text-gray-500 text-center py-6 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No new announcements.
            </div>
        );
    }

    const renderContentWithLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);
        return parts.map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                        {part}
                    </a>
                );
            }
            return part;
        });
    };

    const getRelativeTime = (dateString: string, isExpiry: boolean = false) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);

        if (isExpiry) {
            if (diffInSeconds <= 0) return 'Expired';
            if (diffInSeconds < 60) return 'Expires in < 1 min';
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes < 60) return `Expires in ${diffInMinutes}m`;
            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) return `Expires in ${diffInHours}h`;
            const diffInDays = Math.floor(diffInHours / 24);
            return `Expires in ${diffInDays}d`;
        } else {
            const diff = -diffInSeconds;
            if (diff < 60) return 'Just now';
            const diffInMinutes = Math.floor(diff / 60);
            if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) return `${diffInHours}h ago`;
            const diffInDays = Math.floor(diffInHours / 24);
            if (diffInDays === 1) return 'Yesterday';
            return `${diffInDays}d ago`;
        }
    };

    return (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {announcements.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-all group relative">
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 transition-transform group-hover:scale-110
                            ${item.type === 'alert' ? 'bg-red-50 text-red-600' :
                                item.type === 'event' ? 'bg-purple-50 text-purple-600' :
                                    'bg-blue-50 text-blue-600'}`}
                        >
                            {item.type === 'alert' ? <Megaphone className="w-4 h-4" /> :
                                item.type === 'event' ? <Calendar className="w-4 h-4" /> :
                                    <Info className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0 pr-8">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed" style={{ wordBreak: 'break-word' }}>
                                {renderContentWithLinks(item.content)}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium">
                                <span className="text-gray-400">{getRelativeTime(item.created_at)}</span>
                                {item.expires_at && (
                                    <span className="text-orange-500">
                                        • {getRelativeTime(item.expires_at, true)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {showDelete && (
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete announcement"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
