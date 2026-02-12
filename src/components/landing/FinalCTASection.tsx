import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export function FinalCTASection() {
    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-indigo-700 to-fuchsia-700 opacity-95" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

            <div className="container mx-auto relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-sm font-semibold text-white">Join the AI & DS Revolution</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        Ready to Transform Your
                        <br />
                        Placement Journey?
                    </h2>

                    {/* Subheadline */}
                    <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of AI & Data Science students who are already using PlaceIQ to land their dream jobs at top tech companies.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link to="/register">
                            <Button
                                size="lg"
                                className="group w-full sm:w-auto px-10 py-7 text-lg bg-white text-purple-700 hover:bg-gray-50 shadow-2xl hover:shadow-white/20 transition-all duration-300 border-0 font-bold"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/learning-preview">
                            <Button
                                variant="outline"
                                size="lg"
                                className="group w-full sm:w-auto px-10 py-7 text-lg bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-semibold"
                            >
                                Explore Platform
                            </Button>
                        </Link>
                    </div>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap justify-center gap-8 pt-8 text-white/80">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-sm font-medium">Free to Start</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-400" />
                            <span className="text-sm font-medium">No Credit Card</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-400" />
                            <span className="text-sm font-medium">AI-Powered</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
