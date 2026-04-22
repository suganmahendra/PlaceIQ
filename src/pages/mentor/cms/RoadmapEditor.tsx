import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Layers, BookOpen, Save, Trash2, ChevronRight, Edit2, ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { cmsService, type Course, type CourseModule } from '../../../services/cmsService';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import toast from 'react-hot-toast';

export function RoadmapEditor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // isNew is true when no ID is in URL (the /mentor/cms/new route) OR explicitly set to 'new'
    const isNew = !id || id === 'new';

    const [course, setCourse] = useState<Partial<Course>>({
        title: '',
        description: '',
        difficulty: 'Beginner',
        thumbnail_url: '',
        is_published: false
    });
    const [modules, setModules] = useState<CourseModule[]>([]);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [isAddingModule, setIsAddingModule] = useState(false);

    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [editModuleTitle, setEditModuleTitle] = useState('');

    useEffect(() => {
        if (!isNew && id) loadCourseData(id);
    }, [id, isNew]);

    const loadCourseData = async (courseId: string) => {
        try {
            const [courseData, modulesData] = await Promise.all([
                cmsService.getCourse(courseId),
                cmsService.getModules(courseId)
            ]);
            setCourse(courseData);
            setModules(modulesData || []);
        } catch (error) {
            console.error('Failed to load roadmap data:', error);
            toast.error('Failed to load roadmap. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCourse = async () => {
        try {
            setSaving(true);
            if (isNew) {
                const newCourse = await cmsService.createCourse({
                    title: course.title!,
                    description: course.description,
                    difficulty: course.difficulty,
                    thumbnail_url: course.thumbnail_url,
                    is_published: course.is_published,
                } as any);
                navigate(`/mentor/cms/roadmap/${newCourse.id}`, { replace: true });
            } else {
                await cmsService.updateCourse(id!, {
                    title: course.title,
                    description: course.description,
                    difficulty: course.difficulty,
                    thumbnail_url: course.thumbnail_url,
                    is_published: course.is_published
                });
                toast.success('✅ Roadmap saved successfully!');
            }
        } catch (error: any) {
            console.error('Failed to save course:', error);
            toast.error(error?.message?.includes('RLS') || error?.message?.includes('permission')
                ? '⚠️ Permission denied — see console for Supabase RLS fix instructions.'
                : 'Failed to save roadmap. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddModule = async () => {
        if (!newModuleTitle.trim() || !id) return;
        try {
            const newModule = await cmsService.createModule({
                course_id: id,
                title: newModuleTitle,
                order_index: modules.length
            });
            setModules([...modules, newModule]);
            setNewModuleTitle('');
            setIsAddingModule(false);
            toast.success('Phase added!');
        } catch (error: any) {
            console.error('Failed to add module:', error);
            toast.error(error?.message || 'Failed to add phase.');
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm('Delete this phase and all its topics?')) return;
        try {
            await cmsService.deleteModule(moduleId);
            setModules(modules.filter(m => m.id !== moduleId));
            toast.success('Phase deleted.');
        } catch (error: any) {
            console.error('Failed to delete module:', error);
            toast.error(error?.message || 'Failed to delete phase.');
        }
    };

    const handleEditModule = (module: CourseModule) => {
        setEditingModuleId(module.id);
        setEditModuleTitle(module.title);
    };

    const handleSaveModuleEdit = async () => {
        if (!editingModuleId || !editModuleTitle.trim()) return;
        try {
            await cmsService.updateModule(editingModuleId, { title: editModuleTitle });
            setModules(modules.map(m => m.id === editingModuleId ? { ...m, title: editModuleTitle } : m));
            setEditingModuleId(null);
            toast.success('Phase updated!');
        } catch (error: any) {
            console.error('Failed to update module:', error);
            toast.error(error?.message || 'Failed to update phase.');
        }
    };

    const handleMoveModule = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === modules.length - 1) return;

        const newModules = [...modules];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        // Swap their order_index values
        const order1 = newModules[index].order_index;
        const order2 = newModules[targetIndex].order_index;
        
        newModules[index] = { ...newModules[index], order_index: order2 };
        newModules[targetIndex] = { ...newModules[targetIndex], order_index: order1 };
        
        // Swap elements in array
        [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
        
        setModules(newModules);

        // Update in backend
        try {
            await Promise.all([
                cmsService.updateModule(newModules[index].id, { order_index: newModules[index].order_index }),
                cmsService.updateModule(newModules[targetIndex].id, { order_index: newModules[targetIndex].order_index })
            ]);
        } catch (error: any) {
            console.error('Failed to reorder modules:', error);
            toast.error('Failed to save new order to database. Please refresh and try again.');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Editor...</div>;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 px-3 sm:px-4 md:px-6 lg:px-0">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                {/* Back button */}
                <button
                    onClick={() => navigate('/mentor/cms')}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-fit"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to CMS
                </button>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    {!isNew && (
                        <button
                            onClick={async () => {
                                if (confirm('Delete entire roadmap?')) {
                                    await cmsService.deleteCourse(id!);
                                    navigate('/mentor/cms');
                                }
                            }}
                            className="flex items-center gap-1.5 text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden xs:inline sm:inline">Delete Roadmap</span>
                        </button>
                    )}
                    <Button
                        onClick={handleSaveCourse}
                        isLoading={saving}
                        className="bg-primary text-white flex items-center gap-1.5"
                    >
                        <Save className="w-4 h-4" />
                        {isNew ? 'Create Roadmap' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            {/* ── Roadmap Details Form ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-5">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary shrink-0" />
                    Roadmap Details
                </h2>

                {/* Responsive 2-col grid → stacks on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left column */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
                            <Input
                                value={course.title}
                                onChange={e => setCourse({ ...course, title: e.target.value })}
                                placeholder="e.g. Full Stack Python Developer"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                            <textarea
                                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                rows={4}
                                value={course.description || ''}
                                onChange={e => setCourse({ ...course, description: e.target.value })}
                                placeholder="Describe the learning path outcomes..."
                            />
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Difficulty Level</label>
                            <select
                                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
                                value={course.difficulty || 'Beginner'}
                                onChange={e => setCourse({ ...course, difficulty: e.target.value as any })}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                            <label className="flex items-center gap-2 cursor-pointer mt-2">
                                <input
                                    type="checkbox"
                                    checked={course.is_published || false}
                                    onChange={e => setCourse({ ...course, is_published: e.target.checked })}
                                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                                />
                                <span className="text-sm text-gray-700">Publish to Students</span>
                            </label>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Thumbnail URL</label>
                            <Input
                                value={course.thumbnail_url || ''}
                                onChange={e => setCourse({ ...course, thumbnail_url: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Phases & Curriculum ── */}
            {!isNew && (
                <div className="space-y-4">
                    {/* Section header */}
                    <div className="flex items-center justify-between gap-2">
                        <h2 className="text-base sm:text-xl font-bold flex items-center gap-2 text-gray-900">
                            <Layers className="w-5 h-5 text-secondary shrink-0" />
                            <span>Phases &amp; Curriculum</span>
                        </h2>
                        <Button size="sm" onClick={() => setIsAddingModule(true)} variant="outline" className="shrink-0">
                            <Plus className="w-4 h-4 mr-1" />
                            <span>Add Phase</span>
                        </Button>
                    </div>

                    {/* Add Module Form */}
                    {isAddingModule && (
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                    placeholder="Phase Title (e.g. Foundation)"
                                    value={newModuleTitle}
                                    onChange={e => setNewModuleTitle(e.target.value)}
                                    autoFocus
                                    onKeyDown={e => e.key === 'Enter' && handleAddModule()}
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleAddModule} className="flex-1 sm:flex-none">Add</Button>
                                    <Button variant="ghost" onClick={() => setIsAddingModule(false)} className="flex-1 sm:flex-none">Cancel</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modules List */}
                    <div className="space-y-3">
                        {modules.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm px-4">
                                No phases added yet. Click "Add Phase" to structure your roadmap.
                            </div>
                        ) : (
                            modules.map((module, index) => (
                                <div key={module.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="p-3 sm:p-4 flex items-center justify-between gap-3">
                                        {/* Phase info */}
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm shrink-0">
                                                {index + 1}
                                            </span>
                                            
                                            <div className="flex flex-col shrink-0">
                                                <button 
                                                    disabled={index === 0} 
                                                    onClick={() => handleMoveModule(index, 'up')}
                                                    className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Move Up"
                                                ><ArrowUp className="w-3.5 h-3.5" /></button>
                                                <button 
                                                    disabled={index === modules.length - 1} 
                                                    onClick={() => handleMoveModule(index, 'down')}
                                                    className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Move Down"
                                                ><ArrowDown className="w-3.5 h-3.5" /></button>
                                            </div>

                                            {editingModuleId === module.id ? (
                                                <div className="flex items-center gap-2 flex-1 mr-4">
                                                    <input
                                                        type="text"
                                                        value={editModuleTitle}
                                                        onChange={(e) => setEditModuleTitle(e.target.value)}
                                                        className="flex-1 rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                                        autoFocus
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveModuleEdit()}
                                                    />
                                                    <button onClick={handleSaveModuleEdit} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Save">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setEditingModuleId(null)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{module.title}</h3>
                                                        <button 
                                                            onClick={() => handleEditModule(module)}
                                                            className="text-gray-400 hover:text-primary p-1 rounded transition-colors"
                                                            title="Edit Phase Title"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-gray-400 hidden sm:block">Phase ID: {module.id.slice(0, 8)}...</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                                            <button
                                                onClick={() => navigate(`/mentor/cms/phases/${module.id}`)}
                                                className="flex items-center gap-1 text-xs sm:text-sm font-medium text-primary hover:bg-primary/5 px-2 sm:px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                <span className="hidden sm:inline">Manage Topics</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteModule(module.id)}
                                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Phase"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
