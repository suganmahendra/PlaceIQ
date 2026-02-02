
import { BookOpen, TrendingUp, CheckCircle } from 'lucide-react';

export function HowItWorksSection() {
    const steps = [
        {
            num: '01',
            title: 'Learn',
            desc: 'Master concepts with curated video content and resources tailored to your goals.',
            icon: BookOpen,
            color: 'bg-blue-100 text-blue-600'
        },
        {
            num: '02',
            title: 'Level Up',
            desc: 'Practice with quizzes, challenges, and projects to earn XP and build your profile.',
            icon: TrendingUp,
            color: 'bg-purple-100 text-primary'
        },
        {
            num: '03',
            title: 'Get Recommended',
            desc: 'Unlock job opportunities perfectly matched to your skill profile and performance.',
            icon: CheckCircle,
            color: 'bg-green-100 text-green-600'
        }
    ];

    return (
        <section className="py-24 bg-background-light/30 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-text-primary">How It Works</h2>
                    <p className="text-lg text-text-secondary">Your journey from student to professional in 3 simple steps.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Desktop only) */}
                    <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent -z-10 border-t-2 border-dashed border-gray-300" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center group">
                            <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center mb-6 shadow-md text-2xl font-bold relative z-10 border-4 border-white transition-transform group-hover:scale-110 duration-300`}>
                                <step.icon className="w-8 h-8" />
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full hover:shadow-lg transition-shadow">
                                <span className="text-4xl font-black text-gray-100 absolute top-20 right-8 -z-10 select-none">{step.num}</span>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-gray-500">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
