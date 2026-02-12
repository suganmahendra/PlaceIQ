import { User, Mail, Phone, MapPin, Calendar, Award, Settings, Bell, Lock } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ProgressRing } from '../../components/ui/ProgressRing';

export function ProfilePage() {
    // Mock user data
    const user = {
        name: 'Sugan Mahendra',
        email: 'sugan@example.com',
        phone: '+91 98765 43210',
        department: 'B.Tech AI & Data Science',
        year: '3rd Year',
        rollNumber: 'AI21B001',
        joinedDate: 'January 2026',
        location: 'Chennai, India',
        bio: 'Passionate about AI and Machine Learning. Aspiring to become an AI Engineer.',
    };

    const stats = {
        coursesCompleted: 2,
        totalCourses: 8,
        codingProgress: 65,
        overallProgress: 52,
        certificatesEarned: 2,
        streakDays: 12,
    };

    const skills = [
        { name: 'Python', level: 85 },
        { name: 'SQL', level: 90 },
        { name: 'Data Analysis', level: 70 },
        { name: 'Machine Learning', level: 45 },
        { name: 'Git', level: 95 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                        My Profile
                    </h1>
                    <p className="text-gray-600">Manage your account and track your progress</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-primary to-accent" />

                    {/* Profile Info */}
                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row gap-6 -mt-16">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
                                    <User className="w-16 h-16 text-primary" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 mt-16 md:mt-4">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                                        <p className="text-gray-600 mt-1">{user.department}</p>
                                        <p className="text-sm text-gray-500">{user.rollNumber} • {user.year}</p>
                                    </div>
                                    <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                </div>

                                <p className="text-gray-700 mt-4 max-w-2xl">{user.bio}</p>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm">{user.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{user.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-sm">Joined {user.joinedDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                        <ProgressRing progress={stats.overallProgress} size="lg" />
                        <p className="font-semibold text-gray-900 mt-3">Overall Progress</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                        <div className="text-4xl font-bold text-primary">{stats.certificatesEarned}</div>
                        <p className="text-sm text-gray-600 mt-2">Certificates Earned</p>
                        <Award className="w-6 h-6 text-amber-500 mx-auto mt-2" />
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                        <div className="text-4xl font-bold text-orange-600">{stats.streakDays}</div>
                        <p className="text-sm text-gray-600 mt-2">Day Streak</p>
                        <p className="text-2xl mt-2">🔥</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                        <div className="text-4xl font-bold text-green-600">
                            {stats.coursesCompleted}/{stats.totalCourses}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Courses Completed</p>
                    </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Top Skills</h3>
                    <div className="space-y-4">
                        {skills.map((skill) => (
                            <div key={skill.name}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">{skill.name}</span>
                                    <Badge
                                        variant={skill.level >= 80 ? 'success' : skill.level >= 60 ? 'info' : 'warning'}
                                        size="sm"
                                    >
                                        {skill.level}%
                                    </Badge>
                                </div>
                                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${skill.level}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Notifications */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="w-6 h-6 text-primary" />
                            <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between">
                                <span className="text-gray-700">Course updates</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-gray-700">New content alerts</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
                            </label>
                            <label className="flex items-center justify-between">
                                <span className="text-gray-700">Placement opportunities</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 text-primary" />
                            </label>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-6 h-6 text-primary" />
                            <h3 className="text-xl font-bold text-gray-900">Security</h3>
                        </div>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                Change Password
                            </button>
                            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                Two-Factor Authentication
                            </button>
                            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                Login History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
