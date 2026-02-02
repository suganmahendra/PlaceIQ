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
    BrainCircuit
} from 'lucide-react';

const sidebarLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Learning Paths', path: '/student/learning', icon: BookOpen },
    { name: 'Practice & Quiz', path: '/student/quiz', icon: Gamepad2 },
    { name: 'Analytics', path: '/student/analytics', icon: BarChart2 },
    { name: 'AI Chatbot', path: '/student/ai-chat', icon: MessageSquare }, // Updated path name
    { name: 'Placements', path: '/student/placements', icon: Briefcase },
    { name: 'Profile', path: '/student/profile', icon: User },
];

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const location = useLocation();

    return (
        <aside
            className={cn(
                "h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 transition-all duration-300 z-30 shadow-sm",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="h-16 flex items-center justify-center border-b border-gray-100 relative">
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

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-primary transition-colors shadow-sm z-40"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden scrollbar-thin">
                <nav className="space-y-1 px-3">
                    {sidebarLinks.map((link) => {
                        const isActive = location.pathname === link.path; // Exact match might need refinement for sub-routes
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                                title={collapsed ? link.name : undefined}
                            >
                                <link.icon className={cn("w-5 h-5 min-w-[20px]", isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600")} />
                                {!collapsed && <span className="truncate">{link.name}</span>}

                                {collapsed && isActive && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-gray-100">
                <Link to="/login">
                    <button className={cn(
                        "flex items-center gap-3 w-full px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group",
                        collapsed && "justify-center"
                    )}>
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </Link>
            </div>
        </aside>
    );
}
