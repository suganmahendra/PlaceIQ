import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, BookOpen, Layers } from 'lucide-react';
import { cmsService, type Course } from '../../../services/cmsService';
import { Button } from '../../../components/ui/Button';

export function CMSDashboard() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const data = await cmsService.getCourses();
            setCourses(data || []);
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this roadmap? This action cannot be undone.')) return;
        try {
            await cmsService.deleteCourse(id);
            setCourses(courses.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete course:', error);
            alert('Failed to delete course');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Content Management System...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Roadmap CMS</h1>
                    <p className="text-gray-500">Manage learning paths, phases, and topics.</p>
                </div>
                <Link to="/mentor/cms/new">
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Roadmap
                    </Button>
                </Link>
            </div>

            {courses.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border dashed border-gray-300">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Layers className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Roadmaps Found</h3>
                    <p className="text-gray-500 mt-2 mb-6">Start by creating your first learning path.</p>
                    <Link to="/mentor/cms/new">
                        <Button variant="outline">Create Roadmap</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                            {course.thumbnail_url ? (
                                <div className="h-40 w-full overflow-hidden bg-gray-100">
                                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            ) : (
                                <div className="h-40 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                    <BookOpen className="w-12 h-12 text-white/50" />
                                </div>
                            )}

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${course.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                        course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {course.difficulty}
                                    </span>
                                    {course.is_published ? (
                                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Published
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Draft
                                        </span>
                                    )}
                                </div>

                                <h3 className="font-bold text-lg text-gray-900 mb-2 truncate" title={course.title}>{course.title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 h-10 mb-4">{course.description || 'No description provided.'}</p>

                                <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                                    <Link to={`/mentor/cms/roadmap/${course.id}`}>
                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                            <Edit className="w-3 h-3" /> Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleDelete(course.id)}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
