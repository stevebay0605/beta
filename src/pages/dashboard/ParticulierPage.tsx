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
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-grow bg-slate-50">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-slate-900 mb-4">
              Tableau de bord Apprenant
            </h1>
            <p className="text-slate-600 text-lg">
              Bienvenue, {user?.name}! Continuez votre apprentissage.
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Formations en cours */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Formations</h3>
                <BookOpen className="text-[#0055A4]" size={20} />
              </div>
              <p className="text-3xl font-black text-slate-900">{userStats?.enrolledFormations || 0}</p>
              <p className="text-xs text-slate-500 mt-2">En cours</p>
            </div>

            {/* Formations complétées */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Complétées</h3>
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <p className="text-3xl font-black text-slate-900">{userStats?.completedFormations || 0}</p>
              <p className="text-xs text-slate-500 mt-2">Formations terminées</p>
            </div>

            {/* Certificats */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Certificats</h3>
                <Award className="text-[#F58220]" size={20} />
              </div>
              <p className="text-3xl font-black text-slate-900">{userStats?.certificates || 0}</p>
              <p className="text-xs text-slate-500 mt-2">Obtenus</p>
            </div>

            {/* Heures d'apprentissage */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Apprentissage</h3>
                <Clock className="text-purple-600" size={20} />
              </div>
              <p className="text-3xl font-black text-slate-900">{userStats?.hoursLearned || 0}h</p>
              <p className="text-xs text-slate-500 mt-2">Heures totales</p>
            </div>
          </div>

          {/* Graphique d'inscriptions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Évolution des inscriptions */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Inscriptions par mois</h2>
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
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Progression générale</h2>
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
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Mon Profil</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Nom</p>
                  <p className="text-sm text-slate-900 font-semibold">{user?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Email</p>
                  <p className="text-sm text-slate-900 font-semibold break-all">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Rôle</p>
                  <p className="text-sm text-slate-900 font-semibold capitalize">
                    {roleName || user?.role?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Genre</p>
                  <p className="text-sm text-slate-900 font-semibold capitalize">
                    {user?.genre === 'M' ? 'Masculin' : user?.genre === 'F' ? 'Féminin' : user?.genre || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Actions rapides</h2>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/catalogue"
                  className="flex items-center justify-center gap-2 p-4 bg-[#0055A4]/10 hover:bg-[#0055A4]/20 text-[#0055A4] rounded-lg transition font-semibold text-sm"
                >
                  <BookOpen size={18} />
                  Formations
                </a>
                <a
                  href="/profile"
                  className="flex items-center justify-center gap-2 p-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition font-semibold text-sm"
                >
                  <Award size={18} />
                  Mon profil
                </a>
                <a
                  href="/"
                  className="flex items-center justify-center gap-2 p-4 bg-[#F58220]/10 hover:bg-[#F58220]/20 text-[#F58220] rounded-lg transition font-semibold text-sm"
                >
                  <BookOpen size={18} />
                  Accueil
                </a>
                <a
                  href="/catalogue"
                  className="flex items-center justify-center gap-2 p-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition font-semibold text-sm"
                >
                  <TrendingUp size={18} />
                  Parcours
                </a>
                <button
                  onClick={handleLogout}
                  className="col-span-2 flex items-center justify-center gap-2 p-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition font-semibold text-sm"
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
