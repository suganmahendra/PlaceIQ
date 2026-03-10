import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Plus, Users, AlertCircle, UploadCloud, FileJson, FileText, CheckCircle, X } from 'lucide-react';
import Papa from 'papaparse';

export function StudentManager() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Form state
    const [isAdding, setIsAdding] = useState(false);
    const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');

    // Single form
    const [formData, setFormData] = useState({
        register_number: '',
        full_name: '',
        email: '',
        department: 'AI & Data Science'
    });

    // Bulk drag-and-drop state
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        try {
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

    const getMentorId = async (user: any) => {
        const { data: mentorRec } = await supabase
            .from('mentors')
            .select('id')
            .eq('user_id', user.id)
            .single();
        return mentorRec?.id || user.id;
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) throw new Error("Mentor not authenticated");
            const addedById = await getMentorId(userData.user);

            const { error } = await supabase
                .from('pre_registered_students')
                .insert({
                    register_number: formData.register_number,
                    full_name: formData.full_name,
                    email: formData.email,
                    department: formData.department,
                    added_by: addedById
                });

            if (error) {
                if (error.code === '23505') throw new Error("A student with this Register Number or Email already exists.");
                throw error;
            }

            setSuccessMsg("Student added successfully!");
            setFormData({ register_number: '', full_name: '', email: '', department: 'AI & Data Science' });
            loadStudents();
        } catch (err: any) {
            setError(err.message || 'Failed to add student');
        } finally {
            setSaving(false);
        }
    };

    // Bulk Add Methods
    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            handleFileSelection(file);
        }
    }, []);

    const handleFileSelection = (file: File) => {
        const name = file.name.toLowerCase();
        if (name.endsWith('.csv') || name.endsWith('.json')) {
            setSelectedFile(file);
            setError(null);
            setSuccessMsg(null);
        } else {
            setError('Please upload a valid .csv or .json file.');
            setSelectedFile(null);
        }
    };

    const processBulkUpload = async () => {
        if (!selectedFile) return;
        setSaving(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) throw new Error("Mentor not authenticated");
            const addedById = await getMentorId(userData.user);

            const isJson = selectedFile.name.toLowerCase().endsWith('.json');
            const fileContent = await selectedFile.text();

            let parsedData: any[] = [];

            if (isJson) {
                try {
                    parsedData = JSON.parse(fileContent);
                    if (!Array.isArray(parsedData)) {
                        throw new Error('JSON file must contain an array of objects.');
                    }
                } catch (e) {
                    throw new Error('Invalid JSON structure.');
                }
            } else {
                Papa.parse(fileContent, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        parsedData = results.data;
                    }
                });
            }

            // Map and validate data
            const recordsToInsert = parsedData.map((row: any, index: number) => {
                const regNo = row.register_number || row.registerNumber || row.RegisterNumber || row.Register_Number;
                const name = row.full_name || row.fullName || row.FullName || row.Full_Name || row.name || row.Name;
                const email = row.email || row.Email || row.email_address;
                const dept = row.department || row.Department || row.dept || 'AI & Data Science';

                if (!regNo || !name || !email) {
                    throw new Error(`Row ${index + 1} is missing required fields (register number, full name, or email).`);
                }

                return {
                    register_number: String(regNo).trim(),
                    full_name: String(name).trim(),
                    email: String(email).trim(),
                    department: String(dept).trim(),
                    added_by: addedById
                };
            });

            if (recordsToInsert.length === 0) throw new Error("File contains no valid records.");

            const { error: insertError } = await supabase
                .from('pre_registered_students')
                .insert(recordsToInsert);

            if (insertError) {
                if (insertError.code === '23505') {
                    throw new Error("One or more students in the file already exist (duplicate Register Number or Email).");
                }
                throw insertError;
            }

            setSuccessMsg(`Successfully imported ${recordsToInsert.length} students!`);
            setSelectedFile(null);
            loadStudents();

        } catch (err: any) {
            setError(err.message || 'Failed to process bulk upload.');
        } finally {
            setSaving(false);
        }
    };

    if (loading && students.length === 0) return <div className="p-8 text-center text-text-secondary">Loading students...</div>;

    return (
        <div className="space-y-6 w-full max-w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-text-primary break-words">Manage Students</h1>
                    <p className="text-sm sm:text-base text-text-secondary break-words">Add students to the platform.</p>
                </div>
                <Button onClick={() => {
                    setIsAdding(!isAdding);
                    setError(null);
                    setSuccessMsg(null);
                    setSelectedFile(null);
                }} className="flex items-center gap-2 w-full sm:w-auto justify-center">
                    {isAdding ? 'Close form' : <><Plus className="w-4 h-4" /> Add Student(s)</>}
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-start gap-3 w-full break-words">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium break-words overflow-hidden whitespace-normal">{error}</p>
                </div>
            )}

            {successMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-start gap-3 w-full break-words">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{successMsg}</p>
                </div>
            )}

            {isAdding && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm w-full">
                    <div className="flex flex-col sm:flex-row gap-2 mb-6 border-b border-gray-100 pb-2">
                        <button
                            className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${addMode === 'single' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            onClick={() => { setAddMode('single'); setError(null); setSuccessMsg(null); }}
                        >
                            Single Entry
                        </button>
                        <button
                            className={`px-4 py-2 font-semibold text-sm rounded-lg transition-colors ${addMode === 'bulk' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            onClick={() => { setAddMode('bulk'); setError(null); setSuccessMsg(null); }}
                        >
                            Bulk Upload
                        </button>
                    </div>

                    {addMode === 'single' ? (
                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Register Number"
                                    placeholder="E.g., 621522243"
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
                                    placeholder="student@uni.edu"
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
                                <Button type="submit" isLoading={saving} className="w-full sm:w-auto justify-center">Save Student</Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {!selectedFile ? (
                                <div
                                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onDrop={onDrop}
                                    onClick={() => document.getElementById('file-upload')?.click()}
                                >
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        accept=".csv,.json"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                handleFileSelection(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <UploadCloud className="w-10 h-10 text-gray-400 mb-4" />
                                    <h3 className="text-sm font-bold text-gray-700 mb-1">Click or drag and drop to upload</h3>
                                    <p className="text-xs text-gray-500">Supports .CSV and .JSON files</p>
                                    <p className="text-xs text-gray-400 mt-4 max-w-xs leading-relaxed">Required headers: register_number, full_name, email, department</p>
                                </div>
                            ) : (
                                <div className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 overflow-hidden w-full">
                                        <div className="p-3 bg-indigo-50 text-indigo-500 rounded-lg flex-shrink-0">
                                            {selectedFile.name.endsWith('.json') ? <FileJson className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm text-gray-900 truncate">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button variant="outline" className="flex-1 sm:flex-none justify-center px-3" onClick={() => setSelectedFile(null)} disabled={saving}>
                                            <X className="w-4 h-4 sm:mr-0" /> <span className="sm:hidden ml-1">Remove</span>
                                        </Button>
                                        <Button className="flex-1 sm:flex-none justify-center" onClick={processBulkUpload} isLoading={saving}>
                                            Upload
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="w-full">
                {students.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-12 text-center text-text-secondary flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Users className="w-8 h-8 text-gray-300" />
                        </div>
                        <p>No students have been added yet.</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile view - Cards */}
                        <div className="block md:hidden space-y-4">
                            {students.map((student) => (
                                <div key={student.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-2 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary/80"></div>
                                    <div className="flex justify-between items-start gap-2">
                                        <span className="text-sm font-black text-gray-900 truncate">{student.full_name}</span>
                                        {student.is_activated ? (
                                            <span className="inline-flex flex-shrink-0 items-center py-0.5 px-2 rounded-md text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex flex-shrink-0 items-center py-0.5 px-2 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                Pending
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 flex flex-col gap-1 mt-1">
                                        <p><span className="font-semibold text-gray-400">Reg No:</span> {student.register_number}</p>
                                        <p><span className="font-semibold text-gray-400">Email:</span> <span className="truncate break-all">{student.email}</span></p>
                                        <p><span className="font-semibold text-gray-400">Dept:</span> {student.department}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop view - Table */}
                        <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden w-full">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-max">
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
                                                <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">{student.register_number}</td>
                                                <td className="px-6 py-4 text-text-secondary whitespace-nowrap">{student.full_name}</td>
                                                <td className="px-6 py-4 text-text-secondary whitespace-nowrap">{student.email}</td>
                                                <td className="px-6 py-4 text-text-secondary whitespace-nowrap">{student.department}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {student.is_activated ? (
                                                        <span className="inline-flex items-center py-1 px-2 rounded-md text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center py-1 px-2 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
