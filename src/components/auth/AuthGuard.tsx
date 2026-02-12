import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: ('student' | 'mentor' | 'admin')[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
    const { user, role, loading, isInitialized } = useAuth();
    const location = useLocation();

    if (loading || !isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF5FF]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-secondary font-medium animate-pulse">Initializing Secure Session...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard if role doesn't match
        const targetPath = role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard';
        return <Navigate to={targetPath} replace />;
    }

    return <>{children}</>;
};
