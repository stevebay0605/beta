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
          <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
            <Heart className="w-4 h-4 text-[#F58220] fill-[#F58220]" />
          </button>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="text-[#F58220]">{course.provider}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#0ea5e9] text-white text-xs font-medium rounded">
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

        <div className="flex items-start gap-2 mb-4">
          <div className="w-8 h-8 bg-[#0055A4] rounded flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white text-xs font-bold">IT</span>
          </div>
          <h3 className="font-bold text-[#101722] text-lg leading-tight">
            {course.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
          <MapPin className="w-4 h-4" />
          <span>{course.location}</span>
        </div>

        <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
          <Award className="w-4 h-4" />
          <span>Certificat</span>
        </div>

        <button className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white py-2.5 rounded-lg font-medium transition-colors">
          En savoir plus
        </button>
      </div>
    </div>
  );
}
