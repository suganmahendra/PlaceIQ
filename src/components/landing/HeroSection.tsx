
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '5s' }} />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 mb-8 shadow-sm">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-primary">AI-Powered Placement Readiness</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-text-primary mb-6 max-w-4xl mx-auto leading-tight">
                    Level Up Your Skills with <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-primary via-accent to-accent-pink bg-clip-text text-transparent">PlaceIQ Intelligence</span>
                </h1>

                <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
                    The ultimate platform for students to master placement skills through AI-driven insights, gamified learning paths, and smart recommendations.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/register-student">
                        <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg shadow-primary/25 hover:shadow-primary/40">
                            Get Started as Student
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                    <Link to="/register-mentor">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-lg bg-white/50 backdrop-blur-sm">
                            Join as Mentor
                        </Button>
                    </Link>
                </div>

                {/* Hero Image / UI Mockup Placeholder */}
                <div className="mt-20 relative mx-auto max-w-5xl perspective-1000">
                    <div className="relative rounded-2xl overflow-hidden glass-card p-2 md:p-3 shadow-2xl border border-white/50 bg-white/40 backdrop-blur-xl transform rotate-x-2 transition-transform hover:rotate-x-0 duration-700">
                        <div className="aspect-video bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner">
                            {/* Mock UI content */}
                            <div className="absolute inset-0 flex items-center justify-center text-text-muted z-10">
                                <div className="flex flex-col items-center gap-4 bg-white/80 p-6 rounded-2xl backdrop-blur-sm shadow-lg border border-white">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Play className="w-8 h-8 fill-primary text-primary ml-1" />
                                    </div>
                                    <span className="font-semibold text-lg text-primary">Interactive Demo</span>
                                </div>
                            </div>

                            {/* Decorative elements representing dashboard UI */}
                            <div className="absolute top-0 left-0 right-0 h-16 border-b border-gray-100 bg-white/50 px-6 flex items-center gap-4">
                                <div className="w-32 h-4 bg-gray-200 rounded-full"></div>
                                <div className="flex-1"></div>
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            </div>

                            <div className="absolute top-20 left-6 w-64 bottom-6 bg-white border border-gray-100 rounded-xl shadow-sm p-4 space-y-4">
                                <div className="w-24 h-4 bg-gray-100 rounded"></div>
                                <div className="w-full h-8 bg-primary/5 rounded"></div>
                                <div className="w-full h-8 bg-gray-50 rounded"></div>
                                <div className="w-full h-8 bg-gray-50 rounded"></div>
                            </div>

                            <div className="absolute top-20 left-76 right-6 bottom-6 space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/10"></div>
                                    <div className="h-24 bg-white border border-gray-100 rounded-xl shadow-sm"></div>
                                    <div className="h-24 bg-white border border-gray-100 rounded-xl shadow-sm"></div>
                                </div>
                                <div className="h-40 bg-white border border-gray-100 rounded-xl shadow-sm"></div>
                            </div>
                        </div>
                    </div>

                    {/* Floating badge */}
                    <div className="absolute -top-6 -right-6 md:-right-10 bg-white p-4 rounded-2xl shadow-xl glass-panel animate-bounce" style={{ animationDuration: '3s' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                                98%
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Placement Rate</p>
                                <p className="font-bold text-gray-900">Success</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white p-4 rounded-2xl shadow-xl glass-panel animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">AI Powered</p>
                                <p className="font-bold text-gray-900">Insights</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
