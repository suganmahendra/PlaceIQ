import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    className?: string;
}

const variantStyles = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
};

const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
};

export function Badge({
    children,
    variant = 'default',
    size = 'md',
    icon: Icon,
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 font-medium rounded-full border',
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
        >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {children}
        </span>
    );
}
