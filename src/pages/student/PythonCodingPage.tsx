import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronRight, TrendingUp, Award, Flame } from 'lucide-react';
import { ConceptCard } from '../../components/coding/ConceptCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { pythonModules } from '../../data/pythonConcepts';
import { cn } from '../../lib/utils';

export function PythonCodingPage() {
    const [expandedModules, setExpandedModules] = useState<string[]>(['py-beginner']);

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const overallProgress = Math.round(
        pythonModules.reduce((sum, mod) => sum + mod.progress, 0) / pythonModules.length
    );

    const totalConcepts = pythonModules.reduce((sum, mod) => sum + mod.concepts.length, 0);
    const completedConcepts = pythonModules.reduce(
        (sum, mod) => sum + mod.concepts.filter((c) => c.completed).length,
        0
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Back Button */}
                <Link
                    to="/student/coding"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back to Coding Home</span>
                </Link>

                {/* Header */}
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-2">🐍 Python Mastery</h1>
                            <p className="text-white/90 text-lg mb-6">
                                Master Python for AI, Data Science, and Technical Interviews
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                    <p className="text-sm text-white/80">Progress</p>
                                    <p className="text-2xl font-bold">{overallProgress}%</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                    <p className="text-sm text-white/80">Completed</p>
                                    <p className="text-2xl font-bold">
                                        {completedConcepts}/{totalConcepts}
                                    </p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                    <p className="text-sm text-white/80">Streak</p>
                                    <p className="text-2xl font-bold">🔥 12 days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Performance</h3>
                        </div>
                        <Badge variant="success" size="lg">Bright</Badge>
                        <p className="text-sm text-gray-600 mt-2">You're doing excellent!</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Award className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Focus Score</h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">85/100</p>
                        <p className="text-sm text-gray-600 mt-2">Great concentration!</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <Flame className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Daily Goal</h3>
                        </div>
                        <p className="text-3xl font-bold text-orange-600">2/3</p>
                        <p className="text-sm text-gray-600 mt-2">Concepts today</p>
                    </div>
                </div>

                {/* Modules */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Learning Path</h2>

                    {pythonModules.map((module) => {
                        const isExpanded = expandedModules.includes(module.id);

                        return (
                            <div
                                key={module.id}
                                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                            >
                                {/* Module Header */}
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={cn(
                                            'w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg',
                                            module.level === 'Beginner' && 'bg-green-500',
                                            module.level === 'Intermediate' && 'bg-blue-500',
                                            module.level === 'Advanced' && 'bg-purple-500'
                                        )}>
                                            {module.level[0]}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{module.title}</h3>
                                            <p className="text-sm text-gray-600">
                                                {module.concepts.filter((c) => c.completed).length} / {module.concepts.length} concepts completed
                                            </p>
                                        </div>
                                        <div className="w-48">
                                            <ProgressBar progress={module.progress} height="lg" />
                                        </div>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown className="w-6 h-6 text-gray-400 ml-4" />
                                    ) : (
                                        <ChevronRight className="w-6 h-6 text-gray-400 ml-4" />
                                    )}
                                </button>

                                {/* Module Content */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50">
                                        {module.concepts.map((concept) => (
                                            <ConceptCard
                                                key={concept.id}
                                                concept={concept}
                                                onQuizClick={() => console.log('Quiz:', concept.id)}
                                                onTaskClick={() => console.log('Task:', concept.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
