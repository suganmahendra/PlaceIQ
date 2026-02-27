import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface TopBarProps {
    onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
    const { profile, role } = useAuth();

    const displayName = profile?.full_name || 'User';
    const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Student';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const avatarUrl = (profile as any)?.avatar_url;

    const profileRoute = role === 'mentor' ? '/mentor/dashboard' : '/student/profile';

    return (
        <header
            data-topbar
            className="h-16 bg-white/60 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20 shadow-sm transition-all supports-[backdrop-filter]:bg-white/60"
        >
            {/* Left: mobile hamburger + brand name */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 -ml-2 text-text-secondary hover:bg-white/50 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <span className="md:hidden text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    PlaceIQ
                </span>
            </div>

            {/* Right: profile only */}
            <Link
                to={profileRoute}
                className="flex items-center gap-3 cursor-pointer group"
            >
                <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors leading-tight">
                        {displayName}
                    </p>
                    <p className="text-xs text-gray-500">{displayRole}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent p-[2px] transition-transform group-hover:scale-105 shadow-sm shrink-0">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </Link>
        </header>
    );
}
