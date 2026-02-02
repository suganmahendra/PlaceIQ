import { cn } from '../../lib/utils';

interface FluidBackgroundProps {
    className?: string;
    intensity?: 'subtle' | 'normal' | 'intense';
}

export function FluidBackground({ className, intensity = 'normal' }: FluidBackgroundProps) {
    const opacityClass = {
        subtle: 'opacity-30',
        normal: 'opacity-50',
        intense: 'opacity-70',
    }[intensity];

    return (
        <div className={cn("fixed inset-0 overflow-hidden pointer-events-none -z-10", className)}>
            {/* Mesh Gradient Background base */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-200 via-purple-100 to-white/50" />

            {/* Floating Orbs */}
            <div className={cn("absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob", opacityClass)}></div>
            <div className={cn("absolute top-0 right-1/4 w-96 h-96 bg-accent-violet/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000", opacityClass)}></div>
            <div className={cn("absolute -bottom-32 left-1/3 w-96 h-96 bg-accent-pink/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000", opacityClass)}></div>

            {/* Additional subtle orbs for depth */}
            <div className={cn("absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-5000", opacityClass)}></div>
        </div>
    );
}
