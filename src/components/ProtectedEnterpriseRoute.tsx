import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedEnterpriseRouteProps {
  children: ReactNode;
}

export const ProtectedEnterpriseRoute = ({ children }: ProtectedEnterpriseRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0055A4]"></div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier si l'utilisateur est une entreprise (role_id === 2)
  if (user?.role_id !== 2) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
