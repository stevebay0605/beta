import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import axiosInstance from '../../api/axios';
import { ArrowLeft, Image as ImageIcon, Upload, Trash2 } from 'lucide-react';

interface City {
  id: number;
  name: string;
}

// Les données texte du formulaire
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
}

export default function FormationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Etats
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Formulaire Texte
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
  });

  // 1. Charger les villes et la formation (mode édition)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger les villes
        const citiesResponse = await axiosInstance.get('/admin/cities');
        setCities(citiesResponse.data);

        // Si édition, charger la formation
        if (isEditing) {
          const res = await axiosInstance.get(`/formations/${id}`);
          const data = res.data;
          
          setFormData({
            title: data.title || '',
            description: data.description || '',
            resume: data.resume || '',
            programme: data.programme || '',
            sector: data.sector || '',
            city_id: data.city_id || '',
            price: data.price || '',
            duree: data.duree || '',
            end_date: data.end_date ? data.end_date.split('T')[0] : '', // Format YYYY-MM-DD
          });

          // Si une image existe déjà
          if (data.image_url) {
            setPreviewUrl(data.image_url);
          }
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

  // Gestion des champs texte
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Gestion du fichier image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Créer une URL temporaire pour la prévisualisation
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Soumission avec FormData
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = new FormData();
      
      // Ajout des champs texte
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      // Ajout de l'image SEULEMENT si une nouvelle image est choisie
      // Pour l'édition, si on ne change pas l'image, on n'envoie rien (le backend garde l'ancienne)
      if (selectedFile) {
        payload.append('image', selectedFile);
      }

      // Hack pour Laravel PUT avec FormData (Laravel ne gère pas bien multipart/form-data en PUT natif)
      // On utilise POST avec _method: PUT
      if (isEditing) {
        payload.append('_method', 'PUT');
        await axiosInstance.post(`/formations/${id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Formation mise à jour avec succès');
      } else {
        await axiosInstance.post('/formations', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
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
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <Header />

        <main className="flex-grow p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">
            
            {/* EN-TÊTE */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={() => navigate('/enterprise/formations')}
                className="self-start p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition shadow-sm"
                title="Retour"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {isEditing ? 'Modifier la formation' : 'Nouvelle formation'}
                </h1>
                <p className="text-slate-500 mt-1">
                  {isEditing ? 'Mettez à jour les informations de votre offre.' : 'Remplissez les détails pour publier votre offre.'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center gap-2">
                <span className="font-bold">Erreur :</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              
              <div className="p-8 space-y-8">
                
                {/* SECTION 1: Informations Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Titre */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Titre de la formation <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0055A4] outline-none transition"
                      placeholder="Ex: Masterclass Développement Web"
                    />
                  </div>

                  {/* Secteur */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Secteur d'activité <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0055A4] outline-none transition"
                      placeholder="Ex: Informatique, Design..."
                    />
                  </div>

                  {/* Ville */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Ville <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        name="city_id"
                        value={formData.city_id}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0055A4] outline-none transition appearance-none"
                      >
                        <option value="">Sélectionner une ville</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  {/* Prix */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Prix (FCFA) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0055A4] outline-none transition"
                      placeholder="0"
                    />
                  </div>

                  {/* Durée */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Durée <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="duree"
                      value={formData.duree}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0055A4] outline-none transition"
                      placeholder="Ex: 3 mois, 20h..."
                    />
                  </div>

                  {/* Date Fin */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Date limite d'inscription <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0055A4] outline-none transition"
                    />
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* SECTION 2: Détails */}
                <div className="space-y-6">
                   {/* Résumé */}
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Résumé court</label>
                    <textarea
                      name="resume"
                      value={formData.resume}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0055A4] outline-none transition"
                      placeholder="Une phrase d'accroche pour la liste des formations..."
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Description détaillée <span className="text-red-500">*</span></label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0055A4] outline-none transition"
                      placeholder="Détaillez les objectifs, les prérequis..."
                    />
                  </div>

                  {/* Programme */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Programme de la formation</label>
                    <textarea
                      name="programme"
                      value={formData.programme}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#0055A4] outline-none transition"
                      placeholder="Module 1: Introduction..."
                    />
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* SECTION 3: Image de couverture */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4">Image de couverture</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Zone de Drop / Input */}
                    <div 
                        className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:bg-slate-50 transition cursor-pointer text-center flex flex-col items-center justify-center group h-64"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                            <Upload size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Cliquez pour téléverser une image</p>
                        <p className="text-xs text-slate-400 mt-2">PNG, JPG jusqu'à 5MB</p>
                    </div>

                    {/* Prévisualisation */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 h-64 flex items-center justify-center overflow-hidden relative">
                        {previewUrl ? (
                            <>
                                <img 
                                    src={previewUrl} 
                                    alt="Prévisualisation" 
                                    className="w-full h-full object-cover"
                                />
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setPreviewUrl(null);
                                        setSelectedFile(null);
                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                    }}
                                    className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-50 transition shadow-sm"
                                    title="Supprimer l'image"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </>
                        ) : (
                            <div className="text-center text-slate-400">
                                <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Aucune image sélectionnée</p>
                            </div>
                        )}
                    </div>
                  </div>
                </div>

              </div>

              {/* FOOTER ACTIONS */}
              <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-3">
                 <button
                  type="button"
                  onClick={() => navigate('/enterprise/formations')}
                  className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#0055A4] hover:bg-[#004484] text-white rounded-lg font-bold transition disabled:opacity-50 shadow-lg shadow-blue-900/10"
                >
                  {loading ? 'Enregistrement...' : isEditing ? 'Mettre à jour la formation' : 'Publier la formation'}
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