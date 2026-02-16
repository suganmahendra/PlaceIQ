import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Video, Code, FileText, Trash2, Edit2 } from 'lucide-react';
import { cmsService, type CourseLesson, type CourseModule } from '../../../services/cmsService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export function PhaseManager() {
    const { moduleId } = useParams<{ moduleId: string }>();
    const navigate = useNavigate();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [module, setModule] = useState<CourseModule | null>(null);
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
            const lessonsData = await cmsService.getLessons(id);
            setLessons(lessonsData || []);
        } catch (error) {
            console.error('Failed to load phase content:', error);
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
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Phase List
                </Button>
                <div>
                    <span className="text-sm text-gray-500 uppercase tracking-wider font-bold">Phase Content Manager</span>
                </div>
            </div>

            <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Topics</h1>
                    <p className="text-gray-500">Add videos, notes, and code snippets for this phase.</p>
                </div>
                <Button onClick={() => {
                    setEditingLessonId('new');
                    setLessonForm({ title: '', content_markdown: '', video_url: '', code_snippets: null });
                }}>
                    <Plus className="w-4 h-4 mr-2" /> Add New Topic
                </Button>
            </div>

            {/* List of Lessons */}
            <div className="space-y-4">
                {editingLessonId === 'new' && (
                    <div className="bg-white border-2 border-primary/20 p-6 rounded-xl shadow-lg ring-2 ring-primary/10 animate-in fade-in zoom-in-95">
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
                            <div className="bg-white border-2 border-primary/20 p-6 rounded-xl shadow-lg z-10 relative">
                                <h3 className="font-bold text-lg mb-4 text-primary">Editing: {lesson.title}</h3>
                                <TopicForm
                                    form={lessonForm}
                                    setForm={setLessonForm}
                                    onSave={handleSaveLesson}
                                    onCancel={() => setEditingLessonId(null)}
                                />
                            </div>
                        ) : (
                            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-primary/30 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center font-bold text-xs ring-1 ring-gray-100">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{lesson.title}</h4>
                                        <div className="flex items-center gap-3 mt-1">
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
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" variant="ghost" onClick={() => startEdit(lesson)}>
                                        <Edit2 className="w-4 h-4 text-gray-500" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(lesson.id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
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

function TopicForm({ form, setForm, onSave, onCancel }: {
    form: Partial<CourseLesson>,
    setForm: (f: Partial<CourseLesson>) => void,
    onSave: (snippets?: any) => void,
    onCancel: () => void
}) {
    // Initialize jsonText safely
    const [jsonText, setJsonText] = useState(form.code_snippets ? JSON.stringify(form.code_snippets, null, 2) : '');
    const [jsonError, setJsonError] = useState<string | null>(null);

    // Update jsonText when form.code_snippets changes (e.g. switching between different edits)
    // Actually, we shouldn't do this inside the same component instance unless key changes, which it does.
    useEffect(() => {
        setJsonText(form.code_snippets ? JSON.stringify(form.code_snippets, null, 2) : '');
    }, [form.code_snippets]); // This might cause loop if we update form from jsonText, but we don't.

    const handleSaveClick = () => {
        let snippetData = form.code_snippets;

        if (jsonText.trim()) {
            try {
                const parsed = JSON.parse(jsonText);
                snippetData = parsed;
            } catch (error) {
                setJsonError("Invalid JSON format");
                return;
            }
        } else {
            snippetData = null;
        }

        onSave(snippetData);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
                <Input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Introduction to Variables"
                    autoFocus
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube/MP4)</label>
                <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        value={form.video_url || ''}
                        onChange={e => setForm({ ...form, video_url: e.target.value })}
                        placeholder="https://youtube.com/..."
                        className="pl-10"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown)</label>
                <textarea
                    className="w-full h-32 rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-mono"
                    value={form.content_markdown || ''}
                    onChange={e => setForm({ ...form, content_markdown: e.target.value })}
                    placeholder="# Topic Overview\n\nExplanation goes here..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code Snippets (JSON)</label>
                <textarea
                    className={`w-full h-32 rounded-xl border ${jsonError ? 'border-red-500' : 'border-gray-300'} p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-mono bg-gray-50`}
                    value={jsonText}
                    onChange={e => {
                        setJsonText(e.target.value);
                        setJsonError(null);
                    }}
                    placeholder='[&#10;  {&#10;    "language": "python",&#10;    "code": "print(\"Hello\")"&#10;  }&#10;]'
                />
                {jsonError ? (
                    <p className="text-xs text-red-500 mt-1">{jsonError}</p>
                ) : (
                    <p className="text-xs text-gray-400 mt-1">Optional: Paste valid JSON array of snippets.</p>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSaveClick} className="bg-primary text-white">Save Topic</Button>
            </div>
        </div>
    );
}
