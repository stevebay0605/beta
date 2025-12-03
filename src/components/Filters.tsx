import { X, Filter } from 'lucide-react';
import { SearchFilters } from '../hooks/useSearchFilters';
import { Formation } from '../hooks/useSearchFilters';

interface FiltersProps {
  filters: SearchFilters;
  formations: Formation[];
  onFilterChange: (key: keyof SearchFilters, value: unknown) => void;
  onReset: () => void;
}

export function Filters({ filters, formations, onFilterChange, onReset }: FiltersProps) {
  // Obtenir les valeurs uniques
  const getUniqueValues = (key: keyof Formation): string[] => {
    const values = formations
      .map((f) => f[key])
      .filter((v) => v !== undefined && v !== null && v !== '')
      .map((v) => String(v));
    return Array.from(new Set(values)).sort();
  };

  const categories = getUniqueValues('category');
  const levels = getUniqueValues('level');
  const locations = getUniqueValues('location');
  const durations = getUniqueValues('duree');

  // Obtenir les prix min/max
  const prices = formations
    .map((f) => f.price || 0)
    .filter((p) => p > 0)
    .sort((a, b) => a - b);
  const minPrice = prices[0] || 0;
  const maxPrice = prices[prices.length - 1] || 100000;

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'priceMin') return value !== minPrice;
    if (key === 'priceMax') return value !== maxPrice;
    if (key === 'type') return value !== 'all';
    if (key === 'certificate') return value !== 'all';
    return value !== '';
  });

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      {/* Header avec titre et bouton reset */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-[#0055A4]" />
          <h2 className="text-lg font-bold text-slate-900">Filtres</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
            title="Réinitialiser les filtres"
          >
            <X size={16} />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Grille des filtres */}
      <div className="space-y-6">
        
        {/* Filtre Catégorie */}
        {categories.length > 0 && (
          <div>
            <label htmlFor="category-select" className="block text-sm font-bold text-slate-700 mb-2">
              Catégorie
            </label>
            <select
              id="category-select"
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filtre Niveau */}
        {levels.length > 0 && (
          <div>
            <label htmlFor="level-select" className="block text-sm font-bold text-slate-700 mb-2">
              Niveau
            </label>
            <select
              id="level-select"
              value={filters.level}
              onChange={(e) => onFilterChange('level', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition"
            >
              <option value="">Tous les niveaux</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filtre Localisation */}
        {locations.length > 0 && (
          <div>
            <label htmlFor="location-select" className="block text-sm font-bold text-slate-700 mb-2">
              Localisation
            </label>
            <select
              id="location-select"
              value={filters.location}
              onChange={(e) => onFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition"
            >
              <option value="">Tous les lieux</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filtre Type */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Type de formation
          </label>
          <div className="space-y-2">
            {['all', 'online', 'inperson', 'hybrid'].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={type}
                  checked={filters.type === type}
                  onChange={(e) => onFilterChange('type', e.target.value)}
                  className="w-4 h-4 text-[#0055A4] cursor-pointer"
                  title={`Type: ${type}`}
                />
                <span className="text-sm text-slate-700">
                  {type === 'all'
                    ? 'Tous'
                    : type === 'online'
                      ? 'En ligne'
                      : type === 'inperson'
                        ? 'Présentiel'
                        : 'Hybride'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Filtre Durée */}
        {durations.length > 0 && (
          <div>
            <label htmlFor="duration-select" className="block text-sm font-bold text-slate-700 mb-2">
              Durée
            </label>
            <select
              id="duration-select"
              value={filters.duration}
              onChange={(e) => onFilterChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-[#0055A4] focus:border-transparent outline-none transition"
            >
              <option value="">Toutes les durées</option>
              {durations.map((dur) => (
                <option key={dur} value={dur}>
                  {dur}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filtre Prix */}
        <div>
          <label htmlFor="price-min" className="block text-sm font-bold text-slate-700 mb-3">
            Prix: {filters.priceMin.toLocaleString()} - {filters.priceMax.toLocaleString()} FCFA
          </label>
          <div className="space-y-2">
            <input
              id="price-min"
              type="range"
              min={minPrice}
              max={maxPrice}
              value={filters.priceMin}
              onChange={(e) => onFilterChange('priceMin', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              title="Prix minimum"
            />
            <input
              id="price-max"
              type="range"
              min={minPrice}
              max={maxPrice}
              value={filters.priceMax}
              onChange={(e) => onFilterChange('priceMax', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              title="Prix maximum"
            />
          </div>
        </div>

        {/* Filtre Certificat */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Certificat
          </label>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'Indifférent' },
              { value: 'true', label: 'Avec certificat' },
              { value: 'false', label: 'Sans certificat' },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="certificate"
                  value={value}
                  checked={String(filters.certificate) === value}
                  onChange={(e) => {
                    if (e.target.value === 'all') onFilterChange('certificate', 'all');
                    else onFilterChange('certificate', e.target.value === 'true');
                  }}
                  className="w-4 h-4 text-[#0055A4] cursor-pointer"
                  title={`Certificat: ${label}`}
                />
                <span className="text-sm text-slate-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
