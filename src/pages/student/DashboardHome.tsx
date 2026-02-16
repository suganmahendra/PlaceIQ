import { Award, Zap, BookOpen, Target, ChevronRight, PlayCircle, Clock, CheckCircle2, TrendingUp, type LucideIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AnnouncementsList } from '../../components/dashboard/AnnouncementsList';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../types/database.types';

type StudentProfile = Database['public']['Tables']['students']['Row'];

export function DashboardHome() {
    const { profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const firstName = profile?.full_name?.split(' ')[0] || 'Scholar';

    // Type-safe property access
    const isStudent = profile && 'xp' in profile;
    const studentProfile = isStudent ? (profile as StudentProfile) : null;

    const level = studentProfile?.level || 'N/A';
    const xp = studentProfile?.xp || 0;
    const profileCompletion = studentProfile?.profile_completion || 0;

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-primary to-accent p-8 md:p-12 text-white overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-500">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-10 translate-y-10"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome back, {firstName}! 👋</h1>
                            <p className="text-white/90 text-lg max-w-xl leading-relaxed">
                                You're currently at "{level}" level with {xp} XP. Your profile is {profileCompletion}% complete. Keep up the momentum!
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button className="bg-white text-primary border-none shadow-lg hover:bg-gray-50 px-6">Resume Learning</Button>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-6 text-sm font-medium text-white/80">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-300" />
                            <span>2 Pending Assignments</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-300" />
                            <span>30m Study Time Today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Zap} color="text-yellow-500" bg="bg-yellow-50"
                    label="Readiness Score" value={`${studentProfile?.readiness_score || 0}%`}
                    subtext="Keep improving!"
                    trend="up"
                />
                <StatCard
                    icon={Award} color="text-purple-500" bg="bg-purple-50"
                    label="XP Earned" value={`${xp} XP`}
                    subtext={`Level: ${level}`}
                    trend="up"
                />
                <StatCard
                    icon={Target} color="text-blue-500" bg="bg-blue-50"
                    label="Skill Level" value={level}
                    subtext="Based on your progress"
                    trend="neutral"
                />
                <StatCard
                    icon={BookOpen} color="text-green-500" bg="bg-green-50"
                    label="Profile Status" value={`${profileCompletion}%`}
                    subtext="Completion Rate"
                    trend="up"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Learning Progress / Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">Recommended For You</h3>
                            <Button variant="link" className="text-primary hover:no-underline px-0">See All <ChevronRight className="w-4 h-4 ml-1" /></Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Content Cards */}
                            <ContentCard
                                title="Advanced Graph Algorithms"
                                category="DSA"
                                duration="45 min"
                                instructor="Dr. Angela"
                                progress={30}
                                image="https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80"
                            />
                            <ContentCard
                                title="System Design Basics"
                                category="Architecture"
                                duration="1h 20m"
                                instructor="Alex Xu"
                                progress={0}
                                image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80"
                            />
                        </div>
                    </div>

                    <div className="glass-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 text-lg">Placement Matches Preview</h3>
                            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">3 New</span>
                        </div>
                        <div className="space-y-4">
                            <JobRow company="Google" role="Frontend Engineer" match={95} logo="G" color="bg-red-50 text-red-600" />
                            <JobRow company="Amazon" role="SDE I" match={88} logo="A" color="bg-yellow-50 text-yellow-600" />
                            <JobRow company="Microsoft" role="Full Stack Developer" match={82} logo="M" color="bg-blue-50 text-blue-600" />
                        </div>
                        <Button variant="outline" className="w-full mt-6 border-gray-200 hover:bg-gray-50">View All 12 Matches</Button>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">Announcements</h3>
                        </div>
                        <AnnouncementsList />
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6">Skill Analysis</h3>
                        {/* Simulated Chart */}
                        <div className="flex justify-center mb-6">
                            <div className="relative w-40 h-40">
                                {/* Simple visual representation of radar/pie chart */}
                                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#F3F4F6" strokeWidth="10" />
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="#6A0DAD" strokeWidth="10" strokeDasharray="220" strokeDashoffset="50" strokeLinecap="round" className="animate-[dash_1s_ease-out_forwards]" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-gray-900">{studentProfile?.readiness_score || 0}%</span>
                                    <span className="text-xs text-gray-500 uppercase">Readiness</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <SkillBar label="DSA" percent={75} color="bg-blue-500" />
                            <SkillBar label="Aptitude" percent={40} color="bg-yellow-500" />
                            <SkillBar label="Communication" percent={60} color="bg-green-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white text-center shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-inner group-hover:rotate-12 transition-transform">
                            <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Daily Challenge</h3>
                        <p className="text-sm opacity-90 mb-4 px-2">Solve 3 aptitude questions to keep your 12-day streak alive!</p>
                        <Button size="sm" className="bg-white text-indigo-700 w-full hover:bg-indigo-50 font-bold border-none">Start Quiz</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Subcomponents with explicit typing
interface StatCardProps {
    icon: LucideIcon;
    color: string;
    bg: string;
    label: string;
    value: string;
    subtext: string;
    trend: 'up' | 'down' | 'neutral';
}

const StatCard = ({ icon: Icon, color, bg, label, value, subtext, trend }: StatCardProps) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend === 'up' && <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12%</span>}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
            <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        </div>
    </div>
);

interface ContentCardProps {
    title: string;
    category: string;
    duration: string;
    instructor: string;
    progress: number;
    image: string;
}

const ContentCard = ({ title, category, duration, instructor, progress, image }: ContentCardProps) => (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-40 overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm transform scale-50 group-hover:scale-100 transition-all duration-300">
                    <PlayCircle className="w-6 h-6 text-primary ml-1" />
                </div>
            </div>
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-primary shadow-sm">{category}</span>
            <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-white flex items-center gap-1">
                <Clock className="w-3 h-3" /> {duration}
            </span>
        </div>
        <div className="p-5">
            <h4 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">{title}</h4>
            <p className="text-sm text-gray-500 mb-4">{instructor}</p>

            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    </div>
);

interface JobRowProps {
    company: string;
    role: string;
    match: number;
    logo: string;
    color: string;
}

const JobRow = ({ company, role, match, logo, color }: JobRowProps) => (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group border border-transparent hover:border-gray-100">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center font-bold text-lg shadow-sm`}>
            {logo}
        </div>
        <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">{company}</h4>
            <p className="text-gray-500 text-xs">{role}</p>
        </div>
        <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-green-600 font-bold text-sm">
                <span>{match}%</span>
            </div>
            <p className="text-[10px] text-gray-400">Match</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors" />
    </div>
);

interface SkillBarProps {
    label: string;
    percent: number;
    color: string;
}

const SkillBar = ({ label, percent, color }: SkillBarProps) => (
    <div>
        <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
            <span>{label}</span>
            <span>{percent}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);
