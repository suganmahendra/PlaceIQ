import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Code2, Sparkles, Brain, Cpu, Binary, Calculator, BarChart3, Network, Database, GitBranch, Lightbulb, type LucideIcon } from 'lucide-react';
import { CourseCard } from '../../components/courses/CourseCard';
import { LanguageCard } from '../../components/coding/LanguageCard';
import { coursesData } from '../../data/coursesData';

const iconMap: Record<string, LucideIcon> = {
    Binary, Calculator, BarChart3, Brain, Network, Database, GitBranch, Lightbulb
};

// Mock Data for Coding Progress (Moving from CodingHomePage)
const pythonProgress = {
    language: 'Python' as const,
    progress: 72,
    conceptsCompleted: 45,
    totalConcepts: 70,
    performanceLevel: 'Bright' as const,
    streakDays: 12,
    lastActivity: new Date('2026-02-04'),
};

const javaProgress = {
    language: 'Java' as const,
    progress: 30,
    conceptsCompleted: 18,
    totalConcepts: 60,
    performanceLevel: 'Average' as const,
    streakDays: 5,
    lastActivity: new Date('2026-02-03'),
};

export const LearningPathPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'coding' | 'courses'>('coding');

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-8 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] animate-float" />
            </div>

            {/* Header */}
            <div className="text-center space-y-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 shadow-sm mb-2"
                >
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI-Powered Learning</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-gray-900"
                >
                    Your <span className="text-primary italic font-serif">Learning Path</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 text-lg max-w-2xl mx-auto"
                >
                    A unified journey to master both coding fundamentals and advanced AI courses.
                </motion.p>
            </div>

            {/* Path Switching Tabs */}
            <div className="flex justify-center mb-12">
                <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-lg relative">
                    {/* Sliding Background */}
                    <motion.div
                        layoutId="activeTab"
                        className={`absolute top-1.5 bottom-1.5 rounded-xl bg-white shadow-md z-0 transition-colors duration-300 ${activeTab === 'coding' ? 'left-1.5 w-[calc(50%-6px)]' : 'left-[calc(50%+3px)] w-[calc(50%-6px)]'
                            }`}
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />

                    <button
                        onClick={() => setActiveTab('coding')}
                        className={`relative z-10 px-8 py-3 rounded-xl flex items-center gap-2 font-semibold transition-colors duration-300 ${activeTab === 'coding' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Code2 className="w-5 h-5" />
                        Coding
                    </button>
                    <button
                        onClick={() => setActiveTab('courses')}
                        className={`relative z-10 px-8 py-3 rounded-xl flex items-center gap-2 font-semibold transition-colors duration-300 ${activeTab === 'courses' ? 'text-accent' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <BookOpen className="w-5 h-5" />
                        Courses
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {activeTab === 'coding' ? (
                    <motion.div
                        key="coding"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-6xl mx-auto"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <Cpu className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Coding Mastery</h2>
                                <p className="text-gray-500 text-sm">Practice essential programming languages</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <LanguageCard
                                {...pythonProgress}
                                link="/student/coding/python"
                            />
                            <LanguageCard
                                {...javaProgress}
                                link="/student/coding/java"
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="courses"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-accent/10 rounded-xl">
                                <Brain className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Specialized Courses</h2>
                                <p className="text-gray-500 text-sm">Deep dive into AI, Data Science, and more</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coursesData.map((course) => {
                                const IconComponent = (course.icon && iconMap[course.icon]) ? iconMap[course.icon] : BookOpen;
                                return (
                                    <CourseCard
                                        key={course.id}
                                        {...course}
                                        icon={IconComponent}
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

