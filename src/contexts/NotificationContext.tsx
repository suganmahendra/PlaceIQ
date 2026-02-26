import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationContextType {
    unreadCount: number;
    clearUnread: () => void;
}

const NotificationContext = createContext<NotificationContextType>({ unreadCount: 0, clearUnread: () => { } });

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { role } = useAuth();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);
    const lastSeenAtRef = useRef<string | null>(null);
    const isFirstLoadRef = useRef(true);

    const clearUnread = useCallback(() => {
        setUnreadCount(0);
    }, []);

    // Auto-clear when student navigates to the announcements page
    useEffect(() => {
        if (location.pathname === '/student/announcements') {
            clearUnread();
        }
    }, [location.pathname, clearUnread]);

    useEffect(() => {
        if (role !== 'student') return;

        const checkForNew = async () => {
            try {
                const { data } = await supabase
                    .from('announcements')
                    .select('id, title, created_at')
                    .neq('is_deleted', true)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (!data || data.length === 0) return;
                const latest = data[0];

                if (isFirstLoadRef.current) {
                    lastSeenAtRef.current = latest.created_at;
                    isFirstLoadRef.current = false;
                    return;
                }

                if (lastSeenAtRef.current && latest.created_at > lastSeenAtRef.current) {
                    lastSeenAtRef.current = latest.created_at;
                    setUnreadCount(prev => prev + 1);

                    // Show persistent notification toast
                    toast.custom((t) => (
                        <div
                            className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full pointer-events-auto`}
                            style={{ animation: t.visible ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.2s ease-in' }}
                        >
                            <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden border-l-4 border-primary">
                                {/* Header stripe */}
                                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 pt-3 pb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Bell className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">New Announcement</span>
                                    </div>
                                    <button
                                        onClick={() => toast.dismiss(t.id)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-sm"
                                    >
                                        ✕
                                    </button>
                                </div>
                                {/* Body */}
                                <div className="px-4 py-3">
                                    <p className="text-sm font-semibold text-gray-900 leading-snug">{latest.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">Posted just now by your mentor</p>
                                </div>
                                {/* Action */}
                                <div className="px-4 pb-3">
                                    <Link
                                        to="/student/announcements"
                                        onClick={() => { toast.dismiss(t.id); clearUnread(); }}
                                        className="block w-full text-center py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors"
                                    >
                                        View Announcement →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ), { duration: Infinity, position: 'top-right' });
                }
            } catch {
                // swallow polling errors
            }
        };

        checkForNew();
        const pollId = setInterval(checkForNew, 3000);
        return () => clearInterval(pollId);
    }, [role, clearUnread]);

    return (
        <NotificationContext.Provider value={{ unreadCount, clearUnread }}>
            {children}
        </NotificationContext.Provider>
    );
}
