import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useRoleName } from '../../hooks/useRoleName';
import { useDashboardStats, DashboardStats } from '../../hooks/useDashboardStats';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { LogOut, Users, BookOpen, BarChart3, TrendingUp, DollarSign } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function EnterprisePage() {
  const { user, logout } = useAuth();
  const { roleName } = useRoleName(user?.role_id);
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats('enterprise');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const COLORS = ['#0055A4', '#F58220', '#10b981', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0055A4]"></div>
      </div>
    );
  }

  const dashboardStats = stats as DashboardStats;

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-grow bg-slate-50">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-slate-900 mb-4">
              Tableau de bord Entreprise
            </h1>
            <p className="text-slate-600 text-lg">
              Bienvenue, {user?.name}! Gérez vos formations et apprenants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Formations</h3>
                <BookOpen className="text-[#0055A4]" size={20} />
              </div>
              <p className="text-3xl font-black text-slate-900">{dashboardStats?.totalFormations || 0}</p>
              <p className="text-xs text-slate-500 mt-2">Formations créées</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Utilisateurs</h3>
                <Users className="text-[#F58220]" size={20} />
              </div>
              <p className="text-3xl font-black text-slate-900">{dashboardStats?.totalUsers || 0}</p>
              <p className="text-xs text-slate-500 mt-2">Apprenants inscrits</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Inscriptions</h3>
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <p className="text-3xl font-black text-slate-900">{dashboardStats?.totalEnrolments || 0}</p>
              <p className="text-xs text-slate-500 mt-2">Total inscriptions</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-600">Revenus</h3>
                <DollarSign className="text-purple-600" size={20} />
              </div>
              <p className="text-2xl font-black text-slate-900 truncate">
                {formatCurrency(dashboardStats?.totalRevenue || 0)}
              </p>
              <p className="text-xs text-slate-500 mt-2">Total</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Inscriptions par mois</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardStats?.enrollmentsByMonth || []}>
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
                  <Line
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#0055A4"
                    dot={{ fill: '#0055A4', r: 4 }}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Revenus par mois</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardStats?.revenueByMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar dataKey="revenue" fill="#F58220" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Formations par catégorie</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardStats?.formationsByCategory || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardStats?.formationsByCategory?.map((_: { name: string; value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6">Top formations</h2>
              <div className="space-y-4">
                {dashboardStats?.topFormations?.map((formation, index: number) => (
                  <div key={formation.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-[#0055A4] text-white rounded-full text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{formation.title}</p>
                        <p className="text-xs text-slate-500">{formation.enrollments} inscriptions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-600" />
                      <span className="text-sm font-bold text-green-600">{formation.enrollments}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Profil Entreprise</h2>
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
                  <p className="text-xs text-slate-500 font-semibold uppercase">Téléphone</p>
                  <p className="text-sm text-slate-900 font-semibold">{user?.phone || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Actions rapides</h2>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="/enterprise/formations"
                  className="flex items-center justify-center gap-2 p-4 bg-[#0055A4]/10 hover:bg-[#0055A4]/20 text-[#0055A4] rounded-lg transition font-semibold text-sm"
                >
                  <BookOpen size={18} />
                  Mes formations
                </a>
                <a
                  href="/enterprise/formations/create"
                  className="flex items-center justify-center gap-2 p-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition font-semibold text-sm"
                >
                  <BarChart3 size={18} />
                  Créer une formation
                </a>
                <a
                  href="/catalogue"
                  className="flex items-center justify-center gap-2 p-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition font-semibold text-sm"
                >
                  <BookOpen size={18} />
                  Voir le catalogue
                </a>
                <a
                  href="/profile"
                  className="flex items-center justify-center gap-2 p-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition font-semibold text-sm"
                >
                  <Users size={18} />
                  Mon profil
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
