import { useState, useEffect } from 'react';
import { CourseCard } from '../../components/courses/CourseCard';
import { useAuth } from '../../contexts/AuthContext';
import { courseService } from '../../services/courseService';
import { BookOpen, TrendingUp, Award, Target, Brain, Code, Sparkles, type LucideIcon } from 'lucide-react';
import type { Database } from '../../types/database.types';

type Course = Database['public']['Tables']['courses']['Row'];
type Enrollment = Database['public']['Tables']['enrollments']['Row'];

export function CoursesHomePage() {
    const { profile, loading: authLoading } = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedCourses = await courseService.getCourses();
                setCourses(fetchedCourses);

                if (profile && 'id' in profile) {
                    const fetchedEnrollments = await courseService.getStudentEnrollments(profile.id);
                    setEnrollments(fetchedEnrollments);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchData();
        }
    }, [profile, authLoading]);

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const totalCourses = courses.length;
    const completedCourses = enrollments.filter(e => e.status === 'completed').length;
    const inProgressCourses = enrollments.filter(e => e.status === 'active' && e.progress_percent > 0).length;

    const averageProgress = totalCourses > 0
        ? Math.round(enrollments.reduce((sum, e) => sum + e.progress_percent, 0) / totalCourses)
        : 0;

    const getCourseProgress = (courseId: string) => {
        return enrollments.find(e => e.course_id === courseId)?.progress_percent || 0;
    };

    const isCompleted = (courseId: string) => {
        return enrollments.find(e => e.course_id === courseId)?.status === 'completed';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Industry-Ready Courses
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Master essential AI & Data Science skills through structured, placement-focused courses
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        icon={BookOpen}
                        color="text-blue-600"
                        bg="bg-blue-100"
                        label="Total Courses"
                        value={totalCourses}
                        subtext="Available for you"
                    />
                    <StatCard
                        icon={Award}
                        color="text-green-600"
                        bg="bg-green-100"
                        label="Completed"
                        value={completedCourses}
                        subtext="Certificates earned"
                    />
                    <StatCard
                        icon={Target}
                        color="text-orange-600"
                        bg="bg-orange-100"
                        label="In Progress"
                        value={inProgressCourses}
                        subtext="Currently learning"
                    />
                    <StatCard
                        icon={TrendingUp}
                        color="text-primary"
                        bg="bg-primary/10"
                        label="Avg Progress"
                        value={`${averageProgress}%`}
                        subtext="Across all courses"
                    />
                </div>

                {/* Course Marketplace */}
                <div className="space-y-12">
                    {/* All Courses Grid */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-primary" />
                            Explore All Courses
                        </h2>
                        {totalCourses === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No courses published yet</h3>
                                <p className="text-gray-500">Check back soon for new AI & Data Science content.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((course) => {
                                    const IconComponent = course.category === 'AI' ? Brain : Code;
                                    return (
                                        <CourseCard
                                            key={course.id}
                                            id={course.id}
                                            name={course.title}
                                            slug={course.slug}
                                            description={course.description || ''}
                                            difficulty={course.difficulty || 'Beginner'}
                                            estimatedHours={course.estimated_hours || 0}
                                            progress={getCourseProgress(course.id)}
                                            icon={IconComponent}
                                            certificateEarned={isCompleted(course.id)}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Motivational Section */}
                <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-6xl drop-shadow-lg">🚀</div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">Complete Your Learning Journey</h3>
                            <p className="text-white/90 mb-4">
                                Each course is designed to make you industry-ready. Focus on understanding concepts deeply
                                and completing hands-on projects to maximize your learning.
                            </p>
                            <div className="flex gap-4">
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                    <p className="text-sm text-white/80">Average Progress</p>
                                    <p className="text-2xl font-bold">{averageProgress}%</p>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                    <p className="text-sm text-white/80">Goal Status</p>
                                    <p className="text-2xl font-bold">{completedCourses}/{totalCourses}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    icon: LucideIcon;
    color: string;
    bg: string;
    label: string;
    value: number | string;
    subtext: string;
}

const StatCard = ({ icon: Icon, color, bg, label, value, subtext }: StatCardProps) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center gap-3 mb-2">
            <div className={`${bg} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <h3 className="font-semibold text-gray-900">{label}</h3>
        </div>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        <p className="text-sm text-gray-600 mt-1">{subtext}</p>
    </div>
);
