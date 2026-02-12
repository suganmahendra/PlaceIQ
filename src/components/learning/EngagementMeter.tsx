import React from 'react';
import { Eye, Pause, SkipForward, RotateCcw, AlertCircle } from 'lucide-react';
import type { EngagementMetrics } from '../../types/learningPath';

interface EngagementMeterProps {
    metrics: EngagementMetrics;
    compact?: boolean;
}

export const EngagementMeter: React.FC<EngagementMeterProps> = ({
    metrics,
    compact = false
}) => {
    const getFocusColor = (score: number) => {
        if (score >= 75) return 'text-green-600 bg-green-100';
        if (score >= 50) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getAttentionBadge = () => {
        const badges = {
            high: { label: 'High Focus', color: 'bg-green-500', icon: '✓' },
            medium: { label: 'Moderate Focus', color: 'bg-yellow-500', icon: '~' },
            low: { label: 'Low Focus Detected', color: 'bg-red-500', icon: '!' }
        };
        return badges[metrics.attentionLevel];
    };

    const badge = getAttentionBadge();

    if (compact) {
        return (
            <div className="flex items-center gap-2">
                <div className={`w-12 h-12 rounded-full ${getFocusColor(metrics.focusScore)} flex items-center justify-center font-bold text-sm`}>
                    {metrics.focusScore}%
                </div>
                {metrics.distractionDetected && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                        <AlertCircle className="w-3 h-3" />
                        <span>Rewatch recommended</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="glass-card p-4 rounded-2xl space-y-4">
            {/* Focus Score Circle */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                        Engagement Score
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`text-2xl font-bold ${getFocusColor(metrics.focusScore).split(' ')[0]}`}>
                            {metrics.focusScore}%
                        </div>
                        <div className={`px-2 py-1 rounded-full ${badge.color} text-white text-xs font-bold`}>
                            {badge.label}
                        </div>
                    </div>
                </div>
                <div className={`w-16 h-16 rounded-full ${getFocusColor(metrics.focusScore)} flex items-center justify-center`}>
                    <Eye className="w-8 h-8" />
                </div>
            </div>

            {/* Engagement Heat Bar */}
            <div className="space-y-2">
                <div className="text-xs font-semibold text-text-muted">Attention Trend</div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${metrics.focusScore >= 75 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            metrics.focusScore >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                'bg-gradient-to-r from-red-400 to-red-600'
                            }`}
                        style={{ width: `${metrics.focusScore}%` }}
                    />
                </div>
            </div>

            {/* Engagement Indicators */}
            <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-white/50 rounded-lg">
                    <Pause className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <div className="text-xs font-bold">{metrics.pauseCount}</div>
                    <div className="text-[10px] text-text-muted">Pauses</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                    <SkipForward className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <div className="text-xs font-bold">{metrics.skipCount}</div>
                    <div className="text-[10px] text-text-muted">Skips</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                    <RotateCcw className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <div className="text-xs font-bold">{metrics.rewatchCount}</div>
                    <div className="text-[10px] text-text-muted">Rewatches</div>
                </div>
            </div>

            {/* Distraction Alert */}
            {metrics.distractionDetected && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs">
                        <div className="font-bold text-orange-900">Gentle Reminder</div>
                        <div className="text-orange-700 mt-1">
                            We noticed some skipping behavior. Consider rewatching this section for better understanding.
                        </div>
                    </div>
                </div>
            )}

            {/* Completion Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="font-semibold text-text-muted">Completion</span>
                    <span className="font-bold text-primary">{metrics.completionPercentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
                        style={{ width: `${metrics.completionPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
