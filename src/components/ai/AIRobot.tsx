import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface AIRobotProps {
    className?: string;
    mode?: 'active' | 'passive' | 'minimal';
}

export function AIRobot({ className, mode = 'active' }: AIRobotProps) {
    const location = useLocation();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const robotRef = useRef<HTMLDivElement>(null);

    // Context-aware adjustments
    const isLearningPage = location.pathname.includes('/learning') || location.pathname.includes('/coding');
    const isProfilePage = location.pathname.includes('/profile');

    const currentMode = isLearningPage ? 'minimal' : isProfilePage ? 'passive' : mode;

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (robotRef.current) {
                const rect = robotRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Calculate distance and normalize
                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;
                const maxDist = 1000;

                setMousePos({
                    x: (dx / maxDist) * 30, // Max rotation 30deg
                    y: (dy / maxDist) * 30
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const springX = useSpring(mousePos.x, { damping: 20, stiffness: 100 });
    const springY = useSpring(mousePos.y, { damping: 20, stiffness: 100 });

    return (
        <div
            ref={robotRef}
            className={`relative group ${className}`}
            style={{ perspective: '1000px' }}
        >
            <motion.div
                animate={{
                    y: currentMode === 'minimal' ? [0, -5, 0] : [0, -15, 0],
                    rotateX: springY.get(),
                    rotateY: springX.get(),
                }}
                transition={{
                    y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
                className="relative z-10 cursor-pointer"
            >
                {/* Robot Head */}
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                    {/* Glass outer shell */}
                    <div className="absolute inset-0 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-shadow duration-500" />

                    {/* Inner metal structure */}
                    <div className="absolute inset-[10%] rounded-[2rem] bg-gradient-to-br from-[#1A1A1A] to-[#333] shadow-inner flex items-center justify-center overflow-hidden">
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 bg-primary/10 rounded-full blur-xl transition-opacity duration-1000 ${currentMode === 'minimal' ? 'opacity-20' : 'opacity-100 animate-pulse'}`} />

                        {/* Eyes Container */}
                        <div className="flex gap-6 relative z-10 translate-y-[-5%]">
                            {/* Eye Left */}
                            <motion.div
                                style={{
                                    x: useTransform(springX, (v) => v * 0.2),
                                    y: useTransform(springY, (v) => v * 0.2)
                                }}
                                className={`w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#E0AAFF] shadow-[0_0_10px_#E0AAFF] relative flex items-center justify-center`}
                            >
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white blur-[1px]" />
                            </motion.div>

                            {/* Eye Right */}
                            <motion.div
                                style={{
                                    x: useTransform(springX, (v) => v * 0.2),
                                    y: useTransform(springY, (v) => v * 0.2)
                                }}
                                className={`w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#E0AAFF] shadow-[0_0_10px_#E0AAFF] relative flex items-center justify-center`}
                            >
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white blur-[1px]" />
                            </motion.div>
                        </div>

                        {/* Subtle Mouth Line */}
                        <div className="absolute bottom-[25%] w-8 h-[2px] bg-white/20 rounded-full" />
                    </div>

                    {/* Antenna / Sensor */}
                    <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full blur-[6px]"
                    />
                </div>

                {/* Hover Glow Base */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[60%] h-4 bg-primary/20 blur-xl rounded-full scale-x-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            {/* Context Tooltip (Passive Mode) */}
            {currentMode !== 'minimal' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute -top-16 left-0 right-0 text-center pointer-events-none"
                >
                    <div className="inline-block px-4 py-2 bg-text-primary text-white text-xs font-bold rounded-2xl shadow-xl glass-card border-white/10">
                        PlaceIQ AI Assistant
                    </div>
                </motion.div>
            )}
        </div>
    );
}
