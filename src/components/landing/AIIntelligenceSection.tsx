import { Bot, Gauge, Focus, TrendingUp } from 'lucide-react';

export function AIIntelligenceSection() {
    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card shadow-md">
                        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                        <span className="text-sm font-semibold text-violet-700">Powered by AI</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                        <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">AI-Powered</span> Intelligence
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Smart features that understand your learning patterns, adapt to your pace, and guide you toward placement success.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {/* Feature 1 */}
                    <div className="glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Bot className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Chatbot</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            24/7 intelligent assistant to answer questions, explain concepts, and guide your learning journey.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Gauge className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Level Detection</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Automatic skill assessment that places you at the right difficulty level and tracks your growth.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-fuchsia-500/10 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Focus className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Focus Tracking</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Monitor your engagement patterns and receive insights to optimize your study sessions.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="glass-card rounded-2xl p-6 hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1 group">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Analytics</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Deep insights into your progress, strengths, weaknesses, and personalized improvement recommendations.
                        </p>
                    </div>
                </div>

                {/* Additional highlight */}
                <div className="mt-12 max-w-4xl mx-auto glass-card rounded-3xl p-8 text-center">
                    <p className="text-gray-700 text-lg leading-relaxed">
                        <span className="font-bold text-purple-700">Every interaction is tracked and analyzed</span> to provide you with actionable insights that accelerate your learning and maximize your placement potential.
                    </p>
                </div>
            </div>
        </section>
    );
}
