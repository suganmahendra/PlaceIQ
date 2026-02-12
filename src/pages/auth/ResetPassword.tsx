import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AnimatedBackground } from '../../components/landing/AnimatedBackground';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

export function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Verify we have a session (user clicked email link)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                setStatus('error');
                setError('Invalid or expired reset link. Please try again.');
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setStatus('loading');
        setError(null);

        try {
            await authService.updatePassword(password);
            setStatus('success');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setStatus('error');
            setError(err.message || 'Failed to update password');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF] relative overflow-hidden">
                <AnimatedBackground />
                <div className="glass-card w-full max-w-md p-8 rounded-3xl text-center space-y-6 animate-scale-in relative z-10 border-white/40">
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
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF] relative overflow-hidden">
            <AnimatedBackground />

            <div className="glass-card w-full max-w-md p-8 rounded-[32px] border-white/40 shadow-2xl relative z-10 animate-scale-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary">Set New Password</h2>
                    <p className="text-text-secondary mt-2">Enter your new secure password below.</p>
                </div>

                {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock className="w-5 h-5 text-primary/60" />}
                        required
                        placeholder="Min. 6 characters"
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        icon={<Lock className="w-5 h-5 text-primary/60" />}
                        required
                        placeholder="Re-enter password"
                    />

                    <Button
                        type="submit"
                        isLoading={status === 'loading'}
                        disabled={status === 'loading'}
                        className="w-full h-14 bg-gradient-to-r from-primary to-accent-violet text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/25 transition-all"
                    >
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
