import { Code, BookOpen, Brain, Target, TrendingUp, Users } from 'lucide-react';

export function PlatformFeaturesSection() {
    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

            <div className="container mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16 space-y-4 animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
                        Built Exclusively for{' '}
                        <span className="bg-gradient-to-r from-primary to-accent-violet bg-clip-text text-transparent">
                            AI & Data Science
                        </span>
                    </h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        A comprehensive platform designed specifically for AI & DS students to master skills and land their dream placements
                    </p>
                </div>

                {/* Two Core Pillars */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* Pillar 1: Coding */}
                    <div className="glass-card p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-accent-violet flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Code className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-4">Pillar 1: Coding Mastery</h3>
                        <p className="text-text-secondary mb-6 leading-relaxed">
                            Practice and perfect your coding skills with comprehensive modules in Python and Java.
                            From basics to advanced algorithms, we've got you covered.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                                <span className="text-text-secondary">Python fundamentals to advanced libraries</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                                <span className="text-text-secondary">Java programming with OOP concepts</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                                <span className="text-text-secondary">Real-time code execution and feedback</span>
                            </li>
                        </ul>
                    </div>

                    {/* Pillar 2: Courses */}
                    <div className="glass-card p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-violet to-accent-pink flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-4">Pillar 2: Structured Courses</h3>
                        <p className="text-text-secondary mb-6 leading-relaxed">
                            Learn essential topics through carefully curated courses designed for AI & DS placement success.
                            Track your progress and earn certificates.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-accent-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-accent-violet" />
                                </div>
                                <span className="text-text-secondary">Machine Learning & Deep Learning</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-accent-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-accent-violet" />
                                </div>
                                <span className="text-text-secondary">Data Structures & Algorithms</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-accent-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-accent-violet" />
                                </div>
                                <span className="text-text-secondary">SQL, AI Tools & Industry Skills</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* AI-Powered Intelligence Features */}
                <div className="glass-card p-8 md:p-12 rounded-2xl shadow-xl mb-16">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent-violet/10 mb-4">
                            <Brain className="w-5 h-5 text-primary" />
                            <span className="text-sm font-semibold text-primary">AI-Powered Intelligence</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                            Smart Features That Adapt to You
                        </h3>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Our AI-powered platform learns from your behavior and provides personalized guidance
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* AI Chatbot */}
                        <div className="p-6 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-300 hover:shadow-lg group">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent-violet flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-text-primary mb-2">AI Chatbot</h4>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Get instant answers, coding help, and career guidance from our intelligent AI assistant
                            </p>
                        </div>

                        {/* Level Detection */}
                        <div className="p-6 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-300 hover:shadow-lg group">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-violet to-accent-pink flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-text-primary mb-2">Level Detection</h4>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Automatic skill assessment that adapts content difficulty based on your performance
                            </p>
                        </div>

                        {/* Focus Tracking */}
                        <div className="p-6 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-300 hover:shadow-lg group">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-pink to-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold text-text-primary mb-2">Focus Tracking</h4>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Monitor your learning patterns and get insights on how to optimize your study time
                            </p>
                        </div>
                    </div>
                </div>

                {/* Placement Readiness */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-sm font-semibold text-primary">Placement Ready</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-text-primary">
                            Your Path to{' '}
                            <span className="bg-gradient-to-r from-primary to-accent-violet bg-clip-text text-transparent">
                                Dream Placements
                            </span>
                        </h3>
                        <p className="text-lg text-text-secondary leading-relaxed">
                            Get personalized job recommendations based on your skills, progress, and career goals.
                            Our intelligent matching system connects you with opportunities that fit your profile perfectly.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-text-primary">Smart Job Matching</p>
                                    <p className="text-sm text-text-secondary">AI-powered recommendations based on your skills</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-accent-violet/10 flex items-center justify-center flex-shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-accent-violet" />
                                </div>
                                <div>
                                    <p className="font-semibold text-text-primary">Progress Analytics</p>
                                    <p className="text-sm text-text-secondary">Track your readiness with detailed insights</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-accent-pink/10 flex items-center justify-center flex-shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-accent-pink" />
                                </div>
                                <div>
                                    <p className="font-semibold text-text-primary">Interview Preparation</p>
                                    <p className="text-sm text-text-secondary">Company-specific prep materials and mock tests</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent-violet bg-clip-text text-transparent mb-2">
                                95%
                            </p>
                            <p className="text-sm text-text-secondary font-medium">Placement Rate</p>
                        </div>
                        <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <p className="text-4xl font-bold bg-gradient-to-r from-accent-violet to-accent-pink bg-clip-text text-transparent mb-2">
                                500+
                            </p>
                            <p className="text-sm text-text-secondary font-medium">Partner Companies</p>
                        </div>
                        <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <p className="text-4xl font-bold bg-gradient-to-r from-accent-pink to-primary bg-clip-text text-transparent mb-2">
                                10K+
                            </p>
                            <p className="text-sm text-text-secondary font-medium">Active Students</p>
                        </div>
                        <div className="glass-card p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent-violet bg-clip-text text-transparent mb-2">
                                4.9/5
                            </p>
                            <p className="text-sm text-text-secondary font-medium">Student Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
