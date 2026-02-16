import { useEffect, useState } from 'react';
import { Bell, Megaphone, Info, Calendar } from 'lucide-react';
import { announcementsService, type Announcement } from '../../services/AnnouncementsService';

export function AnnouncementsList() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnnouncements = async () => {
            const data = await announcementsService.getAnnouncements();
            setAnnouncements(data);
            setLoading(false);
        };
        loadAnnouncements();
    }, []);

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

    return (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {announcements.map((item) => (
                <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-all group">
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
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 font-medium">
                                <Bell className="w-3 h-3" />
                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
