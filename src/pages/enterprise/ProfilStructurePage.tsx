import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../api/axios';
import { Building2, Mail, Phone, MapPin, Edit, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface EntrepriseData {
  name: string;
  email: string;
  phone?: string;
  sector?: string;
  adresse?: string;
  description?: string;
  logo?: string;
}

export default function ProfilStructurePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<EntrepriseData>({
    name: '',
    email: '',
    phone: '',
    sector: '',
    adresse: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // TODO: Remplacer par l'endpoint réel
        // const response = await axiosInstance.get('/enterprise/profil');
        // setFormData(response.data);
        
        // Données mockées
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          sector: '',
          adresse: '',
          description: '',
        });
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Remplacer par l'endpoint réel
      // await axiosInstance.put('/enterprise/profil', formData);
      toast.success('Profil mis à jour avec succès!');
      setEditing(false);
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-bg-light via-white to-primary/5 font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <Header />

        <main className="flex-grow p-6 lg:p-10">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* EN-TÊTE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                  Profil Structure
                </h1>
                <p className="text-gray-dark mt-1">Gérez les informations de votre entreprise.</p>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-primary hover:bg-accent text-white px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-200 font-bold hover:-translate-y-0.5"
                >
                  <Edit size={20} />
                  Modifier
                </button>
              )}
            </div>

            {/* FORMULAIRE */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-medium overflow-hidden">
              <div className="p-8 space-y-6">
                
                {/* Logo */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-light">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    {formData.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-xdark">{formData.name}</h2>
                    <p className="text-gray-dark">{formData.sector || 'Secteur non défini'}</p>
                  </div>
                </div>

                {/* Champs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-dark mb-2">
                      <Building2 className="inline w-4 h-4 mr-2" />
                      Nom de l'entreprise
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-gray-light border border-gray-medium rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-dark mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-gray-light border border-gray-medium rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-dark mb-2">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-gray-light border border-gray-medium rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-dark mb-2">
                      Secteur d'activité
                    </label>
                    <input
                      type="text"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-gray-light border border-gray-medium rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition disabled:opacity-60"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-dark mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-gray-light border border-gray-medium rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition disabled:opacity-60"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-dark mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={!editing}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-light border border-gray-medium rounded-lg focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              {editing && (
                <div className="bg-gray-light px-8 py-5 border-t border-gray-medium flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 bg-white border-2 border-gray-medium text-gray-dark rounded-xl font-bold hover:bg-gray-light transition-all duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary hover:bg-accent text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-accent/30 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={18} />
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

