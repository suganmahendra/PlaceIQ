import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { OtpInput } from '../../components/ui/OtpInput';
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
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        expertise: '',
    });

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match.");
                setIsSubmitting(false);
                return;
            }

            // Check if user already exists
            const userExists = await authService.checkUserExists(formData.email);
            if (userExists) {
                setError("User already registered. Please sign in.");
                setIsSubmitting(false);
                return;
            }

            await authService.sendMentorOtp(
                formData.email,
                formData.password,
                formData.name,
                formData.expertise
            );

            setStep(2);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An error occurred during registration';
            setError(message);
            console.error('Registration error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await authService.verifyOtp(formData.email, otp, 'signup');
            navigate('/mentor/dashboard', { replace: true });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Invalid code. Please try again.';
            setError(message);
            console.error('OTP Verification error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Removed isSuccess component

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

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
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
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    icon={<Lock className="text-primary/60 w-5 h-5" />}
                                    required
                                    className="bg-white/40 border-white/60 focus:bg-white rounded-2xl h-14"
                                />

                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    icon={<Lock className="text-primary/60 w-5 h-5" />}
                                    required
                                    className="bg-white/40 border-white/60 focus:bg-white rounded-2xl h-14"
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
                                    Send Verification Code
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <p className="text-text-secondary">
                                    Enter the 6-digit code sent to <span className="font-bold text-primary">{formData.email}</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-text-primary/80 ml-1 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-primary" />
                                    Verification Code
                                </label>
                                <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    error={!!error}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-text-primary hover:bg-black text-white font-bold rounded-2xl shadow-xl transform hover:-translate-y-1 transition-all duration-300 mt-4"
                                isLoading={isSubmitting}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Verify & Create Account
                                    <Star className="w-5 h-5" />
                                </span>
                            </Button>

                            <div className="text-center mt-4">
                                <button type="button" onClick={() => setStep(1)} className="text-sm text-text-muted hover:text-primary font-medium transition-colors">
                                    Back to edit details
                                </button>
                            </div>
                        </form>
                    )}



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
