import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Brain } from 'lucide-react';
import { Button } from '../ui/Button';
import { NeuralBackground } from './NeuralBackground';
import { AIBrain3D } from './AIBrain3D';
import { FloatingDashboardCards } from './FloatingDashboardCards';

export function PremiumHeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Animated Neural Network Background */}
            <NeuralBackground />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-violet-50/50 pointer-events-none" />

            {/* Subtle animated gradient waves */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-300/20 via-transparent to-violet-300/20 animate-pulse"
                    style={{ animationDuration: '8s' }}
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
                    {/* Left Content */}
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            <Brain className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                                AI-Powered Placement Platform
                            </span>
                        </div>

                        {/* Main Headline */}
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                <span className="text-gray-900">Where </span>
                                <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    AI & Data Science
                                </span>
                                <br />
                                <span className="text-gray-900">Students Become</span>
                                <br />
                                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Placement-Ready
                                </span>
                            </h1>
                        </div>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                            Master coding, conquer courses, and leverage AI intelligence to accelerate your journey from student to industry-ready professional.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/register">
                                <Button
                                    size="lg"
                                    className="group w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 border-0"
                                >
                                    Start Your Journey
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="group w-full sm:w-auto px-8 py-6 text-lg glass-card hover:glass-panel border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 transition-all duration-300"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Explore Features
                                </Button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8 pt-8">
                            <div className="space-y-1">
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                                    AI-Driven
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Smart Learning</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    2 Pillars
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Coding + Courses</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                                    100% Ready
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Placement Focus</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="relative h-[600px] hidden lg:block">
                        {/* AI Brain Illustration */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <AIBrain3D />
                        </div>

                        {/* Floating Dashboard Cards */}
                        <FloatingDashboardCards />

                        {/* Decorative glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
                    </div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
        </section>
    );
}
