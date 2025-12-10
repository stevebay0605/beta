import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Catalog } from '../components/Catalog';
import { SearchSection } from '../components/SearchSection';
import { Filters } from '../components/Filters';
import { useSearchFilters } from '../hooks/useSearchFilters';
import { useFetch } from '../hooks/useFetch';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SEO } from '../components/SEO';
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
  // Champs supplémentaires depuis le backend
  entreprise?: {
    id: number;
    name: string;
    logo?: string;
  };
  entreprise_name?: string; // Nom de l'entreprise (si pas d'objet)
  instructor?: string;
  rating?: number;
  reviews_count?: number;
  created_at?: string;
  updated_at?: string;
}

const ITEMS_PER_PAGE = 12;

function Catalogue() {
  const { data: response, loading, error } = useFetch<Formation[] | { data: Formation[] }>({
    url: '/formations',
  });
  
  // Gérer différents formats de réponse API (array direct ou { data: array })
  const formations = Array.isArray(response) 
    ? response 
    : (response as { data?: Formation[] })?.data || [];
  
  // Utiliser uniquement les données du backend, pas de fallback
  const allFormations = formations || [];
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

    <>
      <SEO
        title="Catalogue des formations"
        description="Découvrez toutes les formations disponibles sur PNFC, la Plateforme Nationale de Formation Congolaise. Trouvez la compétence qui boostera votre carrière au Congo-Brazzaville."
        keywords="formations, catalogue, Congo Brazzaville, PNFC, éducation, carrière, développement professionnel"
        url="/catalogue"
        image="/og-catalogue.jpg"
      />
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
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="text-slate-600 text-lg font-semibold">Chargement des formations...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-12">
                  <div className="alert alert-error max-w-md mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-bold">Erreur de chargement</h3>
                      <div className="text-xs">{error}</div>
                    </div>
                  </div>
                </div>
              ) : filteredFormations.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-600 text-lg font-semibold mb-2">Aucune formation trouvée</p>
                  <p className="text-slate-500 text-sm mb-4">
                    {allFormations.length === 0 
                      ? "Aucune formation disponible pour le moment" 
                      : "Essayez d'ajuster vos filtres ou votre recherche"}
                  </p>
                  {allFormations.length > 0 && (
                    <button
                      onClick={handleReset}
                      className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-accent transition"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
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
    </>
  );
}

export default Catalogue;