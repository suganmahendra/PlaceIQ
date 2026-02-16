import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import { quizService, type Quiz } from '../../services/QuizService';
import { VideoPlayer } from '../../components/ui/VideoPlayer';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import type { Database } from '../../types/database.types';

type Enrollment = Database['public']['Tables']['enrollments']['Row'];
type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
type Lesson = Database['public']['Tables']['course_lessons']['Row'];

export function CourseDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { profile, loading: authLoading } = useAuth();
    const [course, setCourse] = useState<RoadmapFull | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
    const [expandedModules, setExpandedModules] = useState<string[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Lesson | null>(null);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

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

    useEffect(() => {
        const fetchQuiz = async () => {
            if (selectedVideo) {
                const q = await quizService.getQuizByLessonId(selectedVideo.id);
                setQuiz(q);
            } else {
                setQuiz(null);
            }
        };
        fetchQuiz();
    }, [selectedVideo]);

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

    const handleMarkComplete = async (lessonId: string) => {
        if (!enrollment) return;
        setIsCompleting(true);
        try {
            await roadmapService.updateLessonProgress(enrollment.id, lessonId, 0, true);

            // Refresh data
            const updatedProgress = await roadmapService.getLessonProgress(enrollment.id);
            setLessonProgress(updatedProgress || []);

            // Re-fetch enrollment to get updated overall progress
            if (profile && 'id' in profile && course) {
                const updatedEnrollment = await roadmapService.checkEnrollment(profile.id, course.id);
                setEnrollment(updatedEnrollment);
            }
        } catch (error) {
            console.error('Failed to mark lesson as complete:', error);
        } finally {
            setIsCompleting(false);
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
                <Link to="/student/courses" className="text-primary hover:underline mt-4 inline-block">
                    ← Back to Course Marketplace
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
        <div className="min-h-screen bg-gradient-to-br from-[#FDFCFE] via-white to-[#F9FAFB]">
            {/* Header / Hero */}
            <div className="bg-gradient-to-r from-primary via-primary-hover to-accent-violet text-white p-10 md:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 animate-pulse" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <Link
                        to="/student/courses"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-all hover:-translate-x-1 font-medium"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Back to Course Marketplace
                    </Link>

                    <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-wrap gap-3">
                                <Badge variant={course.difficulty === 'Beginner' ? 'success' : course.difficulty === 'Intermediate' ? 'info' : 'warning'} className="px-3 py-1">
                                    {course.difficulty}
                                </Badge>
                                <Badge variant="info" className="bg-white/20 text-white backdrop-blur-md border-white/30">
                                    {course.category || 'AI & DS'}
                                </Badge>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">
                                {course.title}
                            </h1>
                            <p className="text-white/90 text-xl max-w-3xl leading-relaxed font-medium">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-8 text-sm font-bold text-white/90 glass-card bg-white/10 border-white/20 p-4 rounded-2xl">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-300" />
                                    <span>{estimatedHours} hours total</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Video className="w-5 h-5 text-blue-300" />
                                    <span>{totalVideos} HD lessons</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-green-300" />
                                    <span>{course.course_modules?.length} Curriculum modules</span>
                                </div>
                                {enrollment?.status === 'completed' && (
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-amber-300" />
                                        <span>Industry Certificate Unlocked</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-shrink-0 lg:mt-6">
                            <div className="bg-white/10 p-4 rounded-[40px] backdrop-blur-xl border border-white/20 shadow-2xl">
                                <ProgressRing progress={progress} size="xl" strokeWidth={10} color="#fff" />
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
                            <div className="bg-gradient-to-br from-primary/5 to-accent-violet/5 rounded-[32px] border-2 border-dashed border-primary/20 p-12 text-center animate-pulse-slow">
                                <Lock className="w-16 h-16 text-primary mx-auto mb-6 opacity-40" />
                                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Access Restricted</h2>
                                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                                    This curriculum is only available to enrolled students. Join the path to start your journey.
                                </p>
                                <Button
                                    className="h-14 px-10 text-lg bg-gradient-to-r from-primary to-accent-violet shadow-2xl shadow-primary/30"
                                    onClick={handleEnroll}
                                    isLoading={isEnrolling}
                                >
                                    Enroll in this Course Now
                                </Button>
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
                                                        <button
                                                            key={lesson.id}
                                                            onClick={() => setSelectedVideo(lesson)}
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
                                                            <ChevronRight className="w-5 h-5 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                                                        </button>
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
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">XP Value</p>
                                            <p className="text-xl font-black text-gray-900">{estimatedHours * 10} XP</p>
                                        </div>
                                        <div className="p-4 bg-[#F9FAFB] rounded-2xl">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Difficulty</p>
                                            <p className="text-xl font-black text-gray-900">{course.difficulty}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {enrollment && (
                                <div className="space-y-3">
                                    <Button className="w-full h-14 text-white font-bold rounded-2xl bg-gradient-to-r from-primary to-accent-violet hover:shadow-xl transition-all">
                                        Start Next Lesson
                                    </Button>
                                    <Button variant="outline" className="w-full h-14 font-bold rounded-2xl border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Download Resources
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* AI Insights Gallery */}
                        <div className="bg-gradient-to-br from-[#2E1A47] to-[#1A0B2E] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />

                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <Brain className="w-6 h-6 text-primary-light" />
                                AI Guidance
                            </h3>

                            <div className="space-y-5">
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
                                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-2">Confidence Score</p>
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

            {/* HIGH-END VIDEO MODAL */}
            {selectedVideo && (
                <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-md animate-fade-in" onClick={() => setSelectedVideo(null)}>
                    <div className="bg-white rounded-[40px] max-w-6xl w-full shadow-2xl relative overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Play className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 leading-none">{selectedVideo.title}</h3>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Section: High-Quality Video Instruction</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all flex items-center justify-center group"
                            >
                                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform rotate-180 transform" />
                            </button>
                        </div>

                        {/* Player Frame */}
                        <div className="aspect-video bg-black relative group">
                            <VideoPlayer
                                youtubeUrl={selectedVideo.video_url || `https://www.youtube.com/watch?v=dQw4w9WgXcQ`}
                                title={selectedVideo.title}
                            />
                        </div>

                        {/* Content Area */}
                        <div className="p-8 md:p-10 bg-white">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-1 space-y-4">
                                    <h4 className="text-2xl font-black text-gray-900">Lesson Overview</h4>
                                    <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                        {selectedVideo.content_markdown || "In this lesson, we cover advanced concepts related to this topic. Follow along with the code-along sections to maximize your understanding."}
                                    </p>
                                </div>
                                <div className="w-full md:w-72 flex flex-col gap-3">
                                    <Button
                                        className="h-14 font-black rounded-2xl text-lg shadow-xl shadow-primary/20"
                                        onClick={() => handleMarkComplete(selectedVideo.id)}
                                        isLoading={isCompleting}
                                        disabled={isLessonCompleted(selectedVideo.id)}
                                    >
                                        {isLessonCompleted(selectedVideo.id) ? 'Already Completed' : 'Mark as Complete'}
                                    </Button>

                                    {isLessonCompleted(selectedVideo.id) && quiz && (
                                        <Button
                                            className="h-14 font-black rounded-2xl text-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-xl shadow-orange-200 mt-2 hover:scale-[1.02] transition-transform animate-pulse"
                                            onClick={() => navigate(`/student/quiz?id=${quiz.id}`)}
                                        >
                                            Start Quiz: {quiz.title}
                                        </Button>
                                    )}

                                    <Button variant="outline" className="h-14 font-bold rounded-2xl border-gray-200 hover:bg-gray-50">
                                        Download Code Files
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InsightItem({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-2 h-2 rounded-full bg-primary-light mt-2 flex-shrink-0 animate-pulse" />
            <p className="text-sm text-white/80 leading-relaxed font-medium">{text}</p>
        </div>
    );
}
