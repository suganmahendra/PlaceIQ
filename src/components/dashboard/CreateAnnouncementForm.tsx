import { useState, type FormEvent } from 'react';
import { Send, Megaphone, Calendar, Info, Loader2, Clock } from 'lucide-react';
import { announcementsService } from '../../services/AnnouncementsService';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

export function CreateAnnouncementForm({ onCreated }: { onCreated?: () => void }) {
    const { profile } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<'general' | 'alert' | 'event'>('general');
    const [expiresAt, setExpiresAt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!profile || !('id' in profile)) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const announcement = await announcementsService.createAnnouncement({
                title,
                content,
                type,
                created_by: profile.id,
                expires_at: expiresAt ? new Date(expiresAt).toISOString() : null
            });

            // TODO: Prevo Notification Hook Placeholder
            // await fetch('https://api.prevo.com/v1/notify', {
            //     method: 'POST',
            //     body: JSON.stringify({ event: 'new_announcement', data: announcement })
            // });
            console.log('[Prevo API Stub] Dispatching email for announcement:', announcement.id);

            setTitle('');
            setContent('');
            setType('general');
            setExpiresAt('');
            setSuccess(true);
            toast.success('Announcement published!');

            if (onCreated) onCreated();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setError('Failed to post announcement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-primary" />
                    Post New Announcement
                </h3>
                {success && (
                    <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold animate-pulse border border-green-200">
                        Posted!
                    </span>
                )}
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">{error}</div>}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        placeholder="e.g. System Maintenance Update"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Content</label>
                    <textarea
                        placeholder="Enter the announcement details (URLs will be clickable)..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none h-32 resize-none transition-all"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { value: 'general', icon: Info, label: 'General', color: 'text-blue-600 bg-blue-50 border-blue-200' },
                                { value: 'alert', icon: Megaphone, label: 'Alert', color: 'text-red-600 bg-red-50 border-red-200' },
                                { value: 'event', icon: Calendar, label: 'Event', color: 'text-purple-600 bg-purple-50 border-purple-200' }
                            ].map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setType(t.value as any)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all font-bold text-sm",
                                        type === t.value
                                            ? t.color.replace('bg-', 'bg-opacity-100 ') + " ring-2 ring-offset-1 ring-primary/20"
                                            : "bg-white border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                    )}
                                >
                                    <t.icon className="w-4 h-4" />
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            Expiration (Optional)
                        </label>
                        <input
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-sm text-gray-600"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-accent-violet text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Publish Announcement
            </button>
        </form>
    );
}
