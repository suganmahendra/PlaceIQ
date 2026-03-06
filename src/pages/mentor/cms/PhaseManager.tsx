import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Video, Code, FileText, Trash2, Edit2, Minimize2, Save, X } from 'lucide-react';
import { cmsService, type CourseLesson } from '../../../services/cmsService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { AppEditor } from '../../../components/ui/AppEditor';
import { QuizManager } from './QuizManager';

export function PhaseManager() {
    const { moduleId } = useParams<{ moduleId: string }>();
    const navigate = useNavigate();

    const [module, setModule] = useState<any>(null);
    const [lessons, setLessons] = useState<CourseLesson[]>([]);
    const [loading, setLoading] = useState(true);

    // Editing State
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [lessonForm, setLessonForm] = useState<Partial<CourseLesson>>({
        title: '',
        content_markdown: '',
        video_url: '',
        code_snippets: null
    });

    useEffect(() => {
        if (moduleId) {
            loadModuleData(moduleId);
        }
    }, [moduleId]);

    const loadModuleData = async (id: string) => {
        try {
            const [moduleData, lessonsData] = await Promise.all([
                cmsService.getModule(id),
                cmsService.getLessons(id)
            ]);
            setModule(moduleData);
            setLessons(lessonsData || []);
        } catch (error) {
            console.error('Failed to load phase/topic content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLesson = async (overrideSnippets?: any) => {
        if (!moduleId || !lessonForm.title) return;

        // Use the override if provided, else current state
        const snippetData = overrideSnippets !== undefined ? overrideSnippets : lessonForm.code_snippets;

        try {
            if (editingLessonId === 'new') {
                const newLesson = await cmsService.createLesson({
                    module_id: moduleId,
                    title: lessonForm.title!,
                    content_markdown: lessonForm.content_markdown || '',
                    video_url: lessonForm.video_url,
                    order_index: lessons.length,
                    code_snippets: snippetData
                } as any);
                setLessons([...lessons, newLesson]);
            } else if (editingLessonId) {
                const updated = await cmsService.updateLesson(editingLessonId, {
                    title: lessonForm.title!,
                    content_markdown: lessonForm.content_markdown,
                    video_url: lessonForm.video_url,
                    code_snippets: snippetData
                } as any);
                setLessons(lessons.map(l => l.id === editingLessonId ? updated : l));
            }
            setEditingLessonId(null);
            setLessonForm({ title: '', content_markdown: '', video_url: '', code_snippets: null });
        } catch (error) {
            console.error('Failed to save topic:', error);
            alert('Failed to save topic');
        }
    };

    const startEdit = (lesson: CourseLesson) => {
        setEditingLessonId(lesson.id);
        setLessonForm({
            title: lesson.title,
            content_markdown: lesson.content_markdown,
            video_url: lesson.video_url,
            code_snippets: lesson.code_snippets
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this topic?')) return;
        try {
            await cmsService.deleteLesson(id);
            setLessons(lessons.filter(l => l.id !== id));
        } catch (error) {
            console.error('Failed to delete topic:', error);
        }
    };

    if (loading) return <div className="p-8 text-center bg-transparent">Loading Phase Content...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 px-2 sm:px-0">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Phase List
                </button>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Phase Content Manager</span>
            </div>

            {/* Hero card */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                        Manage Topics {module ? `for: ${module.title}` : ''}
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">Add videos, notes, and code snippets for this phase.</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingLessonId('new');
                        setLessonForm({ title: '', content_markdown: '', video_url: '', code_snippets: null });
                    }}
                    className="shrink-0 w-full sm:w-auto"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add New Topic
                </Button>
            </div>

            {/* List of Lessons */}
            <div className="space-y-4">
                {editingLessonId === 'new' && (
                    <div className="bg-white border-2 border-primary/20 p-4 sm:p-6 rounded-xl shadow-lg ring-2 ring-primary/10 animate-in fade-in zoom-in-95">
                        <h3 className="font-bold text-lg mb-4 text-primary">New Topic</h3>
                        <TopicForm
                            form={lessonForm}
                            setForm={setLessonForm}
                            onSave={handleSaveLesson}
                            onCancel={() => setEditingLessonId(null)}
                        />
                    </div>
                )}

                {lessons.map((lesson, index) => (
                    <div key={lesson.id} className="relative">
                        {editingLessonId === lesson.id ? (
                            <div className="bg-white border-2 border-primary/20 p-4 sm:p-6 rounded-xl shadow-lg z-10 relative">
                                <h3 className="font-bold text-base sm:text-lg mb-4 text-primary break-words">Editing: {lesson.title}</h3>
                                <TopicForm
                                    form={lessonForm}
                                    setForm={setLessonForm}
                                    onSave={handleSaveLesson}
                                    onCancel={() => setEditingLessonId(null)}
                                />
                                <div className="mt-8 border-t border-gray-200 pt-8">
                                    <QuizManager lessonId={lesson.id} moduleId={moduleId!} />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition-colors flex items-center justify-between gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center font-bold text-xs ring-1 ring-gray-100 shrink-0">
                                        {index + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-sm sm:text-base text-gray-900 truncate">{lesson.title}</h4>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            {lesson.video_url && (
                                                <span className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                    <Video className="w-3 h-3" /> Video
                                                </span>
                                            )}
                                            {lesson.content_markdown && (
                                                <span className="text-xs flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                    <FileText className="w-3 h-3" /> Content
                                                </span>
                                            )}
                                            {lesson.code_snippets && (
                                                <span className="text-xs flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                                    <Code className="w-3 h-3" /> Code
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Always visible on mobile; fade on desktop for a cleaner look */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => startEdit(lesson)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(lesson.id)}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {lessons.length === 0 && !editingLessonId && (
                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        No topics yet. Start adding content!
                    </div>
                )}
            </div>
        </div>
    );
}

export interface LessonPageData {
    id: string;
    title: string;
    content: string;
}

const parseContentPages = (raw: string | undefined | null): LessonPageData[] => {
    if (!raw) return [{ id: crypto.randomUUID(), title: 'Page 1', content: '' }];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            if (parsed.length > 0 && typeof parsed[0] === 'object' && 'title' in parsed[0] && 'content' in parsed[0]) {
                return parsed;
            }
            // Old BlockNote array format
            return [{ id: crypto.randomUUID(), title: 'Page 1', content: raw }];
        }
    } catch (e) {
        // Raw markdown
    }
    return [{ id: crypto.randomUUID(), title: 'Page 1', content: raw }];
};

function TopicForm({ form, setForm, onSave, onCancel }: {
    form: Partial<CourseLesson>,
    setForm: (f: Partial<CourseLesson>) => void,
    onSave: (snippets?: any) => void,
    onCancel: () => void
}) {
    const [pages, setPages] = useState<LessonPageData[]>(() => parseContentPages(form.content_markdown));
    const [activePageIdx, setActivePageIdx] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    // Snapshot of pages before entering fullscreen — used for Discard
    const pagesSnapshot = useRef<string>('');

    const handleSaveClick = () => {
        setForm({ ...form, content_markdown: JSON.stringify(pages) });
        setTimeout(() => onSave(form.code_snippets), 0);
    };

    const syncForm = (newPages: LessonPageData[]) => {
        setPages(newPages);
        setForm({ ...form, content_markdown: JSON.stringify(newPages) });
    };

    const handleAddPage = () => {
        const newPages = [...pages, { id: crypto.randomUUID(), title: `Page ${pages.length + 1}`, content: '' }];
        syncForm(newPages);
        setActivePageIdx(newPages.length - 1);
    };

    const handleDeletePage = (idxToRemove: number) => {
        if (pages.length <= 1) return;
        const newPages = pages.filter((_, i) => i !== idxToRemove);
        syncForm(newPages);
        setActivePageIdx(Math.min(activePageIdx, newPages.length - 1));
    };

    const handlePageContentChange = (newContent: string) => {
        const newPages = [...pages];
        newPages[activePageIdx].content = newContent;
        syncForm(newPages);
    };

    // ── Fullscreen helpers ─────────────────────────────────────────
    const openFullscreen = () => {
        pagesSnapshot.current = JSON.stringify(pages);
        setIsFullscreen(true);
    };

    const saveAndCloseFullscreen = () => {
        setIsFullscreen(false);
        handleSaveClick();
    };

    const discardAndCloseFullscreen = () => {
        // Restore pages to the state they were in when fullscreen was opened
        const restored = JSON.parse(pagesSnapshot.current) as LessonPageData[];
        syncForm(restored);
        setActivePageIdx(prev => Math.min(prev, restored.length - 1));
        setIsFullscreen(false);
    };

    // Hide sidebar + chatbot when fullscreen is active
    useEffect(() => {
        const styleId = 'cms-fullscreen-style';
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
            // Inject a style tag to hide the sidebar (z-50) and AIChatbot
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.textContent = `
                    body.cms-fullscreen aside { display: none !important; }
                    body.cms-fullscreen [data-topbar] { display: none !important; }
                    body.cms-fullscreen [data-chatbot] { display: none !important; }
                `;
                document.head.appendChild(style);
            }
            document.body.classList.add('cms-fullscreen');
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('cms-fullscreen');
        }
        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('cms-fullscreen');
        };
    }, [isFullscreen]);

    // Escape key exits fullscreen without saving
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) discardAndCloseFullscreen();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isFullscreen, pages]);

    // ── Page Tabs (shared between inline + fullscreen) ──────────────
    const PageTabs = ({ compact = false }: { compact?: boolean }) => (
        <div className={`flex gap-2 overflow-x-auto ${compact ? '' : 'flex-1 mr-4 pb-1'}`}>
            {pages.map((p, idx) => (
                <div key={p.id} className="flex-shrink-0 flex items-center">
                    <button
                        onClick={() => setActivePageIdx(idx)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activePageIdx === idx
                            ? compact
                                ? 'bg-white/20 text-white border border-white/30'
                                : 'bg-white text-primary border border-gray-200 shadow-sm'
                            : compact
                                ? 'text-white/60 hover:text-white hover:bg-white/10'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                    >
                        {p.title || `Page ${idx + 1}`}
                    </button>
                    {pages.length > 1 && activePageIdx === idx && (
                        <button
                            onClick={() => handleDeletePage(idx)}
                            className={`ml-1 p-1 transition-colors ${compact ? 'text-white/50 hover:text-red-300' : 'text-gray-400 hover:text-red-500'
                                }`}
                            title="Delete Page"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            ))}
            <button
                onClick={handleAddPage}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${compact
                    ? 'text-white/60 hover:text-white hover:bg-white/10'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
            >
                <Plus className="w-3.5 h-3.5" />
                Add Page
            </button>
        </div>
    );

    // ── Fullscreen Overlay ──────────────────────────────────────────
    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
                {/* Top toolbar */}
                <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3 bg-gray-900 text-white shrink-0 gap-2">
                    {/* Left: close without saving */}
                    <button
                        onClick={discardAndCloseFullscreen}
                        className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 px-2 sm:px-3 py-1.5 rounded-lg transition-colors shrink-0"
                        title="Discard changes and close (Esc)"
                    >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Discard &amp; Close</span>
                    </button>

                    {/* Centre: page tabs */}
                    <div className="flex-1 flex items-center justify-center overflow-x-auto min-w-0">
                        <PageTabs compact />
                    </div>

                    {/* Right: save */}
                    <button
                        onClick={saveAndCloseFullscreen}
                        className="flex items-center gap-1.5 text-sm font-semibold bg-primary text-white px-3 sm:px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shadow shrink-0"
                    >
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline">Save Topic</span>
                    </button>
                </div>

                {/* Hint bar - hidden on small screens */}
                <div className="hidden sm:flex items-center justify-between px-5 py-1.5 bg-gray-50 border-b border-gray-100 shrink-0">
                    <span className="text-xs text-gray-400">Type '/' to add headings, code blocks, and more</span>
                    <button
                        onClick={discardAndCloseFullscreen}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <Minimize2 className="w-3 h-3" /> Exit fullscreen
                    </button>
                </div>

                {/* Editor canvas */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto py-10 px-4">
                        <AppEditor
                            key={pages[activePageIdx].id}
                            initialContent={pages[activePageIdx].content}
                            onChange={handlePageContentChange}
                        />
                    </div>
                </div>

                {/* Sticky bottom save bar */}
                <div className="shrink-0 border-t border-gray-100 bg-white px-6 py-3 flex justify-end gap-3">
                    <button
                        onClick={discardAndCloseFullscreen}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Discard & Close
                    </button>
                    <button
                        onClick={saveAndCloseFullscreen}
                        className="flex items-center gap-1.5 text-sm font-semibold bg-primary text-white px-5 py-2 rounded-lg shadow hover:bg-primary/90 transition-colors"
                    >
                        <Save className="w-4 h-4" />
                        Save Topic
                    </button>
                </div>
            </div>
        );
    }

    // ── Normal (inline) form ──────────────────────────────────────
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
                <Input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Arrays and Strings"
                    autoFocus
                />
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <PageTabs />
                </div>

                <div className="p-4 space-y-4">
                    <div>
                        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-end gap-1 mb-1">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Page Content</label>
                            <span className="text-xs text-gray-400 hidden sm:block">Type '/' to add code snippets</span>
                        </div>
                        <AppEditor
                            key={pages[activePageIdx].id}
                            initialContent={pages[activePageIdx].content}
                            onChange={handlePageContentChange}
                            onOpenFullscreen={openFullscreen}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={onCancel} className="w-full sm:w-auto">Cancel</Button>
                <Button onClick={handleSaveClick} className="bg-primary text-white w-full sm:w-auto">Save Topic</Button>
            </div>
        </div>
    );
}
