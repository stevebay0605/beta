import { Header } from '../components/Header';
import { SearchSection } from '../components/SearchSection';
import { CategoryNav } from '../components/CategoryNav';
import { Filters } from '../components/Filters';
import { Catalog } from '../components/Catalog';

export function Catalogue() {
  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      <Header />
      <SearchSection />
      <CategoryNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          <aside className="w-64 flex-shrink-0">
            <Filters />
          </aside>
          <main className="flex-1">
            <Catalog />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Catalogue;