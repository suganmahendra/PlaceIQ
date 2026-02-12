import { LanguageCard } from '../../components/coding/LanguageCard';
import { Code2, TrendingUp, Target, Flame } from 'lucide-react';

// Mock data - in real app, this would come from context/state management
const pythonProgress = {
    language: 'Python' as const,
    progress: 65,
    conceptsCompleted: 45,
    totalConcepts: 70,
    performanceLevel: 'Bright' as const,
    streakDays: 12,
    lastActivity: new Date('2026-02-04'),
};

const javaProgress = {
    language: 'Java' as const,
    progress: 30,
    conceptsCompleted: 18,
    totalConcepts: 60,
    performanceLevel: 'Average' as const,
    streakDays: 5,
    lastActivity: new Date('2026-02-03'),
};

export function CodingHomePage() {
    const totalProgress = Math.round((pythonProgress.progress + javaProgress.progress) / 2);
    const maxStreak = Math.max(pythonProgress.streakDays, javaProgress.streakDays);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
                        <Code2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Master Programming Languages
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Build strong foundations in Python and Java to ace technical interviews and become placement-ready
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Overall Progress</h3>
                        </div>
                        <p className="text-3xl font-bold text-primary">{totalProgress}%</p>
                        <p className="text-sm text-gray-600 mt-1">Across both languages</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <Flame className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Current Streak</h3>
                        </div>
                        <p className="text-3xl font-bold text-orange-600">{maxStreak} days</p>
                        <p className="text-sm text-gray-600 mt-1">Keep it going!</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Target className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Concepts Mastered</h3>
                        </div>
                        <p className="text-3xl font-bold text-green-600">
                            {pythonProgress.conceptsCompleted + javaProgress.conceptsCompleted}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Out of {pythonProgress.totalConcepts + javaProgress.totalConcepts} total
                        </p>
                    </div>
                </div>

                {/* Language Cards */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Language</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <LanguageCard
                            {...pythonProgress}
                            link="/student/coding/python"
                        />
                        <LanguageCard
                            {...javaProgress}
                            link="/student/coding/java"
                        />
                    </div>
                </div>

                {/* Motivational Section */}
                <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-2">🎯 Your Placement Journey Starts Here</h3>
                    <p className="text-white/90 max-w-2xl mx-auto">
                        Consistent practice in both Python and Java will make you interview-ready.
                        Focus on understanding concepts deeply, not just completing them.
                    </p>
                </div>
            </div>
        </div>
    );
}
