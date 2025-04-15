import { useAuthStore } from '@/store/authStore';
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

export default function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const { isAuthenticated, token, checkAuth } = useAuthStore();
  const location = useLocation();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Component />;
}