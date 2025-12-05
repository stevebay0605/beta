import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardStats, DashboardStats } from '../../hooks/useDashboardStats';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { BookOpen, Users, TrendingUp, DollarSign, ArrowRight, Calendar, Award, BarChart3, Settings } from 'lucide-react';

export default function EnterprisePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats('enterprise');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-light via-white to-primary/5">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const dashboardStats = stats as DashboardStats;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-bg-light via-white to-primary/5">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                  Tableau de bord
                </h1>
                <p className="text-gray-dark text-lg">
                  Bienvenue, <span className="font-bold text-primary">{user?.name}</span>! Aperçu de votre activité.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-dark mb-1">Dernière connexion</p>
                <p className="text-sm font-semibold text-gray-xdark">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-dark">Formations</h3>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-primary" size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-xdark">{dashboardStats?.totalFormations || 0}</p>
              <p className="text-xs text-gray-dark mt-2">Formations créées</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-dark">Utilisateurs</h3>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Users className="text-accent" size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-xdark">{dashboardStats?.totalUsers || 0}</p>
              <p className="text-xs text-gray-dark mt-2">Apprenants inscrits</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-dark">Inscriptions</h3>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-success" size={20} />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-xdark">{dashboardStats?.totalEnrolments || 0}</p>
              <p className="text-xs text-gray-dark mt-2">Total inscriptions</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-dark">Revenus</h3>
                <div className="w-10 h-10 bg-blue-sky/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-blue-sky" size={20} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-xdark truncate">
                {formatCurrency(dashboardStats?.totalRevenue || 0)}
              </p>
              <p className="text-xs text-gray-dark mt-2">Total</p>
            </div>
          </div>

          {/* Sections principales avec liens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Mes Formations */}
            <Link
              to="/enterprise/formations"
              className="bg-white rounded-2xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="text-primary" size={28} />
                </div>
                <ArrowRight className="text-gray-dark group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-xdark mb-2">Mes Formations</h3>
              <p className="text-sm text-gray-dark mb-4">Gérez votre catalogue de formations</p>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <span>{dashboardStats?.totalFormations || 0} formations</span>
              </div>
            </Link>

            {/* Statistiques */}
            <Link
              to="/enterprise/statistiques"
              className="bg-white rounded-2xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <BarChart3 className="text-success" size={28} />
                </div>
                <ArrowRight className="text-gray-dark group-hover:text-success group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-xdark mb-2">Statistiques</h3>
              <p className="text-sm text-gray-dark mb-4">Analysez vos performances détaillées</p>
              <div className="flex items-center gap-2 text-success font-semibold text-sm">
                <span>Voir les statistiques</span>
              </div>
            </Link>
          </div>

          {/* Top Formations & Actions rapides */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Formations */}
            <div className="bg-white rounded-2xl border border-gray-medium shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-xdark">Top formations</h2>
                <Link
                  to="/enterprise/formations"
                  className="text-sm text-primary font-semibold hover:text-accent transition-colors flex items-center gap-1"
                >
                  Voir tout
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {dashboardStats?.topFormations?.slice(0, 5).map((formation, index: number) => (
                  <div key={formation.id} className="flex items-center justify-between p-3 bg-gray-light rounded-lg hover:bg-gray-medium transition-colors group cursor-pointer" onClick={() => navigate(`/formation/${formation.id}`)}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-accent text-white rounded-full text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-xdark truncate group-hover:text-primary transition-colors">{formation.title}</p>
                        <p className="text-xs text-gray-dark">{formation.enrollments} inscriptions</p>
                      </div>
                    </div>
                    <TrendingUp size={16} className="text-success" />
                  </div>
                )) || (
                  <p className="text-center text-gray-dark py-8">Aucune formation pour le moment</p>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl border border-gray-medium shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-xdark mb-6">Actions rapides</h2>
              <div className="space-y-3">
                <Link
                  to="/enterprise/formations/create"
                  className="flex items-center gap-3 p-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all duration-200 font-semibold border border-primary/20 hover:shadow-md hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <span className="flex-1">Créer une nouvelle formation</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
                <Link
                  to="/enterprise/profil"
                  className="flex items-center gap-3 p-4 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl transition-all duration-200 font-semibold border border-accent/20 hover:shadow-md hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                    <Settings className="text-white" size={20} />
                  </div>
                  <span className="flex-1">Modifier le profil structure</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
                <Link
                  to="/catalogue"
                  className="flex items-center gap-3 p-4 bg-blue-sky/10 hover:bg-blue-sky/20 text-blue-sky rounded-xl transition-all duration-200 font-semibold border border-blue-sky/20 hover:shadow-md hover:-translate-y-0.5 group"
                >
                  <div className="w-10 h-10 bg-blue-sky rounded-lg flex items-center justify-center">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <span className="flex-1">Voir le catalogue public</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
