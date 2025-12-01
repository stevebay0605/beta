import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRoleName } from '../../hooks/useRoleName';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { LogOut, Users, BookOpen, BarChart3 } from 'lucide-react';

export default function EnterprisePage() {
  const { user, logout } = useAuth();
  const { roleName } = useRoleName(user?.role_id);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-slate-900 mb-4">
              Tableau de bord Entreprise
            </h1>
            <p className="text-slate-600 text-lg">
              Bienvenue, {user?.name}! Gérez vos formations et apprenants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Profil Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Profil Entreprise
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-600 font-medium">Nom</p>
                  <p className="text-lg text-slate-900 font-semibold">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Email</p>
                  <p className="text-lg text-slate-900 font-semibold">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Rôle</p>
                  <p className="text-lg text-slate-900 font-semibold capitalize">
                    {roleName || user?.role?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Téléphone</p>
                  <p className="text-lg text-slate-900 font-semibold">{user?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Statistiques Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Statistiques
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-[#0055A4]" />
                    <span className="text-slate-700 font-medium">Formations créées</span>
                  </div>
                  <span className="text-2xl font-bold text-[#0055A4]">0</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-[#F58220]" />
                    <span className="text-slate-700 font-medium">Apprenants inscrits</span>
                  </div>
                  <span className="text-2xl font-bold text-[#F58220]">0</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                    <span className="text-slate-700 font-medium">Taux de complétion</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/enterprise/formations"
                className="flex items-center justify-between p-4 bg-[#0055A4]/10 hover:bg-[#0055A4]/20 rounded-lg transition"
              >
                <span className="font-bold text-[#0055A4]">Gestion de Mes formations</span>
                <span>→</span>
              </a>
              <a
                href="/catalogue"
                className="flex items-center justify-between p-4 bg-purple-100 hover:bg-purple-200 rounded-lg transition"
              >
                <span className="font-bold text-purple-700">Voir le catalogue</span>
                <span>→</span>
              </a>
              <a
                href="/"
                className="flex items-center justify-between p-4 bg-[#F58220]/10 hover:bg-[#F58220]/20 rounded-lg transition"
              >
                <span className="font-bold text-[#F58220]">Retour à l'accueil</span>
                <span>→</span>
              </a>
              <button
                onClick={handleLogout}
                className="md:col-span-2 flex items-center justify-center gap-2 p-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition font-bold"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
