import { BarChart2, TrendingUp, Clock, Zap, Eye, Target } from 'lucide-react';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';

export function AnalyticsPage() {
    // Mock data
    const weeklyData = [
        { day: 'Mon', coding: 2.5, courses: 1.5 },
        { day: 'Tue', coding: 3, courses: 2 },
        { day: 'Wed', coding: 1.5, courses: 3 },
        { day: 'Thu', coding: 4, courses: 1 },
        { day: 'Fri', coding: 2, courses: 2.5 },
        { day: 'Sat', coding: 3.5, courses: 3.5 },
        { day: 'Sun', coding: 2.5, courses: 2 },
    ];

    const totalHours = weeklyData.reduce((sum, day) => sum + day.coding + day.courses, 0);
    const codingHours = weeklyData.reduce((sum, day) => sum + day.coding, 0);
    const courseHours = weeklyData.reduce((sum, day) => sum + day.courses, 0);
    const focusScore = 82;
    const distractionRate = 18;

    const skillReadiness = [
        { skill: 'Python', level: 85, status: 'Bright' },
        { skill: 'DSA', level: 65, status: 'Average' },
        { skill: 'Machine Learning', level: 45, status: 'Weak' },
        { skill: 'SQL', level: 90, status: 'Bright' },
        { skill: 'Java', level: 40, status: 'Weak' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
                        <BarChart2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Learning Analytics
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Track your progress, focus, and skill development
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">This Week</h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{totalHours.toFixed(1)}h</p>
                        <p className="text-sm text-gray-600 mt-1">Total learning time</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Eye className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Focus Score</h3>
                        </div>
                        <p className="text-3xl font-bold text-green-600">{focusScore}%</p>
                        <p className="text-sm text-gray-600 mt-1">Great concentration!</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-amber-100 p-2 rounded-lg">
                                <Zap className="w-5 h-5 text-amber-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Distraction</h3>
                        </div>
                        <p className="text-3xl font-bold text-amber-600">{distractionRate}%</p>
                        <p className="text-sm text-gray-600 mt-1">Room for improvement</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Avg/Day</h3>
                        </div>
                        <p className="text-3xl font-bold text-primary">{(totalHours / 7).toFixed(1)}h</p>
                        <p className="text-sm text-gray-600 mt-1">Daily average</p>
                    </div>
                </div>

                {/* Weekly Activity Chart */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Learning Activity</h2>
                    <div className="space-y-4">
                        {weeklyData.map((day, index) => {
                            const maxHours = 7;
                            const totalDayHours = day.coding + day.courses;
                            const codingPercent = (day.coding / maxHours) * 100;
                            const coursesPercent = (day.courses / maxHours) * 100;

                            return (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 w-12">{day.day}</span>
                                        <div className="flex-1 mx-4">
                                            <div className="flex h-8 rounded-lg overflow-hidden bg-gray-100">
                                                <div
                                                    className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                                                    style={{ width: `${codingPercent}%` }}
                                                >
                                                    {day.coding > 0.5 && `${day.coding}h`}
                                                </div>
                                                <div
                                                    className="bg-purple-500 flex items-center justify-center text-white text-xs font-medium"
                                                    style={{ width: `${coursesPercent}%` }}
                                                >
                                                    {day.courses > 0.5 && `${day.courses}h`}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                                            {totalDayHours.toFixed(1)}h
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <span className="text-sm text-gray-600">Coding ({codingHours.toFixed(1)}h)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-500 rounded"></div>
                            <span className="text-sm text-gray-600">Courses ({courseHours.toFixed(1)}h)</span>
                        </div>
                    </div>
                </div>

                {/* Skill Readiness */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-gray-900">Skill Readiness Score</h2>
                    </div>
                    <div className="space-y-4">
                        {skillReadiness.map((skill) => (
                            <div key={skill.skill}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900">{skill.skill}</span>
                                    <div className="flex items-center gap-3">
                                        <Badge
                                            variant={
                                                skill.status === 'Bright'
                                                    ? 'success'
                                                    : skill.status === 'Average'
                                                        ? 'warning'
                                                        : 'danger'
                                            }
                                            size="sm"
                                        >
                                            {skill.status}
                                        </Badge>
                                        <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                                            {skill.level}%
                                        </span>
                                    </div>
                                </div>
                                <ProgressBar
                                    progress={skill.level}
                                    height="md"
                                    color={
                                        skill.status === 'Bright'
                                            ? 'bg-green-500'
                                            : skill.status === 'Average'
                                                ? 'bg-amber-500'
                                                : 'bg-red-500'
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">💪 Strengths</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-green-200">•</span>
                                <span>Excellent focus during Python sessions</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-200">•</span>
                                <span>Consistent daily learning streak</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-200">•</span>
                                <span>Strong SQL and database skills</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                        <h3 className="text-xl font-bold mb-2">🎯 Areas to Improve</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-200">•</span>
                                <span>Spend more time on Machine Learning concepts</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-200">•</span>
                                <span>Reduce video pauses and skips in Java</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-200">•</span>
                                <span>Complete DSA practice problems regularly</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
