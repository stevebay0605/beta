import { Code, Wrench, Briefcase, Users, Languages, Heart, ChevronDown } from 'lucide-react';

const categories = [
  { icon: Code, label: 'IT & Numérique', active: true },
  { icon: Wrench, label: 'Métiers Techniques' },
  { icon: Briefcase, label: 'Arts & Économie' },
  { icon: Users, label: 'Management' },
  { icon: Languages, label: 'Langues' },
  { icon: Heart, label: 'Santé' },
];

export function CategoryNav() {
  return (
    <section className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={index}
                className={`flex flex-col items-center gap-2 px-6 py-3 rounded-lg min-w-[120px] transition-all ${
                  category.active
                    ? 'bg-slate-100 border-2 border-[#0055A4]'
                    : 'bg-white border-2 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-6 h-6 ${category.active ? 'text-[#0055A4]' : 'text-slate-600'}`} />
                <span className={`text-sm font-medium ${category.active ? 'text-[#0055A4]' : 'text-slate-700'}`}>
                  {category.label}
                </span>
              </button>
            );
          })}
          <button className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-slate-900">
            <span className="text-sm font-medium">Autres</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
