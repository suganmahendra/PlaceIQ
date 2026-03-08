import { useState, useEffect, useCallback } from 'react';
import {
    BarChart2, TrendingUp, Clock, Zap, Eye, Target,
    Trophy, BookOpen, CheckCircle2, Layers, RefreshCw
} from 'lucide-react';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { fetchStudentAnalytics } from '../../services/AnalyticsService';
import type { AnalyticsData } from '../../services/AnalyticsService';
import type { Database } from '../../types/database.types';

type StudentProfile = Database['public']['Tables']['students']['Row'];

// ─── Skeleton ────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
    );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <BarChart2 className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">{message}</p>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function AnalyticsPage() {
    const { profile } = useAuth();
    const studentProfile = profile as StudentProfile | null;

    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAnalytics = useCallback(async () => {
        if (!studentProfile?.id) return;
        setLoading(true);
        setError(null);
        try {
            const result = await fetchStudentAnalytics(studentProfile.id);
            setData(result);
        } catch (err) {
            console.error('Analytics fetch error:', err);
            setError('Failed to load analytics data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [studentProfile?.id]);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    // Focus score label
    const getFocusLabel = (score: number) => {
        if (score >= 80) return 'Great concentration!';
        if (score >= 60) return 'Good effort';
        if (score >= 40) return 'Room to improve';
        return 'Keep practicing!';
    };

    // Strengths & areas from skill readiness
    const strengths = data
        ? data.skillReadiness.filter((s) => s.status === 'Bright')
        : [];
    const improvements = data
        ? data.skillReadiness.filter((s) => s.status !== 'Bright')
        : [];

    const maxDayHours = data
        ? Math.max(...data.weeklyActivity.map((d) => d.total), 1)
        : 1;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* ── Header ─────────────────────────────────────────── */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
                        <BarChart2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Learning Analytics
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Track your progress, focus, and skill development
                    </p>
                    {!loading && (
                        <button
                            onClick={loadAnalytics}
                            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh data
                        </button>
                    )}
                </div>

                {/* ── Error Banner ────────────────────────────────────── */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* ── KPI Cards ───────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {/* This Week */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">This Week</h3>
                        </div>
                        {loading
                            ? <Skeleton className="h-9 w-24 mt-1" />
                            : <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                                {data?.totalWeeklyHours ?? 0}h
                            </p>
                        }
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Total learning time</p>
                    </div>

                    {/* Focus Score */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Eye className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Focus Score</h3>
                        </div>
                        {loading
                            ? <Skeleton className="h-9 w-20 mt-1" />
                            : <p className="text-2xl sm:text-3xl font-bold text-green-600">
                                {data?.focusScore ?? 0}%
                            </p>
                        }
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {data ? getFocusLabel(data.focusScore) : '—'}
                        </p>
                    </div>

                    {/* Distraction */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-amber-100 p-2 rounded-lg">
                                <Zap className="w-5 h-5 text-amber-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Distraction</h3>
                        </div>
                        {loading
                            ? <Skeleton className="h-9 w-20 mt-1" />
                            : <p className="text-2xl sm:text-3xl font-bold text-amber-600">
                                {data?.distractionScore ?? 0}%
                            </p>
                        }
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {data && data.distractionScore > 30 ? 'Room for improvement' : 'Well focused'}
                        </p>
                    </div>

                    {/* Avg/Day */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Avg/Day</h3>
                        </div>
                        {loading
                            ? <Skeleton className="h-9 w-20 mt-1" />
                            : <p className="text-2xl sm:text-3xl font-bold text-primary">
                                {data?.avgHoursPerDay ?? 0}h
                            </p>
                        }
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">Daily average</p>
                    </div>
                </div>

                {/* ── Secondary Stats ─────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg shrink-0">
                            <Trophy className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total XP</p>
                            {loading
                                ? <Skeleton className="h-5 w-16 mt-1" />
                                : <p className="font-bold text-purple-600">{data?.totalXp ?? 0} XP</p>
                            }
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Enrolled</p>
                            {loading
                                ? <Skeleton className="h-5 w-16 mt-1" />
                                : <p className="font-bold text-blue-600">
                                    {data?.enrolledCourses ?? 0} Courses
                                </p>
                            }
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Lessons Done</p>
                            {loading
                                ? <Skeleton className="h-5 w-12 mt-1" />
                                : <p className="font-bold text-green-600">
                                    {data?.lessonsCompleted ?? 0}
                                </p>
                            }
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-lg shrink-0">
                            <Layers className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Quizzes Passed</p>
                            {loading
                                ? <Skeleton className="h-5 w-16 mt-1" />
                                : <p className="font-bold text-amber-600">
                                    {data?.quizzesPassed ?? 0} / {data?.quizzesAttempted ?? 0}
                                </p>
                            }
                        </div>
                    </div>
                </div>

                {/* ── Weekly Activity Chart ───────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Learning Activity</h2>

                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Skeleton className="h-4 w-10" />
                                    <Skeleton className="h-8 flex-1" />
                                    <Skeleton className="h-4 w-8" />
                                </div>
                            ))}
                        </div>
                    ) : data && data.weeklyActivity.some((d) => d.total > 0) ? (
                        <div className="space-y-3">
                            {data.weeklyActivity.map((day, index) => {
                                const videoPercent = (day.videoHours / maxDayHours) * 100;
                                const quizPercent = (day.quizHours / maxDayHours) * 100;
                                const isToday = day.date === new Date().toISOString().split('T')[0];

                                return (
                                    <div key={index} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm font-medium w-12 ${isToday ? 'text-primary font-bold' : 'text-gray-700'}`}>
                                                {day.day}
                                                {isToday && <span className="text-xs ml-1 text-primary/70">•</span>}
                                            </span>
                                            <div className="flex-1 mx-4">
                                                <div className="flex h-8 rounded-lg overflow-hidden bg-gray-100">
                                                    {day.videoHours > 0 && (
                                                        <div
                                                            className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium transition-all duration-500"
                                                            style={{ width: `${videoPercent}%` }}
                                                        >
                                                            {day.videoHours > 0.3 && `${day.videoHours}h`}
                                                        </div>
                                                    )}
                                                    {day.quizHours > 0 && (
                                                        <div
                                                            className="bg-purple-500 flex items-center justify-center text-white text-xs font-medium transition-all duration-500"
                                                            style={{ width: `${quizPercent}%` }}
                                                        >
                                                            {day.quizHours > 0.3 && `${day.quizHours}h`}
                                                        </div>
                                                    )}
                                                    {day.total === 0 && (
                                                        <div className="flex items-center justify-center text-gray-400 text-xs w-full">
                                                            No activity
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 w-14 text-right">
                                                {day.total}h
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState message="No learning activity recorded this week yet. Start a lesson to see your progress!" />
                    )}

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded" />
                            <span className="text-sm text-gray-600">
                                Video/Lessons ({data ? data.weeklyActivity.reduce((s, d) => s + d.videoHours, 0).toFixed(1) : 0}h)
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-500 rounded" />
                            <span className="text-sm text-gray-600">
                                Quizzes ({data ? data.weeklyActivity.reduce((s, d) => s + d.quizHours, 0).toFixed(1) : 0}h)
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Skill Readiness ─────────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-gray-900">Skill Readiness Score</h2>
                        <span className="text-xs text-gray-500 ml-auto">Based on course progress</span>
                    </div>

                    {loading ? (
                        <div className="space-y-5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i}>
                                    <div className="flex justify-between mb-2">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                    <Skeleton className="h-3 w-full" />
                                </div>
                            ))}
                        </div>
                    ) : data && data.skillReadiness.length > 0 ? (
                        <div className="space-y-4">
                            {data.skillReadiness.map((skill) => (
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
                    ) : (
                        <EmptyState message="Enroll in courses to see your skill readiness scores here." />
                    )}

                    {/* Overall readiness */}
                    {!loading && data && (
                        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm text-gray-600">Overall Readiness Score</span>
                            <div className="flex items-center gap-3">
                                <div className="w-32">
                                    <ProgressBar
                                        progress={data.readinessScore}
                                        height="sm"
                                        color="bg-primary"
                                    />
                                </div>
                                <span className="font-bold text-primary">{data.readinessScore}%</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Recent XP Activity ──────────────────────────────── */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Trophy className="w-6 h-6 text-amber-500" />
                        <h2 className="text-xl font-bold text-gray-900">Recent XP Activity</h2>
                        <span className="ml-auto text-sm font-bold text-purple-600">
                            {loading ? '...' : `${data?.totalXp ?? 0} XP total`}
                        </span>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <Skeleton className="h-4 flex-1" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                            ))}
                        </div>
                    ) : data && data.xpHistory.length > 0 ? (
                        <div className="space-y-3">
                            {data.xpHistory.map((entry, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-100 p-2 rounded-lg">
                                            <Trophy className="w-4 h-4 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{entry.reason}</p>
                                            <p className="text-xs text-gray-500">{entry.date}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-amber-600">+{entry.amount} XP</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="Complete lessons and quizzes to earn XP!" />
                    )}
                </div>

                {/* ── Insights ────────────────────────────────────────── */}
                {!loading && data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                            <h3 className="text-xl font-bold mb-3">💪 Strengths</h3>
                            <ul className="space-y-2">
                                {strengths.length > 0 ? (
                                    strengths.map((s) => (
                                        <li key={s.skill} className="flex items-start gap-2">
                                            <span className="text-green-200">•</span>
                                            <span>Excellent progress in {s.skill} ({s.level}%)</span>
                                        </li>
                                    ))
                                ) : (
                                    <>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-200">•</span>
                                            <span>You have {data.lessonsCompleted} lessons completed</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-200">•</span>
                                            <span>Keep building momentum – consistency is key!</span>
                                        </li>
                                    </>
                                )}
                                {data.totalXp > 0 && (
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-200">•</span>
                                        <span>{data.totalXp} XP earned – great work!</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                            <h3 className="text-xl font-bold mb-3">🎯 Areas to Improve</h3>
                            <ul className="space-y-2">
                                {improvements.length > 0 ? (
                                    improvements.slice(0, 3).map((s) => (
                                        <li key={s.skill} className="flex items-start gap-2">
                                            <span className="text-amber-200">•</span>
                                            <span>
                                                Spend more time on {s.skill}
                                                {s.status === 'Weak' ? ' – needs attention' : ' – almost there!'}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-200">•</span>
                                            <span>Try to study at least {Math.max(1, 2 - data.avgHoursPerDay).toFixed(1)}h more per day</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-amber-200">•</span>
                                            <span>Take quizzes regularly to boost your focus score</span>
                                        </li>
                                    </>
                                )}
                                {data.quizzesAttempted === 0 && (
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-200">•</span>
                                        <span>Complete quizzes to measure your knowledge retention</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
