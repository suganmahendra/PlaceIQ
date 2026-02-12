import { cn } from '../../lib/utils';

interface ProgressRingProps {
    progress: number; // 0-100
    size?: 'sm' | 'md' | 'lg' | 'xl';
    strokeWidth?: number;
    showLabel?: boolean;
    className?: string;
    color?: string;
}

const sizeMap = {
    sm: 40,
    md: 60,
    lg: 80,
    xl: 120,
};

export function ProgressRing({
    progress,
    size = 'md',
    strokeWidth = 4,
    showLabel = true,
    className,
    color = 'text-primary',
}: ProgressRingProps) {
    const radius = sizeMap[size] / 2 - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            <svg
                width={sizeMap[size]}
                height={sizeMap[size]}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={sizeMap[size] / 2}
                    cy={sizeMap[size] / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                    cx={sizeMap[size] / 2}
                    cy={sizeMap[size] / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn(color, 'transition-all duration-500 ease-out')}
                />
            </svg>
            {showLabel && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                        'font-semibold',
                        size === 'sm' && 'text-xs',
                        size === 'md' && 'text-sm',
                        size === 'lg' && 'text-base',
                        size === 'xl' && 'text-xl',
                    )}>
                        {Math.round(progress)}%
                    </span>
                </div>
            )}
        </div>
    );
}
