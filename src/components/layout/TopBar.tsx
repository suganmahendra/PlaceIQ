import { useState } from 'react';
import { Bell, Search, Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

interface TopBarProps {
    onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
    const { profile, role } = useAuth();
    const { unreadCount, clearUnread } = useNotifications();
    const [searchFocused, setSearchFocused] = useState(false);

    const displayName = profile?.full_name || 'User';
    const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Student';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const avatarUrl = (profile as any)?.avatar_url;

    const announcementsRoute = role === 'mentor' ? '/mentor/dashboard' : '/student/announcements';

    return (
        <header className="h-16 bg-white/60 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm transition-all supports-[backdrop-filter]:bg-white/60">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-text-secondary hover:bg-white/50 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Search Bar */}
                <div className="relative w-full max-w-md hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for skills, videos, or jobs..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/40 bg-white/40 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-sm outline-none placeholder:text-text-muted/70 text-text-primary"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    {!searchFocused && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 border border-gray-200 rounded-md bg-white shadow-sm">Ctrl K</kbd>
                        </div>
                    )}
                </div>
                <h1 className="md:hidden text-lg font-bold text-gray-900">PlaceIQ</h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* Notifications Bell - synced with NotificationContext */}
                <Link
                    to={announcementsRoute}
                    onClick={clearUnread}
                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title={unreadCount > 0 ? `${unreadCount} new announcement${unreadCount > 1 ? 's' : ''}` : 'Announcements'}
                >
                    <Bell className={`w-5 h-5 transition-colors ${unreadCount > 0 ? 'text-primary' : 'text-gray-500'}`} />
                    {unreadCount > 0 ? (
                        <span className="absolute top-1 right-1 w-3.5 h-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 items-center justify-center border-2 border-white">
                                <span className="text-[7px] font-bold text-white leading-none">{unreadCount > 9 ? '9+' : unreadCount}</span>
                            </span>
                        </span>
                    ) : (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-gray-300 rounded-full border-2 border-white"></span>
                    )}
                </Link>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-100 cursor-pointer group">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{displayName}</p>
                        <p className="text-xs text-gray-500">{displayRole}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent p-[2px] transition-transform group-hover:scale-105 shadow-sm">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
