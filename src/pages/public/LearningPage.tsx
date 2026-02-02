import React from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen,
    Code,
    Brain,
    Trophy,
    Terminal,
    Cpu,
    Layers,
    Globe,
    ArrowRight,
    PlayCircle,
    FileText,
    MessageSquare
} from 'lucide-react';

export const LearningPage: React.FC = () => {
    const tracks = [
        {
            title: 'Full-Stack Mastery',
            icon: <Globe className="w-6 h-6" />,
            modules: '12 Modules',
            level: 'Absolute Beginner',
            color: 'bg-blue-500/20 text-blue-600',
            description: 'Master modern web development from HTML/CSS to advanced React and Node.js.'
        },
        {
            title: 'DSA & Algorithms',
            icon: <Code className="w-6 h-6" />,
            modules: '18 Modules',
            level: 'Intermediate',
            color: 'bg-purple-500/20 text-purple-600',
            description: 'The backbone of technical interviews. Learn efficiency, complexity, and patterns.'
        },
        {
            title: 'System Design',
            icon: <Cpu className="w-6 h-6" />,
            modules: '8 Modules',
            level: 'Advanced',
            color: 'bg-orange-500/20 text-orange-600',
            description: 'Learn how to architect scalable systems for millions of concurrent users.'
        },
        {
            title: 'Soft Skills & HR',
            icon: <MessageSquare className="w-6 h-6" />,
            modules: '6 Modules',
            level: 'All Levels',
            color: 'bg-pink-500/20 text-pink-600',
            description: 'Master the art of communication, leadership, and acing the behavioral round.'
        }
    ];

    const features = [
        {
            icon: <Brain className="w-10 h-10 text-primary" />,
            title: 'AI-Powered Path',
            description: 'Our AI analyzes your weak spots and crafts a personalized roadmap just for you.'
        },
        {
            icon: <Terminal className="w-10 h-10 text-primary" />,
            title: 'Interactive Labs',
            description: 'Code directly in your browser with our high-performance cloud environment.'
        },
        {
            icon: <Trophy className="w-10 h-10 text-primary" />,
            title: 'Mock Interviews',
            description: 'Practice with industry experts and get real-time feedback on your performance.'
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-20">
            {/* Hero Section */}
            <section className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto space-y-6"
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-text-primary">
                        A New Way to <span className="text-primary italic">Learn.</span>
                    </h1>
                    <p className="text-xl text-text-secondary leading-relaxed">
                        Stop watching, start building. Our platform combines deep theoretical knowledge with hands-on practice.
                    </p>
                </motion.div>
            </section>

            {/* Categories / Tracks */}
            <section className="container mx-auto px-4 mt-24">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Learning Tracks</h2>
                        <p className="text-text-secondary">Curated paths to lead you to your dream role.</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
                        See All Tracks <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tracks.map((track, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            className="glass-card p-1 rounded-3xl group"
                        >
                            <div className="p-6 space-y-6 bg-white/40 rounded-[1.5rem] h-full transition-colors group-hover:bg-white/60">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${track.color}`}>
                                    {track.icon}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">{track.title}</h3>
                                    <div className="flex gap-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        <span>{track.modules}</span>
                                        <span>•</span>
                                        <span>{track.level}</span>
                                    </div>
                                    <p className="text-text-secondary text-sm leading-relaxed pt-2">
                                        {track.description}
                                    </p>
                                </div>
                                <button className="flex items-center gap-2 text-sm font-bold text-primary group-hover:underline">
                                    View Roadmap <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Interactive Features */}
            <section className="mt-32 py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -skew-y-3 origin-left -z-10" />
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-12">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center space-y-6 px-4">
                                <div className="w-20 h-20 bg-white/80 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-primary/10">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold">{feature.title}</h3>
                                <p className="text-text-secondary leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Learning Experience Showcase */}
            <section className="container mx-auto px-4 mt-32">
                <div className="glass-panel p-10 md:p-20 rounded-[3rem] border-primary/10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <span className="text-accent font-bold tracking-widest uppercase text-sm">Experience</span>
                            <h2 className="text-4xl font-bold leading-tight">Master skills with <span className="text-primary italic">Immersive Content</span></h2>

                            <div className="space-y-4">
                                {[
                                    { icon: <PlayCircle />, label: '800+ HD Video Tutorials' },
                                    { icon: <FileText />, label: 'Comprehensive Documentation & Notes' },
                                    { icon: <Layers />, label: 'Step-by-Step Practical Projects' },
                                    { icon: <BookOpen />, label: 'Integrated Code Editors' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-text-secondary font-medium transition-transform hover:translate-x-2">
                                        <div className="text-primary">{item.icon}</div>
                                        {item.label}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6">
                                <button className="px-8 py-3 bg-text-primary text-white rounded-xl font-bold hover:bg-black transition-colors">
                                    Explore Sample Lessons
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-video glass-card rounded-2xl overflow-hidden p-2 relative">
                                <div className="absolute inset-0 bg-primary/20 animate-pulse flex items-center justify-center">
                                    <PlayCircle className="w-20 h-20 text-white drop-shadow-2xl" />
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80"
                                    alt="Video Player Preview"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            </div>
                            <div className="absolute -top-10 -right-10 glass-panel p-6 rounded-2xl shadow-2xl hidden md:block">
                                <div className="flex flex-col gap-2">
                                    <div className="h-4 w-32 bg-primary/20 rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-primary" />
                                    </div>
                                    <p className="text-xs font-bold">Progress: 75%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Promo CTA */}
            <section className="container mx-auto px-4 mt-32 text-center pb-10">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-4xl font-bold">Don't just take our word for it.</h2>
                    <p className="text-text-secondary">Join over 10,000 students learning today.</p>
                    <div className="flex justify-center -space-x-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <img
                                key={i}
                                className="w-12 h-12 rounded-full border-4 border-background-white object-cover"
                                src={`https://i.pravatar.cc/150?u=${i}`}
                                alt="user"
                            />
                        ))}
                    </div>
                    <p className="text-sm font-medium text-text-muted italic">"PlaceIQ changed my life. I went from knowing nothing to landing a Job at Google!"</p>
                </div>
            </section>
        </div>
    );
};
