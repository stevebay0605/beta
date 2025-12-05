import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import axiosInstance from '../../api/axios';
import { ArrowLeft, Image as ImageIcon, Upload, Trash2, CheckCircle, AlertCircle, HelpCircle, Eye, Save, X, FileText, CheckSquare, Info } from 'lucide-react';
import toast from 'react-hot-toast';

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
}

interface FieldErrors {
  [key: string]: string;
}

const STEPS = [
  { id: 1, name: 'Informations', icon: FileText },
  { id: 2, name: 'Détails', icon: FileText },
  { id: 3, name: 'Image', icon: ImageIcon },
  { id: 4, name: 'Publication', icon: CheckSquare },
];

const SECTOR_SUGGESTIONS = [
  'Informatique',
  'Développement Web',
  'Design Graphique',
  'Marketing Digital',
  'Gestion de Projet',
  'Ressources Humaines',
  'Finance',
  'Commerce',
  'Santé',
  'Éducation',
];

export default function FormationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const draftSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Etats
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [sectorSuggestions, setSectorSuggestions] = useState<string[]>([]);
  const [showSectorSuggestions, setShowSectorSuggestions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Image
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

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

  // Charger les données
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const citiesResponse = await axiosInstance.get('/admin/cities');
        setCities(citiesResponse.data);

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
            end_date: data.end_date ? data.end_date.split('T')[0] : '',
          });

          if (data.image_url) {
            setPreviewUrl(data.image_url);
          }
        } else {
          // Charger le brouillon depuis localStorage
          const draft = localStorage.getItem('formation_draft');
          if (draft) {
            try {
              const draftData = JSON.parse(draft);
              setFormData(draftData);
              toast.success('Brouillon restauré');
            } catch (e) {
              console.error('Erreur restauration brouillon:', e);
            }
          }
        }
      } catch (err: any) {
        console.error('Erreur:', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement');
        toast.error('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  // Sauvegarde automatique du brouillon
  useEffect(() => {
    if (!isEditing && formData.title) {
      if (draftSaveIntervalRef.current) {
        clearInterval(draftSaveIntervalRef.current);
      }

      draftSaveIntervalRef.current = setInterval(() => {
        localStorage.setItem('formation_draft', JSON.stringify(formData));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      }, 30000); // Sauvegarde toutes les 30 secondes
    }

    return () => {
      if (draftSaveIntervalRef.current) {
        clearInterval(draftSaveIntervalRef.current);
      }
    };
  }, [formData, isEditing]);

  // Validation en temps réel
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'title':
        if (!value || value.trim().length < 5) {
          return 'Le titre doit contenir au moins 5 caractères';
        }
        if (value.length > 100) {
          return 'Le titre ne doit pas dépasser 100 caractères';
        }
        break;
      case 'description':
        if (!value || value.trim().length < 50) {
          return 'La description doit contenir au moins 50 caractères';
        }
        if (value.length > 2000) {
          return 'La description ne doit pas dépasser 2000 caractères';
        }
        break;
      case 'resume':
        if (value && value.length > 200) {
          return 'Le résumé ne doit pas dépasser 200 caractères';
        }
        break;
      case 'programme':
        if (value && value.length > 3000) {
          return 'Le programme ne doit pas dépasser 3000 caractères';
        }
        break;
      case 'price':
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
          return 'Le prix doit être un nombre positif';
        }
        break;
      case 'duree':
        if (value && value.length > 50) {
          return 'La durée ne doit pas dépasser 50 caractères (ex: "3 mois" ou "20 heures")';
        }
        break;
      case 'end_date':
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            return 'La date doit être dans le futur';
          }
        }
        break;
    }
    return '';
  };

  // Gestion des champs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validation en temps réel
    const error = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Suggestions pour secteur
    if (name === 'sector' && value.length > 0) {
      const filtered = SECTOR_SUGGESTIONS.filter(s =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setSectorSuggestions(filtered);
      setShowSectorSuggestions(filtered.length > 0 && value.length > 0);
    } else if (name === 'sector' && value.length === 0) {
      setShowSectorSuggestions(false);
    }
  };

  // Gestion du fichier image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validation
      if (file.size > 5 * 1024 * 1024) {
        setImageError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setImageError('Le fichier doit être une image');
        return;
      }

      setImageError(null);
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (file.size > 5 * 1024 * 1024) {
        setImageError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setImageError('Le fichier doit être une image');
        return;
      }

      setImageError(null);
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Validation complète
  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    
    // Validation des champs requis
    if (!formData.title || formData.title.trim().length === 0) {
      errors.title = 'Le titre est requis';
    } else {
      const titleError = validateField('title', formData.title);
      if (titleError) errors.title = titleError;
    }

    if (!formData.description || formData.description.trim().length === 0) {
      errors.description = 'La description est requise';
    } else {
      const descError = validateField('description', formData.description);
      if (descError) errors.description = descError;
    }

    if (!formData.sector || formData.sector.trim().length === 0) {
      errors.sector = 'Le secteur est requis';
    }

    if (!formData.city_id || formData.city_id === '') {
      errors.city_id = 'La ville est requise';
    }

    // Validation du prix (peut être 0 pour gratuit)
    const priceValue = formData.price === '' || formData.price === null || formData.price === undefined;
    if (priceValue) {
      errors.price = 'Le prix est requis';
    } else {
      const priceNum = Number(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        errors.price = 'Le prix doit être un nombre positif';
      }
    }

    if (!formData.duree || formData.duree.trim().length === 0) {
      errors.duree = 'La durée est requise';
    } else if (formData.duree.trim().length > 50) {
      errors.duree = 'La durée ne doit pas dépasser 50 caractères';
    } else {
      const dureeError = validateField('duree', formData.duree);
      if (dureeError) errors.duree = dureeError;
    }

    if (!formData.end_date || formData.end_date === '') {
      errors.end_date = 'La date limite est requise';
    } else {
      const dateError = validateField('end_date', formData.end_date);
      if (dateError) errors.end_date = dateError;
    }

    // Validation des champs optionnels
    if (formData.resume) {
      const resumeError = validateField('resume', formData.resume);
      if (resumeError) errors.resume = resumeError;
    }

    if (formData.programme) {
      const programmeError = validateField('programme', formData.programme);
      if (programmeError) errors.programme = programmeError;
    }

    setFieldErrors(errors);
    
    // Afficher les erreurs dans la console pour debug
    if (Object.keys(errors).length > 0) {
      console.log('Erreurs de validation:', errors);
    }
    
    return Object.keys(errors).length === 0;
  };

  // Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const isValid = validateForm();
    if (!isValid) {
      toast.error('Veuillez corriger les erreurs dans le formulaire', {
        duration: 5000,
      });
      // Aller à la première étape avec erreurs
      setCurrentStep(1);
      // Scroll vers le haut pour voir les erreurs
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      
      // Ajouter les champs avec conversion appropriée et validation de longueur
      payload.append('title', formData.title.trim());
      payload.append('description', formData.description.trim());
      if (formData.resume && formData.resume.trim()) {
        payload.append('resume', formData.resume.trim());
      }
      if (formData.programme && formData.programme.trim()) {
        payload.append('programme', formData.programme.trim());
      }
      payload.append('sector', formData.sector.trim());
      payload.append('city_id', String(formData.city_id));
      payload.append('price', String(formData.price || 0));
      // Limiter la durée à 50 caractères pour éviter l'erreur SQL
      payload.append('duree', formData.duree.trim().substring(0, 50));
      payload.append('end_date', formData.end_date);

      if (selectedFile) {
        payload.append('image', selectedFile);
      }

      // Debug: Afficher les données envoyées
      console.log('Données envoyées:', {
        title: formData.title,
        description: formData.description.substring(0, 50) + '...',
        sector: formData.sector,
        city_id: formData.city_id,
        price: formData.price,
        duree: formData.duree,
        end_date: formData.end_date,
        hasImage: !!selectedFile,
      });

      if (isEditing) {
        payload.append('_method', 'PUT');
        await axiosInstance.post(`/formations/${id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Formation mise à jour avec succès!');
      } else {
        await axiosInstance.post('/formations', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Formation créée avec succès!');
        // Supprimer le brouillon
        localStorage.removeItem('formation_draft');
      }

      navigate('/enterprise/formations');
    } catch (err: any) {
      console.error('Erreur complète:', err);
      console.error('Réponse erreur:', err.response);
      
      let errorMsg = 'Erreur lors de la sauvegarde';
      let validationErrors: FieldErrors = {};

      // Gestion des erreurs de validation du backend
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Message d'erreur principal
        if (errorData.message) {
          errorMsg = errorData.message;
        }

        // Erreurs de validation par champ (Laravel style)
        if (errorData.errors) {
          Object.keys(errorData.errors).forEach((field) => {
            const fieldErrors = errorData.errors[field];
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              validationErrors[field] = fieldErrors[0];
            }
          });
        }

        // Erreurs de validation (format alternatif)
        if (errorData.validation) {
          Object.keys(errorData.validation).forEach((field) => {
            validationErrors[field] = errorData.validation[field];
          });
        }
      }

      // Afficher les erreurs
      setError(errorMsg);
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        // Aller à l'étape 1 pour voir les erreurs
        setCurrentStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Toast avec détails
      if (Object.keys(validationErrors).length > 0) {
        toast.error(`Erreurs de validation: ${Object.keys(validationErrors).join(', ')}`, {
          duration: 6000,
        });
      } else {
        toast.error(errorMsg, {
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigation entre étapes
  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Compteur de caractères
  const getCharCount = (field: keyof FormationData): number => {
    return formData[field]?.toString().length || 0;
  };

  const getCharLimit = (field: string): number => {
    switch (field) {
      case 'title': return 100;
      case 'description': return 2000;
      case 'resume': return 200;
      case 'programme': return 3000;
      case 'duree': return 50;
      default: return 0;
    }
  };

  const isFieldValid = (field: string): boolean => {
    return !fieldErrors[field] && formData[field as keyof FormationData]?.toString().trim().length > 0;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-bg-light via-white to-primary/5 font-sans">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        <Header />

        <main className="flex-grow p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">
            
            {/* EN-TÊTE */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    if (window.confirm('Voulez-vous vraiment quitter ? Les modifications non sauvegardées seront perdues.')) {
                      navigate('/enterprise/formations');
                    }
                  }}
                  className="p-2 bg-white border-2 border-gray-medium hover:border-primary rounded-xl transition-all duration-200 hover:shadow-md"
                  title="Retour"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-dark" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight">
                    {isEditing ? 'Modifier la formation' : 'Nouvelle formation'}
                  </h1>
                  <p className="text-gray-dark mt-1">
                    {isEditing ? 'Mettez à jour les informations de votre offre.' : 'Remplissez les détails pour publier votre offre.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {draftSaved && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-lg text-sm font-semibold">
                    <Save size={14} />
                    Brouillon sauvegardé
                  </div>
                )}
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-medium hover:border-primary rounded-xl transition-all duration-200 font-semibold text-sm"
                >
                  <Eye size={18} />
                  {showPreview ? 'Masquer' : 'Aperçu'}
                </button>
              </div>
            </div>

            {/* STEPPER */}
            <div className="mb-8 bg-white rounded-2xl border border-gray-medium shadow-md p-6">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            currentStep >= step.id
                              ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg'
                              : 'bg-gray-light text-gray-dark'
                          }`}
                        >
                          {currentStep > step.id ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <IconComponent className="w-6 h-6" />
                          )}
                        </div>
                        <span className={`text-xs font-semibold mt-2 ${currentStep >= step.id ? 'text-primary' : 'text-gray-dark'}`}>
                          {step.name}
                        </span>
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 rounded ${currentStep > step.id ? 'bg-primary' : 'bg-gray-light'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MESSAGE D'ERREUR GLOBAL */}
            {(error || Object.keys(fieldErrors).length > 0) && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-md animate-pulse">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    {error && (
                      <div className="mb-3">
                        <span className="font-bold text-base">Erreur lors de la sauvegarde :</span>
                        <p className="mt-1 text-sm">{error}</p>
                      </div>
                    )}
                    {Object.keys(fieldErrors).length > 0 && (
                      <div>
                        <span className="font-bold text-base block mb-2">Erreurs de validation :</span>
                        <ul className="list-disc list-inside space-y-1.5">
                          {Object.entries(fieldErrors).map(([field, message]) => {
                            const fieldLabels: { [key: string]: string } = {
                              title: 'Titre',
                              description: 'Description',
                              sector: 'Secteur',
                              city_id: 'Ville',
                              price: 'Prix',
                              duree: 'Durée',
                              end_date: 'Date limite',
                              resume: 'Résumé',
                              programme: 'Programme',
                            };
                            return (
                              <li key={field} className="text-sm">
                                <span className="font-semibold">{fieldLabels[field] || field}:</span> {message}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <Info size={14} />
                        Vérifiez la console du navigateur (F12) pour plus de détails sur l'erreur.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setError(null);
                      setFieldErrors({});
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Fermer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* FORMULAIRE */}
              <div className={`lg:col-span-${showPreview ? '2' : '3'} transition-all duration-300`}>
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-medium overflow-hidden">
                  
                  {/* ÉTAPE 1: Informations Principales */}
                  {currentStep === 1 && (
                    <div className="p-8 space-y-6">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <FileText className="text-primary" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-xdark">Informations principales</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Titre */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-dark mb-2 flex items-center gap-2">
                            Titre de la formation
                            <span className="text-red-500">*</span>
                            <div className="group relative">
                              <HelpCircle className="w-4 h-4 text-gray-dark cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-xdark text-white text-xs rounded-lg z-10">
                                Un titre accrocheur augmente les inscriptions. Ex: "Masterclass Développement Web Full Stack"
                              </div>
                            </div>
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-gray-light border-2 rounded-xl focus:bg-white outline-none transition ${
                              fieldErrors.title
                                ? 'border-red-500 focus:ring-red-500/20'
                                : isFieldValid('title')
                                ? 'border-green-500 focus:ring-green-500/20'
                                : 'border-gray-medium focus:border-primary focus:ring-primary/20'
                            }`}
                            placeholder="Ex: Masterclass Développement Web"
                          />
                          <div className="flex items-center justify-between mt-1">
                            {fieldErrors.title ? (
                              <span className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {fieldErrors.title}
                              </span>
                            ) : isFieldValid('title') ? (
                              <span className="text-xs text-green-500 flex items-center gap-1">
                                <CheckCircle size={12} />
                                Valide
                              </span>
                            ) : null}
                            <span className="text-xs text-gray-dark">
                              {getCharCount('title')}/{getCharLimit('title')}
                            </span>
                          </div>
                        </div>

                        {/* Secteur */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-dark mb-2 flex items-center gap-2">
                            Secteur d'activité
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="sector"
                            value={formData.sector}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-gray-light border-2 rounded-xl focus:bg-white outline-none transition ${
                              fieldErrors.sector
                                ? 'border-red-500 focus:ring-red-500/20'
                                : isFieldValid('sector')
                                ? 'border-green-500 focus:ring-green-500/20'
                                : 'border-gray-medium focus:border-primary focus:ring-primary/20'
                            }`}
                            placeholder="Ex: Informatique, Design..."
                            onFocus={() => setShowSectorSuggestions(true)}
                          />
                          {showSectorSuggestions && sectorSuggestions.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-medium rounded-xl shadow-lg max-h-48 overflow-y-auto">
                              {sectorSuggestions.map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, sector: suggestion }));
                                    setShowSectorSuggestions(false);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                          {fieldErrors.sector && (
                            <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle size={12} />
                              {fieldErrors.sector}
                            </span>
                          )}
                        </div>

                        {/* Ville */}
                        <div>
                          <label className="block text-sm font-bold text-gray-dark mb-2">
                            Ville <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="city_id"
                              value={formData.city_id}
                              onChange={handleChange}
                              required
                              className={`w-full px-4 py-3 bg-gray-light border-2 rounded-xl focus:bg-white outline-none transition appearance-none ${
                                fieldErrors.city_id
                                  ? 'border-red-500 focus:ring-red-500/20'
                                  : isFieldValid('city_id')
                                  ? 'border-green-500 focus:ring-green-500/20'
                                  : 'border-gray-medium focus:border-primary focus:ring-primary/20'
                              }`}
                            >
                              <option value="">Sélectionner une ville</option>
                              {cities.map((city) => (
                                <option key={city.id} value={city.id}>{city.name}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-dark">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </div>
                          </div>
                          {fieldErrors.city_id && (
                            <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle size={12} />
                              {fieldErrors.city_id}
                            </span>
                          )}
                        </div>

                        {/* Prix */}
                        <div>
                          <label className="block text-sm font-bold text-gray-dark mb-2 flex items-center gap-2">
                            Prix (FCFA)
                            <span className="text-red-500">*</span>
                            <div className="group relative">
                              <HelpCircle className="w-4 h-4 text-gray-dark cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-xdark text-white text-xs rounded-lg z-10">
                                Mettez 0 pour une formation gratuite
                              </div>
                            </div>
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            className={`w-full px-4 py-3 bg-gray-light border-2 rounded-xl focus:bg-white outline-none transition ${
                              fieldErrors.price
                                ? 'border-red-500 focus:ring-red-500/20'
                                : isFieldValid('price')
                                ? 'border-green-500 focus:ring-green-500/20'
                                : 'border-gray-medium focus:border-primary focus:ring-primary/20'
                            }`}
                            placeholder="0"
                          />
                          {fieldErrors.price && (
                            <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle size={12} />
                              {fieldErrors.price}
                            </span>
                          )}
                          {formData.price === '0' && (
                            <span className="text-xs text-primary font-semibold mt-1">Formation gratuite</span>
                          )}
                        </div>

                        {/* Durée */}
                        <div>
                          <label className="block text-sm font-bold text-gray-dark mb-2 flex items-center gap-2">
                            Durée
                            <span className="text-red-500">*</span>
                            <div className="group relative">
                              <HelpCircle className="w-4 h-4 text-gray-dark cursor-help" />
                              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-xdark text-white text-xs rounded-lg z-10">
                                Format court recommandé: "3 mois", "20h", "6 semaines" (max 50 caractères)
                              </div>
                            </div>
                          </label>
                          <input
                            type="text"
                            name="duree"
                            value={formData.duree}
                            onChange={handleChange}
                            required
                            maxLength={50}
                            className={`w-full px-4 py-3 bg-gray-light border-2 rounded-xl focus:bg-white outline-none transition ${
                              fieldErrors.duree
                                ? 'border-red-500 focus:ring-red-500/20'
                                : isFieldValid('duree')
                                ? 'border-green-500 focus:ring-green-500/20'
                                : 'border-gray-medium focus:border-primary focus:ring-primary/20'
                            }`}
                            placeholder="Ex: 3 mois, 20h, 6 semaines..."
                          />
                          <div className="flex items-center justify-between mt-1">
                            {fieldErrors.duree ? (
                              <span className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle size={12} />
                                {fieldErrors.duree}
                              </span>
                            ) : isFieldValid('duree') ? (
                              <span className="text-xs text-green-500 flex items-center gap-1">
                                <CheckCircle size={12} />
                                Valide
                              </span>
                            ) : null}
                            <span className="text-xs text-gray-dark">
                              {getCharCount('duree')}/50
                            </span>
                          </div>
                        </div>

                        {/* Date Fin */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-dark mb-2">
                            Date limite d'inscription <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full px-4 py-3 bg-gray-light border-2 rounded-xl focus:bg-white outline-none transition ${
                              fieldErrors.end_date
                                ? 'border-red-500 focus:ring-red-500/20'
                                : isFieldValid('end_date')
                                ? 'border-green-500 focus:ring-green-500/20'
                                : 'border-gray-medium focus:border-primary focus:ring-primary/20'
                            }`}
                          />
                          {fieldErrors.end_date && (
                            <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
                              <AlertCircle size={12} />
                              {fieldErrors.end_date}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ÉTAPE 2: Détails */}
                  {currentStep === 2 && (
                    <div className="p-8 space-y-6">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <FileText className="text-primary" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-xdark">Détails de la formation</h2>
                      </div>

                      {/* Résumé */}
                      <div>
                        <label className="block text-sm font-bold text-gray-dark mb-2 flex items-center gap-2">
                          Résumé court
                          <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-gray-dark cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-xdark text-white text-xs rounded-lg z-10">
                              Une phrase d'accroche qui apparaîtra dans la liste des formations (optionnel)
                            </div>
                          </div>
                        </label>
                        <textarea
                          name="resume"
                          value={formData.resume}
                          onChange={handleChange}
                          rows={2}
                          className={`w-full px-4 py-3 bg-gray-light border-2 rounded-xl focus:bg-white outline-none transition resize-none ${
                            fieldErrors.resume
                              ? 'border-red-500 focus:ring-red-500/20'
                              : 'border-gray-medium focus:border-primary focus:ring-primary/20'
                          }`}
                          placeholder="Une phrase d'accroche pour la liste des formations..."
                        />
                        <div className="flex items-center justify-between mt-1">
                          {fieldErrors.resume && (
                            <span className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {fieldErrors.resume}
                            </span>
                          )}
                          <span className={`text-xs ${getCharCount('resume') > getCharLimit('resume') ? 'text-red-500' : 'text-gray-dark'}`}>
                            {getCharCount('resume')}/{getCharLimit('resume')}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-bold text-gray-dark mb-2 flex items-center gap-2">
                          Description détaillée
                          <span className="text-red-500">*</span>
                          <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-gray-dark cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-xdark text-white text-xs rounded-lg z-10">
                              Détaillez les objectifs, prérequis, compétences acquises. Minimum 50 caractères.
                            </div>
                          </div>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          rows={6}
                          className={`w-full px-4 py-3 bg-gray-light border-2 rounded-xl focus:bg-white outline-none transition resize-none ${
                            fieldErrors.description
                              ? 'border-red-500 focus:ring-red-500/20'
                              : isFieldValid('description')
                              ? 'border-green-500 focus:ring-green-500/20'
                              : 'border-gray-medium focus:border-primary focus:ring-primary/20'
                          }`}
                          placeholder="Détaillez les objectifs, les prérequis, les compétences acquises..."
                        />
                        <div className="flex items-center justify-between mt-1">
                          {fieldErrors.description ? (
                            <span className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {fieldErrors.description}
                            </span>
                          ) : isFieldValid('description') ? (
                            <span className="text-xs text-green-500 flex items-center gap-1">
                              <CheckCircle size={12} />
                              Valide
                            </span>
                          ) : (
                            <span className="text-xs text-gray-dark">
                              Minimum {50 - getCharCount('description')} caractères restants
                            </span>
                          )}
                          <span className={`text-xs ${getCharCount('description') > getCharLimit('description') ? 'text-red-500' : 'text-gray-dark'}`}>
                            {getCharCount('description')}/{getCharLimit('description')}
                          </span>
                        </div>
                      </div>

                      {/* Programme */}
                      <div>
                        <label className="block text-sm font-bold text-gray-dark mb-2 flex items-center gap-2">
                          Programme de la formation
                          <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-gray-dark cursor-help" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-xdark text-white text-xs rounded-lg z-10">
                              Liste des modules, chapitres ou sujets couverts (optionnel mais recommandé)
                            </div>
                          </div>
                        </label>
                        <textarea
                          name="programme"
                          value={formData.programme}
                          onChange={handleChange}
                          rows={6}
                          className={`w-full px-4 py-3 bg-gray-light border-2 rounded-xl focus:bg-white outline-none transition resize-none ${
                            fieldErrors.programme
                              ? 'border-red-500 focus:ring-red-500/20'
                              : 'border-gray-medium focus:border-primary focus:ring-primary/20'
                          }`}
                          placeholder="Module 1: Introduction...&#10;Module 2: ..."
                        />
                        <div className="flex items-center justify-between mt-1">
                          {fieldErrors.programme && (
                            <span className="text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {fieldErrors.programme}
                            </span>
                          )}
                          <span className={`text-xs ${getCharCount('programme') > getCharLimit('programme') ? 'text-red-500' : 'text-gray-dark'}`}>
                            {getCharCount('programme')}/{getCharLimit('programme')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ÉTAPE 3: Image */}
                  {currentStep === 3 && (
                    <div className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <ImageIcon className="text-primary" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-xdark">Image de couverture</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Zone de Drop / Input */}
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center group h-64 ${
                            isDragging
                              ? 'border-primary bg-primary/5 scale-105'
                              : imageError
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-medium hover:border-primary hover:bg-primary/5'
                          }`}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform ${
                            isDragging ? 'bg-primary text-white scale-110' : 'bg-primary/10 text-primary group-hover:scale-110'
                          }`}>
                            <Upload size={32} />
                          </div>
                          <p className="text-sm font-bold text-gray-xdark mb-2">
                            {isDragging ? 'Déposez l\'image ici' : 'Cliquez ou glissez une image'}
                          </p>
                          <p className="text-xs text-gray-dark">PNG, JPG jusqu'à 5MB</p>
                          {imageError && (
                            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                              <AlertCircle size={12} />
                              {imageError}
                            </p>
                          )}
                        </div>

                        {/* Prévisualisation */}
                        <div className="bg-gray-light rounded-2xl border-2 border-gray-medium h-64 flex items-center justify-center overflow-hidden relative">
                          {previewUrl ? (
                            <>
                              <img
                                src={previewUrl}
                                alt="Prévisualisation"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewUrl(null);
                                  setSelectedFile(null);
                                  setImageError(null);
                                  if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full text-red-500 hover:text-red-600 transition shadow-lg"
                                title="Supprimer l'image"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          ) : (
                            <div className="text-center text-gray-dark">
                              <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Aucune image sélectionnée</p>
                              <p className="text-xs text-gray-dark mt-1">L'image est optionnelle</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ÉTAPE 4: Récapitulatif */}
                  {currentStep === 4 && (
                    <div className="p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                          <CheckSquare className="text-success" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-xdark">Récapitulatif</h2>
                      </div>

                      <div className="space-y-4 bg-gray-light rounded-xl p-6">
                        <div>
                          <span className="text-sm font-bold text-gray-dark">Titre:</span>
                          <p className="text-gray-xdark font-semibold">{formData.title || 'Non renseigné'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-dark">Secteur:</span>
                          <p className="text-gray-xdark font-semibold">{formData.sector || 'Non renseigné'}</p>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-dark">Prix:</span>
                          <p className="text-gray-xdark font-semibold">
                            {formData.price === '0' || formData.price === 0 ? 'Gratuit' : `${Number(formData.price).toLocaleString('fr-FR')} FCFA`}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-dark">Durée:</span>
                          <p className="text-gray-xdark font-semibold">{formData.duree || 'Non renseigné'}</p>
                        </div>
                        {formData.description && (
                          <div>
                            <span className="text-sm font-bold text-gray-dark">Description:</span>
                            <p className="text-gray-xdark text-sm mt-1 line-clamp-3">{formData.description}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                        <p className="text-sm text-gray-dark">
                          <strong>Vérifiez</strong> toutes les informations avant de publier. Vous pourrez toujours modifier la formation après publication.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* NAVIGATION ENTRE ÉTAPES */}
                  <div className="bg-gray-light px-8 py-5 border-t border-gray-medium flex justify-between items-center">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="px-6 py-3 bg-white border-2 border-gray-medium text-gray-dark rounded-xl font-bold hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm('Voulez-vous vraiment annuler ? Les modifications non sauvegardées seront perdues.')) {
                            navigate('/enterprise/formations');
                          }
                        }}
                        className="px-6 py-3 bg-white border-2 border-gray-medium text-gray-dark rounded-xl font-bold hover:border-error hover:text-error transition-all duration-200"
                      >
                        Annuler
                      </button>
                      {currentStep < STEPS.length ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className="px-6 py-3 bg-primary hover:bg-accent text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-accent/30"
                        >
                          Suivant
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-8 py-3 bg-primary hover:bg-accent text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-accent/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save size={18} />
                              {isEditing ? 'Mettre à jour' : 'Publier la formation'}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* APERÇU DE LA CARTE */}
              {showPreview && (
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl border border-gray-medium shadow-lg p-6 sticky top-24">
                    <h3 className="text-lg font-bold text-gray-xdark mb-4">Aperçu de la carte</h3>
                    <div className="border border-gray-medium rounded-xl overflow-hidden">
                      <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-gray-dark opacity-30" size={48} />
                        )}
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-bold rounded">
                            {formData.sector || 'Secteur'}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-xdark mb-2 line-clamp-2">
                          {formData.title || 'Titre de la formation'}
                        </h4>
                        {formData.resume && (
                          <p className="text-sm text-gray-dark mb-3 line-clamp-2">{formData.resume}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-black text-primary">
                            {formData.price === '0' || formData.price === 0 ? 'Gratuit' : `${Number(formData.price).toLocaleString('fr-FR')} FC`}
                          </span>
                          {formData.duree && (
                            <span className="text-xs text-gray-dark">{formData.duree}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
