import { Search } from 'lucide-react';
import { SearchFilters } from '../hooks/useSearchFilters';

interface SearchSectionProps {
  filters: SearchFilters;
  onSearchChange: (search: string) => void;
  resultCount: number;
}

export function SearchSection({ filters, onSearchChange, resultCount }: SearchSectionProps) {
  return (
    <div className="sticky top-20 z-40 mb-8">
      <div className="relative rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Barre de recherche principale */}
          <div className="relative md:col-span-8">
            <label className="sr-only" htmlFor="main-search">
              Rechercher une formation
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
              <Search size={20} />
            </div>
            <input
              id="main-search"
              type="search"
              value={filters.search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher par titre, compétence ou formateur..."
              className="w-full rounded-lg border border-slate-300 bg-white h-12 pl-12 pr-4 text-base placeholder:text-slate-500 focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition"
            />
          </div>

          {/* Compteur de résultats */}
          <div className="md:col-span-4 flex items-center justify-end">
            <span className="text-sm font-semibold text-slate-600">
              {resultCount > 0 ? (
                <>
                  <span className="text-[#0055A4]">{resultCount}</span> résultat{resultCount > 1 ? 's' : ''}
                </>
              ) : (
                <span className="text-red-600">Aucun résultat</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
