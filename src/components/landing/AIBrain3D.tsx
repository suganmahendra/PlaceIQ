export function AIBrain3D() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Main Brain Structure */}
            <div className="relative w-80 h-80 animate-float">
                {/* Brain Core */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/30 via-violet-500/20 to-fuchsia-500/30 backdrop-blur-xl border border-white/40 shadow-2xl">
                    {/* Neural pathways - animated lines */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                        {/* Left hemisphere paths */}
                        <path
                            d="M 60 80 Q 40 100 60 120"
                            fill="none"
                            stroke="url(#gradient1)"
                            strokeWidth="2"
                            className="animate-pulse"
                            style={{ animationDuration: '3s' }}
                        />
                        <path
                            d="M 50 90 Q 30 100 50 110"
                            fill="none"
                            stroke="url(#gradient1)"
                            strokeWidth="1.5"
                            className="animate-pulse"
                            style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
                        />

                        {/* Right hemisphere paths */}
                        <path
                            d="M 140 80 Q 160 100 140 120"
                            fill="none"
                            stroke="url(#gradient2)"
                            strokeWidth="2"
                            className="animate-pulse"
                            style={{ animationDuration: '3.5s' }}
                        />
                        <path
                            d="M 150 90 Q 170 100 150 110"
                            fill="none"
                            stroke="url(#gradient2)"
                            strokeWidth="1.5"
                            className="animate-pulse"
                            style={{ animationDuration: '2.8s', animationDelay: '0.3s' }}
                        />

                        {/* Central connections */}
                        <path
                            d="M 100 60 L 100 140"
                            fill="none"
                            stroke="url(#gradient3)"
                            strokeWidth="3"
                            className="animate-pulse"
                            style={{ animationDuration: '4s' }}
                        />

                        {/* Gradients */}
                        <defs>
                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
                            </linearGradient>
                            <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#D946EF" stopOpacity="0.3" />
                            </linearGradient>
                            <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.7" />
                                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.4" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Glowing nodes */}
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50 animate-pulse" />
                    <div className="absolute top-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute bottom-1/3 left-1/3 w-3.5 h-3.5 rounded-full bg-fuchsia-400 shadow-lg shadow-fuchsia-400/50 animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-pink-400 shadow-lg shadow-pink-400/50 animate-pulse" style={{ animationDelay: '1.5s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50 animate-pulse" style={{ animationDelay: '0.8s' }} />
                </div>

                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
            </div>

            {/* Orbiting particles */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '25s' }}>
                <div className="absolute top-1/2 right-0 w-2.5 h-2.5 rounded-full bg-fuchsia-400 shadow-lg shadow-fuchsia-400/50" />
            </div>
        </div>
    );
}
