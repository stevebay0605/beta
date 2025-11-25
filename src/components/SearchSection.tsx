import { Search } from 'lucide-react';

export function SearchSection() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#101722] text-center mb-8">
          TROUVEZ VOTRE FORMATION
        </h1>

        <div className="flex gap-2 max-w-2xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher par mot-clé, ville ou organisme..."
              className="w-full px-6 py-4 rounded-full border-2 border-slate-200 focus:border-[#0055A4] focus:outline-none text-slate-700"
            />
          </div>
          <button className="bg-[#F58220] hover:bg-[#e67418] text-white px-8 py-4 rounded-full flex items-center gap-2 font-medium transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
