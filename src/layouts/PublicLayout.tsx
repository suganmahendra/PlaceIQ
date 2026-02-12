
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { AIChatbot } from '../components/ai/AIChatbot';

export function PublicLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-background-white">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <AIChatbot />
        </div>
    );
}
