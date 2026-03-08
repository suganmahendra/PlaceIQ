import { useEffect, useState } from 'react';
import { X, Trophy, Briefcase, ArrowRight, Sparkles, PartyPopper } from 'lucide-react';
import type { PlacementRole } from '../../services/PlacementsService';

interface EligibilityModalProps {
    eligibleRoles: PlacementRole[];
    onApply: (role: PlacementRole) => void;
    onClose: () => void;
}

export function EligibilityModal({ eligibleRoles, onApply, onClose }: EligibilityModalProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Small delay for entrance animation
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    if (eligibleRoles.length === 0) return null;

    const isSingle = eligibleRoles.length === 1;
    const role = eligibleRoles[0];

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300
                ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden
                    transition-all duration-300 ${visible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-8'}`}
            >
                {/* Gradient header */}
                <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 p-8 text-white text-center relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                    <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute top-4 left-8 w-12 h-12 bg-white/10 rounded-full" />

                    {/* Icons floating */}
                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <PartyPopper className="w-8 h-8 animate-bounce" />
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Trophy className="w-9 h-9 text-yellow-300" />
                            </div>
                            <Sparkles className="w-8 h-8 animate-pulse" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                            🎉 You're Eligible!
                        </h2>
                        <p className="text-green-100 text-sm">
                            {isSingle
                                ? 'Congratulations! Your roadmap completion has unlocked a real job opportunity.'
                                : `You've completed the required roadmaps for ${eligibleRoles.length} roles!`}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors text-white"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {eligibleRoles.map((r) => (
                            <div
                                key={r.id}
                                className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-2xl"
                            >
                                <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{r.title}</p>
                                    <p className="text-sm text-gray-600 truncate">{r.companyName}</p>
                                    {r.salaryRange && (
                                        <p className="text-xs font-semibold text-green-600 mt-0.5">{r.salaryRange}</p>
                                    )}
                                </div>
                                <div className="shrink-0 text-right">
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                        {r.matchPercentage}% match
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={handleClose}
                            className="py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                        >
                            View Later
                        </button>
                        <button
                            onClick={() => {
                                if (isSingle) {
                                    onApply(role);
                                }
                                handleClose();
                            }}
                            className="py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 text-sm"
                        >
                            {isSingle ? 'Apply Now' : 'See Roles'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-400">
                        Your roadmap completion unlocked this opportunity
                    </p>
                </div>
            </div>
        </div>
    );
}
