import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Award, Star, Building2 } from 'lucide-react';

interface Course {
  id: number;
  image: string;
  title: string;
  description?: string;
  provider: string;
  entrepriseName?: string;
  entrepriseLogo?: string;
  location: string;
  type: string;
  level: string;
  category?: string;
  certificate: boolean;
  price?: number;
  duree?: string;
  rating?: number;
  reviewsCount?: number;
  favorite?: boolean;
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate(`/formation/${course.id}`);
  };

  // Formater le prix
  const formatPrice = (price?: number) => {
    if (!price) return 'Gratuit';
    return `${price.toLocaleString('fr-FR')} FC`;
  };

  // Tronquer la description
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="group flex transform flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20">
      {/* Image */}
      <div className="relative h-48 w-full bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
        {course.image && course.image !== 'https://via.placeholder.com/400x300' ? (
          <img
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            src={course.image}
            alt={course.title}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Building2 className="w-16 h-16 text-primary/30" />
          </div>
        )}
        {/* Badge Catégorie */}
        {course.category && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full shadow-md">
              {course.category}
            </span>
          </div>
        )}
        {/* Badge Certificat */}
        {course.certificate && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
              <Award className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold text-gray-xdark">Certifié</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-5">
        {/* Nom de l'entreprise */}
        <div className="flex items-center gap-2 mb-2">
          {course.entrepriseLogo ? (
            <img
              src={course.entrepriseLogo}
              alt={course.entrepriseName}
              className="w-5 h-5 rounded object-cover"
            />
          ) : (
            <Building2 className="w-4 h-4 text-gray-dark" />
          )}
          <p className="text-xs font-semibold text-gray-dark">
            {course.entrepriseName || course.provider}
          </p>
        </div>

        {/* Titre */}
        <h3 className="mb-3 text-lg font-bold text-gray-xdark line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="mb-4 flex-grow text-sm text-gray-dark line-clamp-3">
            {truncateDescription(course.description, 120)}
          </p>
        )}

        {/* Informations */}
        <div className="space-y-2 mb-4">
          {/* Localisation et Type */}
          <div className="flex items-center gap-3 text-xs text-gray-dark">
            {course.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{course.location}</span>
              </div>
            )}
            {course.type && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{course.type}</span>
              </div>
            )}
          </div>

          {/* Durée */}
          {course.duree && (
            <div className="flex items-center gap-1 text-xs text-gray-dark">
              <Clock className="w-3.5 h-3.5" />
              <span>Durée: {course.duree}</span>
            </div>
          )}

          {/* Rating */}
          {course.rating && (
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < Math.floor(course.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-dark">
                {course.rating.toFixed(1)}
                {course.reviewsCount && ` (${course.reviewsCount})`}
              </span>
            </div>
          )}
        </div>

        {/* Prix et Bouton */}
        <div className="mt-auto pt-4 border-t border-gray-light">
          <div className="flex items-center justify-between mb-3">
            {course.price !== undefined && (
              <div>
                <p className="text-xs text-gray-dark mb-0.5">Prix</p>
                <p className="text-lg font-black text-primary">
                  {formatPrice(course.price)}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleViewMore}
            className="btn btn-primary w-full btn-sm hover:bg-accent hover:border-accent"
          >
            Voir plus
          </button>
        </div>
      </div>
    </div>
  );
}
