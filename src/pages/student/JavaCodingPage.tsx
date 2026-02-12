import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronRight, TrendingUp, Award, Flame, Star } from 'lucide-react';
import { ConceptCard } from '../../components/coding/ConceptCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { javaModules } from '../../data/javaConcepts';
import { cn } from '../../lib/utils';

export function JavaCodingPage() {
    const [expandedModules, setExpandedModules] = useState<string[]>(['java-beginner']);

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const overallProgress = Math.round(
        javaModules.reduce((sum, mod) => sum + mod.progress, 0) / javaModules.length
    );

    const totalConcepts = javaModules.reduce((sum, mod) => sum + mod.concepts.length, 0);
    const completedConcepts = javaModules.reduce(
        (sum, mod) => sum + mod.concepts.filter((c) => c.completed).length,
        0
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-8">
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
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 text-white">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold">☕ Java Mastery</h1>
                                <Badge variant="warning" size="sm" className="bg-white/20 text-white border-white/30">
                                    <Star className="w-3 h-3" />
                                    Recommended for Product Companies
                                </Badge>
                            </div>
                            <p className="text-white/90 text-lg mb-6">
                                Master Java for Backend Development and Technical Interviews
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
                                    <p className="text-2xl font-bold">🔥 5 days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-amber-100 p-2 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-amber-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Performance</h3>
                        </div>
                        <Badge variant="warning" size="lg">Average</Badge>
                        <p className="text-sm text-gray-600 mt-2">Keep practicing!</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Award className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Focus Score</h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">68/100</p>
                        <p className="text-sm text-gray-600 mt-2">Room for improvement</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <Flame className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Daily Goal</h3>
                        </div>
                        <p className="text-3xl font-bold text-orange-600">1/2</p>
                        <p className="text-sm text-gray-600 mt-2">Concepts today</p>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
                    <div className="flex items-start gap-4">
                        <Star className="w-6 h-6 flex-shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-lg mb-1">Why Java for Product Companies?</h3>
                            <p className="text-white/90 text-sm">
                                Java is widely used in large-scale product companies like Amazon, Google, and Microsoft.
                                Mastering Java opens doors to backend development, Android development, and enterprise applications.
                                It's essential for cracking technical interviews at top product-based companies.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modules */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Learning Path</h2>

                    {javaModules.map((module) => {
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
                                            module.level === 'Intermediate' && 'bg-orange-500',
                                            module.level === 'Advanced' && 'bg-red-500'
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
