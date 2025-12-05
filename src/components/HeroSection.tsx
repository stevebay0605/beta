import { Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative flex-grow">
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 h-full w-full bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')]"
        ></div>
        <div className="absolute inset-0 z-10 h-full w-full bg-black/40"></div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter text-white mb-6">
            Votre avenir se forme ici
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 mb-12 max-w-2xl mx-auto">
            Découvrez des opportunités de formation provenant d'organisations du
            monde entier. Lancez votre carrière avec PNFC.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalogue"
              className="flex items-center justify-center gap-2 rounded-lg h-14 px-8 bg-[#0055A4] text-white text-base font-bold hover:opacity-90 transition-opacity"
            >
              <Search className="w-5 h-5" />
              <span>Découvrir les formations</span>
            </Link>
            <Link
              to="/publish"
              className="flex items-center justify-center gap-2 rounded-lg h-14 px-8 bg-[#F58220] text-white text-base font-bold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              <span>Publier une formation</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}