import { useState } from 'react';
import { cn } from '../../lib/utils';

export function LavenderPlants() {
    const [plants] = useState(() => {
        return Array.from({ length: 40 }).map((_, i) => {
            const flowers = Array.from({ length: 14 }).map(() => ({
                widthAdd: Math.random() * 4,
                opacity: 0.8 + Math.random() * 0.2,
                rotation: Math.random() * 360
            }));

            const leaves = Array.from({ length: 5 }).map(() => ({
                width: 8 + Math.random() * 8
            }));

            return {
                id: i,
                height: 120 + Math.random() * 120,
                delay: Math.random() * -15,
                duration: 7 + Math.random() * 5,
                rotation: Math.random() * 6 - 3,
                scale: 0.8 + Math.random() * 0.4,
                opacity: 0.5 + Math.random() * 0.4,
                flowers,
                leaves
            };
        });
    });

    return (
        <div className="absolute bottom-0 left-0 w-full h-[30vh] pointer-events-none z-20 overflow-hidden select-none">
            <div className="absolute bottom-[-10px] left-0 w-full h-full flex items-end justify-around px-2">
                {plants.map((plant, i) => {
                    // Determine swaying animation speed class
                    const animClass = i % 3 === 0 ? "animate-sway-slow" : i % 3 === 1 ? "animate-sway-medium" : "animate-sway-fast";

                    return (
                        <div
                            key={plant.id}
                            className={cn("origin-bottom transform-gpu flex flex-col items-center", animClass)}
                            style={{
                                height: `${plant.height}px`,
                                width: '20px',
                                animationDelay: `${plant.delay}s`,
                                animationDuration: `${plant.duration}s`,
                                transform: `scale(${plant.scale}) rotate(${plant.rotation}deg)`,
                                opacity: plant.opacity,
                                filter: i % 6 === 0 ? 'blur(0.8px)' : 'none',
                            }}
                        >
                            {/* Natural Flower Head (More tapered and organic) */}
                            <div className="flex flex-col items-center -mb-2 space-y-[-6px]">
                                {plant.flowers.map((flower, j) => {
                                    const clusterWidth = (1 - (j / 14)) * 12 + 4; // Tapers towards the top
                                    return (
                                        <div
                                            key={j}
                                            className="rounded-full"
                                            style={{
                                                width: `${clusterWidth + flower.widthAdd}px`,
                                                height: `${j % 3 === 0 ? 8 : 6}px`,
                                                background: j % 3 === 0 ? '#9D4EDD' : j % 3 === 1 ? '#C6B7E2' : '#7B2CBF',
                                                opacity: flower.opacity,
                                                transform: `translateX(${(Math.sin(j * 1.5) * 3)}px) rotate(${flower.rotation}deg)`,
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            {/* Natural Stem */}
                            <div
                                className="w-[1px] md:w-[1.5px] bg-gradient-to-b from-green-600/50 to-green-800/80 rounded-full flex-grow relative"
                                style={{ height: '100%' }}
                            >
                                {/* Tiny, realistic leaves */}
                                {plant.leaves.map((leaf, k) => (
                                    <div
                                        key={k}
                                        className="absolute bg-green-700/60 rounded-full"
                                        style={{
                                            width: `${leaf.width}px`,
                                            height: '2px',
                                            top: `${20 + k * 18}%`,
                                            left: k % 2 === 0 ? '-8px' : '1px',
                                            transform: `rotate(${k % 2 === 0 ? '-40deg' : '40deg'})`,
                                            transformOrigin: k % 2 === 0 ? 'right center' : 'left center'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
