import { supabase } from '../../lib/supabase'; // Import Supabase
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PasswordRecoveryModal } from '../../components/auth/PasswordRecoveryModal';
import { AnimatedBackground } from '../../components/landing/AnimatedBackground';

import {
    BrainCircuit,
    Mail,
    Lock,
    ArrowRight,
    Chrome,
    Fingerprint,
    AlertCircle,
    ShieldCheck // Add ShieldCheck icon
} from 'lucide-react';
import { authService } from '../../services/authService';

export function StudentLogin() {
    const navigate = useNavigate();
    const [registerNumber, setRegisterNumber] = useState('');
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

                // Verify Register Number
                const { data: profile } = await supabase
                    .from('students')
                    .select('register_number')
                    .eq('user_id', data.user.id)
                    .single();

                if (!profile) {
                    // Should not happen for valid student, but safeguard
                    await authService.logoutUser();
                    throw new Error('Student profile not found.');
                }

                if (profile.register_number !== registerNumber) {
                    await authService.logoutUser();
                    throw new Error('Register number does not match our records.');
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
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF] p-4 pt-24 relative overflow-hidden">
            <AnimatedBackground />

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-violet/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="w-full max-w-[900px] flex items-center justify-center gap-12 relative z-10">
                <div className="hidden lg:flex w-1/2 flex-col items-center justify-center">
                    {/* Decorative Abstract Design */}
                    <div className="relative w-80 h-80 animate-float">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent-violet rounded-full opacity-20 blur-3xl" />
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                            <path fill="#8B5CF6" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.5C93.5,8.1,82.2,20.6,71.7,31.7C61.2,42.8,51.5,52.4,40.4,60.2C29.3,68,16.8,74,3.1,78.6C-10.6,83.2,-25.5,86.4,-38.7,82.3C-51.9,78.2,-63.4,66.8,-71.4,53.4C-79.4,40,-83.9,24.6,-83.3,9.5C-82.7,-5.6,-77,-20.4,-68.3,-33.5C-59.6,-46.6,-47.9,-58,-35.1,-65.9C-22.3,-73.8,-8.4,-78.2,3.8,-84.1C16,-90,30.5,-97.4,44.7,-76.4Z" transform="translate(100 100)" />
                            <path fill="#6D28D9" fillOpacity="0.5" d="M38.1,-65.4C49.5,-59.5,59.1,-49.2,66.9,-37.6C74.7,-26,80.6,-13,79.8,-0.5C78.9,12,71.3,23.9,62.8,34.8C54.3,45.7,44.9,55.6,33.8,61.9C22.7,68.2,9.9,70.9,-2.2,74.7C-14.3,78.5,-25.7,83.4,-36.1,80.1C-46.5,76.8,-55.9,65.3,-62.8,53.2C-69.7,41.1,-74.1,28.4,-74.9,15.5C-75.7,2.6,-72.9,-10.5,-66.2,-21.8C-59.5,-33.1,-48.9,-42.6,-37.9,-48.8C-26.9,-55,-15.5,-57.9,-2.4,-53.8C10.7,-49.7,32,-56,38.1,-65.4Z" transform="translate(100 100) scale(0.8)" />
                        </svg>
                        <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-white drop-shadow-md" />
                    </div>

                    <div className="mt-8 text-center relative z-10">
                        <div className="inline-block px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl">
                            <p className="text-text-primary font-bold text-xl tracking-tight">"Ready to reach your peak?"</p>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-[550px] flex-shrink-0">
                    <div className="glass-card rounded-[32px] shadow-2xl p-8 border border-white/50 backdrop-blur-2xl">

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
                                label="Register Number"
                                placeholder="621522243..."
                                value={registerNumber}
                                onChange={(e) => setRegisterNumber(e.target.value)}
                                icon={<ShieldCheck className="text-primary/60 w-5 h-5" />}
                                required
                                className="bg-white/50 border-white/60 focus:bg-white rounded-2xl h-14"
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="student@gmail.com"
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
