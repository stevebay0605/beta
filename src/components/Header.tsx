import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-4 text-slate-900 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 text-[#0055A4]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_319)">
                <path
                  d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect fill="white" height="48" width="48" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight">Formations D-CLIC</h2>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          <Link to="/" className="text-sm font-bold text-[#0055A4]">Accueil</Link>
          <Link to="/catalogue" className="text-sm font-medium hover:text-[#0055A4] transition-colors">Catalogue</Link>
          <a href="#" className="text-sm font-medium hover:text-[#0055A4] transition-colors">À Propos</a>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200/60 text-slate-800 text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                {user?.name?.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-red-100 text-red-700 text-sm font-bold hover:bg-red-200 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200/60 text-slate-800 text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                Se Connecter
              </Link>
              <Link
                to="/register"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0055A4] text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          aria-label="Menu mobile"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link to="/" className="block text-sm font-medium text-[#0055A4]" onClick={() => setIsMobileMenuOpen(false)}>
              Accueil
            </Link>
            <Link to="/catalogue" className="block text-sm font-medium hover:text-[#0055A4]" onClick={() => setIsMobileMenuOpen(false)}>
              Catalogue
            </Link>
            <a href="#" className="block text-sm font-medium hover:text-[#0055A4]" onClick={() => setIsMobileMenuOpen(false)}>
              À Propos
            </a>
            <hr className="my-2 border-slate-200" />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block text-sm font-medium text-[#0055A4]" onClick={() => setIsMobileMenuOpen(false)}>
                  Mon Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-sm font-medium text-red-700 hover:text-red-800"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-sm font-medium hover:text-[#0055A4]" onClick={() => setIsMobileMenuOpen(false)}>
                  Se Connecter
                </Link>
                <Link to="/register" className="block text-sm font-medium text-[#0055A4]" onClick={() => setIsMobileMenuOpen(false)}>
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
