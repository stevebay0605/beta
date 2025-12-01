import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import axiosInstance from '../../api/axios';
import { ArrowLeft } from 'lucide-react';

interface City {
  id: number;
  name: string;
}

interface FormationData {
  title: string;
  description: string;
  resume: string;
  programme: string;
  sector: string;
  city_id: number | string;
  price: number | string;
  duree: string;
  end_date: string;
  image_couverture: string;
}

export default function FormationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormationData>({
    title: '',
    description: '',
    resume: '',
    programme: '',
    sector: '',
    city_id: '',
    price: '',
    duree: '',
    end_date: '',
    image_couverture: '',
  });

  // Charger les villes et la formation (si édition)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger les villes
        const citiesResponse = await axiosInstance.get('/admin/cities');
        setCities(citiesResponse.data);

        // Si édition, charger la formation
        if (isEditing) {
          const formationResponse = await axiosInstance.get(`/formations/${id}`);
          const formation = formationResponse.data;
          setFormData({
            title: formation.title || '',
            description: formation.description || '',
            resume: formation.resume || '',
            programme: formation.programme || '',
            sector: formation.sector || '',
            city_id: formation.city_id || '',
            price: formation.price || '',
            duree: formation.duree || '',
            end_date: formation.end_date || '',
            image_couverture: formation.image_couverture || '',
          });
        }
      } catch (err: any) {
        console.error('Erreur:', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      if (isEditing) {
        // Éditer une formation
        await axiosInstance.put(`/formations/${id}`, formData);
        alert('Formation mise à jour avec succès');
      } else {
        // Créer une formation
        await axiosInstance.post('/formations', formData);
        alert('Formation créée avec succès');
      }

      navigate('/enterprise/formations');
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <Header />

        <main className="flex-grow p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
              <button
                onClick={() => navigate('/enterprise/formations')}
                className="p-2 hover:bg-slate-200 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  {isEditing ? 'Éditer la formation' : 'Créer une formation'}
                </h1>
                <p className="text-slate-600 mt-2">
                  {isEditing
                    ? 'Modifiez les détails de votre formation'
                    : 'Remplissez le formulaire pour créer une nouvelle formation'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Titre */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Titre de la formation *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                    placeholder="Ex: Développement Web Fullstack"
                  />
                </div>

                {/* Secteur */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Secteur *
                  </label>
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                    placeholder="Ex: IT, Marketing"
                  />
                </div>

                {/* Ville */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Ville *
                  </label>
                  <select
                    name="city_id"
                    value={formData.city_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  >
                    <option value="">Sélectionner une ville</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                    placeholder="Ex: 500"
                  />
                </div>

                {/* Durée */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Durée *
                  </label>
                  <input
                    type="text"
                    name="duree"
                    value={formData.duree}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                    placeholder="Ex: 3 mois, 40 heures"
                  />
                </div>

                {/* Date de fin */}
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Résumé */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Résumé
                </label>
                <textarea
                  name="resume"
                  value={formData.resume}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  placeholder="Résumé court de la formation"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  placeholder="Description détaillée de la formation"
                />
              </div>

              {/* Programme */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Programme
                </label>
                <textarea
                  name="programme"
                  value={formData.programme}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  placeholder="Programme détaillé de la formation"
                />
              </div>

              {/* Image de couverture */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  URL Image de couverture
                </label>
                <input
                  type="text"
                  name="image_couverture"
                  value={formData.image_couverture}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  placeholder="https://..."
                />
              </div>

              {/* Boutons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-[#0055A4] hover:bg-[#003d7a] text-white rounded-lg font-bold transition disabled:opacity-50"
                >
                  {loading ? 'Sauvegarde...' : isEditing ? 'Mettre à jour' : 'Créer la formation'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/enterprise/formations')}
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-bold transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
