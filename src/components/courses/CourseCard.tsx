import { Link } from 'react-router-dom';
import { ProgressRing } from '../ui/ProgressRing';
import { Badge } from '../ui/Badge';
import { Clock, ChevronRight, Sparkles, Award } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CourseCardProps {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    estimatedHours: number;
    progress: number;
    icon: LucideIcon;
    certificateEarned?: boolean;
    category?: string;
}

const difficultyColors = {
    Beginner: 'success',
    Intermediate: 'info',
    Advanced: 'warning',
    Expert: 'danger',
} as const;

export function CourseCard({
    name,
    slug,
    description,
    difficulty,
    estimatedHours,
    progress,
    icon: Icon,
    certificateEarned,
    category = 'AI & DS',
    thumbnailUrl
}: CourseCardProps & { thumbnailUrl?: string | null }) {
    const isCompleted = progress === 100;

    return (
        <Link to={`/student/courses/${slug}`} className="block h-full">
            <div className="group relative bg-white rounded-[32px] border border-gray-100 p-8 h-full flex flex-col hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />

                {/* Top Section: Icon & Header */}
                <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                        {thumbnailUrl ? (
                            <img
                                src={thumbnailUrl}
                                alt={name}
                                className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100 bg-white"
                            />
                        ) : (
                            <div className="bg-gradient-to-br from-primary/10 to-accent-violet/10 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500 border border-primary/10">
                                <Icon className="w-8 h-8 text-primary" />
                            </div>
                        )}

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="info" size="sm" className="bg-primary/5 text-primary border-primary/10 font-bold uppercase tracking-tighter">
                                    {category}
                                </Badge>
                                {isCompleted && (
                                    <Badge variant="success" size="sm" className="font-bold uppercase tracking-tighter">
                                        Done
                                    </Badge>
                                )}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-1">{name}</h3>
                        </div>
                    </div>
                    {certificateEarned && (
                        <div className="p-2 bg-amber-50 rounded-xl border border-amber-100 animate-bounce-slow">
                            <Award className="w-6 h-6 text-amber-600" />
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="mb-8 flex-1 relative z-10">
                    <p className="text-gray-500 leading-relaxed font-medium line-clamp-3">
                        {description || 'Become an expert in this domain with our structured, placement-focused curriculum.'}
                    </p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 mb-8 relative z-10">
                    <Badge variant={difficultyColors[difficulty] || 'info'} size="md" className="font-bold border-none px-4 py-1.5 shadow-sm">
                        {difficulty}
                    </Badge>
                    <Badge variant="default" size="md" className="bg-gray-50 text-gray-500 border-none px-4 py-1.5 flex items-center gap-2 font-bold shadow-sm">
                        <Clock className="w-4 h-4" />
                        {estimatedHours}h Total
                    </Badge>
                    <Badge variant="default" size="md" className="bg-primary/5 text-primary-hover border-none px-4 py-1.5 flex items-center gap-2 font-bold shadow-sm">
                        <Sparkles className="w-4 h-4" />
                        AI Verified
                    </Badge>
                </div>

                {/* Footer: Progress & Action */}
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between mt-auto relative z-10">
                    <div className="flex items-center gap-4">
                        <ProgressRing
                            progress={progress}
                            size="md"
                            showLabel={false}
                            strokeWidth={4}
                            color={isCompleted ? "#10b981" : "#6366f1"}
                        />
                        <div>
                            <p className="text-sm font-black text-gray-900">{Math.round(progress)}% Mastery</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">
                                {progress === 0 ? 'Not started' : isCompleted ? 'Course Fully Finished' : 'Currently Active'}
                            </p>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
