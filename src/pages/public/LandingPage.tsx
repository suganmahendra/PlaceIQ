
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '../../components/landing/HeroSection';
import { FeaturesSection } from '../../components/landing/FeaturesSection';
import { HowItWorksSection } from '../../components/landing/HowItWorksSection';
import { Button } from '../../components/ui/Button';

export function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />

            {/* CTA Banner Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto">
                    <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-10 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Kickstart Your Career?</h2>
                            <p className="text-lg md:text-xl text-white/90 mb-10">
                                Join thousands of students who are already using PlaceIQ to land their dream jobs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register-student">
                                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg border-0 w-full sm:w-auto h-14 text-lg">
                                        Get Started Now
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
