import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
    LayoutDashboard,
    BookOpen,
    Gamepad2,
    BarChart2,
    MessageSquare,
    Briefcase,
    User,
    LogOut,
    ChevronLeft,
    ChevronRight,
    BrainCircuit,
} from 'lucide-react';

const sidebarLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Learning Path', path: '/student/learning', icon: BookOpen },
    { name: 'Practice & Quiz', path: '/student/quiz', icon: Gamepad2 },
    { name: 'Analytics', path: '/student/analytics', icon: BarChart2 },
    { name: 'AI Chatbot', path: '/student/ai-chat', icon: MessageSquare },
    { name: 'Placements', path: '/student/placements', icon: Briefcase },
    { name: 'Profile', path: '/student/profile', icon: User },
];

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
    mobileOpen: boolean;
    setMobileOpen: (v: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={cn(
                    "h-screen bg-white/70 backdrop-blur-xl border-r border-white/20 flex flex-col fixed left-0 top-0 transition-all duration-300 z-50 shadow-lg md:shadow-none md:z-30",
                    collapsed ? "w-20" : "w-64",
                    !mobileOpen && "-translate-x-full md:translate-x-0",
                    mobileOpen && "translate-x-0"
                )}
            >
                <div className="h-16 flex items-center justify-center border-b border-white/20 relative">
                    <Link to="/student/dashboard" className="flex items-center gap-3 overflow-hidden px-2">
                        <div className="bg-primary/10 p-1.5 rounded-lg min-w-8 flex items-center justify-center">
                            <BrainCircuit className="w-5 h-5 text-primary" />
                        </div>
                        {!collapsed && (
                            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-in fade-in duration-300 whitespace-nowrap">
                                PlaceIQ
                            </span>
                        )}
                    </Link>

                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-100 rounded-full p-1 text-gray-400 hover:text-primary transition-colors shadow-sm z-40 hover:scale-110 active:scale-95"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-primary"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>

                <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden scrollbar-thin">
                    <nav className="space-y-1 px-3">
                        {sidebarLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileOpen(false)} // Close on navigate (mobile)
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                        isActive
                                            ? "bg-primary/10 text-primary font-medium shadow-sm shadow-primary/5"
                                            : "text-text-secondary hover:bg-white/50 hover:text-primary hover:shadow-sm"
                                    )}
                                    title={collapsed ? link.name : undefined}
                                >
                                    <link.icon className={cn("w-5 h-5 min-w-[20px] transition-colors", isActive ? "text-primary" : "text-text-muted group-hover:text-primary")} />
                                    {!collapsed && <span className="truncate">{link.name}</span>}

                                    {collapsed && isActive && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow shadow-primary/50" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-white/20 bg-white/30 backdrop-blur-md">
                    <Link to="/login">
                        <button className={cn(
                            "flex items-center gap-3 w-full px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors group hover:shadow-sm",
                            collapsed && "justify-center"
                        )}>
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {!collapsed && <span className="font-medium">Logout</span>}
                        </button>
                    </Link>
                </div>
            </aside>
        </>
    );
}
