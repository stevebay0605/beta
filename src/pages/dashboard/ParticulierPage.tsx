import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRoleName } from '../../hooks/useRoleName';
import { useDashboardStats, UserStats } from '../../hooks/useDashboardStats';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { LogOut, BookOpen, Award, Clock, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ParticulierPage() {
  const { user, logout } = useAuth();
  const { roleName } = useRoleName(user?.role_id);
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats('user');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0055A4]"></div>
      </div>
    );
  }

  const userStats = stats as UserStats;

  const formationsWidth = ((userStats?.completedFormations || 0) /
    ((userStats?.enrolledFormations || 0) + (userStats?.completedFormations || 0) || 1)) *
    100;
  
  const certificatesWidth = Math.min(((userStats?.certificates || 0) / 5) * 100, 100);
  
  const hoursWidth = Math.min(((userStats?.hoursLearned || 0) / 1000) * 100, 100);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-bg-light via-white to-primary/5">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Tableau de bord Apprenant
            </h1>
            <p className="text-gray-dark text-lg">
              Bienvenue, {user?.name}! Continuez votre apprentissage.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Formations en cours */}
            <div className="bg-white rounded-xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-dark">Formations</h3>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-primary" size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-xdark">{userStats?.enrolledFormations || 0}</p>
              <p className="text-xs text-gray-dark mt-2">En cours</p>
            </div>

            {/* Formations complétées */}
            <div className="bg-white rounded-xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-dark">Complétées</h3>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-success" size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-xdark">{userStats?.completedFormations || 0}</p>
              <p className="text-xs text-gray-dark mt-2">Formations terminées</p>
            </div>

            {/* Certificats */}
            <div className="bg-white rounded-xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-dark">Certificats</h3>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Award className="text-accent" size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-xdark">{userStats?.certificates || 0}</p>
              <p className="text-xs text-gray-dark mt-2">Obtenus</p>
            </div>

            {/* Heures d'apprentissage */}
            <div className="bg-white rounded-xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-dark">Apprentissage</h3>
                <div className="w-10 h-10 bg-blue-sky/10 rounded-lg flex items-center justify-center">
                  <Clock className="text-blue-sky" size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-xdark">{userStats?.hoursLearned || 0}h</p>
              <p className="text-xs text-gray-dark mt-2">Heures totales</p>
            </div>
          </div>

          {/* Graphique d'inscriptions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Évolution des inscriptions */}
            <div className="bg-white rounded-2xl border border-gray-medium shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-xdark mb-6">Inscriptions par mois</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userStats?.enrollmentsByMonth || []}>
                  <defs>
                    <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0055A4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0055A4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#0055A4"
                    fillOpacity={1}
                    fill="url(#colorEnrollments)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Progression générale */}
            <div className="bg-white rounded-2xl border border-gray-medium shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-xdark mb-6">Progression générale</h2>
              <div className="space-y-6">
                {/* Barre de progression - Formations */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">Formations en cours</span>
                    <span className="text-sm font-bold text-[#0055A4]">
                      {userStats?.enrolledFormations || 0}/{(userStats?.enrolledFormations || 0) + (userStats?.completedFormations || 0) || 0}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-[#0055A4] transition-all duration-300 ease-in-out"
                      style={{ width: `${formationsWidth}%` }}
                    ></div>
                  </div>
                </div>

                {/* Barre de progression - Certificats */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">Certificats obtenus</span>
                    <span className="text-sm font-bold text-[#F58220]">{userStats?.certificates || 0}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-[#F58220] transition-all duration-300 ease-in-out"
                      style={{ width: `${certificatesWidth}%` }}
                    ></div>
                  </div>
                </div>

                {/* Barre de progression - Heures */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-slate-700">Heures d'apprentissage</span>
                    <span className="text-sm font-bold text-purple-600">{userStats?.hoursLearned || 0}h / 1000h</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-purple-600 transition-all duration-300 ease-in-out"
                      style={{ width: `${hoursWidth}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profil & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profil Card */}
            <div className="bg-white rounded-2xl border border-gray-medium shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-xdark mb-4">Mon Profil</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-dark font-semibold uppercase">Nom</p>
                  <p className="text-sm text-gray-xdark font-semibold">{user?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-dark font-semibold uppercase">Email</p>
                  <p className="text-sm text-gray-xdark font-semibold break-all">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-dark font-semibold uppercase">Rôle</p>
                  <p className="text-sm text-gray-xdark font-semibold capitalize">
                    {roleName || user?.role?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-dark font-semibold uppercase">Genre</p>
                  <p className="text-sm text-gray-xdark font-semibold capitalize">
                    {user?.genre === 'M' ? 'Masculin' : user?.genre === 'F' ? 'Féminin' : user?.genre || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-medium shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-xdark mb-4">Actions rapides</h2>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/catalogue"
                  className="flex items-center justify-center gap-2 p-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all duration-200 font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 border border-primary/20"
                >
                  <BookOpen size={18} />
                  Formations
                </a>
                <a
                  href="/profile"
                  className="flex items-center justify-center gap-2 p-4 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl transition-all duration-200 font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 border border-accent/20"
                >
                  <Award size={18} />
                  Mon profil
                </a>
                <a
                  href="/"
                  className="flex items-center justify-center gap-2 p-4 bg-blue-sky/10 hover:bg-blue-sky/20 text-blue-sky rounded-xl transition-all duration-200 font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 border border-blue-sky/20"
                >
                  <BookOpen size={18} />
                  Accueil
                </a>
                <a
                  href="/catalogue"
                  className="flex items-center justify-center gap-2 p-4 bg-success/10 hover:bg-success/20 text-success rounded-xl transition-all duration-200 font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 border border-success/20"
                >
                  <TrendingUp size={18} />
                  Parcours
                </a>
                <button
                  onClick={handleLogout}
                  className="col-span-2 flex items-center justify-center gap-2 p-4 bg-error/10 hover:bg-error/20 text-error rounded-xl transition-all duration-200 font-semibold text-sm hover:shadow-md hover:-translate-y-0.5 border border-error/20"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
