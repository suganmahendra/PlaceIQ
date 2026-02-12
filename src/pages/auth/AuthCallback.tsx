import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AnimatedBackground } from '../../components/landing/AnimatedBackground';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

export function AuthCallback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your session...');

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // 1. Get Session
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;
                if (!session) {
                    // Sometimes the hash is not yet processed, wait a bit or check URL
                    // But usually getSession handles it if the provider redirected correctly with hash
                    throw new Error('No session found. Please try logging in again.');
                }

                // 2. Wait for Profile Creation (Trigger might take a ms)
                setMessage('Setting up your profile...');

                // Retry logic for profile fetch
                let profile: any = null;
                let attempts = 0;
                while (!profile && attempts < 5) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (data) {
                        profile = data;
                    } else {
                        await new Promise(r => setTimeout(r, 1000)); // Wait 1s
                        attempts++;
                    }
                }

                if (!profile) {
                    // Fallback: Check user_roles directly if profile missing (legacy path)
                    const role = await authService.fetchUserRole(session.user.id);
                    if (role) {
                        // Redirect based on role
                        setStatus('success');
                        setTimeout(() => navigate(role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard'), 1000);
                        return;
                    }
                    throw new Error('Profile setup failed. Please contact support.');
                }

                // 3. Redirect based on role
                setStatus('success');
                setMessage('Verified! Redirecting to dashboard...');

                const role = profile.role || 'student'; // Default to student
                setTimeout(() => {
                    navigate(role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard');
                }, 1500);

            } catch (err: any) {
                console.error('Auth callback error:', err);
                setStatus('error');
                setMessage(err.message || 'Authentication failed');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF] relative overflow-hidden">
            <AnimatedBackground />

            <div className="glass-card p-10 rounded-3xl text-center max-w-md w-full relative z-10 border-white/40 shadow-2xl animate-scale-in">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <h2 className="text-xl font-bold text-text-primary">{message}</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-text-primary">Success!</h2>
                        <p className="text-text-secondary">{message}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-text-primary">Verification Failed</h2>
                        <p className="text-red-500 mb-4">{message}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl transition-colors font-semibold"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
