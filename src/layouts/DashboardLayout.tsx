import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { AIChatbot } from '../components/ai/AIChatbot';
import { cn } from '../lib/utils';

export function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen flex font-sans">
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-screen",
                    collapsed ? "md:ml-20" : "md:ml-64",
                    "ml-0" // Reset margin on mobile
                )}
            >
                <TopBar onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Outlet />
                </main>
                <AIChatbot />
            </div>
        </div>
    );
}
