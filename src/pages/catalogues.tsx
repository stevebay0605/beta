import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Catalog } from '../components/Catalog';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Catalogue() {
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

        {/* Sticky Search Bar */}
        <div className="sticky top-20 z-40 mb-8">
          <div className="relative rounded-xl border border-slate-200/80 bg-white/80 backdrop-blur-lg p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="relative md:col-span-6 lg:col-span-8">
                <label className="sr-only" htmlFor="main-search">
                  Rechercher une formation
                </label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
                  <span>🔍</span>
                </div>
                <input
                  className="form-input w-full rounded-lg border border-slate-300 bg-white h-12 pl-12 pr-4 text-base placeholder:text-slate-500 focus:ring-2 focus:ring-[#0055A4] focus:border-transparent"
                  id="main-search"
                  placeholder="Rechercher par mot-clé, compétence ou métier..."
                  type="search"
                />
              </div>
              <div className="md:col-span-3 lg:col-span-2">
                <select className="form-select w-full rounded-lg border border-slate-300 bg-white h-12 text-base placeholder:text-slate-500 focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" title="Sélectionner un domaine">
                  <option defaultValue="">Domaines</option>
                  <option>Développement Web</option>
                  <option>Design UI/UX</option>
                  <option>Marketing Digital</option>
                </select>
              </div>
              <div className="md:col-span-3 lg:col-span-2">
                <select className="form-select w-full rounded-lg border border-slate-300 bg-white h-12 text-base placeholder:text-slate-500 focus:ring-2 focus:ring-[#0055A4] focus:border-transparent" title="Sélectionner un niveau">
                  <option defaultValue="">Niveaux</option>
                  <option>Débutant</option>
                  <option>Intermédiaire</option>
                  <option>Avancé</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <Catalog />
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 disabled:opacity-50 disabled:pointer-events-none" disabled title="Page précédente">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0055A4] text-white font-bold text-sm" title="Page 1">
                1
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-200 font-bold text-sm" title="Page 2">
                2
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-200 font-bold text-sm" title="Page 3">
                3
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200" title="Page suivante">
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Catalogue;