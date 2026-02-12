import { Code2, BookOpen, CheckCircle2 } from 'lucide-react';

export function TwoPillarsSection() {
    return (
        <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50/30">
            <div className="container mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Two Core <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Pillars</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Master both technical coding skills and comprehensive domain knowledge to become a complete AI/DS professional.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Pillar 1: Coding */}
                    <div className="glass-card rounded-3xl p-10 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 group">
                        <div className="flex items-start gap-6 mb-8">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Code2 className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">Coding Mastery</h3>
                                <p className="text-gray-600">Build strong programming foundations</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-emerald-700 font-bold text-lg">Py</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg mb-1">Python Programming</h4>
                                    <p className="text-gray-600 text-sm">
                                        Master Python with 100+ problems covering basics to advanced concepts, data structures, and algorithms.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-teal-700 font-bold text-lg">Jv</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg mb-1">Java Programming</h4>
                                    <p className="text-gray-600 text-sm">
                                        Strengthen your Java skills with OOP concepts, collections, and enterprise-level problem solving.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">DSA</span>
                                    <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">Algorithms</span>
                                    <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold">Problem Solving</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pillar 2: Courses */}
                    <div className="glass-card rounded-3xl p-10 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 group">
                        <div className="flex items-start gap-6 mb-8">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2">Course Library</h3>
                                <p className="text-gray-600">Comprehensive AI/DS knowledge base</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                'Machine Learning Fundamentals',
                                'Deep Learning & Neural Networks',
                                'Data Structures & Algorithms',
                                'SQL & Database Management',
                                'AI Tools & Frameworks',
                                'Statistics & Probability'
                            ].map((course, index) => (
                                <div key={index} className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform duration-200">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <span className="text-gray-700 font-medium">{course}</span>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Video Lectures</span>
                                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">Quizzes</span>
                                    <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">Certificates</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
