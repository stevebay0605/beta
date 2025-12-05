import { CourseCard } from './CourseCard';
import { SearchFilters } from '../hooks/useSearchFilters';

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
  // Champs supplémentaires depuis le backend
  entreprise?: {
    id: number;
    name: string;
    logo?: string;
  };
  entreprise_name?: string; // Nom de l'entreprise (si pas d'objet)
  instructor?: string;
  rating?: number;
  reviews_count?: number;
}

interface CatalogProps {
  formations?: Formation[];
  filters?: SearchFilters;
}

export function Catalog({ formations = [] }: CatalogProps) {
  if (!formations || formations.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-slate-600 text-lg">Aucune formation disponible</p>
      </div>
    );
  }

  return (
    <>
      {formations.map((course) => (
        <CourseCard
          key={course.id}
          course={{
            id: course.id,
            title: course.title,
            description: course.description || course.resume || '',
            image: course.image_url || 'https://via.placeholder.com/400x300',
            provider: course.provider || 'PNFC',
            entrepriseName: course.entreprise?.name || course.entreprise_name || course.provider || 'PNFC',
            entrepriseLogo: course.entreprise?.logo,
            location: course.location || 'En ligne',
            type: course.type || 'Formation',
            level: course.level || 'IT',
            category: course.category || course.level || 'IT',
            certificate: course.certificate || false,
            price: course.price,
            duree: course.duree,
            rating: course.rating,
            reviewsCount: course.reviews_count,
          }}
        />
      ))}
    </>
  );
}
