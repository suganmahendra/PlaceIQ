import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PasswordRecoveryModal } from '../../components/auth/PasswordRecoveryModal';
import { AnimatedBackground } from '../../components/landing/AnimatedBackground';
import { AIRobot } from '../../components/ai/AIRobot';
import {
    BrainCircuit,
    Mail,
    Lock,
    ArrowRight,
    Chrome,
    Fingerprint,
    AlertCircle
} from 'lucide-react';
import { authService } from '../../services/authService';

export function StudentLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await authService.loginUser(email, password);

            if (data.user) {
                const role = await authService.fetchUserRole(data.user.id);

                if (role && role !== 'student') {
                    await authService.logoutUser();
                    throw new Error('Please use the Mentor login page.');
                }

                navigate('/student/dashboard');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Invalid login credentials';
            setError(message);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF] p-4 relative overflow-hidden">
            <AnimatedBackground />

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-violet/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="w-full max-w-[900px] flex items-center justify-center gap-12 relative z-10">
                {/* Welcoming AI Robot (Left Side on Desktop) */}
                <div className="hidden lg:block w-1/2 animate-float">
                    <AIRobot mode="active" className="scale-150" />
                    <div className="mt-20 text-center">
                        <div className="inline-block px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl">
                            <p className="text-text-primary font-bold text-lg">"Welcome back, Explorer. Ready to reach your peak?"</p>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-[440px]">
                    <div className="glass-card rounded-[32px] shadow-2xl p-8 md:p-10 border border-white/50 backdrop-blur-2xl">

                        <div className="text-center mb-10">
                            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                                <div className="bg-gradient-to-tr from-primary to-accent-violet p-3 rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/20">
                                    <BrainCircuit className="w-8 h-8 text-white" />
                                </div>
                                <span className="text-3xl font-black text-text-primary tracking-tighter">PlaceIQ</span>
                            </Link>
                            <h2 className="text-3xl font-extrabold text-text-primary">Welcome Back</h2>
                            <p className="text-text-secondary mt-2 font-medium">Continue your AI journey</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="name@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="text-primary/60 w-5 h-5" />}
                                required
                                className="bg-white/50 border-white/60 focus:bg-white rounded-2xl h-14"
                            />

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-semibold text-text-primary/80">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsRecoveryOpen(true)}
                                        className="text-xs font-bold text-primary hover:text-primary-hover transition-colors shadow-[0_0_10px_transparent] hover:shadow-primary/20"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Lock className="text-primary/60 w-5 h-5" />}
                                    required
                                    className="bg-white/50 border-white/60 focus:bg-white rounded-2xl h-14"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-14 bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-accent-violet text-white font-bold rounded-2xl shadow-xl shadow-primary/25 transform hover:-translate-y-1 transition-all duration-300"
                                isLoading={loading}
                            >
                                <span className="flex items-center justify-center gap-2 text-lg">
                                    Sign In
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
                                    <span className="bg-[#FAF5FF] px-4 text-text-muted font-black tracking-widest">Secure Access</span>
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
                                    className="w-full h-14 flex items-center justify-center gap-3 px-4 py-3 border-2 border-white/80 bg-white/40 hover:bg-white/70 rounded-2xl transition-all duration-300 group shadow-sm"
                                >
                                    <Chrome className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-text-primary font-bold">Sign in with Google</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-white/20 text-center">
                            <p className="text-sm text-text-secondary font-medium">
                                New to PlaceIQ?{' '}
                                <Link to="/register-student" className="text-primary font-bold hover:text-primary-hover underline underline-offset-4 transition-colors">
                                    Create account
                                </Link>
                            </p>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-tighter opacity-60">
                            <Fingerprint className="w-3 h-3 text-primary" />
                            Biometric & Multi-factor ready
                        </div>
                    </div>
                </div>
                <PasswordRecoveryModal
                    isOpen={isRecoveryOpen}
                    onClose={() => setIsRecoveryOpen(false)}
                    userType="student"
                />
            </div>
        </div>
    );
}
