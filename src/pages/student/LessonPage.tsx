import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { roadmapService, type RoadmapFull } from '../../services/RoadmapService';
import { quizService, type Quiz } from '../../services/QuizService';
import { AppViewer } from '../../components/ui/AppViewer';
import { Button } from '../../components/ui/Button';
import type { Database } from '../../types/database.types';

type Enrollment = Database['public']['Tables']['enrollments']['Row'];
type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
type Lesson = Database['public']['Tables']['course_lessons']['Row'];

export interface LessonPageData {
    id: string;
    title: string;
    mode: 'text' | 'html';
    content: string;       // BlockNote JSON (text mode)
    htmlContent: string;   // Full HTML string (html mode)
}

const parseContentPages = (raw: string | undefined | null): LessonPageData[] => {
    const blank = (): LessonPageData => ({ id: crypto.randomUUID(), title: 'Page 1', mode: 'text', content: '', htmlContent: '' });
    if (!raw) return [blank()];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            const first = parsed[0];
            if (typeof first === 'object' && 'title' in first) {
                return parsed.map((p: any, i: number) => ({
                    id: p.id ?? crypto.randomUUID(),
                    title: p.title ?? `Page ${i + 1}`,
                    mode: p.mode ?? 'text',
                    content: p.content ?? '',
                    htmlContent: p.htmlContent ?? '',
                }));
            }
            return [{ id: crypto.randomUUID(), title: 'Page 1', mode: 'text', content: raw, htmlContent: '' }];
        }
    } catch (_) { /* raw markdown */ }
    return [{ id: crypto.randomUUID(), title: 'Page 1', mode: 'text', content: raw ?? '', htmlContent: '' }];
};

export const slugify = (text: string) => text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

export function LessonPage() {
    const { courseSlug, lessonSlug } = useParams<{ courseSlug: string, lessonSlug: string }>();
    const navigate = useNavigate();
    const { profile, loading: authLoading, refreshProfile } = useAuth();

    const [course, setCourse] = useState<RoadmapFull | null>(null);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);

    const [pages, setPages] = useState<LessonPageData[]>([]);
    const [activePageIdx, setActivePageIdx] = useState(0);

    const [prevLessonSlug, setPrevLessonSlug] = useState<string | null>(null);
    const [nextLessonSlug, setNextLessonSlug] = useState<string | null>(null);

    // Reset pagination when routing to a new lesson
    useEffect(() => {
        setActivePageIdx(0);
        setPages([]);
    }, [lessonSlug]);

    useEffect(() => {
        const fetchData = async () => {
            if (!courseSlug || !lessonSlug || authLoading) return;
            try {
                // Fetch course
                const fetchedCourse = await roadmapService.getRoadmapBySlug(courseSlug);
                if (!fetchedCourse) {
                    setLoading(false);
                    return;
                }
                setCourse(fetchedCourse);

                // Flatten all lessons across all modules to find prev/next
                const allLessons: Lesson[] = [];
                for (const mod of fetchedCourse.course_modules || []) {
                    for (const l of mod.course_lessons || []) {
                        allLessons.push(l);
                    }
                }

                let targetLesson: Lesson | null = null;
                let targetIdx = -1;

                for (let i = 0; i < allLessons.length; i++) {
                    if (slugify(allLessons[i].title) === lessonSlug) {
                        targetLesson = allLessons[i];
                        targetIdx = i;
                        break;
                    }
                }

                if (!targetLesson) {
                    setLoading(false);
                    return;
                }

                setLesson(targetLesson);
                setPages(parseContentPages(targetLesson.content_markdown));

                // Set prev/next slugs
                setPrevLessonSlug(targetIdx > 0 ? slugify(allLessons[targetIdx - 1].title) : null);
                setNextLessonSlug(targetIdx < allLessons.length - 1 ? slugify(allLessons[targetIdx + 1].title) : null);

                // Fetch enrollment & progress
                if (profile && 'id' in profile) {
                    const fetchedEnrollment = await roadmapService.checkEnrollment(profile.id, fetchedCourse.id);
                    setEnrollment(fetchedEnrollment);
                    if (fetchedEnrollment) {
                        const progress = await roadmapService.getLessonProgress(fetchedEnrollment.id);
                        setLessonProgress(progress || []);
                    }
                }

                // Fetch Quiz
                const q = await quizService.getQuizByLessonId(targetLesson.id);
                setQuiz(q);

            } catch (error) {
                console.error("Failed to load lesson:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseSlug, lessonSlug, profile, authLoading]);

    const isLessonCompleted = (lessonId: string) => {
        return lessonProgress.some(lp => lp.lesson_id === lessonId && lp.is_completed);
    };

    const handleMarkComplete = async () => {
        if (!enrollment || !lesson) return;
        setIsCompleting(true);
        try {
            await roadmapService.updateLessonProgress(enrollment.id, lesson.id, 0, true);
            await refreshProfile();

            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-3 rounded-2xl shadow-xl font-bold text-sm`}>
                    <span className="text-xl">⚡</span>
                    <div>
                        <div className="font-black">+10 XP Earned!</div>
                        <div className="font-medium opacity-90 text-xs">Lesson marked as complete</div>
                    </div>
                </div>
            ), { duration: 3000, position: 'bottom-right' });

            if (quiz) {
                navigate(`/student/quiz?id=${quiz.id}`);
            } else {
                // Return to course page
                navigate(`/student/courses/${courseSlug}`);
            }
        } catch (error) {
            console.error('Failed to mark complete:', error);
            toast.error("Failed to mark lesson complete");
        } finally {
            setIsCompleting(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!course || !lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-10 text-center">
                <h2 className="text-2xl font-bold text-gray-700">Lesson not found</h2>
                <Link to={`/student/courses/${courseSlug || ''}`} className="text-primary hover:underline mt-4 inline-block font-medium">
                    ← Back to Course
                </Link>
            </div>
        );
    }

    const activePage = pages[activePageIdx];
    const isFirstPage = activePageIdx === 0;
    const isLastPage = activePageIdx === pages.length - 1;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
                <Link
                    to={`/student/courses/${courseSlug}`}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Curriculum
                </Link>
                <div className="text-center absolute left-1/2 -translate-x-1/2 hidden md:block">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{course.title}</p>
                    <h1 className="text-base font-black text-gray-900">{lesson.title}</h1>
                </div>
                <div className="text-sm font-bold text-gray-400">
                    Page {activePageIdx + 1} of {pages.length}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center w-full">
                {/* Document Viewer */}
                <div className="w-full max-w-4xl mx-auto px-6 pt-6 md:pt-8 pb-20">
                    <div className="min-h-[200px]">
                        {activePage ? (
                            <AppViewer key={activePage.id} initialContent={activePage.content} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">Loading Content...</div>
                        )}
                    </div>

                    {/* Pagination Controls */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">

                        {/* LEFT SIDE: Previous Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center sm:justify-start">
                            {!isFirstPage ? (
                                <button
                                    className="font-medium text-gray-500 hover:text-gray-900 border-b border-transparent hover:border-gray-900 transition-colors flex items-center gap-1"
                                    onClick={() => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        setActivePageIdx(prev => Math.max(0, prev - 1));
                                    }}
                                >
                                    <ChevronLeft className="w-4 h-4 ml-[-4px]" /> Previous Page
                                </button>
                            ) : prevLessonSlug ? (
                                <Link
                                    to={`/student/courses/${courseSlug}/${prevLessonSlug}`}
                                    className="font-medium text-gray-500 hover:text-gray-900 border-b border-transparent hover:border-gray-900 transition-colors flex items-center gap-1"
                                >
                                    <ChevronLeft className="w-4 h-4 ml-[-4px]" /> Previous Topic
                                </Link>
                            ) : (
                                <div className="hidden sm:block w-[120px]"></div> // Spacer
                            )}
                        </div>

                        {/* RIGHT SIDE: Next Actions */}
                        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center sm:justify-end mt-8 sm:mt-0">
                            {!isLastPage ? (
                                <button
                                    className="font-medium text-primary hover:text-primary/80 border-b border-transparent hover:border-primary/80 transition-colors flex items-center gap-1"
                                    onClick={() => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        setActivePageIdx(prev => Math.min(pages.length - 1, prev + 1));
                                    }}
                                >
                                    Next Page <ChevronRight className="w-4 h-4 mr-[-4px]" />
                                </button>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <Button
                                        className="h-10 px-6 font-bold rounded-xl text-sm shadow-md shadow-primary/10 w-full sm:w-auto text-white bg-gray-900"
                                        onClick={handleMarkComplete}
                                        isLoading={isCompleting}
                                        disabled={isLessonCompleted(lesson.id) || !enrollment}
                                    >
                                        {isLessonCompleted(lesson.id) ? (
                                            <><CheckCircle2 className="w-4 h-4 mr-1.5" /> Completed</>
                                        ) : 'Mark as Complete'}
                                    </Button>

                                    {isLessonCompleted(lesson.id) && quiz && (
                                        <Button
                                            className="h-10 px-6 font-bold rounded-xl text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md shadow-orange-200 hover:scale-[1.02] transition-transform animate-pulse w-full sm:w-auto"
                                            onClick={() => navigate(`/student/quiz?id=${quiz.id}`)}
                                        >
                                            Take Quiz
                                        </Button>
                                    )}

                                    {isLessonCompleted(lesson.id) && nextLessonSlug && (
                                        <Link
                                            to={`/student/courses/${courseSlug}/${nextLessonSlug}`}
                                            className="font-medium text-primary hover:text-primary/80 border-b border-transparent hover:border-primary/80 transition-colors flex items-center gap-1 ml-2"
                                        >
                                            Next Topic <ChevronRight className="w-4 h-4 mr-[-4px]" />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

