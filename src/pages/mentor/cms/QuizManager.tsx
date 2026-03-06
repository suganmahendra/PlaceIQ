import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { quizService, type Quiz, type QuizQuestion } from '../../../services/QuizService';
import { toast } from 'react-hot-toast';

interface QuizManagerProps {
    lessonId?: string;
    moduleId?: string;
    standaloneQuizId?: string; // If editing an existing standalone quiz
    isStandalone?: boolean;
}

export const QuizManager: React.FC<QuizManagerProps> = ({ lessonId, moduleId, standaloneQuizId, isStandalone }) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [timeLimit, setTimeLimit] = useState(5);
    const [passingScore, setPassingScore] = useState(80);
    const [isMandatory, setIsMandatory] = useState(false);

    useEffect(() => {
        loadQuizData();
    }, [lessonId, standaloneQuizId]);

    const loadQuizData = async () => {
        setIsLoading(true);
        try {
            let data = null;
            if (standaloneQuizId) {
                data = await quizService.getQuizById(standaloneQuizId);
            } else if (lessonId) {
                data = await quizService.getQuizByLessonId(lessonId);
            }
            // If neither, we are creating a new standalone quiz, so data remains null

            if (data) {
                setQuiz(data);
                setTitle(data.title);
                setTimeLimit(data.time_limit_mins);
                setPassingScore(data.passing_score);
                setIsMandatory(data.is_mandatory);

                const qData = await quizService.getQuizQuestions(data.id);
                setQuestions(qData);
            }
        } catch (error) {
            console.error('Failed to load quiz', error);
            toast.error('Failed to load quiz settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveQuizSettings = async () => {
        setIsSaving(true);
        try {
            const quizData: Partial<Quiz> = {
                id: quiz?.id,
                title: title || (isStandalone ? 'Standalone Quiz' : 'Topic Quiz'),
                lesson_id: lessonId || null,
                related_module_id: moduleId || null,
                time_limit_mins: timeLimit,
                passing_score: passingScore,
                is_mandatory: isMandatory,
            };

            const savedQuiz = await quizService.upsertQuiz(quizData);
            setQuiz(savedQuiz);
            toast.success('Quiz settings saved');
        } catch (error) {
            console.error('Failed to save quiz', error);
            toast.error('Failed to save quiz settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddQuestion = async () => {
        if (!quiz) {
            toast.error('Please save quiz settings first');
            return;
        }

        const newQuestion: Partial<QuizQuestion> = {
            quiz_id: quiz.id,
            question_text: 'New Question',
            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            correct_option_index: 0,
            points: 10,
            order_index: questions.length,
            explanation: '',
        };

        try {
            const savedQuestion = await quizService.upsertQuestion(newQuestion);
            setQuestions([...questions, savedQuestion]);
        } catch (error) {
            console.error('Failed to add question', error);
            toast.error('Failed to add question');
        }
    };

    const handleUpdateQuestion = async (index: number, updates: Partial<QuizQuestion>) => {
        const question = questions[index];
        const updatedQuestion = { ...question, ...updates };

        // Optimistically update UI
        const newQuestions = [...questions];
        newQuestions[index] = updatedQuestion;
        setQuestions(newQuestions);

        try {
            await quizService.upsertQuestion(updatedQuestion);
        } catch (error) {
            console.error('Failed to update question', error);
            toast.error('Failed to save question changes');
            // Revert on failure
            loadQuizData();
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        try {
            await quizService.deleteQuestion(id);
            setQuestions(questions.filter(q => q.id !== id));
            toast.success('Question deleted');
        } catch (error) {
            console.error('Failed to delete question', error);
            toast.error('Failed to delete question');
        }
    };

    if (isLoading) return <div className="p-4 text-center">Loading quiz data...</div>;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-xl font-semibold text-gray-900">{isStandalone ? 'Standalone Quiz Configuration' : 'Topic Quiz Configuration'}</h3>
                <button
                    onClick={handleSaveQuizSettings}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g., Time & Space Complexity Quiz"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (mins)</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="number"
                                    value={timeLimit}
                                    onChange={(e) => setTimeLimit(parseInt(e.target.value) || 5)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-900 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
                            <input
                                type="number"
                                value={passingScore}
                                onChange={(e) => setPassingScore(parseInt(e.target.value) || 80)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-indigo-500" />
                        Quiz Rules
                    </h4>

                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={isMandatory}
                            onChange={(e) => setIsMandatory(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div>
                            <p className="text-gray-900 font-medium group-hover:text-indigo-600 transition-colors">Mandatory for completion</p>
                            <p className="text-sm text-gray-500">Students must pass this quiz to complete the topic.</p>
                        </div>
                    </label>
                </div>
            </div>

            {quiz && (
                <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Questions ({questions.length})</h4>
                        <button
                            onClick={handleAddQuestion}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Question
                        </button>
                    </div>

                    <div className="space-y-4">
                        {questions.map((q, index) => (
                            <div key={q.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4 relative group">
                                <button
                                    onClick={() => handleDeleteQuestion(q.id)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Question {index + 1}</label>
                                    <textarea
                                        value={q.question_text}
                                        onChange={(e) => handleUpdateQuestion(index, { question_text: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 outline-none min-h-[80px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Options</label>
                                    {(q.options as string[]).map((opt, optIndex) => (
                                        <div key={optIndex} className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleUpdateQuestion(index, { correct_option_index: optIndex })}
                                                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${q.correct_option_index === optIndex
                                                    ? 'border-green-500 bg-green-50 text-green-500'
                                                    : 'border-gray-300 text-transparent hover:border-gray-400'
                                                    }`}
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOptions = [...(q.options as string[])];
                                                    newOptions[optIndex] = e.target.value;
                                                    handleUpdateQuestion(index, { options: newOptions });
                                                }}
                                                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-gray-900 outline-none text-sm focus:border-indigo-500"
                                                placeholder={`Option ${optIndex + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (optional)</label>
                                    <input
                                        type="text"
                                        value={q.explanation || ''}
                                        onChange={(e) => handleUpdateQuestion(index, { explanation: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 outline-none"
                                        placeholder="Explain why the answer is correct..."
                                    />
                                </div>
                            </div>
                        ))}

                        {questions.length === 0 && (
                            <div className="text-center py-8 text-gray-400 border border-dashed border-white/10 rounded-lg">
                                No questions added yet. Click "Add Question" to start building your quiz.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!quiz && (
                <div className="text-center py-4 text-sm text-amber-400 bg-amber-400/10 rounded-lg border border-amber-400/20">
                    Please save quiz settings first before adding questions.
                </div>
            )}
        </div>
    );
};
