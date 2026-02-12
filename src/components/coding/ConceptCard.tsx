import { useState } from 'react';
import { Badge } from '../ui/Badge';
import { VideoPlayer } from '../ui/VideoPlayer';
import { CheckCircle2, Circle, Code, Eye, EyeOff, AlertTriangle, ShieldCheck, Award } from 'lucide-react';
import type { VideoConcept } from '../../types/coding';

interface ConceptCardProps {
    concept: VideoConcept;
    onQuizClick?: () => void;
    onTaskClick?: () => void;
    onProgressUpdate?: (conceptId: string, data: Partial<VideoConcept>) => void;
}

const levelColors = {
    Beginner: 'success',
    Intermediate: 'info',
    Advanced: 'warning',
} as const;

export function ConceptCard({ concept, onQuizClick, onTaskClick, onProgressUpdate }: ConceptCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [pauseCount, setPauseCount] = useState(concept.pauseCount);
    const [skipAttempts, setSkipAttempts] = useState(concept.skipAttempts);
    const [speedChanges, setSpeedChanges] = useState(concept.speedChanges);
    const [watchProgress] = useState(concept.watchPercentage);

    const isCompleted = watchProgress >= 90;

    const handlePause = () => {
        const newCount = pauseCount + 1;
        setPauseCount(newCount);
        updateMetrics({ pauseCount: newCount });
    };

    const handleSkip = () => {
        const newCount = skipAttempts + 1;
        setSkipAttempts(newCount);
        updateMetrics({ skipAttempts: newCount });
    };

    const handleSpeedChange = () => {
        const newCount = speedChanges + 1;
        setSpeedChanges(newCount);
        updateMetrics({ speedChanges: newCount });
    };

    const updateMetrics = (data: Partial<VideoConcept>) => {
        if (onProgressUpdate) {
            onProgressUpdate(concept.id, data);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start gap-4">
                    <div className="mt-1">
                        {concept.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                            <div className="relative">
                                <Circle className="w-6 h-6 text-gray-300" />
                                <div
                                    className="absolute inset-0 m-auto w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"
                                    style={{ display: watchProgress > 0 && watchProgress < 100 ? 'block' : 'none' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-gray-900">{concept.title}</h4>
                                    {concept.level === 'Advanced' && (
                                        <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
                                            Industry Ready
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">{concept.description}</p>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant={levelColors[concept.level]} size="sm">
                                        {concept.level}
                                    </Badge>

                                    {/* Verified Channel Indicator */}
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                                        <ShieldCheck className="w-3 h-3 text-blue-500" />
                                        {concept.channel}
                                    </div>

                                    <Badge variant="default" size="sm">
                                        {concept.duration} min
                                    </Badge>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                }}
                                className="text-primary hover:text-primary/80 transition-colors"
                            >
                                {isExpanded ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-gray-100 p-4 space-y-6 animate-in slide-in-from-top duration-300 bg-gray-50/50">
                    {/* Video Player & Warning */}
                    <div className="space-y-3">
                        {skipAttempts > 2 && (
                            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-200">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                <span>Slow down! Skipping too frequently might affect your retention score.</span>
                            </div>
                        )}
                        <VideoPlayer
                            youtubeUrl={concept.youtubeUrl}
                            title={concept.title}
                            onPause={handlePause}
                            onSkip={handleSkip}
                            onSpeedChange={handleSpeedChange}
                        />
                    </div>

                    {/* Progress & Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
                            <div className="text-xs text-gray-500 mb-1">Watched</div>
                            <div className="font-bold text-primary">{watchProgress}%</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
                            <div className="text-xs text-gray-500 mb-1">Pauses</div>
                            <div className="font-bold text-gray-700">{pauseCount}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
                            <div className="text-xs text-gray-500 mb-1">Skips</div>
                            <div className="font-bold text-amber-600">{skipAttempts}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
                            <div className="text-xs text-gray-500 mb-1">Speed</div>
                            <div className="font-bold text-purple-600">{speedChanges}x</div>
                        </div>
                    </div>

                    {/* Action Buttons based on Level */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        {/* Mark as Completed - for all levels */}
                        <button
                            disabled={!isCompleted || concept.completed}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${isCompleted && !concept.completed
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md transform hover:-translate-y-0.5'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            {concept.completed ? 'Completed' : 'Mark as Completed'}
                        </button>

                        {/* Intermediate: Quiz Button */}
                        {concept.level === 'Intermediate' && (
                            <button
                                onClick={onQuizClick}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 shadow-md transition-all font-medium"
                            >
                                <Award className="w-5 h-5" />
                                Take Quiz
                            </button>
                        )}

                        {/* Advanced: Code Task */}
                        {concept.level === 'Advanced' && (
                            <button
                                onClick={onTaskClick}
                                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 shadow-md transition-all font-medium"
                            >
                                <Code className="w-5 h-5" />
                                Industry Task
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
