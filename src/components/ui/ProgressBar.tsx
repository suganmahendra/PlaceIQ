import { cn } from '../../lib/utils';

interface ProgressBarProps {
    progress: number; // 0-100
    height?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
    color?: string;
    animated?: boolean;
}

const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
};

export function ProgressBar({
    progress,
    height = 'md',
    showLabel = false,
    className,
    color = 'bg-primary',
    animated = true,
}: ProgressBarProps) {
    return (
        <div className={cn('w-full', className)}>
            {showLabel && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
                </div>
            )}
            <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heightMap[height])}>
                <div
                    className={cn(
                        color,
                        'h-full rounded-full transition-all duration-500 ease-out',
                        animated && 'animate-in slide-in-from-left'
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
