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
    unreadQuizCount: number;
    clearUnreadQuizzes: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
    unreadCount: 0,
    clearUnread: () => { },
    unreadQuizCount: 0,
    clearUnreadQuizzes: () => { }
});

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { role } = useAuth();
    const location = useLocation();

    // Announcements state
    const [unreadCount, setUnreadCount] = useState(0);
    const lastSeenAtRef = useRef<string | null>(null);
    const isFirstLoadRef = useRef(true);

    // Quizzes state
    const [unreadQuizCount, setUnreadQuizCount] = useState(0);
    const lastSeenQuizAtRef = useRef<string | null>(null);
    const isFirstQuizLoadRef = useRef(true);

    const clearUnread = useCallback(() => {
        setUnreadCount(0);
    }, []);

    const clearUnreadQuizzes = useCallback(() => {
        setUnreadQuizCount(0);
    }, []);

    // Auto-clear when student navigates to respective pages
    useEffect(() => {
        if (location.pathname === '/student/announcements') clearUnread();
        if (location.pathname === '/student/quiz') clearUnreadQuizzes();
    }, [location.pathname, clearUnread, clearUnreadQuizzes]);

    // Polling for Announcements
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

                    toast.custom((t) => (
                        <div
                            className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full pointer-events-auto`}
                            style={{ animation: t.visible ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.2s ease-in' }}
                        >
                            <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden border-l-4 border-primary">
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
                                <div className="px-4 py-3">
                                    <p className="text-sm font-semibold text-gray-900 leading-snug">{latest.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">Posted just now by your mentor</p>
                                </div>
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

    // Polling for Quizzes
    useEffect(() => {
        if (role !== 'student') return;

        const checkForNewQuizzes = async () => {
            try {
                const { data } = await supabase
                    .from('quizzes')
                    .select('id, title, created_at')
                    .eq('is_standalone', true)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (!data || data.length === 0) return;
                const latest = data[0];

                if (isFirstQuizLoadRef.current) {
                    lastSeenQuizAtRef.current = latest.created_at;
                    isFirstQuizLoadRef.current = false;
                    return;
                }

                if (lastSeenQuizAtRef.current && latest.created_at > lastSeenQuizAtRef.current) {
                    lastSeenQuizAtRef.current = latest.created_at;
                    setUnreadQuizCount(prev => prev + 1);

                    toast.custom((t) => (
                        <div
                            className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full pointer-events-auto`}
                            style={{ animation: t.visible ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.2s ease-in' }}
                        >
                            <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden border-l-4 border-indigo-500">
                                <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 px-4 pt-3 pb-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                            <Bell className="w-3.5 h-3.5 text-indigo-600" />
                                        </div>
                                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">New Quiz</span>
                                    </div>
                                    <button
                                        onClick={() => toast.dismiss(t.id)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-sm"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="px-4 py-3">
                                    <p className="text-sm font-semibold text-gray-900 leading-snug">{latest.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">Practice and earn some XP!</p>
                                </div>
                                <div className="px-4 pb-3">
                                    <Link
                                        to="/student/quiz"
                                        onClick={() => { toast.dismiss(t.id); clearUnreadQuizzes(); }}
                                        className="block w-full text-center py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                                    >
                                        Take Quiz →
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

        checkForNewQuizzes();
        const pollId = setInterval(checkForNewQuizzes, 3000);
        return () => clearInterval(pollId);
    }, [role, clearUnreadQuizzes]);

    return (
        <NotificationContext.Provider value={{ unreadCount, clearUnread, unreadQuizCount, clearUnreadQuizzes }}>
            {children}
        </NotificationContext.Provider>
    );
}
