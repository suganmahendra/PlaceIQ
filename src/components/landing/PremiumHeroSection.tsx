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

            {/* Clean Modern Gradient Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/40 via-transparent to-transparent pointer-events-none" />

            {/* Subtle animated gradient waves - Refined */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-200/20 via-sky-100/10 to-blue-200/20 animate-pulse"
                    style={{ animationDuration: '6s' }}
                />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
                    {/* Left Content */}
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Badge - Sleek and Modern */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-violet-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
                            <Brain className="w-3.5 h-3.5 text-violet-600" />
                            <span className="text-xs font-bold tracking-wide uppercase text-violet-700">
                                AI-Powered Placement Platform
                            </span>
                        </div>

                        {/* Main Headline - Space Grotesk Font */}
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl lg:text-7xl font-bold leading-tight tracking-tight font-[family-name:var(--font-display)]">
                                <span className="text-slate-900">Where </span>
                                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent pb-2 inline-block">
                                    AI & Data Science
                                </span>
                                <br />
                                <span className="text-slate-900">Students Become</span>
                                <br />
                                <span className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-500 bg-clip-text text-transparent pb-2 inline-block">
                                    Placement-Ready
                                </span>
                            </h1>
                        </div>

                        {/* Subheadline - Outfit Font */}
                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl font-[family-name:var(--font-sans)]">
                            Master coding, conquer courses, and leverage AI intelligence to accelerate your journey from student to industry-ready professional.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/register">
                                <Button
                                    size="lg"
                                    className="group w-full sm:w-auto px-8 py-6 text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 transition-all duration-300 border-0 rounded-2xl"
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
                                <div className="text-3xl font-bold font-[family-name:var(--font-display)] bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                    AI-Driven
                                </div>
                                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Smart Learning</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold font-[family-name:var(--font-display)] bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                                    2 Pillars
                                </div>
                                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Coding + Courses</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-bold font-[family-name:var(--font-display)] bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                                    100% Ready
                                </div>
                                <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Placement Focus</div>
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
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
                    </div>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
        </section>
    );
}
