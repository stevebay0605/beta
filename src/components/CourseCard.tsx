import { useNavigate } from 'react-router-dom';

interface Course {
  id: number;
  image: string;
  title: string;
  provider: string;
  location: string;
  type: string;
  level: string;
  certificate: boolean;
  favorite?: boolean;
  category?: string;
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate(`/formation/${course.id}`);
  };

  return (
    <div className="group flex transform flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-40 w-full bg-slate-200">
        <img
          className="h-full w-full object-cover"
          src={course.image}
          alt={course.title}
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-1 text-sm font-semibold text-[#F58220]">
          {course.category || course.level}
        </p>
        <h3 className="mb-2 text-lg font-bold text-slate-900">
          {course.title}
        </h3>
        <p className="mb-4 text-sm text-slate-600">
          Par {course.provider}
        </p>
        <p className="mb-6 flex-grow text-sm text-slate-700">
          Découvrez cette formation de qualité pour développer vos compétences professionnelles.
        </p>
        <button
          onClick={handleViewMore}
          className="mt-auto flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0055A4]/10 text-[#0055A4] text-sm font-bold leading-normal hover:bg-[#0055A4]/20 transition-colors"
        >
          <span className="truncate">Voir plus</span>
        </button>
      </div>
    </div>
  );
}
