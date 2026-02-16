import type { Json } from '../types/database.types';
import { supabase } from '../lib/supabase';

export type UserRole = 'student' | 'mentor' | 'admin';

export interface SecurityEvent {
    eventType: 'login' | 'logout' | 'reset' | 'fail' | 'register';
    ipAddress?: string;
    deviceInfo?: Json;
}

export const authService = {
    /**
     * Register a new student
     */
    async registerStudent(
        email: string,
        password: string,
        fullName: string,
        department: string = 'AI & Data Science',
        registerNumber: string
    ) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: 'student',
                    department: department,
                    register_number: registerNumber
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
        // Check for session to ensure we don't return false success if session is missing (verification required)
        if (data.user && !data.session) {
            // Verification required
            return { user: data.user, session: null, verificationRequired: true };
        }
        return data;
    },

    /**
     * Register a new mentor
     */
    async registerMentor(email: string, password: string, fullName: string, expertise: string) {
        // Enforce Organization Email Domain
        if (!email.toLowerCase().endsWith('@mahendracollege.com')) {
            throw new Error('Mentors must use an official @mahendracollege.com email address.');
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: 'mentor',
                    expertise: expertise,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
        if (data.user && !data.session) {
            return { user: data.user, session: null, verificationRequired: true };
        }
        return data;
    },

    /**
     * Sign in with Google (Student)
     */
    async signInWithGoogleStudent() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?role=student`, // Use callback to handle profile check
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            },
        });

        if (error) throw error;
        return data;
    },

    /**
     * Sign in with Google (Mentor)
     */
    async signInWithGoogleMentor() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?role=mentor`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            },
        });

        if (error) throw error;
        return data;
    },

    /**
     * Login user
     */
    async loginUser(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.message.includes('Email not confirmed')) {
                    throw new Error('Please verify your email address before signing in.');
                }
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Invalid email or password. Please try again.');
                }
                if (error.message.includes('Failed to fetch')) {
                    throw new Error('Connection error: Please check your internet or Supabase configuration.');
                }
                throw error;
            }

            // Fetch role after login
            if (data.user) {
                await this.trackSecurityEvent(data.user.id, 'login');
                const role = await this.fetchUserRole(data.user.id);
                return { ...data, role };
            }

            return data;
        } catch (err) {
            console.error('Login implementation error:', err);
            throw err;
        }
    },

    /**
     * Logout user
     */
    async logoutUser() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await this.trackSecurityEvent(user.id, 'logout');
        }
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Request password reset (send email)
     */
    async requestPasswordReset(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/update-password`,
        });
        if (error) throw error;
    },

    /**
     * Update password
     */
    async updatePassword(newPassword: string) {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await this.trackSecurityEvent(user.id, 'reset');
        }
    },

    /**
     * Resend verification email
     */
    async resendVerification(email: string) {
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${window.location.origin}/login`,
            },
        });
        if (error) throw error;
    },

    /**
     * Fetch current user and profile
     */
    async fetchCurrentUser() {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return null;

        const role = await this.fetchUserRole(user.id);
        let profile = null;

        if (role === 'student') {
            const { data } = await supabase
                .from('students')
                .select('*')
                .eq('user_id', user.id)
                .single();
            profile = data;
        } else if (role === 'mentor') {
            const { data } = await supabase
                .from('mentors')
                .select('*')
                .eq('user_id', user.id)
                .single();
            profile = data;
        }

        return { ...user, role, profile };
    },

    /**
     * Fetch user role
     */
    async fetchUserRole(userId: string): Promise<UserRole | null> {
        const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (error || !data) return null;
        return data.role as UserRole;
    },

    /**
     * Track security event
     */
    async trackSecurityEvent(userId: string, eventType: SecurityEvent['eventType']) {
        const { error } = await supabase
            .from('user_security_logs')
            .insert({
                user_id: userId,
                event_type: eventType,
                ip_address: '127.0.0.1', // In production, this would be captured from edge function
                device_info: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language,
                },
            });

        if (error) console.error('Failed to log security event:', error);
    }
};
