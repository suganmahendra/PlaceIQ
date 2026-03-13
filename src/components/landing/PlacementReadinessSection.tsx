import { Briefcase, Target, TrendingUp } from 'lucide-react';

export function PlacementReadinessSection() {
    return (
        <section className="py-20 px-4 bg-gradient-to-b from-purple-50/30 to-white">
            <div className="container mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-md border border-violet-100">
                        <Briefcase className="w-4 h-4 text-violet-600" />
                        <span className="text-sm font-semibold text-violet-700">Career Success</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-[family-name:var(--font-display)]">
                        Your Path to <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Placement Success</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-[family-name:var(--font-sans)]">
                        From skill building to job matching, we guide you through every step of your placement journey.
                    </p>
                </div>

                {/* Main Feature Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                    {/* Job Matching */}
                    <div className="glass-card rounded-3xl p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 group">
                        <div className="flex items-start gap-6 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2 font-[family-name:var(--font-display)]">Smart Job Matching</h3>
                                <p className="text-slate-600">AI-powered recommendations based on your skills and interests</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-purple-500" />
                                <span className="text-slate-700">Personalized company recommendations</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-violet-500" />
                                <span className="text-slate-700">Role compatibility scoring</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-fuchsia-500" />
                                <span className="text-slate-700">Skill gap analysis</span>
                            </div>
                        </div>
                    </div>

                    {/* Readiness Score */}
                    <div className="glass-card rounded-3xl p-8 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 group">
                        <div className="flex items-start gap-6 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2 font-[family-name:var(--font-display)]">Readiness Score</h3>
                                <p className="text-slate-600">Real-time assessment of your placement preparedness</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-violet-500" />
                                <span className="text-slate-700">Comprehensive skill evaluation</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-fuchsia-500" />
                                <span className="text-slate-700">Progress tracking dashboard</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-pink-500" />
                                <span className="text-slate-700">Actionable improvement tips</span>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
}
