import { Bot, Gauge, Focus, TrendingUp } from 'lucide-react';

export function AIIntelligenceSection() {
    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-md border border-violet-100">
                        <div className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
                        <span className="text-sm font-semibold text-violet-700">Powered by AI</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-[family-name:var(--font-display)]">
                        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">AI-Powered</span> Intelligence
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-[family-name:var(--font-sans)]">
                        Smart features that understand your learning patterns, adapt to your pace, and guide you toward placement success.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {/* Feature 1 */}
                    <div className="glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1 group border border-white/50">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-violet-500/20">
                            <Bot className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 font-[family-name:var(--font-display)]">AI Chatbot</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            24/7 intelligent assistant to answer questions, explain concepts, and guide your learning journey.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 hover:-translate-y-1 group border border-white/50">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-sky-500/20">
                            <Gauge className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 font-[family-name:var(--font-display)]">Level Detection</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Automatic skill assessment that places you at the right difficulty level and tracks your growth.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 hover:-translate-y-1 group border border-white/50">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-rose-500/20">
                            <Focus className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 font-[family-name:var(--font-display)]">Focus Tracking</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Monitor your engagement patterns and receive insights to optimize your study sessions.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 group border border-white/50">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
                            <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 font-[family-name:var(--font-display)]">Smart Analytics</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Deep insights into your progress, strengths, weaknesses, and personalized improvement recommendations.
                        </p>
                    </div>
                </div>

                {/* Additional highlight */}
                <div className="mt-12 max-w-4xl mx-auto glass-card rounded-3xl p-8 text-center">
                    <p className="text-slate-700 text-lg leading-relaxed font-[family-name:var(--font-sans)]">
                        <span className="font-bold text-violet-700">Every interaction is tracked and analyzed</span> to provide you with actionable insights that accelerate your learning and maximize your placement potential.
                    </p>
                </div>
            </div>
        </section>
    );
}
