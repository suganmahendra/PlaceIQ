import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { cn } from '../lib/utils';

export function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background-white flex font-sans">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-screen",
                    collapsed ? "ml-20" : "ml-64"
                )}
            >
                <TopBar />
                <main className="flex-1 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
