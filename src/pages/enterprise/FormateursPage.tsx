import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import axiosInstance from '../../api/axios';
import { Users, Mail, Phone, Building2, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Formateur {
  id: number;
  name: string;
  email: string;
  phone?: string;
  specialite?: string;
  experience?: string;
}

export default function FormateursPage() {
  const navigate = useNavigate();
  const [formateurs, setFormateurs] = useState<Formateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFormateurs = async () => {
      try {
        setLoading(true);
        // TODO: Remplacer par l'endpoint réel quand disponible
        // const response = await axiosInstance.get('/enterprise/formateurs');
        // setFormateurs(response.data);
        
        // Données mockées pour l'instant
        setFormateurs([]);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFormateurs();
  }, []);

  const filteredFormateurs = formateurs.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-bg-light via-white to-primary/5 font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <Header />

        <main className="flex-grow p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* EN-TÊTE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                  Mes Formateurs
                </h1>
                <p className="text-gray-dark mt-1">Gérez vos formateurs et leurs compétences.</p>
              </div>
              <button 
                onClick={() => navigate('/enterprise/formateurs/create')}
                className="flex items-center gap-2 bg-primary hover:bg-accent text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-200 font-bold hover:-translate-y-0.5"
              >
                <Plus size={20} />
                Ajouter un formateur
              </button>
            </div>

            {/* BARRE DE RECHERCHE */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-medium">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-dark" size={20} />
                <input 
                  type="text" 
                  placeholder="Rechercher un formateur..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-light border border-gray-medium rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                />
              </div>
            </div>

            {/* CONTENU */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
              </div>
            ) : filteredFormateurs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-medium shadow-md p-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-primary" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-xdark mb-2">Aucun formateur</h3>
                <p className="text-gray-dark mb-6">Commencez par ajouter vos premiers formateurs.</p>
                <button
                  onClick={() => navigate('/enterprise/formateurs/create')}
                  className="btn btn-primary"
                >
                  Ajouter un formateur
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFormateurs.map((formateur) => (
                  <div key={formateur.id} className="bg-white rounded-2xl border border-gray-medium shadow-md hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {formateur.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-xdark text-lg">{formateur.name}</h3>
                        {formateur.specialite && (
                          <p className="text-sm text-gray-dark mt-1">{formateur.specialite}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-dark">
                        <Mail size={16} className="text-primary" />
                        <span>{formateur.email}</span>
                      </div>
                      {formateur.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-dark">
                          <Phone size={16} className="text-primary" />
                          <span>{formateur.phone}</span>
                        </div>
                      )}
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

