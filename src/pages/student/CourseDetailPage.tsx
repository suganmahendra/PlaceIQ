import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronDown,
    ChevronRight,
    Play,
    CheckCircle2,
    Award,
    Clock,
    BookOpen,
    TrendingUp,
    Brain,
    FileText,
    Video,
    Lock,
    Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { roadmapService, type RoadmapFull } from '../../services/RoadmapService';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Badge } from '../../components/ui/Badge';
import { slugify } from './LessonPage';
import { cn } from '../../lib/utils';
import type { Database } from '../../types/database.types';

type Enrollment = Database['public']['Tables']['enrollments']['Row'];
type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];

export function CourseDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { profile, loading: authLoading } = useAuth();
    const [course, setCourse] = useState<RoadmapFull | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!slug) return;
            try {
                // Use RoadmapService
                const fetchedCourse = await roadmapService.getRoadmapBySlug(slug);
                if (!fetchedCourse) {
                    setLoading(false);
                    return;
                }
                setCourse(fetchedCourse);

                // Auto-expand the first module
                if (fetchedCourse.course_modules?.length > 0) {
                    setExpandedModules([fetchedCourse.course_modules[0].id]);
                }

                if (profile && 'id' in profile) {
                    const fetchedEnrollment = await roadmapService.checkEnrollment(profile.id, fetchedCourse.id);
                    setEnrollment(fetchedEnrollment);

                    if (fetchedEnrollment) {
                        const progress = await roadmapService.getLessonProgress(fetchedEnrollment.id);
                        setLessonProgress(progress || []);
                    }
                }
            } catch (error) {
                console.error('Error loading course:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchCourseDetails();
        }
    }, [slug, profile, authLoading]);

    const handleEnroll = async () => {
        if (!profile || !course || !('id' in profile)) return;
        setIsEnrolling(true);
        try {
            const newEnrollment = await roadmapService.enrollStudent(profile.id, course.id);
            setEnrollment(newEnrollment);
            setLessonProgress([]);
        } catch (error) {
            console.error('Enrollment failed:', error);
        } finally {
            setIsEnrolling(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold text-gray-700">Course not found</h2>
                <Link to="/student/learning" className="text-primary hover:underline mt-4 inline-block">
                    ← Back to Learning Path
                </Link>
            </div>
        );
    }

    const totalVideos = course.course_modules?.reduce((acc, mod) => acc + (mod.course_lessons?.length || 0), 0) || 0;
    const progress = enrollment?.progress_percent || 0;
    const estimatedHours = course.estimated_hours || 0;

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const isLessonCompleted = (lessonId: string) => {
        return lessonProgress.some(lp => lp.lesson_id === lessonId && lp.is_completed);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header / Hero - clean white card */}
            <div className="bg-white border-b border-gray-200 px-6 md:px-10 py-8">

                <div className="max-w-7xl mx-auto">
                    <Link
                        to="/student/learning"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-all hover:-translate-x-1 font-medium text-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Learning Path
                    </Link>

                    <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant={course.difficulty === 'Beginner' ? 'success' : course.difficulty === 'Intermediate' ? 'info' : 'warning'} className="px-3 py-1">
                                    {course.difficulty}
                                </Badge>
                                <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                                    {course.category || 'AI & DS'}
                                </Badge>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                                {course.title}
                            </h1>
                            <p className="text-gray-600 text-base md:text-lg max-w-3xl leading-relaxed">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 p-4 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span>{estimatedHours} hours total</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Video className="w-4 h-4 text-blue-500" />
                                    <span>{totalVideos} HD lessons</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-green-500" />
                                    <span>{course.course_modules?.length} Curriculum modules</span>
                                </div>
                                {enrollment?.status === 'completed' && (
                                    <div className="flex items-center gap-2">
                                        <Award className="w-4 h-4 text-amber-500" />
                                        <span className="text-amber-600 font-bold">Certificate Unlocked</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <div className="bg-gray-100 p-4 rounded-3xl border border-gray-200 shadow-sm">
                                <ProgressRing progress={progress} size="xl" strokeWidth={10} color="#7c3aed" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Layout Area */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* LEFT COLUMN: Course Curriculum */}
                    <div className="lg:col-span-2 space-y-8">

                        {!enrollment ? (
                            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
                                <Lock className="w-14 h-14 text-gray-400 mx-auto mb-5" />
                                <h2 className="text-2xl font-black text-gray-900 mb-3">Access Restricted</h2>
                                <p className="text-gray-500 text-base mb-8 max-w-md mx-auto">
                                    This curriculum is only available to enrolled students. Join the path to start your journey.
                                </p>
                                <button
                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
                                    onClick={handleEnroll}
                                    disabled={isEnrolling}
                                >
                                    {isEnrolling ? 'Enrolling…' : 'Enroll in this Course Now'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Curriculum</h2>
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        Interactive Modules
                                    </div>
                                </div>

                                {course.course_modules?.map((module, index) => (
                                    <div key={module.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500">
                                        {/* Module Header */}
                                        <button
                                            onClick={() => toggleModule(module.id)}
                                            className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent-violet/10 flex items-center justify-center text-primary font-black text-xl border border-primary/20">
                                                    {index + 1}
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-xl font-bold text-gray-900 leading-none mb-2">{module.title}</h3>
                                                    <p className="text-sm text-gray-500 font-medium">{module.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="hidden md:block text-right">
                                                    <div className="text-xs text-gray-400 font-bold uppercase tracking-tighter mb-1">Status</div>
                                                    <div className="text-sm font-black text-gray-700">{module.course_lessons?.length || 0} Lessons</div>
                                                </div>
                                                <div className={cn(
                                                    "p-2 rounded-xl bg-gray-100 text-gray-400 transition-transform duration-300",
                                                    expandedModules.includes(module.id) && "rotate-180 bg-primary/10 text-primary"
                                                )}>
                                                    <ChevronDown className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </button>

                                        {/* Module Lessons */}
                                        {expandedModules.includes(module.id) && (
                                            <div className="border-t border-gray-50 bg-gray-50/30 p-4 pt-2">
                                                <div className="space-y-2">
                                                    {module.course_lessons?.map((lesson, lIdx) => (
                                                        <Link
                                                            key={lesson.id}
                                                            to={`/student/courses/${slug}/${slugify(lesson.title)}`}
                                                            className="w-full flex items-center gap-5 p-4 rounded-2xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group"
                                                        >
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all shadow-inner",
                                                                isLessonCompleted(lesson.id) ? "bg-green-500 text-white" : "bg-white border border-gray-200 text-gray-400 group-hover:text-primary group-hover:border-primary/30"
                                                            )}>
                                                                {isLessonCompleted(lesson.id) ? (
                                                                    <CheckCircle2 className="w-6 h-6" />
                                                                ) : (
                                                                    <Play className="w-5 h-5 ml-0.5" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1 text-left">
                                                                <div className="font-bold text-gray-800 group-hover:text-primary transition-colors">
                                                                    {lIdx + 1}. {lesson.title}
                                                                </div>
                                                                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                                    HD Quality • {lesson.duration_mins || 10} mins
                                                                </div>
                                                            </div>
                                                            {/* XP chip */}
                                                            <span className={cn(
                                                                "flex-shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full",
                                                                isLessonCompleted(lesson.id)
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-yellow-100 text-yellow-700"
                                                            )}>
                                                                {isLessonCompleted(lesson.id) ? '✓ +10 XP' : '+10 XP'}
                                                            </span>
                                                            <ChevronRight className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Sidebar Stats & Tools */}
                    <div className="space-y-8">

                        {/* Course Overview Card */}
                        <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-8">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                    <TrendingUp className="w-6 h-6 text-primary" />
                                    Learning Matrix
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Progress</span>
                                            <span className="text-2xl font-black text-primary">{progress}%</span>
                                        </div>
                                        <ProgressBar progress={progress} color="primary" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                                        <div className="p-4 bg-[#F9FAFB] rounded-2xl">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">My XP</p>
                                            <p className="text-xl font-black text-gray-900">{profile && 'xp' in profile ? profile.xp : 0} XP</p>
                                        </div>
                                        <div className="p-4 bg-[#F9FAFB] rounded-2xl">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">My Level</p>
                                            <p className="text-xl font-black text-gray-900">{profile && 'level' in profile ? profile.level : 'Beginner'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {enrollment && (
                                <div className="space-y-3">
                                    <button className="w-full h-12 text-white font-bold rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors">
                                        Start Next Lesson
                                    </button>
                                    <button className="w-full h-12 font-bold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-2 transition-colors">
                                        <FileText className="w-4 h-4" />
                                        Download Resources
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* AI Insights */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                                <Brain className="w-5 h-5 text-violet-600" />
                                AI Guidance
                            </h3>

                            <div className="space-y-3">
                                <InsightItem
                                    text="This course aligns with current Data Scientist requirements at Google and Amazon."
                                />
                                <InsightItem
                                    text="Students who complete this track usually score 40% higher in placement evaluations."
                                />
                                <InsightItem
                                    text="We recommend allocating 45 mins this evening for Module 1."
                                />
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <p className="text-xs text-black/40 font-bold uppercase tracking-widest mb-2">Confidence Score</p>
                                <div className="text-3xl font-black text-primary-light">94%</div>
                            </div>
                        </div>

                        {/* Milestone Alert */}
                        {progress < 100 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                    <Award className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-amber-900">Certificate Goal</p>
                                    <p className="text-sm text-amber-700 mt-1">
                                        Complete {100 - progress}% more to get your verified industry certificate.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

function InsightItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
            <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed font-medium">{text}</p>
        </div>
    );
}
