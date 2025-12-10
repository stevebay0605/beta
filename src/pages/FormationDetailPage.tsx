import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Award, 
  ArrowLeft, 
  Share2,
  Heart
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import { ReviewsSection } from '../components/FormationDetail/ReviewsSection';
import { EnrollmentForm } from '../components/FormationDetail/EnrollmentForm';
import { RelatedFormations } from '../components/FormationDetail/RelatedFormations';
import toast from 'react-hot-toast';

interface Formation {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  image_couverture?: string;
  resume?: string;
  provider?: string;
  entreprise?: {
    id: number;
    name: string;
    logo?: string;
  };
  entreprise_name?: string;
  location?: string;
  city?: {
    id: number;
    name: string;
  };
  city_id?: number;
  type?: string;
  level?: string;
  certificate?: boolean;
  price?: number;
  duree?: string;
  category?: string;
  sector?: string;
  detailed_description?: string;
  objectives?: string[] | string;
  prerequisites?: string[] | string;
  programme?: string;
  program?: string[];
  instructor?: string;
  rating?: number;
  reviews_count?: number;
  enrolled_count?: number;
  created_at?: string;
  updated_at?: string;
}

function FormationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'program' | 'reviews'>('overview');

  // Charger la formation depuis le backend
  const { data: response, loading: isLoading, error } = useFetch<Formation | { data: Formation }>({
    url: `/formations/${id}`,
  });

  // Gérer différents formats de réponse API
  const formation = response 
    ? (Array.isArray(response) ? response[0] : (response as { data?: Formation })?.data || response as Formation)
    : null;

  // Rediriger si erreur ou formation non trouvée
  useEffect(() => {
    if (!isLoading && (error || !formation)) {
      toast.error('Formation non trouvée');
      navigate('/catalogue');
    }
  }, [isLoading, error, formation, navigate]);

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-bg-light via-white to-primary/5">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="relative mx-auto mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-gray-dark font-semibold">Chargement de la formation...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-bg-light via-white to-primary/5">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-dark text-lg font-semibold mb-4">Formation non trouvée</p>
            <button
              onClick={() => navigate('/catalogue')}
              className="btn btn-primary"
            >
              Retour au catalogue
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: formation.title,
        text: formation.description,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Lien copié dans le presse-papiers!');
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50">
      <Header />

      {/* SEO pour la formation */}
      {formation && (
        <SEO
          title={formation.title}
          description={formation.detailed_description || formation.description || "Découvrez cette formation sur PNFC, la plateforme nationale de formation congolaise."}
          keywords={`${formation.title}, formation, Congo-Brazzaville, PNFC${formation.category ? ', ' + formation.category : ''}`}
          image={formation.image_url || formation.image_couverture || '/og-default.jpg'}
          url={`/formations/${formation.id}`}
          type="article"
        />
      )}

        <main className="flex-grow">
        {/* Back Button */}
        <div className="bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate('/catalogue')}
              className="flex items-center gap-2 text-[#0055A4] hover:opacity-70 transition font-semibold"
            >
              <ArrowLeft size={20} />
              Retour au catalogue
            </button>
          </div>
        </div>

        {/* Hero Section with Image */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="rounded-lg overflow-hidden mb-6 shadow-md">
                  <img
                    src={formation.image_url || formation.image_couverture || 'https://via.placeholder.com/800x400?text=Formation'}
                    alt={formation.title}
                    className="w-full h-96 object-cover"
                  />
                </div>

                {/* Title and Meta Info */}
                <h1 className="text-4xl font-black text-slate-900 mb-4">
                  {formation.title}
                </h1>

                {/* Rating and Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < Math.floor(formation.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-slate-900">
                      {formation.rating?.toFixed(1)} ({formation.reviews_count} avis)
                    </span>
                  </div>
                  <span className="text-slate-600 font-semibold">
                    {formation.entreprise?.name || formation.entreprise_name || formation.provider || 'PNFC'}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-[#0055A4] rounded-full text-sm font-semibold">
                    {formation.category || formation.sector || 'Formation'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                  {formation.detailed_description || formation.description}
                </p>

                {/* Key Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Clock size={20} className="text-[#0055A4]" />
                      <span className="text-sm font-semibold">Durée</span>
                    </div>
                    <p className="text-slate-900 font-bold">{formation.duree}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <MapPin size={20} className="text-[#0055A4]" />
                      <span className="text-sm font-semibold">Lieu</span>
                    </div>
                    <p className="text-slate-900 font-bold">
                      {formation.city?.name || formation.location || 'Non spécifié'}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Users size={20} className="text-[#0055A4]" />
                      <span className="text-sm font-semibold">Type</span>
                    </div>
                    <p className="text-slate-900 font-bold">{formation.type}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Award size={20} className="text-[#0055A4]" />
                      <span className="text-sm font-semibold">Certificat</span>
                    </div>
                    <p className="text-slate-900 font-bold">
                      {formation.certificate ? 'Oui' : 'Non'}
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-slate-200 mb-8">
                  <div className="flex gap-8">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`pb-4 font-semibold transition ${
                        activeTab === 'overview'
                          ? 'border-b-2 border-[#0055A4] text-[#0055A4]'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Vue d'ensemble
                    </button>
                    <button
                      onClick={() => setActiveTab('program')}
                      className={`pb-4 font-semibold transition ${
                        activeTab === 'program'
                          ? 'border-b-2 border-[#0055A4] text-[#0055A4]'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Programme
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`pb-4 font-semibold transition ${
                        activeTab === 'reviews'
                          ? 'border-b-2 border-[#0055A4] text-[#0055A4]'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Avis ({formation.reviews_count})
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Objectives */}
                    {formation.objectives && (
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                          Objectifs de la formation
                        </h2>
                        <ul className="space-y-3">
                          {(Array.isArray(formation.objectives) 
                            ? formation.objectives 
                            : typeof formation.objectives === 'string' 
                              ? formation.objectives.split('\n').filter(o => o.trim())
                              : []
                          ).map((objective, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="text-[#0055A4] font-bold mt-1">✓</span>
                              <span className="text-slate-700">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prerequisites */}
                    {formation.prerequisites && (
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                          Prérequis
                        </h2>
                        <ul className="space-y-3">
                          {(Array.isArray(formation.prerequisites) 
                            ? formation.prerequisites 
                            : typeof formation.prerequisites === 'string' 
                              ? formation.prerequisites.split('\n').filter(p => p.trim())
                              : []
                          ).map((prerequisite, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="text-slate-400 font-bold mt-1">•</span>
                              <span className="text-slate-700">{prerequisite}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Instructor */}
                    {formation.instructor && (
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                          Instructeur
                        </h2>
                        <p className="text-slate-700 font-semibold">{formation.instructor}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'program' && (formation.programme || formation.program) && (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Programme détaillé
                    </h2>
                    {formation.programme ? (
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                          {formation.programme.split('\n').map((line, index) => (
                            <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:shadow-sm transition bg-white mb-3">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0055A4] text-white flex items-center justify-center font-bold text-sm">
                                  {index + 1}
                                </div>
                                <p className="text-slate-900 font-semibold pt-1">{line}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : formation.program ? (
                      <div className="space-y-4">
                        {formation.program.map((week, index) => (
                          <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:shadow-sm transition bg-white">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0055A4] text-white flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <p className="text-slate-900 font-semibold pt-1">{week}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ReviewsSection formationId={formation.id} />
                )}
              </div>

              {/* Sidebar - Enrollment Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  {/* Enrollment Card */}
                  <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
                    <EnrollmentForm 
                      formationId={formation.id}
                      title={formation.title}
                      price={formation.price || 0}
                      instructor={formation.instructor || 'Instructeur à confirmer'}
                      duration={formation.duree || 'Non spécifié'}
                      level={formation.level || 'Tous niveaux'}
                      enrolledCount={formation.enrolled_count || formation.reviews_count || 0}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="bg-white rounded-lg shadow-lg p-4 border border-slate-200">
                    <div className="flex gap-3">
                      <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition"
                      >
                        <Share2 size={18} />
                        Partager
                      </button>
                      <button
                        onClick={handleFavorite}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition ${
                          isFavorite
                            ? 'bg-red-100 text-red-600 border border-red-200'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                        {isFavorite ? 'Favori' : 'Favoris'}
                      </button>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-slate-700">
                      <strong>Besoin d'aide?</strong> Contactez notre équipe support à{' '}
                      <a href="mailto:support@pnfc.cd" className="text-[#0055A4] font-semibold hover:underline">
                        support@pnfc.cd
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Formations */}
        <div className="container mx-auto px-4 py-8">
          <RelatedFormations 
            currentFormationId={formation.id}
            category={formation.category}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default FormationDetailPage;