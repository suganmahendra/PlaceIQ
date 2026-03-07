import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, Users, AlertCircle } from 'lucide-react';

export function StudentManager() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        register_number: '',
        full_name: '',
        email: '',
        department: 'AI & Data Science'
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        try {
            const { data: mentorsData } = await supabase.auth.getUser();
            await supabase
                .from('pre_registered_students')
                .select('*')
                .eq('added_by', (mentorsData.user as any)?.id || '');

            // If the policy doesn't restrict to the mentor, we still query all for now or query based on the mentor's id.
            // Since we added a policy "Mentors can view all", we just fetch them. But better to fetch the ones added by this mentor if needed, or all.
            const { data: allData, error: err } = await supabase
                .from('pre_registered_students')
                .select('*')
                .order('created_at', { ascending: false });

            if (err) throw err;
            setStudents(allData || []);
        } catch (err: any) {
            console.error('Error loading students:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) throw new Error("Mentor not authenticated");

            // Look up mentor ID
            const { data: mentorRec } = await supabase
                .from('mentors')
                .select('id')
                .eq('user_id', userData.user.id)
                .single();

            const { error } = await supabase
                .from('pre_registered_students')
                .insert({
                    register_number: formData.register_number,
                    full_name: formData.full_name,
                    email: formData.email,
                    department: formData.department,
                    added_by: mentorRec?.id || userData.user.id
                });

            if (error) {
                if (error.code === '23505') {
                    throw new Error("A student with this Register Number or Email already exists.");
                }
                throw error;
            }

            // Success
            setIsAdding(false);
            setFormData({
                register_number: '',
                full_name: '',
                email: '',
                department: 'AI & Data Science'
            });
            loadStudents();

        } catch (err: any) {
            setError(err.message || 'Failed to add student');
        } finally {
            setSaving(false);
        }
    };

    if (loading && students.length === 0) return <div className="p-8 text-center text-text-secondary">Loading students...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Manage Students</h1>
                    <p className="text-text-secondary">Add students to the platform so they can request access.</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2">
                    {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Student</>}
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {isAdding && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-text-primary mb-4">Add New Student</h2>
                    <form onSubmit={handleAddStudent} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                label="Register Number"
                                placeholder="E.g., 621522243xxx"
                                value={formData.register_number}
                                onChange={(e) => setFormData({ ...formData, register_number: e.target.value })}
                                required
                            />
                            <Input
                                label="Full Name"
                                placeholder="E.g., John Doe"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                required
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="student@university.edu"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Department"
                                placeholder="E.g., AI & Data Science"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" isLoading={saving}>Save Student</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {students.length === 0 ? (
                    <div className="p-6 sm:p-12 text-center text-text-secondary flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-gray-300" />
                        </div>
                        <p>No students have been added yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-text-secondary font-semibold">
                                    <th className="px-6 py-4">Register Number</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-text-primary">{student.register_number}</td>
                                        <td className="px-6 py-4 text-text-secondary">{student.full_name}</td>
                                        <td className="px-6 py-4 text-text-secondary">{student.email}</td>
                                        <td className="px-6 py-4 text-text-secondary">{student.department}</td>
                                        <td className="px-6 py-4">
                                            {student.is_activated ? (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
