import { CreateAnnouncementForm } from '../../components/dashboard/CreateAnnouncementForm';
import { AnnouncementsList } from '../../components/dashboard/AnnouncementsList';
import { useAuth } from '../../contexts/AuthContext';
import { Globe } from 'lucide-react';

export function DashboardHome() {
    const { profile } = useAuth();
    const firstName = profile?.full_name?.split(' ')[0] || 'Mentor';

    return (
        <div className="space-y-8 p-6 md:p-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
                <p className="text-gray-500 mt-2">Welcome back, {firstName}. Manage your students and global announcements.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Announcement */}
                <div className="space-y-6">
                    <CreateAnnouncementForm />
                </div>

                {/* Existing Announcements Preview */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                <Globe className="w-5 h-5 text-gray-400" />
                                Current Global Stickies
                            </h3>
                        </div>
                        <AnnouncementsList />
                    </div>
                </div>
            </div>
        </div>
    );
}
