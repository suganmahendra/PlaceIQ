import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import { CourseCard } from '../../components/courses/CourseCard';
import { useAuth } from '../../contexts/AuthContext';
import { roadmapService } from '../../services/RoadmapService';
import type { Database } from '../../types/database.types';

// Define Course Type derived from DB
type CourseRow = Database['public']['Tables']['courses']['Row'];

export const LearningPathPage: React.FC = () => {
    const { profile } = useAuth();
    const [courses, setCourses] = useState<CourseRow[]>([]);
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [enrollments, setEnrollments] = useState<any[]>([]);

    useEffect(() => {
        loadRoadmaps();
    }, []);

    useEffect(() => {
        if (profile && 'id' in profile) {
            loadEnrollments(profile.id);
        }
    }, [profile]);

    const loadRoadmaps = async () => {
        setLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = await roadmapService.getRoadmaps() as any[];
            setCourses(data || []);
        } catch (error) {
            console.error('Failed to load roadmaps:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadEnrollments = async (userId: string) => {
        try {
            const data = await roadmapService.getUserEnrollments(userId);
            setEnrollments(data || []);
        } catch (error) {
            console.error('Failed to load enrollments:', error);
        }
    };

    const getCourseProgress = (courseId: string) => {
        const enrollment = enrollments.find(e => e.course_id === courseId);
        return enrollment ? (enrollment.progress_percent || 0) : 0;
    };

    const isCourseCompleted = (courseId: string) => {
        const enrollment = enrollments.find(e => e.course_id === courseId);
        return enrollment?.status === 'completed';
    };

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] animate-float" />
            </div>

            {/* Header */}
            <div className="text-center space-y-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-sm mb-2"
                >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI-Powered Learning</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-gray-900"
                >
                    Your <span className="text-primary italic font-serif">Learning Path</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 text-lg max-w-2xl mx-auto"
                >
                    A unified journey to master both coding fundamentals and advanced AI courses.
                </motion.p>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No courses available at the moment. Check back later!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => {
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            const IconComponent = BookOpen;

                            return (
                                <CourseCard
                                    key={course.id}
                                    id={course.id}
                                    name={course.title}
                                    slug={course.slug}
                                    description={course.description}
                                    difficulty={course.difficulty as any}
                                    estimatedHours={course.estimated_hours || 0}
                                    progress={getCourseProgress(course.id)}
                                    icon={IconComponent}
                                    thumbnailUrl={course.thumbnail_url}
                                    category={course.category || 'Roadmap'}
                                    certificateEarned={isCourseCompleted(course.id)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
