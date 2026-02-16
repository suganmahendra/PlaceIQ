import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { AnimatedBackground } from '../../components/landing/AnimatedBackground';
import {
    User,
    Mail,
    Lock,
    Award,
    ArrowRight,
    Chrome,
    Briefcase,
    ShieldCheck,
    Star,
    AlertCircle
} from 'lucide-react';
import { authService } from '../../services/authService';

export function MentorRegister() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        expertise: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setIsSubmitting(false);
            return;
        }

        // Validate email domain for mentors
        if (!formData.email.trim().toLowerCase().endsWith('@mahendracollege.com')) {
            setError("Mentor registration is restricted to authorized staff only (@mahendracollege.com).");
            setIsSubmitting(false);
            return;
        }

        try {
            await authService.registerMentor(
                formData.email,
                formData.password,
                formData.name,
                formData.expertise
            );

            // Handle success
            setIsSuccess(true);
            // No auto-redirect. User must check email.
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An error occurred during registration';
            setError(message);
            console.error('Registration error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF] relative overflow-hidden">
                <AnimatedBackground />
                <div className="glass-card w-full max-w-md p-8 rounded-3xl text-center space-y-6 animate-scale-in relative z-10 border-white/40">
                    <div className="w-24 h-24 bg-gradient-to-tr from-primary to-accent-violet rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/20 animate-bounce">
                        <Mail className="w-12 h-12 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary mb-2">Check Your Email</h2>
                        <p className="text-text-secondary">
                            We've sent a verification link to <span className="font-bold text-primary">{formData.email}</span>. <br />
                            Please verify your professional email to secure your mentor account.
                        </p>
                    </div>

                    <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10 text-sm text-text-muted">
                        <p>Didn't receive the email? Check your spam folder.</p>
                    </div>

                    <Link to="/login-mentor" className="inline-block mt-4 text-primary font-bold hover:underline">
                        Back to Mentor Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF] p-4 pt-24 relative overflow-hidden">
            <AnimatedBackground />

            <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-accent-violet/5 rounded-full blur-[100px]" />

            <div className="w-full max-w-[600px] relative z-10">
                <div className="glass-card rounded-[32px] shadow-2xl p-6 border border-white/60 backdrop-blur-2xl">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-6 border border-primary/20 relative group">
                            <Award className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute -top-2 -right-2 bg-accent-pink text-white p-1 rounded-lg">
                                <Star className="w-3 h-3 fill-current" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">
                            Mentor Onboarding
                        </h2>
                        <p className="text-text-secondary font-medium text-sm">Share your expertise with the next generation of AI leaders</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}
                        <div className="space-y-4">
                            <Input
                                label="Full Name"
                                placeholder="Dr. Sarah Johnson"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                icon={<User className="text-primary/60 w-5 h-5" />}
                                required
                                className="bg-white/40 border-white/60 focus:bg-white rounded-2xl h-14"
                            />

                            <Input
                                label="Work Email"
                                type="email"
                                placeholder="name@mahendracollege.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                icon={<Mail className="text-primary/60 w-5 h-5" />}
                                required
                                className="bg-white/40 border-white/60 focus:bg-white rounded-2xl h-14"
                            />

                            <Input
                                label="Password"
                                type="password"
                                placeholder="Create your secure access"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                icon={<Lock className="text-primary/60 w-5 h-5" />}
                                required
                                className="bg-white/40 border-white/60 focus:bg-white rounded-2xl h-14"
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                icon={<Lock className="text-primary/60 w-5 h-5" />}
                                required
                                className={`bg-white/40 border-white/60 focus:bg-white rounded-2xl h-14 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-400 focus:ring-red-200' : ''
                                    }`}
                            />

                            <Input
                                label="Area of Expertise"
                                placeholder="E.g. Machine Learning, NLP, Data Engineering"
                                value={formData.expertise}
                                onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                                icon={<Briefcase className="text-primary/60 w-5 h-5" />}
                                required
                                className="bg-white/40 border-white/60 focus:bg-white rounded-2xl h-14"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-text-primary hover:bg-black text-white font-bold rounded-2xl shadow-xl transform hover:-translate-y-1 transition-all duration-300 mt-4"
                            isLoading={isSubmitting}
                        >
                            <span className="flex items-center justify-center gap-2">
                                Complete Mentor Registration
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        </Button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-100" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase">
                                <span className="bg-[#FAF5FF] px-4 text-text-muted font-black tracking-[0.2em]">Verified Professional Login</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        await authService.signInWithGoogleMentor();
                                    } catch (err) {
                                        console.error('Google sign-in error:', err);
                                        setError('Failed to sign in with Google. Please try again.');
                                    }
                                }}
                                className="w-full h-14 flex items-center justify-center gap-3 px-4 py-3 border-2 border-white/80 bg-white/20 hover:bg-white/50 rounded-2xl transition-all duration-300 group"
                            >
                                <Chrome className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
                                <span className="text-text-primary font-bold">Register with Google Workspace</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm font-medium">
                        <Link to="/login-mentor" className="text-text-muted hover:text-primary transition-colors">
                            Already part of our network? <span className="text-primary font-bold">Sign in here</span>
                        </Link>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-4 grayscale opacity-40">
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">ISO 27001</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">GDPR Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
