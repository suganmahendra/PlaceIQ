import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import {
    Search, UserCircle, BookOpen, Clock, Activity, Target,
    ChevronLeft, Star, Zap, TrendingUp, AlertTriangle
} from 'lucide-react';
import type { AnalyticsData } from '../../../services/AnalyticsService';
import { fetchStudentAnalytics } from '../../../services/AnalyticsService';

interface StudentData {
    id: string;
    full_name: string;
    email: string;
    level?: string;
    xp?: number;
}

const levelColor = (level?: string) => {
    switch (level) {
        case 'Expert':       return 'text-purple-600 bg-purple-50 border-purple-200';
        case 'Advanced':     return 'text-blue-600 bg-blue-50 border-blue-200';
        case 'Intermediate': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        default:             return 'text-gray-500 bg-gray-50 border-gray-200';
    }
};

const avatarColor = (name?: string) => {
    const colors = [
        'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
        'bg-orange-500', 'bg-rose-500', 'bg-indigo-500',
    ];
    return colors[(name?.charCodeAt(0) ?? 0) % colors.length];
};

/* ─── Empty State ─────────────────────────────────────────────────────────── */
function EmptyState({ studentCount }: { studentCount: number }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 mb-6 relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-25" />
                <div className="absolute inset-2 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCircle className="w-8 h-8 text-primary/50" />
                </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Select a Student</h2>
            <p className="text-gray-500 mt-2 max-w-xs text-sm">
                Pick a student from the list below to view their full performance telemetry and analytics.
            </p>
            {studentCount > 0 && (
                <span className="mt-4 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    {studentCount} students enrolled
                </span>
            )}
        </div>
    );
}

/* ─── Student Card (in list) ─────────────────────────────────────────────── */
function StudentCard({ student, onSelect }: { student: StudentData; onSelect: () => void }) {
    return (
        <button
            onClick={onSelect}
            className="w-full text-left p-4 rounded-2xl border border-gray-100 bg-white hover:border-primary/30 hover:shadow-md transition-all duration-200 flex items-center gap-4 group"
        >
            <div className={`w-12 h-12 rounded-2xl ${avatarColor(student.full_name)} text-white flex items-center justify-center font-bold text-lg flex-shrink-0 transition-transform group-hover:scale-105`}>
                {student.full_name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate text-sm">{student.full_name}</p>
                <p className="text-gray-400 text-xs truncate mt-0.5">{student.email}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                {student.level && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${levelColor(student.level)}`}>
                        {student.level}
                    </span>
                )}
                {student.xp !== undefined && (
                    <span className="text-[10px] text-amber-600 font-semibold">{student.xp} XP</span>
                )}
            </div>
        </button>
    );
}

/* ─── KPI Card ───────────────────────────────────────────────────────────── */
function KpiCard({ label, value, sub, colorClass, icon }: {
    label: string; value: string; sub?: string;
    colorClass: string; icon: React.ReactNode;
}) {
    return (
        <div className={`rounded-2xl p-5 border ${colorClass} flex flex-col gap-2`}>
            <div className="flex items-center gap-2 text-sm font-semibold opacity-80">
                {icon}
                {label}
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {sub && <p className="text-xs opacity-70">{sub}</p>}
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export function StudentExplorerPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents]     = useState<StudentData[]>([]);
    const [filtered, setFiltered]     = useState<StudentData[]>([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState<string | null>(null);

    const [selected, setSelected]     = useState<StudentData | null>(null);
    const [analyticsData, setAnalytics] = useState<AnalyticsData | null>(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    /* fetch student list */
    useEffect(() => {
        (async () => {
            setLoading(true);
            const { data, error: err } = await supabase
                .from('students')
                .select('id, full_name, email, level, xp')
                .order('full_name');
            if (err) setError(err.message);
            else { setStudents(data ?? []); setFiltered(data ?? []); }
            setLoading(false);
        })();
    }, []);

    /* filter on search */
    useEffect(() => {
        if (!searchTerm.trim()) { setFiltered(students); return; }
        const t = searchTerm.toLowerCase();
        setFiltered(students.filter(s =>
            s.full_name?.toLowerCase().includes(t) ||
            s.email?.toLowerCase().includes(t)
        ));
    }, [searchTerm, students]);

    const handleSelect = useCallback(async (student: StudentData) => {
        setSelected(student);
        setAnalytics(null);
        setAnalyticsLoading(true);
        try { setAnalytics(await fetchStudentAnalytics(student.id)); }
        catch (e) { console.error(e); }
        setAnalyticsLoading(false);
    }, []);

    const handleBack = () => {
        setSelected(null);
        setAnalytics(null);
    };

    /* ── DETAIL VIEW ─────────────────────────────────────────────────────── */
    if (selected) {
        return (
            <div className="flex flex-col h-full overflow-hidden bg-gray-50/50">
                {/* sticky header */}
                <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center gap-4 flex-shrink-0">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors group"
                    >
                        <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        All Students
                    </button>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className={`w-10 h-10 ${avatarColor(selected.full_name)} text-white rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0`}>
                        {selected.full_name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-bold text-gray-900 text-lg leading-tight truncate">{selected.full_name}</h1>
                        <p className="text-sm text-gray-400 truncate">{selected.email}</p>
                    </div>
                    {selected.level && (
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border flex-shrink-0 hidden sm:block ${levelColor(selected.level)}`}>
                            {selected.level}
                        </span>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
                    {analyticsLoading ? (
                        /* skeleton */
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="h-48 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                                ))}
                            </div>
                        </div>
                    ) : analyticsData ? (
                        <>
                            {/* KPI Cards — always 2×2 on md, 4×1 on lg */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <KpiCard
                                    label="Weekly Hours" value={`${analyticsData.totalWeeklyHours}h`}
                                    sub={`${analyticsData.avgHoursPerDay}h avg/day`}
                                    colorClass="from-blue-50 to-blue-100/50 bg-gradient-to-br border-blue-100 text-blue-700"
                                    icon={<Clock size={15} />}
                                />
                                <KpiCard
                                    label="Focus Score" value={`${analyticsData.focusScore}%`}
                                    sub={`${analyticsData.distractionScore}% distraction`}
                                    colorClass="from-purple-50 to-purple-100/50 bg-gradient-to-br border-purple-100 text-purple-700"
                                    icon={<Activity size={15} />}
                                />
                                <KpiCard
                                    label="Readiness" value={`${analyticsData.readinessScore}%`}
                                    sub={analyticsData.level}
                                    colorClass="from-emerald-50 to-emerald-100/50 bg-gradient-to-br border-emerald-100 text-emerald-700"
                                    icon={<Target size={15} />}
                                />
                                <KpiCard
                                    label="Courses" value={`${analyticsData.enrolledCourses}`}
                                    sub="enrolled"
                                    colorClass="from-orange-50 to-orange-100/50 bg-gradient-to-br border-orange-100 text-orange-700"
                                    icon={<BookOpen size={15} />}
                                />
                            </div>

                            {/* Performance + XP */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-sm">
                                        <TrendingUp size={15} className="text-primary" />
                                        Performance Telemetry
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            { label: 'Total XP',         value: analyticsData.totalXp.toLocaleString(), accent: true },
                                            { label: 'Lessons Completed', value: `${analyticsData.lessonsCompleted}` },
                                            { label: 'Quizzes Passed',   value: `${analyticsData.quizzesPassed} / ${analyticsData.quizzesAttempted}` },
                                            { label: 'Avg Hours / Day',  value: `${analyticsData.avgHoursPerDay}h` },
                                            { label: 'Weekly Total',     value: `${analyticsData.totalWeeklyHours}h` },
                                        ].map(({ label, value, accent }) => (
                                            <li key={label} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                                                <span className="text-gray-500">{label}</span>
                                                <span className={`font-semibold ${accent ? 'text-primary' : 'text-gray-900'}`}>{value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-sm">
                                        <Star size={15} className="text-yellow-500" />
                                        Recent XP Activity
                                    </h3>
                                    {analyticsData.xpHistory.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-8">No recent XP activity.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                            {analyticsData.xpHistory.slice(0, 6).map((entry, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm">
                                                    <Zap size={13} className="text-yellow-400 flex-shrink-0" />
                                                    <span className="text-gray-600 truncate flex-1">{entry.reason}</span>
                                                    <span className="text-emerald-600 font-semibold flex-shrink-0">+{entry.amount}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Skill Readiness */}
                            {analyticsData.skillReadiness.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-5 text-sm">Skill Readiness</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {analyticsData.skillReadiness.map(skill => (
                                            <div key={skill.skill} className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="font-medium text-gray-700 truncate pr-2">{skill.skill}</span>
                                                    <span className={`font-bold flex-shrink-0 ${
                                                        skill.status === 'Bright' ? 'text-emerald-600' :
                                                        skill.status === 'Average' ? 'text-amber-600' : 'text-red-500'
                                                    }`}>{skill.level}%</span>
                                                </div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            skill.status === 'Bright' ? 'bg-emerald-500' :
                                                            skill.status === 'Average' ? 'bg-amber-400' : 'bg-red-400'
                                                        }`}
                                                        style={{ width: `${skill.level}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 text-gray-400 text-sm">
                            <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            Could not load analytics for this student.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    /* ── LIST VIEW ───────────────────────────────────────────────────────── */
    return (
        <div className="flex flex-col h-full overflow-hidden bg-gray-50/50 p-4 md:p-6 lg:p-8 space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Explorer</h1>
                <p className="text-gray-500 text-sm mt-1">Search and select a student to view their full analytics.</p>
            </div>

            {/* Search */}
            <div className="relative max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm
                               focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40
                               transition-all text-sm text-gray-700"
                />
            </div>

            {/* Count */}
            {!loading && !error && (
                <p className="text-xs text-gray-400 -mt-2 pl-1">
                    {filtered.length} student{filtered.length !== 1 ? 's' : ''} found
                </p>
            )}

            {/* Grid List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-red-400" />
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-sm">
                        No students match your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pb-4">
                        {filtered.map(student => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                onSelect={() => handleSelect(student)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
