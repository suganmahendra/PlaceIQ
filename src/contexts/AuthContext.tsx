import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';
import type { UserRole } from '../services/authService';
import type { Database } from '../types/database.types';

type StudentProfile = Database['public']['Tables']['students']['Row'];
type MentorProfile = Database['public']['Tables']['mentors']['Row'];

interface AuthContextType {
    user: User | null;
    session: Session | null;
    role: UserRole | null;
    profile: StudentProfile | MentorProfile | null;
    loading: boolean;
    isInitialized: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [profile, setProfile] = useState<StudentProfile | MentorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    const ensureProfileExists = React.useCallback(async (user: User, userRole: UserRole) => {
        const table = userRole === 'mentor' ? 'mentors' : 'students';

        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error || !data) {
            console.log(`Profile missing for ${userRole}, auto-creating...`);
            // Auto-creation logic (Self-healing)
            const fullName = user.user_metadata?.full_name || 'User';

            if (userRole === 'mentor') {
                const { data: newMentor, error: insertError } = await supabase
                    .from('mentors')
                    .insert({
                        user_id: user.id,
                        full_name: fullName,
                        expertise: user.user_metadata?.expertise || 'AI Expert',
                    })
                    .select()
                    .single();
                if (!insertError) setProfile(newMentor);
            } else {
                const { data: newStudent, error: insertError } = await supabase
                    .from('students')
                    .insert({
                        user_id: user.id,
                        full_name: fullName,
                        email: user.email || '', // Essential for the new NOT NULL column
                        register_number: user.user_metadata?.register_number || null,
                        level: 'Beginner',
                        xp: 0,
                        readiness_score: 0,
                        profile_completion: 20,
                        social_links: { github: "", linkedin: "", portfolio: "" }
                    })
                    .select()
                    .single();
                if (!insertError) setProfile(newStudent);
                else console.error('Failed to auto-create student profile:', insertError);
            }
        } else {
            setProfile(data);
        }
    }, []);

    const initializeAuth = React.useCallback(async (currentSession: Session | null) => {
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
            try {
                // 1. Fetch Role
                let userRole = await authService.fetchUserRole(currentUser.id);

                // If role is missing from user_roles, default to student (as per trigger logic)
                if (!userRole) {
                    const fallbackRole = (currentUser.user_metadata?.role as UserRole) || 'student';
                    await supabase.from('user_roles').upsert({
                        user_id: currentUser.id,
                        role: fallbackRole
                    });
                    userRole = fallbackRole;
                }
                setRole(userRole);

                // 2. Fetch/Auto-Initialize Profile
                await ensureProfileExists(currentUser, userRole);
            } catch (error) {
                console.error('Error during auth initialization:', error);
            }
        } else {
            setRole(null);
            setProfile(null);
        }

        setLoading(false);
        setIsInitialized(true);
    }, [ensureProfileExists]);

    const refreshProfile = React.useCallback(async () => {
        if (user && role) {
            await ensureProfileExists(user, role);
        }
    }, [user, role, ensureProfileExists]);

    useEffect(() => {
        // Handle initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            initializeAuth(session);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            initializeAuth(session);
        });

        return () => subscription.unsubscribe();
    }, [initializeAuth]);

    const signOut = async () => {
        await authService.logoutUser();
        setSession(null);
        setUser(null);
        setRole(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            role,
            profile,
            loading,
            isInitialized,
            signOut,
            refreshProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
