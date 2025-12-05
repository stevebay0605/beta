import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import axiosInstance from '../../api/axios';
import { BarChart3, TrendingUp, Users, BookOpen, DollarSign, Calendar } from 'lucide-react';
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

const COLORS = ['#0055A4', '#F58220', '#10b981', '#0ea5e9', '#8b5cf6'];

export default function StatistiquesPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // TODO: Remplacer par l'endpoint réel
        // const response = await axiosInstance.get('/enterprise/statistiques');
        // setStats(response.data);
        
        // Données mockées
        setStats({
          totalFormations: 12,
          totalInscriptions: 245,
          revenusTotal: 1250000,
          tauxCompletion: 78,
          inscriptionsByMonth: [
            { month: 'Jan', inscriptions: 20 },
            { month: 'Fév', inscriptions: 35 },
            { month: 'Mar', inscriptions: 45 },
            { month: 'Avr', inscriptions: 30 },
            { month: 'Mai', inscriptions: 55 },
            { month: 'Juin', inscriptions: 60 },
          ],
          formationsByCategory: [
            { name: 'Développement', value: 5 },
            { name: 'Design', value: 3 },
            { name: 'Marketing', value: 2 },
            { name: 'Autre', value: 2 },
          ],
        });
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-bg-light via-white to-primary/5">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-bg-light via-white to-primary/5 font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <Header />

        <main className="flex-grow p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* EN-TÊTE */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                Statistiques
              </h1>
              <p className="text-gray-dark mt-1">Analysez les performances de vos formations.</p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-dark">Formations</h3>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="text-primary" size={24} />
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-xdark">{stats?.totalFormations || 0}</p>
                <p className="text-xs text-gray-dark mt-2">Total actif</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-dark">Inscriptions</h3>
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Users className="text-accent" size={24} />
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-xdark">{stats?.totalInscriptions || 0}</p>
                <p className="text-xs text-gray-dark mt-2">Total</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-dark">Revenus</h3>
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <DollarSign className="text-success" size={24} />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-xdark truncate">
                  {formatCurrency(stats?.revenusTotal || 0)}
                </p>
                <p className="text-xs text-gray-dark mt-2">Total</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-dark">Taux</h3>
                  <div className="w-12 h-12 bg-blue-sky/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-blue-sky" size={24} />
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-xdark">{stats?.tauxCompletion || 0}%</p>
                <p className="text-xs text-gray-dark mt-2">Complétion</p>
              </div>
            </div>

            {/* GRAPHIQUES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl border border-gray-medium shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-xdark mb-6">Inscriptions par mois</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats?.inscriptionsByMonth || []}>
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
                      dataKey="inscriptions"
                      stroke="#0055A4"
                      strokeWidth={2}
                      dot={{ fill: '#0055A4', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-gray-medium shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-xdark mb-6">Formations par catégorie</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats?.formationsByCategory || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats?.formationsByCategory?.map((_: any, index: number) => (
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
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

