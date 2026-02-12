import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, RotateCcw, TrendingUp } from 'lucide-react';
import type { ConceptCheck as ConceptCheckType } from '../../types/learningPath';

interface ConceptCheckProps {
    conceptCheck: ConceptCheckType;
    onComplete: (score: number, confidence: number) => void;
}

export const ConceptCheck: React.FC<ConceptCheckProps> = ({
    conceptCheck,
    onComplete
}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [confidence, setConfidence] = useState(50);
    const [isComplete, setIsComplete] = useState(false);

    const currentQuestion = conceptCheck.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === conceptCheck.questions.length - 1;

    const handleAnswerSelect = (optionIndex: number) => {
        if (showResult) return;
        setSelectedAnswer(optionIndex);
    };

    const handleSubmit = () => {
        if (selectedAnswer === null) return;

        setShowResult(true);
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setIsComplete(true);
        } else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        }
    };

    const getRecommendation = () => {
        const percentage = (score / conceptCheck.questions.length) * 100;

        if (percentage >= 80 && confidence >= 70) {
            return {
                type: 'proceed',
                icon: ArrowRight,
                color: 'bg-green-500',
                title: 'Excellent! Ready to Proceed',
                message: 'You have a strong grasp of this topic. Continue to the next video!',
                action: 'Continue Learning'
            };
        } else if (percentage >= 60 && confidence >= 50) {
            return {
                type: 'proceed',
                icon: TrendingUp,
                color: 'bg-blue-500',
                title: 'Good Progress!',
                message: 'You understand the basics well. Feel free to move forward.',
                action: 'Next Video'
            };
        } else if (percentage < 60 || confidence < 50) {
            return {
                type: 'revise',
                icon: RotateCcw,
                color: 'bg-orange-500',
                title: 'Consider Reviewing',
                message: 'A quick revision might help strengthen your understanding.',
                action: 'Rewatch Video'
            };
        } else {
            return {
                type: 'switch_difficulty',
                icon: Lightbulb,
                color: 'bg-yellow-500',
                title: 'Try Different Approach',
                message: 'Consider switching to a different difficulty level for better understanding.',
                action: 'Switch Level'
            };
        }
    };

    if (isComplete) {
        const recommendation = getRecommendation();
        const Icon = recommendation.icon;
        const percentage = (score / conceptCheck.questions.length) * 100;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 rounded-3xl space-y-6"
            >
                <div className="text-center space-y-4">
                    <div className={`w-20 h-20 rounded-full ${recommendation.color} mx-auto flex items-center justify-center`}>
                        <Icon className="w-10 h-10 text-white" />
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">
                            {recommendation.title}
                        </h3>
                        <p className="text-text-secondary">
                            {recommendation.message}
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-8 py-4">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary">{score}/{conceptCheck.questions.length}</div>
                            <div className="text-sm text-text-muted mt-1">Correct Answers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary">{percentage.toFixed(0)}%</div>
                            <div className="text-sm text-text-muted mt-1">Score</div>
                        </div>
                    </div>

                    {/* Confidence Slider Result */}
                    <div className="bg-white/50 rounded-2xl p-4">
                        <div className="text-sm font-semibold text-text-muted mb-2">Your Confidence Level</div>
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">😟</div>
                            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"
                                    style={{ width: `${confidence}%` }}
                                />
                            </div>
                            <div className="text-2xl">😊</div>
                        </div>
                        <div className="text-center mt-2 font-bold text-primary">{confidence}% Confident</div>
                    </div>

                    <button
                        onClick={() => onComplete(score, confidence)}
                        className="w-full px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors"
                    >
                        {recommendation.action}
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 rounded-3xl space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-text-primary">Quick Concept Check</h3>
                    <p className="text-sm text-text-muted">Test your understanding</p>
                </div>
                <div className="text-sm font-bold text-primary">
                    Question {currentQuestionIndex + 1} of {conceptCheck.questions.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
                    style={{ width: `${((currentQuestionIndex + 1) / conceptCheck.questions.length) * 100}%` }}
                />
            </div>

            {/* Question */}
            <div className="space-y-4">
                <div className="text-lg font-semibold text-text-primary">
                    {currentQuestion.question}
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showResult}
                            className={`w-full p-4 rounded-xl text-left transition-all ${selectedAnswer === index
                                ? showResult
                                    ? index === currentQuestion.correctAnswer
                                        ? 'bg-green-100 border-2 border-green-500'
                                        : 'bg-red-100 border-2 border-red-500'
                                    : 'bg-primary/10 border-2 border-primary'
                                : showResult && index === currentQuestion.correctAnswer
                                    ? 'bg-green-100 border-2 border-green-500'
                                    : 'glass-card hover:bg-white/80'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === index
                                    ? showResult
                                        ? index === currentQuestion.correctAnswer
                                            ? 'bg-green-500 border-green-500'
                                            : 'bg-red-500 border-red-500'
                                        : 'bg-primary border-primary'
                                    : showResult && index === currentQuestion.correctAnswer
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-300'
                                    }`}>
                                    {showResult && (
                                        index === currentQuestion.correctAnswer ? (
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        ) : selectedAnswer === index ? (
                                            <XCircle className="w-4 h-4 text-white" />
                                        ) : null
                                    )}
                                </div>
                                <span className="font-medium">{option}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Explanation */}
                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3"
                    >
                        <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <div className="font-bold text-blue-900 mb-1">Explanation</div>
                            <div className="text-sm text-blue-800">{currentQuestion.explanation}</div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Confidence Slider (shown after answering) */}
            {showResult && isLastQuestion && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/50 rounded-2xl p-4 space-y-3"
                >
                    <div className="text-sm font-semibold text-text-primary">How confident are you with this topic?</div>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">😟</div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={confidence}
                            onChange={(e) => setConfidence(Number(e.target.value))}
                            className="flex-1 h-3 rounded-full appearance-none bg-gradient-to-r from-red-200 via-yellow-200 to-green-200"
                            style={{
                                background: `linear-gradient(to right, #fca5a5 0%, #fde047 50%, #86efac 100%)`
                            }}
                        />
                        <div className="text-2xl">😊</div>
                    </div>
                    <div className="text-center text-sm font-bold text-primary">{confidence}%</div>
                </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                {!showResult ? (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                        className={`flex-1 px-6 py-3 rounded-xl font-bold transition-colors ${selectedAnswer === null
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-primary text-white hover:bg-primary-hover'
                            }`}
                    >
                        Submit Answer
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
                    >
                        {isLastQuestion ? 'See Results' : 'Next Question'}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </motion.div>
    );
};
