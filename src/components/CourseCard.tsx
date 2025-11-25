import { MapPin, Award, Heart } from 'lucide-react';

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
}

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        {course.favorite && (
          <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow" title="Ajouter aux favoris">
            <Heart className="w-4 h-4 text-[#F58220] fill-[#F58220]" />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#F58220] text-xs font-medium">{course.provider}</span>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#0055A4] text-white text-xs font-medium rounded">
            {course.level}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#0ea5e9] text-white text-xs font-medium rounded">
            <MapPin className="w-3 h-3" />
            {course.location}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#0ea5e9] text-white text-xs font-medium rounded">
            {course.type}
          </span>
        </div>

        <div className="flex items-start gap-2 mb-3">
          <div className="w-7 h-7 bg-[#0055A4] rounded flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">IT</span>
          </div>
          <h3 className="font-bold text-[#101722] text-sm leading-tight">
            {course.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-3 text-xs text-slate-600">
          <MapPin className="w-3 h-3" />
          <span>{course.location}</span>
        </div>

        <div className="flex items-center gap-2 mb-4 text-xs text-slate-600">
          <Award className="w-3 h-3" />
          <span>Certificat</span>
        </div>

        <button className={`w-full text-white py-2 rounded-lg font-medium text-sm transition-colors ${
          course.favorite
            ? 'bg-[#FFC107] hover:bg-[#FFB300]'
            : 'bg-[#0ea5e9] hover:bg-[#0284c7]'
        }`}>
          {course.favorite ? 'Favoris' : 'En savoir plus'}
        </button>
      </div>
    </div>
  );
}
