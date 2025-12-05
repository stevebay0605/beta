import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Award } from 'lucide-react';

interface RelatedFormation {
  id: number;
  title: string;
  image_url?: string;
  provider?: string;
  location?: string;
  price?: number;
  duree?: string;
  level?: string;
  rating?: number;
  certificate?: boolean;
  category?: string;
}

interface RelatedFormationsProps {
  currentFormationId: number;
  category?: string;
}

const MOCK_RELATED: RelatedFormation[] = [
  {
    id: 2,
    title: 'React Avancé et Hooks',
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'OIF - PNFC',
    location: 'Kinshasa',
    price: 35000,
    duree: '6 semaines',
    level: 'Intermédiaire',
    rating: 4.7,
    certificate: true,
    category: 'Développement',
  },
  {
    id: 3,
    title: 'Node.js et Express',
    image_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'Université de Kinshasa',
    location: 'Kinshasa',
    price: 40000,
    duree: '8 semaines',
    level: 'Intermédiaire',
    rating: 4.6,
    certificate: true,
    category: 'Développement',
  },
  {
    id: 4,
    title: 'TypeScript Complet',
    image_url: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'OIF - PNFC',
    location: 'En ligne',
    price: 30000,
    duree: '5 semaines',
    level: 'Avancé',
    rating: 4.8,
    certificate: true,
    category: 'Développement',
  },
  {
    id: 5,
    title: 'API REST et Bases de Données',
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'Institut de Technologie',
    location: 'Brazzaville',
    price: 38000,
    duree: '7 semaines',
    level: 'Intermédiaire',
    rating: 4.5,
    certificate: true,
    category: 'Développement',
  },
];

export function RelatedFormations({ currentFormationId, category }: RelatedFormationsProps) {
  const navigate = useNavigate();
  
  const related = MOCK_RELATED.filter(f => f.id !== currentFormationId).slice(0, 4);

  const handleViewFormation = (formationId: number) => {
    navigate(`/formation/${formationId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="mt-16 pt-8 border-t border-slate-200">
      <h2 className="text-3xl font-bold text-slate-900 mb-8">Formations recommandées</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((formation) => (
          <div
            key={formation.id}
            className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => handleViewFormation(formation.id)}
          >
            {/* Image */}
            <div className="relative h-32 w-full bg-slate-200 overflow-hidden">
              <img
                src={formation.image_url || 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'}
                alt={formation.title}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {formation.certificate && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Award size={12} />
                  Certificat
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              {/* Category */}
              <p className="text-xs font-semibold text-[#F58220] mb-2">
                {formation.category || formation.level}
              </p>

              {/* Title */}
              <h3 className="font-bold text-slate-900 mb-3 text-sm line-clamp-2">
                {formation.title}
              </h3>

              {/* Provider */}
              <p className="text-xs text-slate-600 mb-3">
                {formation.provider}
              </p>

              {/* Details */}
              <div className="space-y-2 mb-4 text-xs text-slate-600">
                {formation.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{formation.location}</span>
                  </div>
                )}
                {formation.duree && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-slate-400" />
                    <span>{formation.duree}</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              {formation.rating && (
                <div className="flex items-center gap-1 mb-4">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-slate-900">
                    {formation.rating}
                  </span>
                </div>
              )}

              {/* Price and Button */}
              <div className="mt-auto border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0055A4]">
                    {formation.price === 0 ? 'Gratuit' : `${formation.price?.toLocaleString('fr-FR')} $`}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewFormation(formation.id);
                    }}
                    className="px-3 py-1 bg-[#0055A4] text-white text-xs font-semibold rounded hover:bg-[#0055A4]/90 transition"
                  >
                    Voir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/catalogues')}
          className="px-8 py-3 border-2 border-[#0055A4] text-[#0055A4] font-bold rounded-lg hover:bg-[#0055A4]/10 transition"
        >
          Voir toutes les formations
        </button>
      </div>
    </div>
  );
}
