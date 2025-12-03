import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Catalog } from '../components/Catalog';
import { SearchSection } from '../components/SearchSection';
import { Filters } from '../components/Filters';
import { useSearchFilters } from '../hooks/useSearchFilters';
import { useFetch } from '../hooks/useFetch';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Formation {
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

const DEFAULT_FORMATIONS: Formation[] = [
  {
    id: 1,
    title: 'Introduction au Développement Web',
    description: 'Apprenez les bases du web avec HTML, CSS et JavaScript',
    image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'OIF - D-CLIC',
    location: 'Kinshasa',
    type: 'En ligne',
    level: 'IT',
    certificate: true,
    price: 25000,
    duree: '3 mois',
    category: 'Développement',
  },
  {
    id: 2,
    title: 'Principes du Design d\'Interface',
    description: 'Maîtrisez les bases du design UI/UX moderne',
    image_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'Université de Brazzaville',
    location: 'Brazzaville',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    price: 35000,
    duree: '2 mois',
    category: 'Design',
  },
  {
    id: 3,
    title: 'Gestion de Projet Agile avec Scrum',
    description: 'Apprenez les méthodologies Agile et Scrum',
    image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'TechHub Congo',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    price: 30000,
    duree: '1.5 mois',
    category: 'Gestion',
  },
  {
    id: 4,
    title: 'Développement Web Fullstack',
    description: 'Devenez développeur fullstack avec React et Node.js',
    image_url: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'Structure Design Tech',
    location: 'Kinshasa',
    type: 'En ligne',
    level: 'IT',
    certificate: true,
    price: 50000,
    duree: '4 mois',
    category: 'Développement',
  },
  {
    id: 5,
    title: 'Marketing Digital Avancé',
    description: 'Stratégies marketing pour les réseaux sociaux et le web',
    image_url: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'Digital Academy',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    price: 20000,
    duree: '6 semaines',
    category: 'Marketing',
  },
  {
    id: 6,
    title: 'Python pour la Data Science',
    description: 'Analyse de données avec Python et pandas',
    image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
    provider: 'Tech Institute',
    location: 'Kinshasa',
    type: 'Formation',
    level: 'IT',
    certificate: true,
    price: 40000,
    duree: '3 mois',
    category: 'Data Science',
  },
];

const ITEMS_PER_PAGE = 12;

function Catalogue() {
  const { data: formations } = useFetch<Formation[]>({
    url: '/formations',
  });
  
  const allFormations = formations && formations.length > 0 ? formations : DEFAULT_FORMATIONS;
  const { filters, updateFilter, resetFilters, filteredFormations } = useSearchFilters(allFormations);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredFormations.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFormations = filteredFormations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Réinitialiser la page si les filtres changent
  const handleFilterChange = (key: keyof typeof filters, value: unknown) => {
    updateFilter(key, value);
    setCurrentPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="container mx-auto flex-grow p-4 md:p-6 lg:p-8">
        {/* Title Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-slate-900">
            Trouvez votre prochaine compétence
          </h1>
          <p className="text-slate-600 mt-3 text-lg max-w-2xl mx-auto">
            Explorez un monde de possibilités avec notre catalogue de formations
            conçues pour vous. Lancez votre carrière au Congo.
          </p>
        </div>

        {/* Search Section */}
        <SearchSection 
          filters={filters}
          onSearchChange={(search) => handleFilterChange('search', search)}
          resultCount={filteredFormations.length}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Filters
              filters={filters}
              formations={allFormations}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
            />
          </div>

          {/* Catalog Grid */}
          <div className="lg:col-span-3">
            {filteredFormations.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600 text-lg font-semibold mb-2">Aucune formation trouvée</p>
                <p className="text-slate-500 text-sm mb-4">Essayez d'ajuster vos filtres ou votre recherche</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-[#0055A4] text-white rounded-lg font-bold hover:opacity-90 transition"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                {/* Formations Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Catalog 
                    formations={paginatedFormations}
                    filters={filters}
                  />
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:pointer-events-none transition"
                        title="Page précédente"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page = i + 1;
                        if (totalPages > 5 && currentPage > 3) {
                          page = currentPage - 2 + i;
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm transition ${
                              currentPage === page
                                ? 'bg-[#0055A4] text-white'
                                : 'text-slate-700 hover:bg-slate-200'
                            }`}
                            title={`Page ${page}`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:pointer-events-none transition"
                        title="Page suivante"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Catalogue;