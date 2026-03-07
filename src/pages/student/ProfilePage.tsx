import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Award, Settings, Save, X, Camera, School, Hash, Book, ShieldCheck, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { emailService } from '../../services/emailService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function ProfilePage() {
    const { profile, refreshProfile } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    // Security State
    const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [otpSuccess, setOtpSuccess] = useState<string | null>(null);
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        github: '',
        linkedin: '',
        portfolio: ''
    });

    useEffect(() => {
        if (profile && 'xp' in profile) {
            setFormData({
                full_name: profile.full_name || '',
                bio: profile.bio || '',
                github: (profile.social_links as any)?.github || '',
                linkedin: (profile.social_links as any)?.linkedin || '',
                portfolio: (profile.social_links as any)?.portfolio || ''
            });
        }
    }, [profile]);

    const handleSave = async () => {
        if (!profile) return;
        setLoading(true);
        try {
            const updates = {
                full_name: formData.full_name,
                bio: formData.bio,
                social_links: {
                    github: formData.github,
                    linkedin: formData.linkedin,
                    portfolio: formData.portfolio
                }
            };

            const { error } = await supabase
                .from('students')
                .update(updates)
                .eq('id', profile.id);

            if (error) throw error;

            await refreshProfile();
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0 || !profile) {
            return;
        }

        setUploading(true);
        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile
            const { error: updateError } = await supabase
                .from('students')
                .update({ avatar_url: publicUrl })
                .eq('id', profile.id);

            if (updateError) throw updateError;

            await refreshProfile();
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Make sure the image is less than 2MB.');
        } finally {
            setUploading(false);
        }
    };

    const handleRequestOtp = async () => {
        setOtpLoading(true);
        setOtpError(null);
        setOtpSuccess(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.email) throw new Error("No email associated with account.");

            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins

            const { error: insertError } = await supabase
                .from('password_reset_otps')
                .insert({
                    user_id: user.id,
                    email: user.email,
                    otp_code: generatedOtp,
                    otp_hash: generatedOtp, // simple for MVP
                    expires_at: expiresAt
                });

            if (insertError) throw insertError;

            await emailService.sendPasswordResetOtp(user.email, generatedOtp);

            setOtpSuccess(`OTP sent to ${user.email}`);
            setOtpStep('verify');
        } catch (err: any) {
            setOtpError(err.message || 'Failed to request OTP');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtpAndUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setOtpLoading(true);
        setOtpError(null);
        setOtpSuccess(null);

        try {
            if (newPassword !== confirmPassword) {
                throw new Error("Passwords do not match.");
            }
            if (newPassword.length < 6) {
                throw new Error("Password must be at least 6 characters.");
            }

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Verify OTP
            const { data: otps, error: otpError } = await supabase
                .from('password_reset_otps')
                .select('*')
                .eq('user_id', user.id)
                .eq('otp_code', otpCode)
                .eq('is_used', false)
                .gte('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(1);

            if (otpError || !otps || otps.length === 0) {
                throw new Error("Invalid or expired OTP.");
            }

            // Update Password via Supabase Auth
            const { error: updateAuthError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateAuthError) throw updateAuthError;

            // Mark OTP as used
            await supabase
                .from('password_reset_otps')
                .update({ is_used: true })
                .eq('id', otps[0].id);

            setOtpSuccess("Password changed successfully!");
            setOtpStep('request');
            setOtpCode('');
            setNewPassword('');
            setConfirmPassword('');

        } catch (err: any) {
            setOtpError(err.message || 'Failed to update password');
        } finally {
            setOtpLoading(false);
        }
    };


    if (!profile || !('xp' in profile)) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ─── Banner ────────────────────────────────────────────── */}
            <div className="relative h-40 sm:h-48 bg-gradient-to-r from-violet-600 to-indigo-600">
                {/* Edit / Save Actions — always top-right inside banner */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    {activeTab === 'profile' && (
                        isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    disabled={loading}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-violet-700 text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-60"
                                >
                                    <Save className="w-4 h-4" /> {loading ? 'Saving…' : 'Save'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors backdrop-blur-sm"
                            >
                                <Settings className="w-4 h-4" /> Edit Profile
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* ─── Profile Card — avatar overlaps banner bottom by 48px ── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Avatar row */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mt-[-48px] mb-4">
                    {/* Avatar */}
                    <div className="relative group flex-shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1 shadow-lg border-4 border-white">
                            <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden relative">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-gray-400" />
                                )}
                                <div
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-xl"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-violet-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Name / email / badges — pushed below the banner overlap on mobile */}
                    <div className="flex-1 min-w-0 pt-14 sm:pt-3 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-wrap">
                            <div className="min-w-0">
                                {isEditing && activeTab === 'profile' ? (
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="text-2xl font-bold text-gray-900 border-b-2 border-violet-300 focus:border-violet-600 outline-none bg-transparent w-full sm:max-w-xs"
                                    />
                                ) : (
                                    <h2 className="text-2xl font-bold text-gray-900 truncate">{profile.full_name}</h2>
                                )}
                                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1 text-gray-500 text-sm mt-1">
                                    <span className="flex items-center gap-1 min-w-0">
                                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="truncate">{profile.email}</span>
                                    </span>
                                    <span className="hidden sm:inline text-gray-300">•</span>
                                    <span className="flex items-center gap-1">
                                        <School className="w-3.5 h-3.5 flex-shrink-0" />
                                        Computer Science &amp; Engineering
                                    </span>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap justify-center sm:justify-end gap-2 flex-shrink-0">
                                <Badge variant="success" size="lg">{profile.level}</Badge>
                                <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm border border-yellow-100">
                                    <Award className="w-4 h-4" />
                                    {profile.xp} XP
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'profile' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User className="w-4 h-4 inline-block mr-2 mb-0.5" />
                        My Profile
                    </button>
                    <button
                        className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'security' ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <ShieldCheck className="w-4 h-4 inline-block mr-2 mb-0.5" />
                        Security Settings
                    </button>
                </div>

                {/* ─── Content Grid ─────────────────────────────────────── */}
                {activeTab === 'profile' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 animate-in fade-in slide-in-from-bottom-2">
                        {/* Left / Main */}
                        <div className="lg:col-span-2 space-y-5">
                            {/* About Me */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                <h3 className="text-base font-bold text-gray-900 mb-3">About Me</h3>
                                {isEditing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none min-h-[100px] resize-none text-sm"
                                        placeholder="Tell us about yourself…"
                                    />
                                ) : (
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {profile.bio || 'No bio added yet. Click Edit Profile to add one!'}
                                    </p>
                                )}
                            </div>

                            {/* Academic Details */}
                            <div
                                className="grid gap-4"
                                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
                            >
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                        <span className="font-semibold text-gray-700 text-sm">Register Number</span>
                                    </div>
                                    <p className="text-gray-900 font-mono text-sm pl-6">{profile.register_number || 'N/A'}</p>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Book className="w-4 h-4 text-gray-400" />
                                        <span className="font-semibold text-gray-700 text-sm">Current Semester</span>
                                    </div>
                                    <p className="text-gray-900 text-sm pl-6">6th Semester</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-5">
                            {/* Profile Completion */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                <h3 className="font-bold text-gray-900 mb-4 text-sm">Profile Completion</h3>
                                <div className="flex justify-center mb-4">
                                    <ProgressRing progress={profile.profile_completion || 30} size="lg" />
                                </div>
                                <p className="text-center text-xs text-gray-500">Complete your profile to unlock more features!</p>
                            </div>

                            {/* Social Links */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                <h3 className="font-bold text-gray-900 mb-3 text-sm">Social Links</h3>
                                <div className="space-y-3">
                                    {(['github', 'linkedin', 'portfolio'] as const).map((platform) => (
                                        <div key={platform}>
                                            <label className="text-[10px] font-semibold text-gray-400 uppercase mb-1 block tracking-wider">
                                                {platform}
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData[platform]}
                                                    onChange={(e) => setFormData({ ...formData, [platform]: e.target.value })}
                                                    className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:border-violet-500 outline-none"
                                                    placeholder={`Your ${platform} URL`}
                                                />
                                            ) : (
                                                <a
                                                    href={formData[platform] || '#'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={`block w-full p-2 rounded-lg border text-sm truncate ${formData[platform] ? 'border-gray-100 text-violet-600 hover:bg-violet-50' : 'border-gray-100 text-gray-400 pointer-events-none'}`}
                                                >
                                                    {formData[platform] || 'Not set'}
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                                <div className="bg-violet-100 p-3 rounded-2xl">
                                    <KeyRound className="w-8 h-8 text-violet-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                                    <p className="text-gray-500 mt-1">Manage your account security using One-Time Passwords.</p>
                                </div>
                            </div>

                            {otpError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 mb-6">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm font-medium">{otpError}</p>
                                </div>
                            )}

                            {otpSuccess && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3 mb-6">
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm font-medium">{otpSuccess}</p>
                                </div>
                            )}

                            {otpStep === 'request' ? (
                                <div className="text-center py-6">
                                    <p className="text-gray-600 mb-8">
                                        To securely change your password, we'll send a 6-digit One-Time Password (OTP) to your registered email address <strong>{profile.email}</strong>.
                                    </p>
                                    <Button
                                        onClick={handleRequestOtp}
                                        isLoading={otpLoading}
                                        className="bg-violet-600 hover:bg-violet-700 text-white min-w-[200px]"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Request OTP
                                        </span>
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleVerifyOtpAndUpdatePassword} className="space-y-5">
                                    <p className="text-sm text-gray-500 mb-2">We sent a 6-digit code to {profile.email}. It expires in 10 minutes.</p>

                                    <Input
                                        label="OTP Code from Email"
                                        placeholder="Enter 6-digit OTP"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                        maxLength={6}
                                        required
                                        className="font-mono text-center tracking-widest text-lg h-14"
                                    />

                                    <Input
                                        label="New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="h-12"
                                    />

                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="h-12"
                                    />

                                    <div className="pt-4 flex gap-3 justify-end items-center">
                                        <button
                                            type="button"
                                            onClick={() => setOtpStep('request')}
                                            className="text-gray-500 hover:text-gray-700 font-bold text-sm px-4"
                                        >
                                            Cancel
                                        </button>
                                        <Button
                                            type="submit"
                                            isLoading={otpLoading}
                                            className="bg-violet-600 hover:bg-violet-700"
                                        >
                                            <span className="flex items-center gap-2">
                                                Update Password
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
