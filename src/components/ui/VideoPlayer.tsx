import { useState } from 'react';
import { cn } from '../../lib/utils';
import { Play, Pause, SkipForward, Settings, Maximize } from 'lucide-react';

interface VideoPlayerProps {
    youtubeUrl: string;
    title: string;
    onProgressUpdate?: (percentage: number) => void;
    onPause?: () => void;
    onSkip?: () => void;
    onSpeedChange?: (speed: number) => void;
    className?: string;
}

export function VideoPlayer({
    youtubeUrl,
    title,
    onPause,
    onSkip,
    onSpeedChange,
    className,
}: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    // Extract YouTube video ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(youtubeUrl);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1` : '';

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (isPlaying && onPause) {
            onPause();
        }
    };

    const handleSpeedChange = (speed: number) => {
        setPlaybackSpeed(speed);
        if (onSpeedChange) {
            onSpeedChange(speed);
        }
    };

    return (
        <div className={cn('bg-gray-900 rounded-xl overflow-hidden', className)}>
            {/* Video Container */}
            <div className="relative aspect-video bg-black">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        title={title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                        <p>Invalid YouTube URL</p>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-800 px-4 py-3">
                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePlayPause}
                            className="hover:text-primary transition-colors"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => onSkip && onSkip()}
                            className="hover:text-primary transition-colors"
                            aria-label="Skip forward"
                        >
                            <SkipForward className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-400">
                            {Math.round(progress)}% watched
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Speed Control */}
                        <div className="flex items-center gap-2">
                            <Settings className="w-4 h-4 text-gray-400" />
                            <select
                                value={playbackSpeed}
                                onChange={(e) => handleSpeedChange(Number(e.target.value))}
                                className="bg-gray-700 text-white text-sm rounded px-2 py-1 border-none outline-none cursor-pointer"
                            >
                                <option value={0.5}>0.5x</option>
                                <option value={0.75}>0.75x</option>
                                <option value={1}>1x</option>
                                <option value={1.25}>1.25x</option>
                                <option value={1.5}>1.5x</option>
                                <option value={2}>2x</option>
                            </select>
                        </div>

                        <button className="hover:text-primary transition-colors" aria-label="Fullscreen">
                            <Maximize className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
