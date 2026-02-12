import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { authService } from '../../services/authService';

interface PasswordRecoveryModalProps {
    isOpen: boolean;
    onClose: () => void;
    userType: 'student' | 'mentor';
}

export function PasswordRecoveryModal({ isOpen, onClose, userType }: PasswordRecoveryModalProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await authService.requestPasswordReset(email);
            setStatus('success');
            setCountdown(60);
        } catch (err) {
            console.error(err);
            setStatus('error');
            // Allow retry
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md glass-card rounded-[32px] p-8 md:p-10 border-white/60 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative Glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold text-text-primary tracking-tight">Account Recovery</h3>
                                <p className="text-sm text-text-secondary mt-1 font-medium">Reset your {userType} access</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-black/5 rounded-xl transition-colors text-text-muted"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 py-4"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-text-primary">Email Sent!</h4>
                                    <p className="text-sm text-text-secondary mt-2 leading-relaxed px-4">
                                        A secure password reset link has been sent to <span className="text-text-primary font-bold">{email}</span>. Please check your inbox.
                                    </p>
                                </div>
                                <div className="pt-4">
                                    {countdown > 0 ? (
                                        <p className="text-[10px] uppercase font-black tracking-widest text-text-muted">
                                            Resend available in {countdown}s
                                        </p>
                                    ) : (
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="text-xs font-bold text-primary hover:underline flex items-center gap-2 mx-auto"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            Didn't receive it? Try again
                                        </button>
                                    )}
                                </div>
                                <Button
                                    onClick={onClose}
                                    className="w-full h-12 bg-text-primary text-white rounded-2xl font-bold"
                                >
                                    Return to Login
                                </Button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="space-y-4">
                                    <Input
                                        label="Registered Email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        icon={<Mail className="w-5 h-5 text-primary/60" />}
                                        required
                                        className="bg-white/40 border-white/60 focus:bg-white rounded-2xl h-14"
                                    />
                                    <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                        <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                        <p className="text-[10px] text-text-secondary leading-tight uppercase font-black tracking-tighter">
                                            PlaceIQ Security: The reset link will be active for 15 minutes and can only be used once.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={status === 'loading'}
                                    disabled={status === 'loading'}
                                    className="w-full h-14 bg-gradient-to-r from-primary to-accent-violet hover:from-primary-hover hover:to-accent-violet text-white font-bold rounded-2xl shadow-xl shadow-primary/20 transform hover:-translate-y-1 transition-all duration-300"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Send Reset Link
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                </Button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={() => alert("Guidance: Please contact support at support@placeiq.ai or check your previous registration confirmation emails.")}
                                        className="text-xs font-bold text-text-muted hover:text-primary transition-colors hover:underline"
                                    >
                                        Need help with your registered email?
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="mt-8 flex justify-center gap-4 grayscale opacity-30">
                            <div className="flex items-center gap-1 text-[8px] font-black tracking-[0.2em] uppercase">
                                <ShieldCheck className="w-2.5 h-2.5" />
                                AES-256 Secure
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
