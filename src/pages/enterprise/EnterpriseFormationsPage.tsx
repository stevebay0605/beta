import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import axiosInstance from '../../api/axios';
import { Edit, Trash2, Eye, BookOpen, Plus } from 'lucide-react';

interface Formation {
  id: number;
  name: string;
  navda?: string;
  category: string;
  start_date: string;
  status: string;
  learners_count?: number;
}

interface Stats {
  active_formations: number;
  total_formations: number;
  total_demands: number;
}

export default function EnterpriseFormationsPage() {
  const navigate = useNavigate();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [stats, setStats] = useState<Stats>({
    active_formations: 0,
    total_formations: 0,
    total_demands: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Récupérer les formations
        const formationsResponse = await axiosInstance.get('/formations');
        setFormations(formationsResponse.data);

        // Récupérer les statistiques
        const statsResponse = await axiosInstance.get('/formations/stats');
        setStats(statsResponse.data);
      } catch (err: any) {
        console.error('Erreur lors du chargement des données:', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'publié':
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'brouillon':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archivé':
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleDelete = async (formationId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette formation?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/formations/${formationId}`);
      setFormations(formations.filter((f) => f.id !== formationId));
      alert('Formation supprimée avec succès');
    } catch (err: any) {
      console.error('Erreur:', err);
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <Header />

        <main className="flex-grow p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Gestion de Mes formations
              </h1>
              <p className="text-slate-600">
                Gérez et suivez vos formations
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Formations Actives</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                      {stats.active_formations}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Formations Totales</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                      {stats.total_formations}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Demandes Totales</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">
                      {stats.total_demands}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/enterprise/formations/create')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                  >
                    <Plus className="w-5 h-5" />
                    Créer Nouvelle formation
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des Formations */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">
                  Liste de Mes formations
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0055A4]"></div>
                </div>
              ) : formations.length === 0 ? (
                <div className="p-6 text-center text-slate-600">
                  Aucune formation trouvée
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Navda/Formation
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Catégorie
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Début
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {formations.map((formation) => (
                        <tr key={formation.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                            {formation.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formation.navda || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {formation.category}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(formation.start_date).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(formation.status)}`}>
                              {formation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/formations/${formation.id}`)}
                                className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                                title="Voir"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => navigate(`/enterprise/formations/${formation.id}/edit`)}
                                className="p-2 hover:bg-yellow-100 rounded-lg transition text-yellow-600"
                                title="Éditer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(formation.id)}
                                className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
