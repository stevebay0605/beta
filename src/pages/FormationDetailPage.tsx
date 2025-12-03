import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
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
  resume?: string;
  provider?: string;
  location?: string;
  type?: string;
  level?: string;
  certificate?: boolean;
  price?: number;
  duree?: string;
  category?: string;
  detailed_description?: string;
  objectives?: string[];
  prerequisites?: string[];
  program?: string[];
  instructor?: string;
  rating?: number;
  reviews_count?: number;
}

const DEFAULT_FORMATIONS: Formation[] = [
  {
    id: 1,
    title: 'Introduction au Développement Web',
    description: 'Apprenez les bases du web avec HTML, CSS et JavaScript',
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'OIF - D-CLIC',
    location: 'Kinshasa',
    type: 'En ligne',
    level: 'IT',
    certificate: true,
    price: 25000,
    duree: '3 mois',
    category: 'Développement',
    detailed_description: 'Une formation complète pour apprendre les fondamentaux du développement web. Vous apprendrez HTML5, CSS3 et JavaScript moderne. Cette formation est conçue pour les débutants et vous guide pas à pas dans la création de sites web interactifs.',
    objectives: [
      'Maîtriser les bases de HTML5 et CSS3',
      'Comprendre les principes du JavaScript',
      'Créer des pages web responsives',
      'Utiliser les outils de développement modernes',
    ],
    prerequisites: [
      'Connaissances informatiques basiques',
      'Accès à un ordinateur et une connexion internet',
    ],
    program: [
      'Semaines 1-2: HTML5 et structure des pages',
      'Semaines 3-4: CSS3 et styling avancé',
      'Semaines 5-8: JavaScript et interactivité',
      'Semaines 9-12: Projet final et portfolio',
    ],
    instructor: 'Jean Mukonde',
    rating: 4.5,
    reviews_count: 245,
  },
  {
    id: 2,
    title: 'Principes du Design d\'Interface',
    description: 'Maîtrisez les bases du design UI/UX moderne',
    image_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'Université de Brazzaville',
    location: 'Brazzaville',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    price: 35000,
    duree: '2 mois',
    category: 'Design',
    detailed_description: 'Apprenez les principes fondamentaux du design UI/UX. Cette formation couvre la théorie des couleurs, la typographie, l\'ergonomie et les meilleures pratiques du design moderne.',
    objectives: [
      'Comprendre les principes du design UI/UX',
      'Maîtriser l\'utilisation des outils de design',
      'Créer des interfaces utilisateur efficaces',
      'Implémenter les meilleures pratiques d\'accessibilité',
    ],
    prerequisites: [
      'Intérêt pour le design',
      'Connaissance basique des outils numériques',
    ],
    program: [
      'Semaine 1: Fondamentaux du design',
      'Semaine 2-3: Théorie des couleurs et typographie',
      'Semaine 4-5: Outils de design modernes (Figma)',
      'Semaine 6-8: Projets pratiques et portfolio',
    ],
    instructor: 'Marie Kinshasa',
    rating: 4.7,
    reviews_count: 189,
  },
];

function FormationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'program' | 'reviews'>('overview');

  // Simuler le fetch de la formation
  useEffect(() => {
    setIsLoading(true);
    const formationId = parseInt(id || '0');
    const found = DEFAULT_FORMATIONS.find(f => f.id === formationId);
    if (found) {
      setFormation(found);
    } else {
      toast.error('Formation non trouvée');
      navigate('/catalogue');
    }
    setIsLoading(false);
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-slate-500">Chargement...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!formation) {
    return null;
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
                <div className="rounded-lg overflow-hidden mb-6">
                  <img
                    src={formation.image_url}
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
                  <span className="text-slate-600 font-semibold">{formation.provider}</span>
                  <span className="px-3 py-1 bg-blue-100 text-[#0055A4] rounded-full text-sm font-semibold">
                    {formation.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                  {formation.detailed_description || formation.description}
                </p>

                {/* Key Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Clock size={20} />
                      <span className="text-sm font-semibold">Durée</span>
                    </div>
                    <p className="text-slate-900 font-bold">{formation.duree}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <MapPin size={20} />
                      <span className="text-sm font-semibold">Lieu</span>
                    </div>
                    <p className="text-slate-900 font-bold">{formation.location}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Users size={20} />
                      <span className="text-sm font-semibold">Type</span>
                    </div>
                    <p className="text-slate-900 font-bold">{formation.type}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Certificate size={20} />
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
                          {formation.objectives.map((objective, index) => (
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
                          {formation.prerequisites.map((prerequisite, index) => (
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
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">
                          Instructeur
                        </h2>
                        <p className="text-slate-700 font-semibold">{formation.instructor}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'program' && formation.program && (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">
                      Programme détaillé
                    </h2>
                    <div className="space-y-4">
                      {formation.program.map((week, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                          <p className="text-slate-900 font-semibold">{week}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ReviewsSection formationId={formation.id} />
                )}
              </div>

              {/* Sidebar - Enrollment Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  {/* Price Card */}
                  <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
                    <div className="mb-6">
                      <p className="text-slate-600 text-sm mb-2">Prix de la formation</p>
                      <p className="text-4xl font-black text-[#0055A4]">
                        {formation.price?.toLocaleString()} FC
                      </p>
                      <p className="text-slate-500 text-sm mt-1">Prix fixe, une seule fois</p>
                    </div>

                    <EnrollmentForm 
                      formation={formation}
                      isAuthenticated={!!user}
                    />

                    <div className="flex gap-3 mt-4">
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
                            ? 'bg-red-100 text-red-600'
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
                      <strong>Besoin d'aide?</strong> Contactez notre équipe support à support@platforma.cd
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Formations */}
        <RelatedFormations 
          currentFormationId={formation.id}
          category={formation.category}
        />
      </main>

      <Footer />
    </div>
  );
}

export default FormationDetailPage;