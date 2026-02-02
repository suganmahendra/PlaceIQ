import { Bell, Search } from 'lucide-react';

export function TopBar() {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm transition-all">
            <div className="flex items-center gap-4 flex-1">
                {/* Search Bar - Global */}
                <div className="relative w-full max-w-md hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for skills, videos, or jobs..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all text-sm outline-none placeholder:text-gray-400"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-400 border border-gray-200 rounded-md bg-white shadow-sm">Ctrl K</kbd>
                    </div>
                </div>
                <h1 className="md:hidden text-lg font-bold text-gray-900">PlaceIQ</h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-100 cursor-pointer group">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">John Doe</p>
                        <p className="text-xs text-gray-500">Student</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-accent p-[2px] transition-transform group-hover:scale-105 shadow-sm">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
