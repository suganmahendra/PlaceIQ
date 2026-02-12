import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AnimatedBackground } from '../../components/landing/AnimatedBackground';
import {
    Briefcase,
    GraduationCap,
    Github,
    Linkedin,
    Globe,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { authService } from '../../services/authService';
import { supabase } from '../../lib/supabase';

export function CompleteProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState<'student' | 'mentor' | null>(null);
    const [formData, setFormData] = useState({
        bio: '',
        github: '',
        linkedin: '',
        portfolio: '',
        department: 'AI & Data Science',
        expertise: '',
        company: '',
        yearsOfExperience: 0
    });

    const checkUserRole = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            const role = await authService.fetchUserRole(user.id);
            // Only set role if it's student or mentor
            if (role === 'student' || role === 'mentor') {
                setUserRole(role);
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error fetching user role:', error);
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        checkUserRole();
    }, [checkUserRole]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user found');

            if (userRole === 'student') {
                // Update student profile
                const { error } = await supabase
                    .from('students')
                    .update({
                        bio: formData.bio,
                        social_links: {
                            github: formData.github,
                            linkedin: formData.linkedin,
                            portfolio: formData.portfolio
                        },
                        profile_completion: 100
                    })
                    .eq('user_id', user.id);

                if (error) throw error;
                navigate('/student/dashboard');
            } else if (userRole === 'mentor') {
                // Update mentor profile
                const { error } = await supabase
                    .from('mentors')
                    .update({
                        expertise: formData.expertise.split(',').map(e => e.trim()),
                        company: formData.company,
                        years_of_experience: formData.yearsOfExperience
                    })
                    .eq('user_id', user.id);

                if (error) throw error;
                navigate('/mentor/dashboard');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!userRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF] p-4 relative overflow-hidden">
            <AnimatedBackground />

            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-violet/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-[600px] relative z-10">
                <div className="glass-card rounded-[32px] shadow-2xl p-8 md:p-10 border border-white/50 backdrop-blur-2xl">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-primary/10 to-accent-violet/10 rounded-[20px] mb-6 shadow-inner border border-white/40">
                            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-text-primary tracking-tight mb-2">
                            Complete Your Profile
                        </h2>
                        <p className="text-text-secondary font-medium">
                            {userRole === 'student'
                                ? 'Help us personalize your learning journey'
                                : 'Share your expertise with aspiring professionals'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {userRole === 'student' ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary/80 ml-1">
                                        Bio
                                    </label>
                                    <textarea
                                        placeholder="Tell us about yourself, your goals, and interests..."
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full p-4 rounded-2xl border border-white/60 bg-white/50 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all text-text-primary text-sm resize-none"
                                        rows={4}
                                    />
                                </div>

                                <Input
                                    label="GitHub Profile"
                                    placeholder="https://github.com/yourusername"
                                    value={formData.github}
                                    onChange={e => setFormData({ ...formData, github: e.target.value })}
                                    icon={<Github className="text-primary/60 w-5 h-5" />}
                                    className="bg-white/50 border-white/60 focus:bg-white rounded-2xl h-14"
                                />

                                <Input
                                    label="LinkedIn Profile"
                                    placeholder="https://linkedin.com/in/yourusername"
                                    value={formData.linkedin}
                                    onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                    icon={<Linkedin className="text-primary/60 w-5 h-5" />}
                                    className="bg-white/50 border-white/60 focus:bg-white rounded-2xl h-14"
                                />

                                <Input
                                    label="Portfolio Website"
                                    placeholder="https://yourportfolio.com"
                                    value={formData.portfolio}
                                    onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                                    icon={<Globe className="text-primary/60 w-5 h-5" />}
                                    className="bg-white/50 border-white/60 focus:bg-white rounded-2xl h-14"
                                />
                            </>
                        ) : (
                            <>
                                <Input
                                    label="Company/Organization"
                                    placeholder="E.g. Google, Microsoft, Freelance"
                                    value={formData.company}
                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                    icon={<Briefcase className="text-primary/60 w-5 h-5" />}
                                    required
                                    className="bg-white/50 border-white/60 focus:bg-white rounded-2xl h-14"
                                />

                                <Input
                                    label="Years of Experience"
                                    type="number"
                                    placeholder="5"
                                    value={formData.yearsOfExperience.toString()}
                                    onChange={e => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                                    icon={<GraduationCap className="text-primary/60 w-5 h-5" />}
                                    required
                                    className="bg-white/50 border-white/60 focus:bg-white rounded-2xl h-14"
                                />

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary/80 ml-1">
                                        Areas of Expertise (comma-separated)
                                    </label>
                                    <textarea
                                        placeholder="E.g. Machine Learning, Deep Learning, NLP, Computer Vision"
                                        value={formData.expertise}
                                        onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                                        className="w-full p-4 rounded-2xl border border-white/60 bg-white/50 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all text-text-primary text-sm resize-none"
                                        rows={3}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-14 bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-accent-violet text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transform hover:-translate-y-1 transition-all duration-300"
                                isLoading={loading}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Complete Profile & Continue
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            </Button>
                        </div>

                        <button
                            type="button"
                            onClick={() => navigate(userRole === 'student' ? '/student/dashboard' : '/mentor/dashboard')}
                            className="w-full text-sm text-text-muted hover:text-primary transition-colors font-medium"
                        >
                            Skip for now
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
