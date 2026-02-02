import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Briefcase, Clock, CheckCircle } from 'lucide-react';

export function MentorRegister() {
    const [step, setStep] = useState(1); // 1: Form, 2: Pending
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(2);
        }, 1500);
    };

    if (step === 2) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-lg w-full text-center border border-gray-100 animate-in zoom-in-95 duration-300">
                    <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                        <Clock className="w-12 h-12 text-yellow-600" />
                        <div className="absolute top-0 right-0 bg-green-500 rounded-full p-2 border-4 border-white">
                            <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Thanks for applying to be a Mentor at PlaceIQ. Your profile is currently under review. We will notify you via email once approved (usually within 24 hours).
                    </p>
                    <Link to="/">
                        <Button variant="outline" className="w-full">Return to Home</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50 relative overflow-hidden">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12 relative z-10 mx-4 border border-gray-100">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-secondary/20 rounded-xl mb-4">
                        <Briefcase className="w-8 h-8 text-secondary-dark" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Become a Mentor</h2>
                    <p className="text-gray-500 mt-2">Share your expertise and guide the next generation.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Full Name" placeholder="Dr. Jane Smith" required />
                        <Input label="Email" type="email" placeholder="jane@university.edu" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Check Current Role" placeholder="Senior Engineer, Professor..." required />
                        <Input label="Years of Experience" type="number" placeholder="5" required />
                    </div>

                    <Input label="Expertise (Tags)" placeholder="e.g. Data Science, Resume Building, Mock Interviews" required />
                    <Input label="LinkedIn / Portfolio URL" placeholder="https://linkedin.com/in/..." required />

                    <div className="pt-4">
                        <Button type="submit" className="w-full h-12 text-lg bg-secondary-dark hover:bg-secondary text-white" isLoading={loading}>
                            Submit Application
                        </Button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    For students, <Link to="/register-student" className="text-secondary-dark font-semibold hover:underline">register here</Link>.
                </div>
            </div>
        </div>
    );
}
