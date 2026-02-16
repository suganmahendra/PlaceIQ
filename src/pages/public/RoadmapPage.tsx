import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Clock,
    BookOpen,
    Award,
    Target,
    TrendingUp,
    Lock
} from 'lucide-react';
import { roadmapService, type RoadmapFull } from '../../services/RoadmapService';
import { useAuth } from '../../contexts/AuthContext';

export const RoadmapPage: React.FC = () => {
    const { roadmapId } = useParams<{ roadmapId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [roadmap, setRoadmap] = useState<RoadmapFull | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRoadmap = async () => {
            if (!roadmapId) return;
            try {
                // Determine if roadmapId is a slug or ID. The route param is :roadmapId but we use slug in DB.
                // Assuming links pass the slug.
                const data = await roadmapService.getRoadmapBySlug(roadmapId);
                setRoadmap(data);
            } catch (error) {
                console.error("Failed to load roadmap:", error);
            } finally {
                setLoading(false);
            }
        };
        loadRoadmap();
    }, [roadmapId]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

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

    const getColorClasses = (color: string | null) => {
        const colorMap: Record<string, { bg: string; text: string; border: string }> = {
            blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/30' },
            purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/30' },
            orange: { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/30' },
            pink: { bg: 'bg-pink-500/10', text: 'text-pink-600', border: 'border-pink-500/30' },
        };
        // Default to blue if color is null or not found
        return colorMap[color || 'blue'] || colorMap.blue;
    };

    const colors = getColorClasses(roadmap.color);



    const handleStartLearning = () => {
        if (user) {
            navigate(`/student/courses/${roadmap.slug}`);
        } else {
            // Redirect to login with return url
            navigate(`/login?returnUrl=/student/courses/${roadmap.slug}`);
        }
    };

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
                                        <span className="text-sm font-semibold">{roadmap.estimated_hours} Hours</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl">
                                        <BookOpen className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-semibold">{roadmap.course_modules?.length || 0} Modules</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl">
                                        <Target className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-semibold">{roadmap.difficulty}</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA for Public View */}
                            <div className="lg:w-48 text-center">
                                <button
                                    onClick={handleStartLearning}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:bg-primary-hover hover:scale-105 transition-all flex flex-col items-center justify-center gap-1"
                                >
                                    <span>{user ? 'Continue Learning' : 'Start Learning'}</span>
                                    {!user && <span className="text-[10px] opacity-80 uppercase tracking-widest">Login Required</span>}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Roadmap Phases */}
                <div className="space-y-8">
                    {roadmap.course_modules?.map((phase, phaseIndex) => (
                        <motion.div
                            key={phase.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: phaseIndex * 0.1 }}
                            className="relative"
                        >
                            {/* Timeline Connector */}
                            {phaseIndex < (roadmap.course_modules?.length || 0) - 1 && (
                                <div className={`absolute left-8 top-20 bottom-0 w-0.5 ${colors.bg} hidden md:block`} />
                            )}

                            <div className="glass-card p-6 rounded-2xl border border-white/60 hover:shadow-lg transition-shadow">
                                {/* Phase Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`w-16 h-16 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center flex-shrink-0 relative z-10`}>
                                        <span className="text-2xl font-bold">{phaseIndex + 1}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-bold mb-1">{phase.title}</h2>
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <span className="text-sm font-medium">
                                                {phase.description}
                                            </span>
                                            <span className="mx-2">•</span>
                                            <div className="flex items-center gap-1 text-xs text-text-secondary">
                                                <Clock className="w-3 h-3" />
                                                <span>{phase.course_lessons?.reduce((acc, lesson) => acc + (lesson.duration_mins || 0), 0) || 0} mins</span>
                                            </div>
                                            <span className="mx-2">•</span>
                                            <span className="text-sm font-medium">
                                                {phase.course_lessons?.length || 0} Topics
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

                                {/* Topics Preview (Locked) */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {phase.course_lessons?.map((topic) => (
                                        <div
                                            key={topic.id}
                                            className={`p-4 bg-white/40 rounded-xl border ${colors.border} flex items-start gap-3 opacity-80`}
                                        >
                                            <Lock className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-sm mb-1 text-gray-700">
                                                    {topic.title}
                                                </h4>
                                                <p className="text-xs text-text-secondary leading-relaxed truncate">
                                                    {topic.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* 'Show More' / CTA to login if too many topics, or just a generic 'Login to view content' */}
                                    <div
                                        onClick={handleStartLearning}
                                        className={`p-4 ${colors.bg} rounded-xl border ${colors.border} flex items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity`}
                                    >
                                        <span className={`text-sm font-bold ${colors.text}`}>
                                            {user ? 'View Content' : 'Login to Access Content'}
                                        </span>
                                        <ArrowLeft className={`w-4 h-4 ${colors.text} rotate-180`} />
                                    </div>
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
                        <button
                            onClick={handleStartLearning}
                            className="px-8 py-3 bg-gradient-to-r from-primary to-accent-violet text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                        >
                            {user ? 'Continue Learning' : 'Start Learning Now'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
