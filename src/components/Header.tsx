import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-[#f6f7f8]/80 dark:bg-[#101722]/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-4 text-slate-900 dark:text-slate-50 hover:opacity-80 transition-opacity"
        >
          <div className="size-8 text-[#0055A4]">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_6_319)">
                <path
                  d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                  fill="currentColor"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_6_319">
                  <rect fill="white" height="48" width="48"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-lg font-bold tracking-tight">Formations D-CLIC</h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-9 md:flex">
          <Link className="text-sm font-bold text-[#0055A4]" to="/">
            Accueil
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#0055A4] dark:hover:text-[#0055A4]"
            to="/catalogue"
          >
            Catalogue
          </Link>
          <Link
            className="text-sm font-medium hover:text-[#0055A4] dark:hover:text-[#0055A4]"
            to="/about"
          >
            À Propos
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <span className="truncate">Se Connecter</span>
          </Link>
          <Link
            to="/register"
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#0055A4] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90"
          >
            <span className="truncate">S'inscrire</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          id="mobileMenuBtn"
          aria-label="Menu mobile"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              className="block text-sm font-medium text-[#0055A4]"
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              className="block text-sm font-medium hover:text-[#0055A4]"
              to="/catalogue"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Catalogue
            </Link>
            <Link
              className="block text-sm font-medium hover:text-[#0055A4]"
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              À Propos
            </Link>
            <hr className="my-2 border-slate-200 dark:border-slate-700" />
            <Link
              className="block text-sm font-medium hover:text-[#0055A4]"
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Se Connecter
            </Link>
            <Link
              className="block text-sm font-medium text-[#0055A4]"
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              S'inscrire
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
