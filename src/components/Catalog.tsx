import { CourseCard } from './CourseCard';

const courses = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Introduction au Développement Web',
    provider: 'OIF - D-CLIC',
    location: 'Kinshasa',
    type: 'En ligne',
    level: 'IT',
    certificate: true,
    category: 'Développement Web',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Principes du Design d\'Interface',
    provider: 'Université de Brazzaville',
    location: 'Brazzaville',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    category: 'Design UI/UX',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Gestion de Projet Agile avec Scrum',
    provider: 'TechHub Congo',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    category: 'Gestion de Projet',
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Développement Web Fullstack',
    provider: 'Structure Design Tech',
    location: 'Kinshasa',
    type: 'En ligne',
    level: 'IT',
    certificate: true,
    category: 'Développement Web',
  },
  {
    id: 5,
    image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Marketing Digital Avancé',
    provider: 'Digital Academy',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    category: 'Marketing Digital',
  },
  {
    id: 6,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Python pour la Data Science',
    provider: 'Tech Institute',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    category: 'Développement Web',
  },
];

export function Catalog() {
  return (
    <>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </>
  );
}
