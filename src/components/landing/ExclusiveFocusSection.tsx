import { Brain, Target, Zap } from 'lucide-react';

export function ExclusiveFocusSection() {
    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-md border border-violet-100">
                        <Target className="w-4 h-4 text-violet-600" />
                        <span className="text-sm font-semibold text-violet-700">Exclusively for AI & DS</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-[family-name:var(--font-display)]">
                        Built <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Exclusively</span> for You
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-[family-name:var(--font-sans)]">
                        PlaceIQ is laser-focused on Artificial Intelligence and Data Science students. Every feature, every course, every challenge is tailored to your domain.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Card 1 */}
                    <div className="group glass-card rounded-3xl p-8 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 hover:-translate-y-2 border border-white/50">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-violet-500/20">
                            <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 font-[family-name:var(--font-display)]">AI & DS Curriculum</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Curated learning paths covering Machine Learning, Deep Learning, NLP, Computer Vision, and all essential AI/DS domains.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="group glass-card rounded-3xl p-8 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 hover:-translate-y-2 border border-white/50">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-sky-500/20">
                            <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 font-[family-name:var(--font-display)]">Industry-Aligned Skills</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Practice problems and projects that mirror real-world AI/DS challenges faced by top tech companies.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="group glass-card rounded-3xl p-8 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500 hover:-translate-y-2 border border-white/50">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-rose-500/20">
                            <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 font-[family-name:var(--font-display)]">Placement-First Approach</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Every feature is designed with one goal: getting you placed in top AI/DS roles at leading companies.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
