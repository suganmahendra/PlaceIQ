import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AnimatedBackground } from '../../components/landing/AnimatedBackground';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, Fingerprint, Mail, KeyRound, ArrowRight } from 'lucide-react';
import { emailService } from '../../services/emailService';

export function ResetPassword() {
    const navigate = useNavigate();

    // Stages: 'request' (enter register number) -> 'verify' (enter OTP + new password) -> 'success'
    const [step, setStep] = useState<'request' | 'verify' | 'success'>('request');

    // Form state
    const [registerNumber, setRegisterNumber] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [maskedEmail, setMaskedEmail] = useState('');

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!registerNumber) throw new Error("Please enter your Register Number.");

            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit

            // 1. the RPC validates the user and firmly inserts the OTP without needing an active session
            const { data: email, error: rpcError } = await (supabase.rpc as any)('request_password_reset_otp', {
                p_register_number: registerNumber,
                p_otp_code: generatedOtp
            });

            if (rpcError) {
                throw new Error(rpcError.message || "Failed to locate account. Please check your Register Number.");
            }
            if (!email) {
                throw new Error("Account found but no email address is linked.");
            }

            // 2. Dispatch Brevo Email
            const emailResult = await emailService.sendPasswordResetOtp(email, generatedOtp);

            // Mask email for UI (e.g. s***@gmail.com)
            const [local, domain] = email.split('@');
            setMaskedEmail(`${local.charAt(0)}${'*'.repeat(local.length - 1)}@${domain}`);

            if (emailResult.mocked) {
                // In local dev without Brevo keys, output it so testing isn't blocked.
                setError(`[LOCAL TEST MODE] Email Mocked! Your OTP is: ${generatedOtp}`);
            }

            setStep('verify');
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (otpCode.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // The RPC validates the OTP and automatically handles pgcrypto bcrypt hashing to securely update auth.users
            const { error: rpcError } = await (supabase.rpc as any)('reset_password_with_otp', {
                p_register_number: registerNumber,
                p_otp_code: otpCode,
                p_new_password: password
            });

            if (rpcError) {
                throw new Error(rpcError.message || 'Invalid or expired OTP. Please try again.');
            }

            setStep('success');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    // --- Renders ---

    if (step === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF] relative overflow-hidden p-4">
                <AnimatedBackground />
                <div className="glass-card w-full max-w-md p-8 rounded-[32px] text-center space-y-6 animate-scale-in relative z-10 border-white/40 shadow-2xl">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary">Password Updated!</h2>
                    <p className="text-text-secondary">Your password has been securely updated. Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF] relative overflow-hidden p-4 pt-12">
            <AnimatedBackground />

            <div className="glass-card w-full max-w-lg p-6 sm:p-10 rounded-[32px] border-white/40 shadow-2xl relative z-10 animate-scale-in">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner">
                        <KeyRound className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                        {step === 'request' ? 'Forgot Password?' : 'Set New Password'}
                    </h2>
                    <p className="text-text-secondary mt-3 text-sm sm:text-base px-2">
                        {step === 'request'
                            ? "Enter your Register Number and we'll send a 6-digit recovery code to your registered email address."
                            : `We sent a 6-digit code to ${maskedEmail}. It expires in 10 minutes.`}
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm animate-shake ${error.includes('LOCAL TEST MODE') ? 'bg-amber-50 border border-amber-200 text-amber-800' : 'bg-red-50 border border-red-100 text-red-600'}`}>
                        {error.includes('LOCAL TEST MODE') ? <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                        <p className="font-medium leading-relaxed">{error}</p>
                    </div>
                )}

                {/* Forms */}
                {step === 'request' ? (
                    <form onSubmit={handleRequestOtp} className="space-y-6">
                        <Input
                            label="Register Number"
                            placeholder="E.g., 621522243..."
                            value={registerNumber}
                            onChange={(e) => setRegisterNumber(e.target.value)}
                            icon={<Fingerprint className="w-5 h-5 text-primary/60" />}
                            required
                            className="bg-white/60 focus:bg-white h-14 rounded-xl"
                        />

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full h-14 bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-accent-violet text-white font-bold rounded-xl shadow-xl shadow-primary/25 transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="flex items-center gap-2 text-lg">
                                Send Recovery Code
                                <Mail className="w-5 h-5" />
                            </span>
                        </Button>

                        <div className="text-center mt-6">
                            <Link to="/login" className="text-sm font-bold text-text-muted hover:text-primary transition-colors">
                                Wait, I remember my password
                            </Link>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <Input
                            label="6-Digit OTP"
                            placeholder="Enter code"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            maxLength={6}
                            required
                            className="font-mono tracking-widest text-center text-lg bg-white/60 focus:bg-white h-14 rounded-xl"
                            icon={<ShieldCheck className="w-5 h-5 text-primary/60" />}
                        />
                        <Input
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock className="w-5 h-5 text-primary/60" />}
                            required
                            placeholder="Min. 6 characters"
                            className="bg-white/60 focus:bg-white h-14 rounded-xl"
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={<Lock className="w-5 h-5 text-primary/60" />}
                            required
                            placeholder="Re-enter password"
                            className="bg-white/60 focus:bg-white h-14 rounded-xl"
                        />

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full h-14 mt-4 bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-accent-violet text-white font-bold rounded-xl shadow-xl shadow-primary/25 transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <span className="flex items-center gap-2 text-lg">
                                Secure Reset
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        </Button>

                        <div className="text-center mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setStep('request');
                                    setOtpCode('');
                                    setError(null);
                                }}
                                className="text-sm font-bold text-text-muted hover:text-primary transition-colors"
                            >
                                Did not receive code? Try again
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
