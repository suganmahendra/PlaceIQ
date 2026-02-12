import { TrendingUp, Code, BookOpen } from 'lucide-react';

export function FloatingDashboardCards() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Progress Card */}
            <div
                className="absolute top-10 right-10 w-56 glass-card rounded-2xl p-4 shadow-xl animate-float"
                style={{ animationDelay: '0s', animationDuration: '6s' }}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Your Progress</p>
                        <p className="text-lg font-bold text-gray-900">Level 7</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">XP Progress</span>
                        <span className="font-semibold text-purple-600">850/1000</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-purple-500 to-violet-600 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Coding Stats Card */}
            <div
                className="absolute top-40 right-72 w-52 glass-card rounded-2xl p-4 shadow-xl animate-float"
                style={{ animationDelay: '1s', animationDuration: '7s' }}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <Code className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Coding Streak</p>
                        <p className="text-lg font-bold text-gray-900">12 Days</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-8 rounded ${i < 5 ? 'bg-emerald-500' : 'bg-gray-200'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Course Progress Card */}
            <div
                className="absolute bottom-20 right-20 w-60 glass-card rounded-2xl p-4 shadow-xl animate-float"
                style={{ animationDelay: '0.5s', animationDuration: '6.5s' }}
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Active Course</p>
                        <p className="text-sm font-bold text-gray-900">Machine Learning</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Completion</span>
                        <span className="font-semibold text-blue-600">65%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Next: Neural Networks</p>
                </div>
            </div>
        </div>
    );
}
