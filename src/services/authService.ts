import type { Json } from '../types/database.types';
import { supabase } from '../lib/supabase';

export type UserRole = 'student' | 'mentor' | 'admin';

export interface SecurityEvent {
    eventType: 'login' | 'logout' | 'reset' | 'fail' | 'register';
    ipAddress?: string;
    deviceInfo?: Json;
}

export const authService = {
    async sendStudentOtp(
        email: string,
        password: string,
        fullName: string,
        department: string = 'AI & Data Science',
        registerNumber: string
    ) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: 'student',
                        department: department,
                        register_number: registerNumber
                    }
                },
            });

            if (error) {
                console.error("Supabase Auth API Error Details:");
                console.error("- Message:", error.message);
                console.error("- Name:", error.name);
                console.error("- Status:", error.status);
                // @ts-ignore
                if (error.code) console.error("- Code:", error.code);

                if (error.message.includes('Error sending confirmation email')) {
                    throw new Error('Supabase failed to send the email through Brevo. IMPORTANT: Supabase hides the exact reason for security. To see the exact reason Brevo rejected the email, go to your Supabase Dashboard -> Logs -> Auth.');
                }

                if (error.message.includes('Failed to fetch')) {
                    throw new Error('Network error: Please check your internet connection, disable ad-blockers, or try a different network.');
                }
                throw error;
            }
            return data;
        } catch (err: any) {
            console.error('Catch Block Error (Full Object):', err);
            if (err.message && err.message.includes('Failed to fetch')) {
                throw new Error('Network error: Unable to connect to the authentication server. Please check your internet connection, disable any ad-blockers/VPN, or try a different network.');
            }
            throw err;
        }
    },

    /**
     * Send OTP to register a new mentor
     */
    async sendMentorOtp(email: string, password: string, fullName: string, expertise: string) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: 'mentor',
                        expertise: expertise,
                    }
                },
            });

            if (error) {
                console.error("Supabase Auth API Error Details:");
                console.error("- Message:", error.message);
                console.error("- Name:", error.name);
                console.error("- Status:", error.status);
                // @ts-ignore
                if (error.code) console.error("- Code:", error.code);

                if (error.message.includes('Error sending confirmation email')) {
                    throw new Error('Supabase failed to send the email through Brevo. IMPORTANT: Supabase hides the exact reason for security. To see the exact reason Brevo rejected the email, go to your Supabase Dashboard -> Logs -> Auth.');
                }

                if (error.message.includes('Failed to fetch')) {
                    throw new Error('Network error: Please check your internet connection, disable ad-blockers, or try a different network.');
                }
                throw error;
            }
            return data;
        } catch (err: any) {
            console.error('Catch Block Error (Full Object):', err);
            if (err.message && err.message.includes('Failed to fetch')) {
                throw new Error('Network error: Unable to connect to the authentication server. Please check your internet connection, disable any ad-blockers/VPN, or try a different network.');
            }
            throw err;
        }
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
     * Sign in with Password
     */
    async signInUser(email: string, password: string, expectedRole: 'student' | 'mentor', registerNumber?: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                throw new Error('Incorrect email or password.');
            }
            if (error.message.includes('Email not confirmed')) {
                throw new Error('Please verify your email address before signing in.');
            }
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Connection error: Please check your internet or Supabase configuration.');
            }
            throw error;
        }

        if (data.user) {
            const role = await this.fetchUserRole(data.user.id);

            if (expectedRole === 'student' && role && role !== 'student') {
                await this.logoutUser();
                throw new Error('Please use the Mentor login page.');
            }
            if (expectedRole === 'mentor' && role && role !== 'mentor') {
                await this.logoutUser();
                throw new Error('Please use the Student login page.');
            }

            // Additional verification for students
            if (expectedRole === 'student' && registerNumber) {
                const { data: studentData, error: studentError } = await supabase
                    .from('students')
                    .select('register_number')
                    .eq('user_id', data.user.id)
                    .single();

                if (studentError || !studentData || studentData.register_number !== registerNumber) {
                    await this.logoutUser();
                    throw new Error('Invalid registration number for this account.');
                }
            }

            await this.trackSecurityEvent(data.user.id, 'login');
            return { ...data, role };
        }

        return data;
    },

    /**
     * Verify OTP
     */
    async verifyOtp(email: string, token: string, type: 'email' | 'magiclink' | 'signup' = 'signup') {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            // @ts-ignore
            type,
        });

        if (error) throw error;

        if (data.user) {
            await this.trackSecurityEvent(data.user.id, 'register');
            const role = await this.fetchUserRole(data.user.id);
            return { ...data, role };
        }

        return data;
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
     * Check if user exists (RPC)
     */
    async checkUserExists(email: string) {
        // 1. Primary Method: RPC (Securely checks auth.users)
        try {
            // @ts-expect-error - RPC function might not be in types
            const { data, error } = await supabase.rpc('check_user_exists', {
                email_to_check: email
            });

            if (!error) return data;

            if (error.code === 'PGRST202') {
                console.warn('RPC check_user_exists not found. Falling back to public profile check...');
            } else {
                console.warn('RPC check_user_exists error:', error);
            }
        } catch (e) {
            console.error('RPC call fatal error:', e);
        }

        // 2. Fallback Method: Check public profiles table
        // Note: This only works if the user was already verified and a profile was created.
        try {
            const { data } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', email)
                .maybeSingle();

            if (data) return true;
        } catch (e) {
            // Profiles might be RLS protected, so we just continue
        }

        return false;
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
