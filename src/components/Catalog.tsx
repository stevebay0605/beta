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
}

// Données par défaut - Formations d'exemple
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
  },
  {
    id: 3,
    title: 'Gestion de Projet Agile avec Scrum',
    description: 'Apprenez les méthodologies Agile et Scrum',
    image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'TechHub Congo',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    price: 30000,
    duree: '1.5 mois',
  },
  {
    id: 4,
    title: 'Développement Web Fullstack',
    description: 'Devenez développeur fullstack avec React et Node.js',
    image_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'Structure Design Tech',
    location: 'Kinshasa',
    type: 'En ligne',
    level: 'IT',
    certificate: true,
    price: 50000,
    duree: '4 mois',
  },
  {
    id: 5,
    title: 'Marketing Digital Avancé',
    description: 'Stratégies marketing pour les réseaux sociaux et le web',
    image_url: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'Digital Academy',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    price: 20000,
    duree: '6 semaines',
  },
  {
    id: 6,
    title: 'Python pour la Data Science',
    description: 'Analyse de données avec Python et pandas',
    image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'Tech Institute',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    price: 40000,
    duree: '3 mois',
  },
];

interface CatalogProps {
  formations?: Formation[];
  filters?: SearchFilters;
}

export function Catalog({ formations = DEFAULT_FORMATIONS }: CatalogProps) {
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
            image: course.image_url || 'https://via.placeholder.com/400x300',
            provider: course.provider || 'D-CLIC',
            location: course.location || 'En ligne',
            type: course.type || 'Formation',
            level: course.level || 'IT',
            certificate: course.certificate || false,
          }}
        />
      ))}
    </>
  );
}
