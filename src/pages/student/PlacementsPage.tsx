import { Badge } from '../../components/ui/Badge';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Briefcase, TrendingUp, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface PlacementRole {
    id: string;
    title: string;
    company: string;
    matchPercentage: number;
    requiredSkills: { skill: string; acquired: boolean }[];
    eligibilityStatus: 'Eligible' | 'Almost Ready' | 'Not Ready';
    salaryRange: string;
    description: string;
}

const placementRoles: PlacementRole[] = [
    {
        id: '1',
        title: 'AI Engineer',
        company: 'Tech Giants',
        matchPercentage: 75,
        requiredSkills: [
            { skill: 'Python', acquired: true },
            { skill: 'Machine Learning', acquired: true },
            { skill: 'Deep Learning', acquired: false },
            { skill: 'DSA', acquired: true },
            { skill: 'SQL', acquired: true },
        ],
        eligibilityStatus: 'Almost Ready',
        salaryRange: '₹8-12 LPA',
        description: 'Build and deploy AI models for production systems',
    },
    {
        id: '2',
        title: 'Data Analyst',
        company: 'Analytics Firms',
        matchPercentage: 90,
        requiredSkills: [
            { skill: 'Python', acquired: true },
            { skill: 'Data Analysis', acquired: true },
            { skill: 'SQL', acquired: true },
            { skill: 'Statistics', acquired: true },
        ],
        eligibilityStatus: 'Eligible',
        salaryRange: '₹5-8 LPA',
        description: 'Analyze data to derive business insights and create visualizations',
    },
    {
        id: '3',
        title: 'ML Intern',
        company: 'Startups',
        matchPercentage: 65,
        requiredSkills: [
            { skill: 'Python', acquired: true },
            { skill: 'Machine Learning', acquired: true },
            { skill: 'Mathematics', acquired: false },
            { skill: 'Git', acquired: true },
        ],
        eligibilityStatus: 'Almost Ready',
        salaryRange: '₹3-5 LPA',
        description: 'Work on ML projects and learn from experienced engineers',
    },
    {
        id: '4',
        title: 'Software Engineer',
        company: 'Product Companies',
        matchPercentage: 55,
        requiredSkills: [
            { skill: 'DSA', acquired: true },
            { skill: 'Java', acquired: false },
            { skill: 'System Design', acquired: false },
            { skill: 'Git', acquired: true },
        ],
        eligibilityStatus: 'Not Ready',
        salaryRange: '₹10-15 LPA',
        description: 'Develop scalable software solutions for millions of users',
    },
];

const statusColors = {
    Eligible: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', variant: 'success' as const },
    'Almost Ready': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', variant: 'warning' as const },
    'Not Ready': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', variant: 'danger' as const },
};

export function PlacementsPage() {
    const eligibleCount = placementRoles.filter((r) => r.eligibilityStatus === 'Eligible').length;
    const averageMatch = Math.round(
        placementRoles.reduce((sum, role) => sum + role.matchPercentage, 0) / placementRoles.length
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
                        <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Placement Recommendations
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        AI-powered role matching based on your skills and learning progress
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Eligible Roles</h3>
                        </div>
                        <p className="text-3xl font-bold text-green-600">{eligibleCount}</p>
                        <p className="text-sm text-gray-600 mt-1">Ready to apply</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Avg Match</h3>
                        </div>
                        <p className="text-3xl font-bold text-primary">{averageMatch}%</p>
                        <p className="text-sm text-gray-600 mt-1">Across all roles</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Total Roles</h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{placementRoles.length}</p>
                        <p className="text-sm text-gray-600 mt-1">Recommended for you</p>
                    </div>
                </div>

                {/* Role Cards */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Recommended Roles</h2>

                    {placementRoles.map((role) => {
                        const statusStyle = statusColors[role.eligibilityStatus];
                        const acquiredSkills = role.requiredSkills.filter((s) => s.acquired).length;
                        const totalSkills = role.requiredSkills.length;

                        return (
                            <div
                                key={role.id}
                                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start gap-6">
                                    {/* Match Percentage */}
                                    <div className="flex-shrink-0">
                                        <ProgressRing progress={role.matchPercentage} size="lg" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-1">{role.title}</h3>
                                                <p className="text-gray-600">{role.company}</p>
                                                <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant={statusStyle.variant} size="lg">
                                                    {role.eligibilityStatus}
                                                </Badge>
                                                <p className="text-lg font-bold text-primary mt-2">{role.salaryRange}</p>
                                            </div>
                                        </div>

                                        {/* Skills Checklist */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-gray-900">Required Skills</h4>
                                                <span className="text-sm text-gray-600">
                                                    {acquiredSkills}/{totalSkills} acquired
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                                {role.requiredSkills.map((skill) => (
                                                    <div
                                                        key={skill.skill}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${skill.acquired
                                                                ? 'bg-green-50 border-green-200'
                                                                : 'bg-gray-50 border-gray-200'
                                                            }`}
                                                    >
                                                        {skill.acquired ? (
                                                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        )}
                                                        <span
                                                            className={`text-sm font-medium ${skill.acquired ? 'text-green-700' : 'text-gray-600'
                                                                }`}
                                                        >
                                                            {skill.skill}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action */}
                                        {role.eligibilityStatus === 'Eligible' ? (
                                            <button className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                                                Apply Now
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                                <p className="text-sm text-amber-700">
                                                    Complete the missing skills to become eligible for this role
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
