import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { AlertTriangle, CheckCircle, Search, Clock, Bot } from 'lucide-react';

interface AIAlert {
    id: string;
    title: string;
    message: string;
    created_at: string;
    read: boolean;
    action_url: string | null;
}

export function MentorAlertsPage() {
    const { profile } = useAuth();
    const [alerts, setAlerts] = useState<AIAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile) return;
        fetchAlerts();
    }, [profile]);

    const fetchAlerts = async () => {
        setLoading(true);
        if (!profile?.user_id) { setLoading(false); return; }
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', profile.user_id)
            .eq('type', 'ai_alert')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setAlerts(data as AIAlert[]);
        }
        setLoading(false);
    };

    const markAsRead = async (id: string) => {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
        fetchAlerts(); // refresh
    };

    const clearAllAlerts = async () => {
        if (!profile?.user_id) return;
        setLoading(true);
        await supabase.from('notifications')
            .delete()
            .eq('user_id', profile.user_id)
            .eq('type', 'ai_alert')
            .eq('read', true);
        fetchAlerts();
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-gray-500 font-medium">Scanning AI Alerts...</p>
        </div>
    );

    return (
        <div className="space-y-8 p-4 md:p-8 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                <div className="flex items-start gap-4 relative z-10">
                    <div className="bg-primary/10 p-4 rounded-2xl flex-shrink-0">
                        <Bot className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">AI Retention Alerts</h1>
                        <p className="text-gray-500 mt-1 max-w-xl text-sm md:text-base">
                            The Dropout Predictor Machine Learning model scans all students nightly. High-risk students are flagged here with a full performance breakdown.
                        </p>
                    </div>
                </div>
                {alerts.some(a => a.read) && (
                    <button 
                        onClick={clearAllAlerts}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2 border border-gray-100 bg-gray-50/50"
                    >
                        Clear Resolved
                    </button>
                )}
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-6">
                {alerts.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">All Clear!</h3>
                        <p className="text-gray-500 mt-1">The AI hasn't detected any high-risk students recently.</p>
                    </div>
                ) : (
                    alerts.map((alert) => {
                        let data: any = null;
                        try { data = JSON.parse(alert.message); } catch (e) { data = { legacy: true, text: alert.message }; }

                        return (
                            <div key={alert.id} className={`bg-white rounded-3xl border transition-all overflow-hidden ${alert.read ? 'border-gray-100 opacity-60' : 'border-primary/20 shadow-xl shadow-primary/5 ring-1 ring-primary/5'}`}>
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* Left Side: Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className={`mt-1 p-2 rounded-lg ${alert.read ? 'bg-gray-100 text-gray-400' : 'bg-red-50 text-red-500 pulse'}`}>
                                                    <AlertTriangle className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center flex-wrap gap-2 mb-1">
                                                        <h3 className="font-bold text-lg md:text-xl text-gray-900 truncate">
                                                            {alert.title || 'Risk Warning'}
                                                        </h3>
                                                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            AI Detected
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <Clock size={12} />
                                                        {new Date(alert.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </div>
                                                </div>
                                            </div>

                                            {data.metrics ? (
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                                                    {[
                                                        { label: 'Weekly Hours', val: `${data.metrics.weekly_hours}h`, color: 'text-blue-600' },
                                                        { label: 'Focus Score', val: `${data.metrics.focus_score}%`, color: 'text-purple-600' },
                                                        { label: 'Readiness', val: `${data.metrics.readiness_score}%`, color: 'text-emerald-600' },
                                                        { label: 'Inactivity', val: `${data.metrics.days_since_active}d`, color: 'text-orange-600' },
                                                    ].map((m, i) => (
                                                        <div key={i} className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100/50">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">{m.label}</p>
                                                            <p className={`text-lg font-bold ${m.color}`}>{m.val}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-2xl">
                                                    {data.text || alert.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Right Side: Actions */}
                                        <div className="flex flex-row lg:flex-col gap-3 min-w-[160px]">
                                            {!alert.read && (
                                                <button 
                                                    onClick={() => markAsRead(alert.id)}
                                                    className="flex-1 lg:flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                                                >
                                                    <CheckCircle size={18} />
                                                    Resolve
                                                </button>
                                            )}
                                            {alert.action_url && (
                                                <a 
                                                    href={alert.action_url} 
                                                    className="flex-1 lg:flex-none px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-2xl border border-gray-200 flex items-center justify-center gap-2 transition-all hover:border-gray-300"
                                                >
                                                    <Search size={18} />
                                                    Explorer
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

