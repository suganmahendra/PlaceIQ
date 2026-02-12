import { Brain, TrendingUp, BookOpen, Code } from 'lucide-react';

export function AIBrainIllustration() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Central AI Brain */}
            <div className="relative">
                {/* Glowing orb background */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-primary/30 via-accent-violet/20 to-accent-pink/30 rounded-full blur-3xl animate-pulse"
                        style={{ animationDuration: '4s' }} />
                </div>

                {/* Brain icon */}
                <div className="relative z-10 w-48 h-48 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent-violet rounded-full opacity-10 animate-pulse"
                        style={{ animationDuration: '3s' }} />
                    <Brain className="w-32 h-32 text-primary drop-shadow-lg" strokeWidth={1.5} />
                </div>

                {/* Orbiting connection lines */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                    <div className="absolute top-0 left-1/2 w-1 h-20 bg-gradient-to-b from-primary/40 to-transparent -translate-x-1/2" />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                    <div className="absolute bottom-0 left-1/2 w-1 h-20 bg-gradient-to-t from-accent-violet/40 to-transparent -translate-x-1/2" />
                </div>
            </div>

            {/* Floating glassmorphic cards */}
            {/* Progress Card - Top Right */}
            <div className="absolute top-8 right-8 glass-card p-4 rounded-xl shadow-xl animate-float"
                style={{ animationDelay: '0s' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent-violet flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-text-muted font-medium">Progress</p>
                        <p className="text-lg font-bold text-primary">87%</p>
                    </div>
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[87%] bg-gradient-to-r from-primary to-accent-violet rounded-full" />
                </div>
            </div>

            {/* Coding Card - Left */}
            <div className="absolute top-1/3 left-4 glass-card p-4 rounded-xl shadow-xl animate-float"
                style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-violet to-accent-pink flex items-center justify-center">
                        <Code className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-text-muted font-medium">Coding</p>
                        <p className="text-sm font-bold text-text-primary">Python & Java</p>
                    </div>
                </div>
            </div>

            {/* Courses Card - Bottom Right */}
            <div className="absolute bottom-12 right-12 glass-card p-4 rounded-xl shadow-xl animate-float"
                style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-pink to-primary flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-text-muted font-medium">Courses</p>
                        <p className="text-sm font-bold text-text-primary">ML, DSA, SQL</p>
                    </div>
                </div>
            </div>

            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-ping"
                style={{ animationDuration: '3s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-accent-violet/40 rounded-full animate-ping"
                style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-accent-pink/40 rounded-full animate-ping"
                style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>
    );
}
