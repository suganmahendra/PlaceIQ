import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BrainCircuit, X, GraduationCap } from 'lucide-react';

export function StudentRegister() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        college: '',
        department: '',
    });
    const [skills, setSkills] = useState<string[]>(['Communication', 'Problem Solving']); // Default skills
    const [skillInput, setSkillInput] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1: Details, 2: Skills/Verification

    const handleSkillAdd = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            const val = skillInput.trim();
            if (!skills.includes(val)) {
                setSkills([...skills, val]);
            }
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/student/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[10%] right-[20%] w-72 h-72 bg-accent/5 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12 relative z-10 mx-4 border border-gray-100">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
                        <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Student Registration</h2>
                    <p className="text-gray-500 mt-2">Join PlaceIQ to kickstart your career journey</p>
                    {/* Progress Indicators */}
                    <div className="flex justify-center gap-2 mt-6">
                        <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
                        <div className={`h-1.5 w-12 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-8 fade-in duration-300">
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Min. 8 characters"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="College / University"
                                    placeholder="MIT Anna University"
                                    value={formData.college}
                                    onChange={e => setFormData({ ...formData, college: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Department"
                                    placeholder="Computer Science"
                                    value={formData.department}
                                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="button" className="w-full mt-6 h-12 text-lg" onClick={() => setStep(2)}>
                                Next Step
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                                <BrainCircuit className="w-5 h-5 text-blue-600 mt-0.5 min-w-5" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 text-sm">Tell us your interests</h4>
                                    <p className="text-blue-700 text-xs mt-1">We'll verify your email later. For now, let's personalize your feed.</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Skills / Interests (Type and press Enter)</label>
                                <input
                                    className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                                    placeholder="e.g. Java, Python, React, Aptitude"
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={handleSkillAdd}
                                />
                                <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
                                    {skills.map((skill, idx) => (
                                        <span key={idx} className="bg-white border border-primary/20 text-primary px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm animate-in zoom-in-50 duration-200">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 ml-1 rounded-full hover:bg-red-50 p-0.5"><X className="w-3 h-3" /></button>
                                        </span>
                                    ))}
                                    {skills.length === 0 && <span className="text-gray-400 text-sm italic">No skills added yet</span>}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep(1)}>
                                    Back
                                </Button>
                                <Button type="submit" className="w-2/3" isLoading={isSubmitting}>
                                    Complete Registration
                                </Button>
                            </div>
                        </div>
                    )}
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
}
