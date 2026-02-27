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
    GraduationCap,
    ArrowRight,
    Chrome,
    Sparkles,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import { authService } from '../../services/authService';

export function StudentRegister() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        registerNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: 'AI & Data Science', // Default as per requirements
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

            await authService.sendStudentOtp(
                formData.email,
                formData.password,
                formData.name,
                formData.department,
                formData.registerNumber
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
            navigate('/student/dashboard', { replace: true });
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

            {/* Animated Blobs for "Futuristic" feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-violet/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-[600px] relative z-10 w-full">
                <div className="glass-card rounded-[32px] shadow-2xl p-6 border border-white/50 backdrop-blur-2xl">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-primary/10 to-accent-violet/10 rounded-[20px] mb-6 shadow-inner border border-white/40 group">
                            <GraduationCap className="w-10 h-10 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-text-primary tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-violet">
                            Join PlaceIQ
                        </h2>
                        <p className="text-text-secondary font-medium">Create your AI-powered student profile</p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            {error && (
                                <div className={`border px-4 py-3 rounded-xl flex items-start gap-3 animate-shake ${error.includes('already registered')
                                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                                    : 'bg-red-50 border-red-200 text-red-600'
                                    }`}>
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{error}</p>
                                        {error.includes('already registered') && (
                                            <Link to="/login" className="text-sm font-bold underline mt-1 inline-block hover:text-blue-600">
                                                Click here to Sign In instead
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="space-y-5">
                                <Input
                                    label="Full Name"
                                    placeholder="E.g. Sugan Mahendra"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    icon={<User className="text-primary/60 w-5 h-5" />}
                                    required
                                    className="bg-white/50 border-white/60 focus:bg-white transition-all rounded-2xl h-14"
                                />

                                <Input
                                    label="Register Number"
                                    placeholder="621522243..."
                                    value={formData.registerNumber}
                                    onChange={e => setFormData({ ...formData, registerNumber: e.target.value })}
                                    icon={<ShieldCheck className="text-primary/60 w-5 h-5" />}
                                    required
                                    className="bg-white/50 border-white/60 focus:bg-white transition-all rounded-2xl h-14"
                                />

                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="student@gmail.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    icon={<Mail className="text-primary/60 w-5 h-5" />}
                                    required
                                    className="bg-white/50 border-white/60 focus:bg-white transition-all rounded-2xl h-14"
                                />

                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    icon={<Lock className="text-primary/60 w-5 h-5" />}
                                    required
                                    className="bg-white/50 border-white/60 focus:bg-white transition-all rounded-2xl h-14"
                                />

                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    icon={<Lock className="text-primary/60 w-5 h-5" />}
                                    required
                                    className="bg-white/50 border-white/60 focus:bg-white transition-all rounded-2xl h-14"
                                />

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-text-primary/80 ml-1 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        Department
                                    </label>
                                    <div className="relative group">
                                        <select
                                            className="w-full h-14 p-4 rounded-2xl border border-white/60 bg-white/50 focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all appearance-none text-text-primary text-sm font-medium"
                                            value={formData.department}
                                            onChange={e => setFormData({ ...formData, department: e.target.value })}
                                        >
                                            <option value="AI & Data Science">AI & Data Science (Recommended)</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Information Technology">Information Technology</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">
                                            <ArrowRight className="w-5 h-5 rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-accent-violet text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transform hover:-translate-y-1 transition-all duration-300"
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
                                <div className="border px-4 py-3 rounded-xl flex items-start gap-3 animate-shake bg-red-50 border-red-200 text-red-600">
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
                                className="w-full h-14 bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-accent-violet text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transform hover:-translate-y-1 transition-all duration-300"
                                isLoading={isSubmitting}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Verify & Create Account
                                    <Sparkles className="w-5 h-5" />
                                </span>
                            </Button>

                            <div className="text-center mt-4">
                                <button type="button" onClick={() => setStep(1)} className="text-sm text-text-muted hover:text-primary font-medium transition-colors">
                                    Back to edit details
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#FAF5FF] px-4 text-text-muted font-bold tracking-widest">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={async () => {
                                    try {
                                        await authService.signInWithGoogleStudent();
                                    } catch (err) {
                                        console.error('Google sign-in error:', err);
                                        setError('Failed to sign in with Google. Please try again.');
                                    }
                                }}
                                className="w-full h-14 flex items-center justify-center gap-3 px-4 py-3 border-2 border-white/60 bg-white/40 hover:bg-white/70 rounded-2xl transition-all duration-300 group shadow-sm hover:shadow-md"
                            >
                                <Chrome className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-text-primary font-bold">Sign up with Google</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/20 text-center">
                        <p className="text-sm text-text-secondary font-medium">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-bold hover:text-primary-hover underline underline-offset-4 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-tighter">
                        <ShieldCheck className="w-3 h-3 text-green-500" />
                        Enterprise Grade Security Guaranteed
                    </div>
                </div>
            </div>
        </div>
    );
}
