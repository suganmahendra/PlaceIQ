import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Shield, Rocket, Heart, Zap } from 'lucide-react';

export const AboutPage: React.FC = () => {
    const stats = [
        { label: 'Students Helped', value: '50,000+' },
        { label: 'Mentors Onboard', value: '1,200+' },
        { label: 'Success Rate', value: '94%' },
        { label: 'Partner Companies', value: '300+' },
    ];

    const values = [
        {
            icon: <Target className="w-8 h-8 text-primary" />,
            title: 'Precision Learning',
            description: 'We believe in laser-focused curriculum that targets the exact skills industry leaders are looking for.'
        },
        {
            icon: <Users className="w-8 h-8 text-primary" />,
            title: 'Community First',
            description: 'Education is a shared journey. Our platform fosters deep connections between mentors and aspirants.'
        },
        {
            icon: <Shield className="w-8 h-8 text-primary" />,
            title: 'Authentic Guidance',
            description: 'No fluff. Just real-world insights from professionals who have been where you are today.'
        },
        {
            icon: <Rocket className="w-8 h-8 text-primary" />,
            title: 'Innovation Driven',
            description: 'We leverage AI and modern pedagogy to make complex concepts intuitive and accessible.'
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 overflow-hidden">
            {/* Hero Section */}
            <section className="container mx-auto px-4 relative">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
                            Our Journey
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-text-primary leading-tight">
                            Empowering the next generation of <span className="text-primary italic font-serif">Tech Leaders</span>.
                        </h1>
                        <p className="mt-6 text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
                            PlaceIQ was born from a simple observation: the gap between academic knowledge and industry readiness is wider than ever. We're here to bridge it.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-4 mt-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-8 text-center rounded-3xl"
                        >
                            <h3 className="text-3xl font-bold text-primary mb-2">{stat.value}</h3>
                            <p className="text-text-secondary font-medium uppercase tracking-wider text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <section className="container mx-auto px-4 mt-32">
                <div className="glass-panel rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -m-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 -m-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" />

                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold text-text-primary">Our Mission & Vision</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                                        <Heart className="text-primary w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Human-Centric Tech</h3>
                                        <p className="text-text-secondary leading-relaxed">
                                            We prioritize the human element in technology education. Mentorship isn't just about sharing code; it's about building confidence and character.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center shrink-0">
                                        <Zap className="text-accent w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Accelerated Growth</h3>
                                        <p className="text-text-secondary leading-relaxed">
                                            Our platform is designed to slash the time it takes to become job-ready, focusing on productivity and high-impact skills.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl overflow-hidden glass-card p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                                    alt="Team collaboration"
                                    className="w-full h-full object-cover rounded-2xl opacity-90"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-2xl animate-bounce-slow">
                                <p className="text-sm font-bold text-primary">Trust by 100+ Universities</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="container mx-auto px-4 mt-32">
                <h2 className="text-4xl font-bold text-center mb-16">The Values that <span className="text-primary">Drive Us</span></h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-10 rounded-[2.5rem] hover:-translate-y-2 transition-transform duration-300 group"
                        >
                            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                {value.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                            <p className="text-text-secondary leading-relaxed">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 mt-32 mb-20 text-center">
                <div className="glass-panel p-16 rounded-[3rem] border-primary/20">
                    <h2 className="text-4xl font-bold mb-6">Ready to start your journey?</h2>
                    <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
                        Join thousands of students who are already shaping their future with PlaceIQ.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="px-10 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/25">
                            Get Started Now
                        </button>
                        <button className="px-10 py-4 glass-card rounded-2xl font-bold hover:bg-white/50 transition-colors">
                            Talk to a Mentor
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
