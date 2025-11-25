import { CourseCard } from './CourseCard';

const courses = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Développement Web Fullstack',
    provider: 'Structure Design Tech',
    location: 'Kinshasa',
    type: 'En ligne',
    level: 'IT',
    certificate: true,
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Développement Web Fullstack',
    provider: 'Structure Design Tech',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Maraismunt Vte Fullstack',
    provider: 'Structure Google Tech',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    favorite: true,
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
  },
  {
    id: 5,
    image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Développement Web Fullstack',
    provider: 'Structure Design Tech',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
  },
  {
    id: 6,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Maraismunt Vte Fullstack',
    provider: 'Structure Google Tech',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
  },
];

export function Catalog() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#101722]">
          Toutes les Formations <span className="text-slate-500 font-normal">(1350 résultats)</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
