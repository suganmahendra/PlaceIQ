import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Award, Settings, Save, X, Camera, School, Hash, Book } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';

export function ProfilePage() {
    const { profile, refreshProfile } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                github: (profile.social_links as any)?.github || '',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                linkedin: (profile.social_links as any)?.linkedin || '',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    if (!profile || !('xp' in profile)) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="w-full">
                {/* Cover Background - Full Width */}
                <div className="h-64 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
                    <div className="absolute inset-0 bg-black/10"></div>

                    {/* Header Actions - Absolute positioned on cover or top */}
                    <div className="absolute top-6 right-6 z-10">
                        {isEditing ? (
                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={() => setIsEditing(false)} disabled={loading}>
                                    <X className="w-4 h-4 mr-2" /> Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={loading} className="bg-white text-primary hover:bg-gray-100 border-none">
                                    <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/40">
                                <Settings className="w-4 h-4 mr-2" /> Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-12 relative">
                    {/* Avatar Section */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden relative">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-16 h-16 text-gray-400" />
                                    )}

                                    {/* Upload Overlay */}
                                    <div
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </div>
                            </div>
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-2xl">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="mt-4 md:mt-0 md:pl-40 pt-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-4 text-center md:text-left">
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    className="text-3xl font-bold text-gray-900 border-b-2 border-primary/20 focus:border-primary outline-none bg-transparent px-1 text-center md:text-left w-full"
                                />
                            ) : (
                                <h2 className="text-3xl font-bold text-gray-900">{profile.full_name}</h2>
                            )}
                            <div className="flex flex-col md:flex-row items-center gap-2 text-gray-600 mt-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>{profile.email}</span>
                                </div>
                                <span className="hidden md:inline text-gray-300">|</span>
                                <div className="flex items-center gap-2">
                                    <School className="w-4 h-4" />
                                    <span>Computer Science & Engineering</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Badge variant="success" size="lg">{profile.level}</Badge>
                            <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-1.5 rounded-full font-bold text-sm border border-yellow-100">
                                <Award className="w-4 h-4" />
                                {profile.xp} XP
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">About Me</h3>
                                {isEditing ? (
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[120px] resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-600 leading-relaxed">
                                        {profile.bio || "No bio added yet. Click edit to add a bio!"}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Hash className="w-5 h-5 text-gray-400" />
                                        <span className="font-semibold text-gray-700">Register Number</span>
                                    </div>
                                    <p className="text-gray-900 font-mono pl-8">{profile.register_number || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Book className="w-5 h-5 text-gray-400" />
                                        <span className="font-semibold text-gray-700">Current Semester</span>
                                    </div>
                                    <p className="text-gray-900 pl-8">6th Semester</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Stats */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-6">Profile Completion</h3>
                                <div className="flex justify-center mb-6">
                                    <ProgressRing progress={profile.profile_completion || 30} size="lg" />
                                </div>
                                <p className="text-center text-sm text-gray-500">
                                    Complete your profile to unlock more features!
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="font-bold text-gray-900 mb-4">Social Links</h3>
                                <div className="space-y-3">
                                    {['Github', 'Linkedin', 'Portfolio'].map((platform) => {
                                        const key = platform.toLowerCase() as keyof typeof formData;
                                        return (
                                            <div key={platform}>
                                                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">{platform}</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={formData[key]}
                                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                                        className="w-full p-2 rounded-lg border border-gray-200 text-sm focus:border-primary outline-none"
                                                        placeholder={`Your ${platform} URL`}
                                                    />
                                                ) : (
                                                    <a
                                                        href={(formData[key] as string) || '#'}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={`block w-full p-2 rounded-lg border border-gray-100 text-sm truncate ${formData[key] ? 'text-primary hover:bg-primary/5' : 'text-gray-400 cursor-not-allowed'}`}
                                                    >
                                                        {(formData[key] as string) || 'Not set'}
                                                    </a>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
