import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import type { VideoContent, EngagementMetrics } from '../../types/learningPath';

interface VideoCardProps {
    video: VideoContent;
    isLocked?: boolean;
    isCompleted?: boolean;
    engagementMetrics?: EngagementMetrics;
    onClick?: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
    video,
    isLocked = false,
    isCompleted = false,
    engagementMetrics,
    onClick
}) => {
    const difficultyColors = {
        beginner: 'bg-green-100 text-green-700 border-green-300',
        intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        advanced: 'bg-red-100 text-red-700 border-red-300'
    };

    const getFocusBadge = () => {
        if (!engagementMetrics) return null;

        if (engagementMetrics.distractionDetected) {
            return (
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Rewatch
                </div>
            );
        }

        if (engagementMetrics.focusScore >= 75) {
            return (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    ✓ Great Focus
                </div>
            );
        }

        if (engagementMetrics.focusScore < 50) {
            return (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    Low Focus
                </div>
            );
        }

        return null;
    };

    return (
        <motion.div
            whileHover={!isLocked ? { y: -5, scale: 1.02 } : {}}
            className={`glass-card rounded-2xl overflow-hidden group ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
            onClick={!isLocked ? onClick : undefined}
        >
            {/* Thumbnail Section */}
            <div className="relative aspect-video bg-gray-200">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                    }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Play Button */}
                {!isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                    </div>
                )}

                {/* Lock Overlay */}
                {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="text-center">
                            <Lock className="w-12 h-12 text-white mx-auto mb-2" />
                            <div className="text-white text-sm font-bold">Complete previous videos</div>
                        </div>
                    </div>
                )}

                {/* Completed Badge */}
                {isCompleted && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                    </div>
                )}

                {/* Focus Badge */}
                {getFocusBadge()}

                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <h3 className="font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary line-clamp-2">
                    {video.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between">
                    <div className="text-xs text-text-muted">
                        📺 {video.channel}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold border ${difficultyColors[video.difficulty]}`}>
                        {video.difficulty.charAt(0).toUpperCase() + video.difficulty.slice(1)}
                    </div>
                </div>

                {/* Progress Bar */}
                {engagementMetrics && engagementMetrics.completionPercentage > 0 && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span className="text-text-muted">Progress</span>
                            <span className="font-bold text-primary">{engagementMetrics.completionPercentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
                                style={{ width: `${engagementMetrics.completionPercentage}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Focus Score Indicator */}
                {engagementMetrics && (
                    <div className="flex items-center gap-2 text-xs">
                        <div className="flex-1 flex items-center gap-2">
                            <div className="text-text-muted">Focus Score:</div>
                            <div className={`font-bold ${engagementMetrics.focusScore >= 75 ? 'text-green-600' :
                                engagementMetrics.focusScore >= 50 ? 'text-yellow-600' :
                                    'text-red-600'
                                }`}>
                                {engagementMetrics.focusScore}%
                            </div>
                        </div>
                    </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {video.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
