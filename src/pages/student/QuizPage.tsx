import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Using react-router-dom, fixing this
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { quizService, type Quiz, type QuizQuestion } from '../../services/QuizService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export function QuizPage() {
    const { id } = useParams<{ id?: string }>(); // Quiz ID optional
    const navigate = useNavigate();
    const location = useLocation();
    const { profile, refreshProfile } = useAuth();

    const searchParams = new URLSearchParams(location.search);
    const queryId = id || searchParams.get('id');

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [answers, setAnswers] = useState<Record<string, number>>({});

    // Standalone quizzes list
    const [standaloneQuizzes, setStandaloneQuizzes] = useState<Quiz[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(false);

    // Timer state
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Submission state
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [passed, setPassed] = useState(false);

    useEffect(() => {
        if (queryId) {
            loadQuizData(queryId);
        } else {
            loadStandaloneQuizzes();
        }
    }, [queryId]);

    const loadStandaloneQuizzes = async () => {
        setIsLoadingList(true);
        try {
            const list = await quizService.getStandaloneQuizzes();
            setStandaloneQuizzes(list);
        } catch (error) {
            console.error('Failed to load standalone quizzes', error);
        } finally {
            setIsLoadingList(false);
        }
    };

    useEffect(() => {
        let timer: number;
        if (isTimerRunning && timeLeft > 0) {
            timer = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isTimerRunning && timeLeft === 0) {
            handleTimeUp();
        }
        return () => window.clearInterval(timer);
    }, [isTimerRunning, timeLeft]);

    const loadQuizData = async (quizId: string) => {
        try {
            // Because we only pass lessonId in the URL from LessonPage right now, 
            // the 'id' param might actually be the lessonId. Let's check.
            const searchParams = new URLSearchParams(location.search);
            const isLessonId = searchParams.get('type') === 'lesson';

            let quizData = null;
            if (isLessonId) {
                quizData = await quizService.getQuizByLessonId(quizId);
            } else {
                quizData = await quizService.getQuizById(quizId);
            }

            if (quizData) {
                setQuiz(quizData);
                const qData = await quizService.getQuizQuestions(quizData.id);
                setQuestions(qData);
                setTimeLeft(quizData.time_limit_mins * 60);
                setIsTimerRunning(true);
            } else {
                toast.error("Quiz not found");
                navigate(-1);
            }
        } catch (e) {
            console.error("Failed to load quiz", e);
            toast.error("Failed to load quiz");
        }
    };

    const handleAnswerSelect = (questionId: string, optionIndex: number) => {
        if (isSubmitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleTimeUp = () => {
        toast.error("Time's up!");
        handleSubmit();
    };

    const handleSubmit = async () => {
        if (!quiz || isSubmitted) return;

        setIsTimerRunning(false);
        setIsSubmitted(true);

        let totalScore = 0;
        let maxScore = questions.reduce((acc, q) => acc + q.points, 0);

        questions.forEach(q => {
            if (answers[q.id] === q.correct_option_index) {
                totalScore += q.points;
            }
        });

        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        const isPassed = percentage >= quiz.passing_score;

        setScore(percentage);
        setPassed(isPassed);

        try {
            await quizService.submitQuizAttempt({
                quiz_id: quiz.id,
                student_id: profile!.id,
                score: percentage,
                passed: isPassed,
                answers: answers
            });

            // If passed, give extra XP natively via RPC call or service
            if (isPassed) {
                // Bonus XP for passing quiz
                await quizService.awardQuizXp(profile!.id, 20);
                toast.success(`You passed with ${percentage}%! (+20 XP)`);
                await refreshProfile(); // Sync XP
            } else {
                toast.error(`You scored ${percentage}%. Passing is ${quiz.passing_score}%.`);
            }
        } catch (error) {
            console.error("Failed to submit quiz attempt", error);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!queryId) {
        return (
            <div className="-m-4 md:-m-8 min-h-screen bg-gray-900 pt-12 md:pt-20 pb-12 px-4 sm:px-6 md:px-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center mt-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-6">
                            Practice & Quizzes
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Level Up Your Skills</h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Complete standalone quizzes to earn extra XP and test your knowledge.
                            If a specific quiz was assigned to you, please use the direct link provided by your mentor or check your learning path.
                        </p>
                    </div>

                    <div className="bg-gray-800 rounded-3xl border border-gray-700 p-8 shadow-2xl mt-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Clock className="w-6 h-6 text-indigo-400" />
                            Available Practice Quizzes
                        </h2>

                        {isLoadingList ? (
                            <div className="text-center py-12 text-gray-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                                Loading quizzes...
                            </div>
                        ) : standaloneQuizzes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {standaloneQuizzes.map(q => (
                                    <div
                                        key={q.id}
                                        className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800 transition-all group cursor-pointer shadow-sm hover:shadow-indigo-500/10"
                                        onClick={() => navigate(`/student/quiz?id=${q.id}`)}
                                    >
                                        <h3 className="text-xl text-white font-bold mb-3 group-hover:text-indigo-400 transition-colors">{q.title}</h3>
                                        <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-500" /> {q.time_limit_mins} mins</span>
                                            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-500/70" /> {q.passing_score}% to pass</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-4 border-2 border-dashed border-gray-700 rounded-2xl bg-gray-900/20">
                                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">You're all caught up!</h3>
                                <p className="text-gray-400 max-w-sm mx-auto">
                                    No standalone quizzes are available at the moment. Keep progressing through your learning path to unlock topic quizzes.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!quiz) return <div className="p-8 text-center text-white">Loading quiz...</div>;

    return (
        <div className="-m-4 md:-m-8 min-h-screen bg-gray-900 pt-12 md:pt-20 pb-12 px-4 sm:px-6 md:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>

                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">{quiz.title}</h1>
                        <p className="text-gray-400">
                            Passing score: <span className="text-white font-medium">{quiz.passing_score}%</span>
                        </p>
                    </div>

                    {!isSubmitted && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${timeLeft < 60 ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                            }`}>
                            <Clock className="w-5 h-5" />
                            <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>

                {isSubmitted && (
                    <div className={`mb-8 p-6 rounded-2xl border ${passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {passed ? (
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                ) : (
                                    <XCircle className="w-10 h-10 text-red-500" />
                                )}
                                <div>
                                    <h2 className={`text-2xl font-bold ${passed ? 'text-green-500' : 'text-red-500'}`}>
                                        {passed ? 'Quiz Passed!' : 'Quiz Failed'}
                                    </h2>
                                    <p className="text-gray-300">
                                        You scored {score}% ({passed ? 'passing' : `needs ${quiz.passing_score}%`})
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
                            >
                                Continue Learning
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <div key={q.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-sm">
                            <h3 className="text-lg font-medium text-white mb-4">
                                <span className="text-indigo-400 mr-2">{index + 1}.</span>
                                {q.question_text}
                            </h3>

                            <div className="space-y-3">
                                {(q.options as string[]).map((opt, optIdx) => {
                                    const isSelected = answers[q.id] === optIdx;
                                    const isCorrect = isSubmitted && q.correct_option_index === optIdx;
                                    const isWrong = isSubmitted && isSelected && q.correct_option_index !== optIdx;

                                    let optionStyles = "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700";
                                    if (isSubmitted) {
                                        if (isCorrect) optionStyles = "bg-green-500/20 border-green-500 text-green-400";
                                        else if (isWrong) optionStyles = "bg-red-500/20 border-red-500 text-red-400";
                                        else optionStyles = "bg-gray-800 border-gray-700 text-gray-500 opacity-50";
                                    } else if (isSelected) {
                                        optionStyles = "bg-indigo-600/20 border-indigo-500 text-indigo-300";
                                    }

                                    return (
                                        <button
                                            key={optIdx}
                                            onClick={() => handleAnswerSelect(q.id, optIdx)}
                                            disabled={isSubmitted}
                                            className={`w-full text-left px-5 py-3 rounded-xl border-2 transition-all ${optionStyles}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span>{opt}</span>
                                                {isSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                                                {isSubmitted && isWrong && <XCircle className="w-5 h-5 text-red-500" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {isSubmitted && q.explanation && (
                                <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-200 text-sm">
                                    <span className="font-semibold text-indigo-400 mr-2">Explanation:</span>
                                    {q.explanation}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {!isSubmitted && (
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(answers).length !== questions.length}
                            className={`px-8 py-3 rounded-xl font-bold transition-all ${Object.keys(answers).length === questions.length
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
