import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { AIBrainIllustration } from './AIBrainIllustration';

export function NewHeroSection() {
    return (
        <section className="relative pt-24 pb-20 overflow-hidden">
            {/* Subtle gradient waves background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
                        style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent-violet/10 rounded-full blur-3xl animate-pulse"
                        style={{ animationDuration: '10s', animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-pink/5 rounded-full blur-3xl animate-pulse"
                        style={{ animationDuration: '12s', animationDelay: '4s' }} />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - Content */}
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-sm">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent-violet bg-clip-text text-transparent">
                                AI & Data Science Exclusive Platform
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                            <span className="text-text-primary">Where AI & Data Science</span>
                            <br />
                            <span className="text-text-primary">Students Become</span>
                            <br />
                            <span className="bg-gradient-to-r from-primary via-accent-violet to-accent-pink bg-clip-text text-transparent">
                                Placement-Ready
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-xl">
                            Master coding in Python & Java, learn ML, DSA, SQL, and AI tools—all powered by intelligent tracking,
                            AI chatbot assistance, and personalized placement recommendations.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Link to="/register-student">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-primary to-accent-violet hover:shadow-2xl transition-all duration-300 animate-glow group"
                                >
                                    Start Your Journey
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/about">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto px-8 py-6 text-lg glass-card border-2 border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                                >
                                    <Zap className="w-5 h-5 mr-2" />
                                    Explore Features
                                </Button>
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-8 pt-4">
                            <div className="space-y-1">
                                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent-violet bg-clip-text text-transparent">
                                    AI-Powered
                                </p>
                                <p className="text-sm text-text-muted font-medium">Smart Learning</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold bg-gradient-to-r from-accent-violet to-accent-pink bg-clip-text text-transparent">
                                    2 Pillars
                                </p>
                                <p className="text-sm text-text-muted font-medium">Coding + Courses</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold bg-gradient-to-r from-accent-pink to-primary bg-clip-text text-transparent">
                                    100% Focus
                                </p>
                                <p className="text-sm text-text-muted font-medium">AI & DS Students</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - AI Brain Illustration */}
                    <div className="relative h-[500px] lg:h-[600px] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <AIBrainIllustration />
                    </div>
                </div>
            </div>
        </section>
    );
}
