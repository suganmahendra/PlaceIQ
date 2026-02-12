import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { ChevronRight, Code2 } from 'lucide-react';
import type { LanguageType, PerformanceLevel } from '../../types/coding';

interface LanguageCardProps {
    language: LanguageType;
    progress: number;
    conceptsCompleted: number;
    totalConcepts: number;
    performanceLevel: PerformanceLevel;
    streakDays: number;
    lastActivity?: Date;
    link: string;
}

const languageColors = {
    Python: {
        bg: 'from-blue-500 to-cyan-500',
        icon: 'text-blue-600',
        badge: 'primary',
    },
    Java: {
        bg: 'from-orange-500 to-red-500',
        icon: 'text-orange-600',
        badge: 'warning',
    },
};

const performanceColors = {
    Weak: 'danger',
    Average: 'warning',
    Bright: 'success',
} as const;

export function LanguageCard({
    language,
    progress,
    conceptsCompleted,
    totalConcepts,
    performanceLevel,
    streakDays,
    lastActivity,
    link,
}: LanguageCardProps) {
    const colors = languageColors[language];

    return (
        <Link to={link}>
            <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Gradient Header */}
                <div className={cn('h-32 bg-gradient-to-br', colors.bg, 'relative overflow-hidden')}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute top-4 right-4">
                        <Code2 className="w-12 h-12 text-white/30" />
                    </div>
                    <div className="absolute bottom-4 left-4">
                        <h3 className="text-2xl font-bold text-white">{language}</h3>
                        <p className="text-white/80 text-sm mt-1">
                            {conceptsCompleted} / {totalConcepts} concepts
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Progress */}
                    <div>
                        <ProgressBar progress={progress} showLabel height="lg" />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <Badge variant={performanceColors[performanceLevel]} size="sm">
                                {performanceLevel}
                            </Badge>
                            {streakDays > 0 && (
                                <Badge variant="info" size="sm">
                                    🔥 {streakDays} day streak
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Last Activity */}
                    {lastActivity && (
                        <p className="text-xs text-gray-500">
                            Last activity: {new Date(lastActivity).toLocaleDateString()}
                        </p>
                    )}

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-sm font-medium text-primary">
                            {progress === 100 ? 'Review Concepts' : 'Continue Learning'}
                        </span>
                        <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
