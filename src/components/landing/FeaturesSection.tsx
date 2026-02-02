
import { Target, TrendingUp, Users, Brain, MessageSquare, Award } from 'lucide-react';

const features = [
    {
        icon: Target,
        title: 'AI Skill Tracking',
        description: 'Get real-time analysis of your strengths and weaknesses with our advanced AI algorithms.'
    },
    {
        icon: TrendingUp,
        title: 'Learning Paths',
        description: 'Customized structured roadmaps to guide you from beginner to expert in any domain.'
    },
    {
        icon: Award,
        title: 'Gamification',
        description: 'Earn XP, badges, and compete on leaderboards to make learning addictive and fun.'
    },
    {
        icon: Users,
        title: 'Placement Recommendations',
        description: 'Smart job matching based on your skill profile and performance analytics.'
    },
    {
        icon: MessageSquare,
        title: 'Smart Chatbot',
        description: '24/7 AI mentor to answer your doubts and guide your preparation journey.'
    },
    {
        icon: Brain,
        title: 'Mock Interviews',
        description: 'Practice with AI-driven mock interviews and get instant feedback on your performance.'
    }
];

export function FeaturesSection() {
    return (
        <section className="py-24 bg-white relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text-primary">Why Choose <span className="text-primary">PlaceIQ?</span></h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Everything you need to crack your dream placement, all in one intelligent platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="w-14 h-14 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center mb-6 transition-colors">
                                <feature.icon className="w-7 h-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
