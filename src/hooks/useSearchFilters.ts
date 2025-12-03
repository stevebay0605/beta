import { useState, useCallback, useMemo } from 'react';

export interface SearchFilters {
  search: string;
  category: string;
  level: string;
  location: string;
  priceMin: number;
  priceMax: number;
  duration: string;
  type: 'all' | 'online' | 'inperson' | 'hybrid';
  certificate: boolean | 'all';
}

export const DEFAULT_FILTERS: SearchFilters = {
  search: '',
  category: '',
  level: '',
  location: '',
  priceMin: 0,
  priceMax: 100000,
  duration: '',
  type: 'all',
  certificate: 'all',
};

export interface Formation {
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

export const useSearchFilters = (formations: Formation[]) => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  // Mettre à jour un filtre
  const updateFilter = useCallback((key: keyof SearchFilters, value: unknown) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Réinitialiser tous les filtres
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Filtrer les formations
  const filteredFormations = useMemo(() => {
    return formations.filter((formation) => {
      // Filtre recherche (titre + description + provider)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          formation.title.toLowerCase().includes(searchTerm) ||
          formation.description?.toLowerCase().includes(searchTerm) ||
          formation.provider?.toLowerCase().includes(searchTerm);

        if (!matchesSearch) return false;
      }

      // Filtre catégorie
      if (filters.category && formation.category !== filters.category) {
        return false;
      }

      // Filtre niveau
      if (filters.level && formation.level !== filters.level) {
        return false;
      }

      // Filtre localisation
      if (filters.location && formation.location !== filters.location) {
        return false;
      }

      // Filtre prix
      const price = formation.price || 0;
      if (price < filters.priceMin || price > filters.priceMax) {
        return false;
      }

      // Filtre durée
      if (filters.duration && formation.duree !== filters.duration) {
        return false;
      }

      // Filtre type
      if (filters.type !== 'all') {
        const typeMap: Record<string, string> = {
          online: 'En ligne',
          inperson: 'Formation',
          hybrid: 'Hybride',
        };
        if (formation.type !== typeMap[filters.type]) {
          return false;
        }
      }

      // Filtre certificat
      if (filters.certificate !== 'all' && formation.certificate !== filters.certificate) {
        return false;
      }

      return true;
    });
  }, [formations, filters]);

  // Obtenir les valeurs uniques pour les selects
  const getUniqueValues = useCallback((key: keyof Formation): string[] => {
    const values = formations
      .map((f) => f[key])
      .filter((v) => v !== undefined && v !== null && v !== '')
      .map((v) => String(v));

    return Array.from(new Set(values)).sort();
  }, [formations]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredFormations,
    getUniqueValues,
  };
};
