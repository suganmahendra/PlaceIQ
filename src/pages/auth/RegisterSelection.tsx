import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export function RegisterSelection() {
    return (
        <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        x: [0, -50, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px]"
                />
            </div>

            <div className="max-w-4xl w-full text-center space-y-4 mb-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-4">
                        Get Started
                    </span>
                    <h1 className="text-5xl md:text-6xl font-bold text-text-primary leading-tight">
                        Choose Your <span className="text-primary italic font-serif">Path</span>
                    </h1>
                    <p className="mt-6 text-xl text-text-secondary max-w-2xl mx-auto">
                        Whether you're looking to launch your career or guide the next generation, we have the right tools for you.
                    </p>
                </motion.div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
                {/* Student Card */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <Link to="/register-student" className="group block h-full">
                        <div className="glass-panel h-full p-10 rounded-[3rem] border-primary/10 hover:border-primary/40 transition-all duration-500 relative overflow-hidden group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/10">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <GraduationCap className="w-56 h-56 text-primary" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
                                    <UserCheck className="w-8 h-8" />
                                </div>

                                <div className="mt-8">
                                    <h2 className="text-3xl font-bold mb-4">Student</h2>
                                    <p className="text-text-secondary leading-relaxed mb-8">
                                        Personalized learning paths, AI-driven mock interviews, and direct access to top recruiters.
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-10 mt-auto">
                                    {['Personalized Roadmaps', 'AI Mock Interviews', 'Company Specific Prep'].map((feat) => (
                                        <li key={feat} className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
                                            <div className="w-2 h-2 rounded-full bg-primary" /> {feat}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-6 flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                                    Register as Student <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>

                {/* Mentor Card */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <Link to="/register-mentor" className="group block h-full">
                        <div className="glass-panel h-full p-10 rounded-[3rem] border-accent/10 hover:border-accent/40 transition-all duration-500 relative overflow-hidden group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-accent/10">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Briefcase className="w-56 h-56 text-accent" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl shadow-accent/5">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>

                                <div className="mt-8">
                                    <h2 className="text-3xl font-bold mb-4">Mentor</h2>
                                    <p className="text-text-secondary leading-relaxed mb-8">
                                        Share your expertise, guide future talent, and build your brand as an industry leader.
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-10 mt-auto">
                                    {['Profile Management', 'Session Automation', 'Student Performance Data'].map((feat) => (
                                        <li key={feat} className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
                                            <div className="w-2 h-2 rounded-full bg-accent" /> {feat}
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-6 flex items-center gap-2 text-accent font-bold group-hover:gap-4 transition-all">
                                    Apply as Mentor <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-16 text-center space-y-4"
            >
                <p className="text-text-secondary font-medium">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">Log in here</Link>
                </p>
                <Link to="/" className="inline-block text-sm text-text-muted hover:text-primary transition-colors">
                    ← Back to homepage
                </Link>
            </motion.div>
        </div>
    );
}
