import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase, TrendingUp, CheckCircle2, XCircle, AlertCircle,
    Search, Filter, MapPin, Clock, RefreshCw, Send, ExternalLink,
    Trophy, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '../../components/ui/Badge';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EligibilityModal } from '../../components/placements/EligibilityModal';
import { useAuth } from '../../contexts/AuthContext';
import { placementsService } from '../../services/PlacementsService';
import type { PlacementRole } from '../../services/PlacementsService';
import type { Database } from '../../types/database.types';

type StudentProfile = Database['public']['Tables']['students']['Row'];
type FilterTab = 'All' | 'Eligible' | 'Almost Ready' | 'Not Ready';

// ─── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />;
}

function RoleCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-6">
                <Skeleton className="w-20 h-20 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="flex justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 rounded-lg" />)}
                    </div>
                    <Skeleton className="h-11 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

// ─── Status config ──────────────────────────────────────────────────────────

const statusConfig = {
    Eligible: { variant: 'success' as const, bg: 'bg-green-50', border: 'border-green-200', ring: 'text-green-500' },
    'Almost Ready': { variant: 'warning' as const, bg: 'bg-amber-50', border: 'border-amber-200', ring: 'text-amber-500' },
    'Not Ready': { variant: 'danger' as const, bg: 'bg-red-50', border: 'border-red-200', ring: 'text-red-500' },
};

// ─── Main Page ───────────────────────────────────────────────────────────────

export function PlacementsPage() {
    const { profile } = useAuth();
    const studentProfile = profile as StudentProfile | null;
    const navigate = useNavigate();

    const [roles, setRoles] = useState<PlacementRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filterTab, setFilterTab] = useState<FilterTab>('All');
    const [jobTypeFilter, setJobTypeFilter] = useState<string>('All');
    const [salaryFilter, setSalaryFilter] = useState<string>('All');
    const [experienceFilter, setExperienceFilter] = useState<string>('All');
    const [applyingId, setApplyingId] = useState<string | null>(null);

    // Eligibility modal state
    const [showModal, setShowModal] = useState(false);
    const [newlyEligible, setNewlyEligible] = useState<PlacementRole[]>([]);
    const shownModalRef = useRef(false);

    const loadData = useCallback(async () => {
        if (!studentProfile?.id) return;
        setLoading(true);
        setError(null);
        try {
            const data = await placementsService.fetchAll(
                studentProfile.id,
                studentProfile.readiness_score ?? 0,
            );
            setRoles(data);

            // Show eligibility modal once per session for newly eligible roles
            if (!shownModalRef.current) {
                const sessionKey = `eligibility_shown_${studentProfile.id}`;
                const alreadyShown = sessionStorage.getItem(sessionKey);
                const eligible = data.filter((r) => r.eligibilityStatus === 'Eligible' && !r.hasApplied);
                if (!alreadyShown && eligible.length > 0) {
                    setNewlyEligible(eligible);
                    setShowModal(true);
                    sessionStorage.setItem(sessionKey, '1');
                    shownModalRef.current = true;
                }
            }
        } catch (err) {
            console.error('Placements fetch error:', err);
            setError('Failed to load placement data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [studentProfile?.id, studentProfile?.readiness_score]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // ── Apply to a job ────────────────────────────────────────────────────
    const handleApply = async (role: PlacementRole) => {
        if (!studentProfile?.id || role.hasApplied || applyingId) return;
        setApplyingId(role.id);
        try {
            await placementsService.applyToJob(studentProfile.id, role.id);
            setRoles((prev) =>
                prev.map((r) => r.id === role.id ? { ...r, hasApplied: true } : r)
            );
            toast.success(`🎉 Applied to ${role.title} at ${role.companyName}!`);
        } catch (err) {
            toast.error('Failed to submit application. Please try again.');
        } finally {
            setApplyingId(null);
        }
    };

    // ── Derived stats ─────────────────────────────────────────────────────
    const eligibleCount = roles.filter((r) => r.eligibilityStatus === 'Eligible').length;
    const averageMatch = roles.length > 0
        ? Math.round(roles.reduce((s, r) => s + r.matchPercentage, 0) / roles.length)
        : 0;
    const appliedCount = roles.filter((r) => r.hasApplied).length;

    // ── Filter ────────────────────────────────────────────────────────────
    const filtered = roles.filter((r) => {
        const matchesTab = filterTab === 'All' || r.eligibilityStatus === filterTab;
        const matchesSearch = !search ||
            r.title.toLowerCase().includes(search.toLowerCase()) ||
            r.companyName.toLowerCase().includes(search.toLowerCase());

        const matchesJobType = jobTypeFilter === 'All' || r.jobType === jobTypeFilter;

        // Salary parsing for LPA filters
        let matchesSalary = true;
        if (salaryFilter !== 'All') {
            if (r.salaryRange) {
                const lpaMatch = r.salaryRange.match(/(\d+(?:\.\d+)?)/g);
                if (lpaMatch) {
                    const nums = lpaMatch.map(Number);
                    const maxLpa = Math.max(...nums);
                    if (salaryFilter === '< 5 LPA') matchesSalary = maxLpa < 5;
                    else if (salaryFilter === '5 - 10 LPA') matchesSalary = maxLpa >= 5 && maxLpa <= 10;
                    else if (salaryFilter === '10+ LPA') matchesSalary = maxLpa >= 10;
                } else {
                    matchesSalary = false; // Could not parse LPA numbers
                }
            } else {
                matchesSalary = false; // missing salary data
            }
        }

        // Quick parse for experience from title, desc, and type
        let matchesExp = true;
        if (experienceFilter !== 'All') {
            const text = (r.title + " " + (r.description || "")).toLowerCase();
            const isFresherKeyword = text.includes('fresh') || text.includes('0 year') || text.includes('0-1') || r.jobType?.toLowerCase() === 'internship';

            if (experienceFilter === 'Fresher') {
                matchesExp = isFresherKeyword;
            } else if (experienceFilter === 'Experienced') {
                matchesExp = !isFresherKeyword;
            }
        }

        return matchesTab && matchesSearch && matchesJobType && matchesSalary && matchesExp;
    });

    const tabCounts: Record<FilterTab, number> = {
        All: roles.length,
        Eligible: roles.filter((r) => r.eligibilityStatus === 'Eligible').length,
        'Almost Ready': roles.filter((r) => r.eligibilityStatus === 'Almost Ready').length,
        'Not Ready': roles.filter((r) => r.eligibilityStatus === 'Not Ready').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-8">
            {/* Eligibility Modal */}
            {showModal && newlyEligible.length > 0 && (
                <EligibilityModal
                    eligibleRoles={newlyEligible}
                    onApply={handleApply}
                    onClose={() => setShowModal(false)}
                />
            )}

            <div className="max-w-7xl mx-auto space-y-8">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
                        <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Placement Recommendations
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Jobs you're eligible for are determined by your completed roadmaps. Keep learning to unlock more!
                    </p>
                    {!loading && (
                        <button
                            onClick={loadData}
                            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" /> Refresh
                        </button>
                    )}
                </div>

                {/* ── Error ──────────────────────────────────────────────── */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* ── KPI Cards ──────────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-100 p-2 rounded-lg shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">Eligible Roles</h3>
                        </div>
                        {loading ? <Skeleton className="h-9 w-12 mt-1" /> :
                            <p className="text-2xl sm:text-3xl font-bold text-green-600">{eligibleCount}</p>}
                        <p className="text-xs text-gray-500 mt-1">Ready to apply</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">Avg Match</h3>
                        </div>
                        {loading ? <Skeleton className="h-9 w-16 mt-1" /> :
                            <p className="text-2xl sm:text-3xl font-bold text-primary">{averageMatch}%</p>}
                        <p className="text-xs text-gray-500 mt-1">Across all roles</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">Total Roles</h3>
                        </div>
                        {loading ? <Skeleton className="h-9 w-12 mt-1" /> :
                            <p className="text-2xl sm:text-3xl font-bold text-blue-600">{roles.length}</p>}
                        <p className="text-xs text-gray-500 mt-1">Active listings</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-purple-100 p-2 rounded-lg shrink-0">
                                <Send className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">Applied</h3>
                        </div>
                        {loading ? <Skeleton className="h-9 w-12 mt-1" /> :
                            <p className="text-2xl sm:text-3xl font-bold text-purple-600">{appliedCount}</p>}
                        <p className="text-xs text-gray-500 mt-1">Applications sent</p>
                    </div>
                </div>

                {/* ── Eligibility Banner ──────────────────────────────────── */}
                {!loading && eligibleCount > 0 && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-5 text-white flex items-center gap-4">
                        <div className="shrink-0">
                            <Trophy className="w-10 h-10 text-yellow-300" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-lg">
                                🎉 You're eligible for {eligibleCount} role{eligibleCount > 1 ? 's' : ''}!
                            </p>
                            <p className="text-green-100 text-sm mt-0.5">
                                Your completed roadmaps have unlocked real placement opportunities. Apply now!
                            </p>
                        </div>
                        <button
                            onClick={() => setFilterTab('Eligible')}
                            className="shrink-0 bg-white text-green-700 font-bold px-4 py-2 rounded-xl hover:bg-green-50 transition-colors text-sm flex items-center gap-1"
                        >
                            <Sparkles className="w-4 h-4" /> View
                        </button>
                    </div>
                )}

                {/* ── Search + Filters ────────────────────────────────────── */}
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by role or company..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                            />
                        </div>

                        {/* Status Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                            <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
                            {(['All', 'Eligible', 'Almost Ready', 'Not Ready'] as FilterTab[]).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilterTab(tab)}
                                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterTab === tab
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:border-primary/30'
                                        }`}
                                >
                                    {tab} {!loading && <span className="opacity-70">({tabCounts[tab]})</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Secondary Dropdown Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-2 border-b border-gray-100">
                        <select
                            value={jobTypeFilter}
                            onChange={(e) => setJobTypeFilter(e.target.value)}
                            className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer transition-colors"
                        >
                            <option value="All">All Job Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                        </select>

                        <select
                            value={salaryFilter}
                            onChange={(e) => setSalaryFilter(e.target.value)}
                            className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer transition-colors"
                        >
                            <option value="All">Any Salary</option>
                            <option value="< 5 LPA">&lt; 5 LPA</option>
                            <option value="5 - 10 LPA">5 - 10 LPA</option>
                            <option value="10+ LPA">10+ LPA</option>
                        </select>

                        <select
                            value={experienceFilter}
                            onChange={(e) => setExperienceFilter(e.target.value)}
                            className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-gray-700 hover:border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer transition-colors"
                        >
                            <option value="All">Any Experience</option>
                            <option value="Fresher">Fresher (0-1 Yrs)</option>
                            <option value="Experienced">Experienced</option>
                        </select>
                    </div>
                </div>

                {/* ── Role Cards ──────────────────────────────────────────── */}
                <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {filterTab === 'All' ? 'All Roles' : `${filterTab} Roles`}
                    </h2>

                    {loading ? (
                        <div className="space-y-6">
                            {[...Array(3)].map((_, i) => <RoleCardSkeleton key={i} />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">
                                {roles.length === 0
                                    ? 'No active job listings found right now. Check back soon!'
                                    : 'No roles match your current filter.'}
                            </p>
                        </div>
                    ) : (
                        filtered.map((role) => {
                            const cfg = statusConfig[role.eligibilityStatus];
                            const acquiredCount = role.requiredSkills.filter((s) => s.acquired).length;
                            const totalSkills = role.requiredSkills.length;
                            const isApplying = applyingId === role.id;

                            return (
                                <div
                                    key={role.id}
                                    className={`bg-white rounded-2xl border-2 p-5 sm:p-6 hover:shadow-lg transition-all duration-200 ${role.eligibilityStatus === 'Eligible'
                                        ? 'border-green-200 shadow-green-50 shadow-md'
                                        : 'border-gray-200'
                                        }`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start gap-5">
                                        {/* Match ring */}
                                        <div className="shrink-0 flex flex-col items-center gap-1">
                                            <ProgressRing
                                                progress={role.matchPercentage}
                                                size="lg"
                                                color={
                                                    role.eligibilityStatus === 'Eligible'
                                                        ? 'text-green-500'
                                                        : role.eligibilityStatus === 'Almost Ready'
                                                            ? 'text-amber-500'
                                                            : 'text-red-400'
                                                }
                                            />
                                            <span className="text-xs text-gray-500">match</span>
                                        </div>

                                        {/* Main content */}
                                        <div className="flex-1 space-y-4 min-w-0">
                                            {/* Title row */}
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                                                        {role.hasApplied && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                                                <CheckCircle2 className="w-3 h-3" /> Applied
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 font-medium">{role.companyName}</p>
                                                    {role.description && (
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{role.description}</p>
                                                    )}
                                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                                                        {role.location && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-3 h-3" /> {role.location}
                                                            </span>
                                                        )}
                                                        {role.jobType && (
                                                            <span className="flex items-center gap-1">
                                                                <Briefcase className="w-3 h-3" /> {role.jobType}
                                                            </span>
                                                        )}
                                                        {role.deadline && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" /> Deadline: {new Date(role.deadline).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <Badge variant={cfg.variant} size="md">{role.eligibilityStatus}</Badge>
                                                    {role.salaryRange && (
                                                        <p className="text-base font-bold text-primary mt-1">{role.salaryRange}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Skills */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-gray-900 text-sm">Required Roadmaps / Skills</h4>
                                                    <span className="text-xs text-gray-500">
                                                        {acquiredCount}/{totalSkills} completed
                                                    </span>
                                                </div>

                                                {/* Progress bar for skill completion */}
                                                <div className="mb-3">
                                                    <ProgressBar
                                                        progress={totalSkills > 0 ? (acquiredCount / totalSkills) * 100 : 0}
                                                        height="sm"
                                                        color={
                                                            role.eligibilityStatus === 'Eligible'
                                                                ? 'bg-green-500'
                                                                : role.eligibilityStatus === 'Almost Ready'
                                                                    ? 'bg-amber-500'
                                                                    : 'bg-red-400'
                                                        }
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                                    {role.requiredSkills.map((skill) => (
                                                        <div
                                                            key={skill.skill}
                                                            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${skill.acquired
                                                                ? 'bg-green-50 border-green-200 text-green-700'
                                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                                                }`}
                                                        >
                                                            {skill.acquired ? (
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0" />
                                                            ) : (
                                                                <XCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                                            )}
                                                            <span className="truncate flex-1">{skill.skill}</span>
                                                            {skill.progress > 0 && !skill.acquired && (
                                                                <span className="text-amber-600 text-xs shrink-0">{skill.progress}%</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action row */}
                                            {role.eligibilityStatus === 'Eligible' ? (
                                                <div className="flex flex-wrap gap-3">
                                                    {!role.hasApplied ? (
                                                        <button
                                                            onClick={() => handleApply(role)}
                                                            disabled={isApplying}
                                                            className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-60"
                                                        >
                                                            {isApplying
                                                                ? 'Applying…'
                                                                : <><Send className="w-4 h-4" /> Apply Now</>
                                                            }
                                                        </button>
                                                    ) : (
                                                        <div className="flex-1 sm:flex-none flex items-center gap-2 px-6 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-bold text-sm">
                                                            <CheckCircle2 className="w-4 h-4" /> Application Submitted
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className={`flex items-start gap-3 p-4 ${cfg.bg} border ${cfg.border} rounded-xl`}>
                                                    <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${role.eligibilityStatus === 'Almost Ready' ? 'text-amber-600' : 'text-red-500'}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-800 mb-2">
                                                            {role.eligibilityStatus === 'Almost Ready'
                                                                ? `Almost there! Complete ${totalSkills - acquiredCount} more skill${totalSkills - acquiredCount > 1 ? 's' : ''} to unlock this role.`
                                                                : 'Complete the required roadmaps below to become eligible for this role.'}
                                                        </p>
                                                        {/* Missing skills with links */}
                                                        <div className="flex flex-wrap gap-2">
                                                            {role.requiredSkills
                                                                .filter((s) => !s.acquired)
                                                                .map((s) => (
                                                                    s.courseSlug ? (
                                                                        <button
                                                                            key={s.skill}
                                                                            onClick={() => navigate(`/student/courses/${s.courseSlug}`)}
                                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:border-primary hover:text-primary transition-colors"
                                                                        >
                                                                            <ExternalLink className="w-3 h-3" />
                                                                            Start {s.skill}
                                                                            {s.progress > 0 && ` (${s.progress}%)`}
                                                                        </button>
                                                                    ) : (
                                                                        <span
                                                                            key={s.skill}
                                                                            className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-lg"
                                                                        >
                                                                            {s.skill}
                                                                        </span>
                                                                    )
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ── How It Works ────────────────────────────────────────── */}
                {!loading && (
                    <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/10 p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            How Eligibility Works
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex gap-3">
                                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 font-bold text-primary text-xs">1</div>
                                <p>Enroll in courses from <strong>Learning Path</strong> that match the required skills.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 font-bold text-primary text-xs">2</div>
                                <p>Complete ≥ 80% of each required roadmap's lessons.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 font-bold text-primary text-xs">3</div>
                                <p>You become <strong>Eligible</strong> and get a notification to apply!</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
