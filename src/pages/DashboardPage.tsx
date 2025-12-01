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
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0055A4]"></div>
    </div>
  );
}
