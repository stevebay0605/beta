import { GraduationCap } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-[#101722] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#0055A4] font-bold text-sm">PNFC</span>
            </div>
            <span className="font-semibold text-lg">PNFC</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white hover:text-[#F58220] transition-colors">
              Accueil
            </a>
            <a href="#" className="text-white hover:text-[#F58220] transition-colors">
              Formations
            </a>
            <a href="#" className="text-white hover:text-[#F58220] transition-colors">
              Favoris
            </a>
            <a href="#" className="text-white hover:text-[#F58220] transition-colors">
              Connexion
            </a>
          </nav>

          <button className="bg-[#F58220] hover:bg-[#e67418] text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Inscription
          </button>
        </div>
      </div>
    </header>
  );
}
