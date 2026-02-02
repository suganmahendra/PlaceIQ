import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BrainCircuit } from 'lucide-react';

export function StudentLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login
        setTimeout(() => {
            setLoading(false);
            navigate('/student/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-20 pb-12 flex items-center justify-center bg-gray-50/50 relative">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mx-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                            <BrainCircuit className="w-8 h-8 text-primary" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">PlaceIQ</span>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back!</h2>
                    <p className="text-gray-500 mt-2">Please login to access your dashboard.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <a href="#" className="text-xs text-primary hover:underline" onClick={(e) => e.preventDefault()}>Forgot password?</a>
                        </div>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="flex items-center gap-2 py-1">
                        <input type="checkbox" id="remember" className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
                        <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">Remember me</label>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" isLoading={loading}>
                        Sign In
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/register-student" className="text-primary font-semibold hover:underline">Register here</Link>
                </div>
            </div>
        </div>
    );
}
