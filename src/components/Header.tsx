import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, ChevronDown, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Détecter le scroll pour l'effet shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // Vérifier si une route est active
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/catalogue', label: 'Catalogue' },
    { path: '/about', label: 'À Propos' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? 'bg-base-100/95 backdrop-blur-md border-gray-medium shadow-lg'
          : 'bg-base-100/80 backdrop-blur-sm border-gray-medium'
      } hover:bg-accent/5 hover:border-accent`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-gray-xdark hover:opacity-80 transition-opacity group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
            P
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold tracking-tight leading-none">PNFC</h2>
            <span className="text-xs text-gray-dark leading-none hidden sm:block">
              Plateforme Nationale
            </span>
          </div>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? 'text-primary font-bold'
                  : 'text-gray-dark hover:text-accent'
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Actions utilisateur */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative">
              {/* Dropdown User Menu */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="btn btn-ghost btn-sm gap-2 hover:bg-accent/10"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden lg:inline font-medium">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-medium z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-medium bg-gray-light/30">
                      <p className="font-bold text-gray-xdark text-base">{user?.name}</p>
                      <p className="text-sm text-gray-dark mt-1">{user?.email}</p>
                      {user?.role && (
                        <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-primary text-white rounded-full">
                          {user.role.name}
                        </span>
                      )}
                    </div>
                    <div className="py-2 bg-white">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-xdark hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Tableau de bord
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-xdark hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Mon profil
                      </Link>
                    </div>
                    <div className="border-t border-gray-medium py-2 bg-white">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-red-50 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="relative px-4 py-2 rounded-lg text-sm font-bold text-primary border-2 border-primary bg-white hover:bg-primary hover:text-white transition-all duration-200 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 min-w-[120px] text-center"
              >
                Se Connecter
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-primary hover:bg-accent transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 min-w-[120px] text-center"
              >
                S'inscrire
              </Link>
            </>
          )}

          {/* Menu Mobile Button */}
          <button
            className="btn btn-ghost btn-sm md:hidden"
            aria-label="Menu mobile"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-medium bg-base-100 animate-in slide-in-from-top duration-200">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-gray-dark hover:bg-gray-light hover:text-accent'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="divider my-2"></div>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-dark hover:bg-gray-light hover:text-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    Tableau de bord
                  </div>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-dark hover:bg-gray-light hover:text-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4" />
                    Mon profil
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-error hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-bold text-primary border-2 border-primary bg-white hover:bg-primary hover:text-white transition-all duration-200 text-center"
                >
                  Se Connecter
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-bold text-white bg-primary hover:bg-accent transition-all duration-200 text-center shadow-md shadow-primary/20"
                >
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
