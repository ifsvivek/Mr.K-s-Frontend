import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/Context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthContext();
  const location = useLocation();

  // Store the attempted URL for redirecting after login
  if (!isAuthenticated && requireAuth) {
    localStorage.setItem('redirectUrl', location.pathname);
    return <Navigate to="/user-login" replace />;
  }

  // If admin route but user is not admin
  if (requireAdmin && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // If trying to access login/signup while already authenticated
  if (isAuthenticated && !requireAuth && location.pathname !== '/dashboard') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
