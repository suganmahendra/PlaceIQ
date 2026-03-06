import { useState, useEffect } from 'react';
import { FileQuestion, Plus, X, Copy, CheckCircle } from 'lucide-react';
import { QuizManager } from '../../pages/mentor/cms/QuizManager';
import { quizService, type Quiz } from '../../services/QuizService';
import toast from 'react-hot-toast';

export function CreateStandaloneQuizPanel() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        loadQuizzes();
    }, [isCreating, editingQuizId]); // Reload when returning from create/edit

    const loadQuizzes = async () => {
        try {
            const data = await quizService.getStandaloneQuizzes();
            setQuizzes(data);
        } catch (error) {
            console.error(error);
        }
    };

    const copyLink = (quizId: string) => {
        const url = `${window.location.origin}/student/quiz?id=${quizId}`;
        navigator.clipboard.writeText(url);
        setCopiedId(quizId);
        toast.success('Quiz link copied! Paste it in an announcement.');
        setTimeout(() => setCopiedId(null), 3000);
    };

    if (isCreating || editingQuizId) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FileQuestion className="w-5 h-5 text-indigo-500" />
                        {editingQuizId ? 'Edit Standalone Quiz' : 'Create New Quiz'}
                    </h3>
                    <button
                        onClick={() => { setIsCreating(false); setEditingQuizId(null); }}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <QuizManager
                    isStandalone={true}
                    standaloneQuizId={editingQuizId || undefined}
                />
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FileQuestion className="w-5 h-5 text-indigo-500" />
                    Standalone Quizzes
                </h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold text-sm rounded-xl hover:bg-indigo-100 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create New
                </button>
            </div>

            <div className="space-y-3">
                {quizzes.length === 0 ? (
                    <div className="text-center py-6 text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                        No standalone quizzes created yet.
                    </div>
                ) : (
                    quizzes.map(quiz => (
                        <div key={quiz.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-indigo-100 hover:bg-indigo-50/30 transition-all gap-4">
                            <div>
                                <h4 className="font-bold text-gray-900">{quiz.title}</h4>
                                <p className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-3">
                                    <span>Time: {quiz.time_limit_mins}m</span>
                                    <span>Pass: {quiz.passing_score}%</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => copyLink(quiz.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    {copiedId === quiz.id ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copiedId === quiz.id ? 'Copied' : 'Copy Link'}
                                </button>
                                <button
                                    onClick={() => setEditingQuizId(quiz.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
