import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // Redirection basée sur le rôle
    if (user?.role_id === 2) {
      navigate('/dashboard/entreprise', { replace: true });
    } else if (user?.role_id === 1) {
      navigate('/dashboard/particulier', { replace: true });
    } else {
      // Rôle inconnu, rediriger vers l'accueil
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // Afficher un loader pendant la redirection
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-bg-light via-white to-primary/5">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
      <p className="mt-6 text-gray-dark font-semibold">Chargement...</p>
    </div>
  );
}
