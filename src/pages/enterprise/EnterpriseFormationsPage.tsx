import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import axiosInstance from '../../api/axios';
import { 
  Edit, Trash2, Eye, Plus, Calendar, Users, 
  Image as ImageIcon, Search, BookOpen // <--- Ajouté ici
} from 'lucide-react';

// --- INTERFACE SÉCURISÉE ---
interface Formation {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  navda?: string;
  category?: string;
  start_date?: string;
  status?: string; 
  learners_count?: number;
}

interface Stats {
  active_formations: number;
  total_formations: number;
  total_demands: number;
}

export default function EnterpriseFormationsPage() {
  const navigate = useNavigate();
  
  // --- ÉTATS ---
  const [formations, setFormations] = useState<Formation[]>([]);
  const [stats, setStats] = useState<Stats>({ active_formations: 0, total_formations: 0, total_demands: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [formationsRes, statsRes] = await Promise.allSettled([
            axiosInstance.get('/formations'),
            axiosInstance.get('/formations/stats')
        ]);

        // Gestion Formations
        if (formationsRes.status === 'fulfilled') {
            const data = Array.isArray(formationsRes.value.data) ? formationsRes.value.data : [];
            setFormations(data);
        } else {
            console.error("Erreur API Formations:", formationsRes.reason);
        }

        // Gestion Stats
        if (statsRes.status === 'fulfilled') {
            setStats(statsRes.value.data);
        }

      } catch (err) {
        console.error('Erreur globale:', err);
        setError('Une erreur est survenue lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- ACTIONS ---
  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette formation ?')) return;
    try {
      await axiosInstance.delete(`/formations/${id}`);
      setFormations(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  // --- FILTRES ---
  const filteredFormations = formations.filter(f => {
      const nameMatch = (f.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const catMatch = (f.category || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const currentStatus = (f.status || 'draft').toLowerCase();
      const statusMatch = filterStatus === 'all' || 
                          (filterStatus === 'published' && (currentStatus === 'published' || currentStatus === 'publié')) ||
                          (filterStatus === 'draft' && (currentStatus === 'draft' || currentStatus === 'brouillon'));
                          
      return (nameMatch || catMatch) && statusMatch;
  });

  // --- HELPER AFFICHAGE STATUT ---
  const getStatusBadge = (status?: string) => {
    const safeStatus = (status || 'draft').toLowerCase();

    if (safeStatus === 'published' || safeStatus === 'publié') {
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Publié</span>;
    }
    if (safeStatus === 'archived' || safeStatus === 'archivé') {
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Archivé</span>;
    }
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Brouillon</span>;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <Header />

        <main className="flex-grow p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* EN-TÊTE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mes Formations</h1>
                <p className="text-slate-500 mt-1">Pilotez votre catalogue et suivez vos inscriptions.</p>
              </div>
              <button 
                onClick={() => navigate('/enterprise/formations/create')}
                className="flex items-center gap-2 bg-[#0055A4] hover:bg-[#004484] text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-900/20 transition-all font-medium"
              >
                <Plus size={20} />
                Nouvelle Formation
              </button>
            </div>

            {/* STATISTIQUES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <StatCard 
                 title="Formations Actives" 
                 value={stats.active_formations || 0} 
                 icon={<BookOpen className="text-white" size={24} />} 
                 color="bg-blue-500" 
               />
               <StatCard 
                 title="Total Catalogue" 
                 value={stats.total_formations || 0} 
                 icon={<Users className="text-white" size={24} />} 
                 color="bg-indigo-500" 
               />
               <StatCard 
                 title="Demandes en attente" 
                 value={stats.total_demands || 0} 
                 icon={<Calendar className="text-white" size={24} />} 
                 color="bg-orange-500" 
               />
            </div>

            {/* BARRE DE RECHERCHE & FILTRES */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Rechercher une formation..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'published', 'draft'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                                filterStatus === status 
                                ? 'bg-slate-900 text-white' 
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {status === 'all' ? 'Toutes' : status === 'published' ? 'Publiées' : 'Brouillons'}
                        </button>
                    ))}
                </div>
            </div>

            {/* MESSAGE D'ERREUR */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                  {error}
              </div>
            )}

            {/* GRILLE DES FORMATIONS */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : filteredFormations.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">Aucune formation trouvée</h3>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredFormations.map((formation) => (
                        <div key={formation.id} className="group bg-white rounded-xl border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col overflow-hidden">
                            
                            {/* IMAGE DE COUVERTURE */}
                            <div className="relative h-48 bg-slate-100 overflow-hidden">
                                {formation.image_url ? (
                                    <img 
                                        src={formation.image_url} 
                                        alt={formation.name} 
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                                        <ImageIcon size={48} />
                                        <span className="text-xs mt-2 font-medium">Pas d'image</span>
                                    </div>
                                )}
                                
                                {/* Badge Statut */}
                                <div className="absolute top-3 right-3 shadow-sm">
                                    {getStatusBadge(formation.status)}
                                </div>

                                {/* Actions au survol */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 backdrop-blur-sm">
                                     <button onClick={() => navigate(`/formations/${formation.id}`)} className="p-2 bg-white rounded-full hover:bg-blue-50 text-slate-900 transition" title="Voir">
                                         <Eye size={18} />
                                     </button>
                                     <button onClick={() => navigate(`/enterprise/formations/${formation.id}/edit`)} className="p-2 bg-white rounded-full hover:bg-yellow-50 text-yellow-600 transition" title="Modifier">
                                         <Edit size={18} />
                                     </button>
                                     <button onClick={() => handleDelete(formation.id)} className="p-2 bg-white rounded-full hover:bg-red-50 text-red-600 transition" title="Supprimer">
                                         <Trash2 size={18} />
                                     </button>
                                </div>
                            </div>

                            {/* INFO FORMATION */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                                    {formation.category || 'Non catégorisé'}
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                                    {formation.name}
                                </h3>
                                
                                <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-center text-sm text-slate-500">
                                        <Calendar size={16} className="mr-2 text-slate-400" />
                                        {formation.start_date 
                                            ? new Date(formation.start_date).toLocaleDateString('fr-FR') 
                                            : 'Date non définie'}
                                    </div>
                                    <div className="flex items-center text-sm text-slate-500">
                                        <Users size={16} className="mr-2 text-slate-400" />
                                        {formation.learners_count || 0} Apprenants
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---
const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 ${color}`}>
            {icon}
        </div>
    </div>
);

const SkeletonCard = () => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
        <div className="h-48 bg-slate-200"></div>
        <div className="p-5 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="pt-4 border-t border-slate-100 flex gap-2">
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
            </div>
        </div>
    </div>
);