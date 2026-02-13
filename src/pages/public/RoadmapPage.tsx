import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Clock,
    BookOpen,
    CheckCircle2,
    Circle,
    Award,
    Target,
    TrendingUp
} from 'lucide-react';
import roadmapsData from '../../data/roadmaps';

interface Topic {
    name: string;
    description: string;
    completed: boolean;
    resources: number;
}

interface Phase {
    title: string;
    duration: string;
    topics: Topic[];
}

interface Roadmap {
    id: string;
    title: string;
    level: string;
    modules: number;
    duration: string;
    color: string;
    icon: string;
    description: string;
    phases: Phase[];
}

export const RoadmapPage: React.FC = () => {
    const { roadmapId } = useParams<{ roadmapId: string }>();
    const navigate = useNavigate();

    const roadmap = roadmapsData.find((r: Roadmap) => r.id === roadmapId);

    if (!roadmap) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Roadmap not found</h2>
                    <button
                        onClick={() => navigate('/learning-preview')}
                        className="text-primary font-bold hover:underline"
                    >
                        ← Back to Learning Tracks
                    </button>
                </div>
            </div>
        );
    }

    const getColorClasses = (color: string) => {
        const colorMap: Record<string, { bg: string; text: string; border: string }> = {
            blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/30' },
            purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/30' },
            orange: { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/30' },
            pink: { bg: 'bg-pink-500/10', text: 'text-pink-600', border: 'border-pink-500/30' },
        };
        return colorMap[color] || colorMap.blue;
    };

    const colors = getColorClasses(roadmap.color);
    const totalTopics = roadmap.phases.reduce((acc, phase) => acc + phase.topics.length, 0);
    const completedTopics = roadmap.phases.reduce(
        (acc, phase) => acc + phase.topics.filter(t => t.completed).length,
        0
    );
    const progress = Math.round((completedTopics / totalTopics) * 100);

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <button
                        onClick={() => navigate('/learning-preview')}
                        className="flex items-center gap-2 text-text-secondary hover:text-primary font-medium mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Learning Tracks
                    </button>

                    <div className="glass-card p-8 rounded-3xl border border-white/60">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center`}>
                                        <Award className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-text-primary">{roadmap.title}</h1>
                                        <p className="text-text-secondary mt-1">{roadmap.description}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 mt-6">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-semibold">{roadmap.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl">
                                        <BookOpen className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-semibold">{roadmap.modules} Modules</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl">
                                        <Target className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-semibold">{roadmap.level}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress */}
                            <div className="lg:w-48">
                                <div className="text-center p-6 bg-white/60 rounded-2xl border border-primary/10">
                                    <div className="relative w-32 h-32 mx-auto mb-3">
                                        <svg className="transform -rotate-90 w-32 h-32">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                className="text-gray-200"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="transparent"
                                                strokeDasharray={`${2 * Math.PI * 56}`}
                                                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                                                className={colors.text}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-3xl font-bold">{progress}%</span>
                                        </div>
                                    </div>
                                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                                        Overall Progress
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Roadmap Phases */}
                <div className="space-y-8">
                    {roadmap.phases.map((phase, phaseIndex) => (
                        <motion.div
                            key={phaseIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: phaseIndex * 0.1 }}
                            className="relative"
                        >
                            {/* Timeline Connector */}
                            {phaseIndex < roadmap.phases.length - 1 && (
                                <div className={`absolute left-8 top-20 bottom-0 w-0.5 ${colors.bg} hidden md:block`} />
                            )}

                            <div className="glass-card p-6 rounded-2xl border border-white/60">
                                {/* Phase Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center flex-shrink-0 relative z-10`}>
                                        <span className="text-2xl font-bold">{phaseIndex + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold mb-1">{phase.title}</h2>
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm font-medium">{phase.duration}</span>
                                            <span className="mx-2">•</span>
                                            <span className="text-sm font-medium">
                                                {phase.topics.length} Topics
                                            </span>
                                        </div>
                                    </div>
                                    <div className={`hidden md:flex items-center gap-2 px-4 py-2 ${colors.bg} ${colors.text} rounded-xl`}>
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm font-bold">
                                            Phase {phaseIndex + 1}
                                        </span>
                                    </div>
                                </div>

                                {/* Topics */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {phase.topics.map((topic, topicIndex) => (
                                        <motion.div
                                            key={topicIndex}
                                            whileHover={{ scale: 1.02 }}
                                            className={`p-4 bg-white/40 hover:bg-white/60 rounded-xl border ${colors.border} transition-all cursor-pointer group`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {topic.completed ? (
                                                    <CheckCircle2 className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                                                        {topic.name}
                                                    </h4>
                                                    <p className="text-xs text-text-secondary leading-relaxed mb-2">
                                                        {topic.description}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-text-muted">
                                                        <BookOpen className="w-3 h-3" />
                                                        <span>{topic.resources} resources</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <div className="glass-card p-8 rounded-2xl inline-block">
                        <h3 className="text-2xl font-bold mb-3">Ready to start your journey?</h3>
                        <p className="text-text-secondary mb-6">
                            Track your progress and unlock resources as you learn
                        </p>
                        <button className="px-8 py-3 bg-gradient-to-r from-primary to-accent-violet text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all">
                            Start Learning Now
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
