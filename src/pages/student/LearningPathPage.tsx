import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Search, X } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');

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

    // Case-insensitive client-side filter by title
    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

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

                {/* ── Search Bar ── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-md mx-auto mt-2"
                >
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search courses by title..."
                            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-sm text-gray-800 placeholder-gray-400 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                    {searchQuery && (
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            {filteredCourses.length === 0
                                ? 'No courses match your search'
                                : `${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} found`}
                        </p>
                    )}
                </motion.div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        {searchQuery
                            ? <>No courses found for <span className="font-semibold text-gray-700">"{searchQuery}"</span>. Try a different search.</>
                            : 'No courses available at the moment. Check back later!'}
                    </div>
                ) : (
                    <div
                        className="grid gap-5"
                        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
                    >
                        {filteredCourses.map((course) => {
                            const IconComponent = BookOpen;
                            return (
                                <CourseCard
                                    key={course.id}
                                    id={course.id}
                                    name={course.title}
                                    slug={course.slug}
                                    description={course.description}
                                    difficulty={course.difficulty as any}  // eslint-disable-line @typescript-eslint/no-explicit-any
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
