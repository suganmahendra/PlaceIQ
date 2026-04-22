import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, FileText, Code, ArrowUp, ArrowDown } from 'lucide-react';
import { cmsService, type CourseLesson } from '../../../services/cmsService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { AppEditor } from '../../../components/ui/AppEditor';
import { QuizManager } from './QuizManager';
import toast from 'react-hot-toast';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LessonPageData {
    id: string;
    title: string;
    mode: 'text' | 'html';   // 'text' = BlockNote editor, 'html' = raw HTML rendered as iframe
    content: string;          // BlockNote JSON (used when mode='text')
    htmlContent: string;      // Full HTML string (used when mode='html')
}

// ─── Page data parser ─────────────────────────────────────────────────────────

const parseContentPages = (raw: string | undefined | null): LessonPageData[] => {
    const blank = (): LessonPageData => ({ id: crypto.randomUUID(), title: 'Page 1', mode: 'text', content: '', htmlContent: '' });
    if (!raw) return [blank()];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            const first = parsed[0];
            if (typeof first === 'object' && 'title' in first) {
                // Migrate old pages that don't have mode/htmlContent
                return parsed.map((p: any, i: number) => ({
                    id: p.id ?? crypto.randomUUID(),
                    title: p.title ?? `Page ${i + 1}`,
                    mode: p.mode ?? 'text',
                    content: p.content ?? '',
                    htmlContent: p.htmlContent ?? '',
                }));
            }
            // Old BlockNote array format (pre-paged)
            return [{ id: crypto.randomUUID(), title: 'Page 1', mode: 'text', content: raw, htmlContent: '' }];
        }
    } catch (_) { /* raw markdown */ }
    return [{ id: crypto.randomUUID(), title: 'Page 1', mode: 'text', content: raw ?? '', htmlContent: '' }];
};



// ─── PhaseManager ─────────────────────────────────────────────────────────────

export function PhaseManager() {
    const { moduleId } = useParams<{ moduleId: string }>();
    const navigate = useNavigate();

    const [module, setModule] = useState<any>(null);
    const [lessons, setLessons] = useState<CourseLesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [lessonForm, setLessonForm] = useState<Partial<CourseLesson>>({
        title: '', content_markdown: '', video_url: '', code_snippets: null
    });

    useEffect(() => {
        if (moduleId) loadModuleData(moduleId);
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

    const handleSaveLesson = async (snippets?: any) => {
        if (!moduleId || !lessonForm.title) return;
        try {
            if (editingLessonId === 'new') {
                const newLesson = await cmsService.createLesson({
                    module_id: moduleId,
                    title: lessonForm.title!,
                    content_markdown: lessonForm.content_markdown || '',
                    video_url: lessonForm.video_url,
                    order_index: lessons.length,
                    code_snippets: snippets ?? lessonForm.code_snippets
                } as any);
                setLessons([...lessons, newLesson]);
            } else if (editingLessonId) {
                const updated = await cmsService.updateLesson(editingLessonId, {
                    title: lessonForm.title!,
                    content_markdown: lessonForm.content_markdown,
                    video_url: lessonForm.video_url,
                    code_snippets: snippets ?? lessonForm.code_snippets
                } as any);
                setLessons(lessons.map(l => l.id === editingLessonId ? updated : l));
            }
            toast.success('Topic saved!');
            setEditingLessonId(null);
            setLessonForm({ title: '', content_markdown: '', video_url: '', code_snippets: null });
        } catch (error: any) {
            console.error('Failed to save topic:', error);
            toast.error(error?.message || 'Failed to save topic');
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
            toast.success('Topic deleted.');
        } catch (error) {
            console.error('Failed to delete topic:', error);
        }
    };

    const handleMoveLesson = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === lessons.length - 1) return;

        const newLessons = [...lessons];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        // Swap their order_index values
        const order1 = newLessons[index].order_index;
        const order2 = newLessons[targetIndex].order_index;
        
        newLessons[index] = { ...newLessons[index], order_index: order2 };
        newLessons[targetIndex] = { ...newLessons[targetIndex], order_index: order1 };
        
        // Swap elements in array
        [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]];
        
        setLessons(newLessons);

        try {
            await Promise.all([
                cmsService.updateLesson(newLessons[index].id, { order_index: newLessons[index].order_index } as any),
                cmsService.updateLesson(newLessons[targetIndex].id, { order_index: newLessons[targetIndex].order_index } as any)
            ]);
        } catch (error: any) {
            console.error('Failed to reorder topics:', error);
            toast.error('Failed to save new order. Please refresh and try again.');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Phase Content...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 px-3 sm:px-4 md:px-6 lg:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Phase List
                </button>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Phase Content Manager</span>
            </div>

            {/* Hero */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 gap-3">
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                        Manage Topics {module ? `for: ${module.title}` : ''}
                    </h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        Each topic supports multiple pages. Use <strong>Text</strong> or <strong>HTML</strong> mode per page.
                    </p>
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

            {/* Lesson list */}
            <div className="space-y-4">
                {editingLessonId === 'new' && (
                    <div className="bg-white border-2 border-primary/20 p-4 sm:p-6 rounded-xl shadow-lg">
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
                    <div key={lesson.id}>
                        {editingLessonId === lesson.id ? (
                            <div className="bg-white border-2 border-primary/20 p-4 sm:p-6 rounded-xl shadow-lg">
                                <h3 className="font-bold text-base sm:text-lg mb-4 text-primary break-words">
                                    Editing: {lesson.title}
                                </h3>
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
                            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <span className="w-7 h-7 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center font-bold text-xs ring-1 ring-gray-100 shrink-0">
                                        {index + 1}
                                    </span>
                                    
                                    <div className="flex flex-col shrink-0">
                                        <button 
                                            disabled={index === 0} 
                                            onClick={() => handleMoveLesson(index, 'up')}
                                            className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move Up"
                                        ><ArrowUp className="w-3.5 h-3.5" /></button>
                                        <button 
                                            disabled={index === lessons.length - 1} 
                                            onClick={() => handleMoveLesson(index, 'down')}
                                            className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                            title="Move Down"
                                        ><ArrowDown className="w-3.5 h-3.5" /></button>
                                    </div>

                                    <div className="min-w-0">
                                        <h4 className="font-bold text-sm sm:text-base text-gray-900 truncate">{lesson.title}</h4>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            {lesson.content_markdown && (() => {
                                                try {
                                                    const pages = JSON.parse(lesson.content_markdown || '[]') as LessonPageData[];
                                                    const hasHtml = Array.isArray(pages) && pages.some(p => p.mode === 'html');
                                                    const hasText = Array.isArray(pages) && pages.some(p => p.mode !== 'html');
                                                    return (
                                                        <>
                                                            {hasText && <span className="text-xs flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full"><FileText className="w-3 h-3" /> Text</span>}
                                                            {hasHtml && <span className="text-xs flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full"><Code className="w-3 h-3" /> HTML</span>}
                                                        </>
                                                    );
                                                } catch { return null; }
                                            })()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                                    <button onClick={() => startEdit(lesson)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(lesson.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
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

// ─── TopicForm ────────────────────────────────────────────────────────────────

function TopicForm({ form, setForm, onSave, onCancel }: {
    form: Partial<CourseLesson>;
    setForm: (f: Partial<CourseLesson>) => void;
    onSave: (snippets?: any) => void;
    onCancel: () => void;
}) {
    const [pages, setPages] = useState<LessonPageData[]>(() => parseContentPages(form.content_markdown));
    const [activePageIdx, setActivePageIdx] = useState(0);

    const activePage = pages[activePageIdx] ?? pages[0];

    const syncPages = useCallback((newPages: LessonPageData[]) => {
        setPages(newPages);
        setForm({ ...form, content_markdown: JSON.stringify(newPages) });
    }, [form, setForm]);

    const updateActivePage = (patch: Partial<LessonPageData>) => {
        const updated = pages.map((p, i) => i === activePageIdx ? { ...p, ...patch } : p);
        syncPages(updated);
    };

    const handleSaveClick = () => {
        setForm({ ...form, content_markdown: JSON.stringify(pages) });
        setTimeout(() => onSave(form.code_snippets), 0);
    };

    const handleAddPage = () => {
        const newPages = [
            ...pages,
            // Keep mode: 'text' default for backward compatibility with existing data model
            { id: crypto.randomUUID(), title: `Page ${pages.length + 1}`, mode: 'text' as const, content: '', htmlContent: '' }
        ];
        syncPages(newPages);
        setActivePageIdx(newPages.length - 1);
    };

    const handleDeletePage = (idx: number) => {
        if (pages.length <= 1) return;
        const newPages = pages.filter((_, i) => i !== idx);
        syncPages(newPages);
        setActivePageIdx(Math.min(activePageIdx, newPages.length - 1));
    };

    const switchPage = (idx: number) => {
        setActivePageIdx(idx);
    };

    // ── Page Tabs (shared) ──────────────────────────────────────────
    const PageTabs = ({ compact = false }: { compact?: boolean }) => (
        <div className={`flex gap-2 overflow-x-auto ${compact ? '' : 'flex-1 mr-4 pb-1'}`}>
            {pages.map((p, idx) => (
                <div key={p.id} className="flex-shrink-0 flex items-center">
                    <button
                        onClick={() => switchPage(idx)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activePageIdx === idx
                            ? compact ? 'bg-white/20 text-white border border-white/30' : 'bg-white text-primary border border-gray-200 shadow-sm'
                            : compact ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                    >
                        {p.title || `Page ${idx + 1}`}
                    </button>
                    {pages.length > 1 && activePageIdx === idx && (
                        <button onClick={() => handleDeletePage(idx)} className={`ml-1 p-1 transition-colors ${compact ? 'text-white/50 hover:text-red-300' : 'text-gray-400 hover:text-red-500'}`} title="Remove page">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            ))}
            <button onClick={handleAddPage} className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${compact ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
                <Plus className="w-3.5 h-3.5" /> Add Page
            </button>
        </div>
    );



    // ── Normal form ─────────────────────────────────────────────────
    return (
        <div className="space-y-6">
            {/* Topic Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
                <Input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Arrays and Strings"
                    autoFocus
                />
            </div>

            {/* Page tabs + per-page editor */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                {/* Tab bar */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <PageTabs />
                </div>

                <div className="p-4 space-y-4">
                    {/* Page Title */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Page Title</label>
                        <input
                            value={activePage.title}
                            onChange={e => updateActivePage({ title: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="Page title..."
                        />
                    </div>

                    {/* Editor area */}
                    <div>
                        <div className="flex items-end justify-between mb-2">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Page Content</label>
                        </div>
                        <AppEditor
                            key={activePage.id}
                            initialContent={activePage.mode === 'html' ? activePage.htmlContent : activePage.content}
                            onChange={c => updateActivePage({ content: c, mode: 'text', htmlContent: '' })}
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
