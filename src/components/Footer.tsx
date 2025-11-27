import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 text-slate-900 dark:text-slate-50">
              <div className="size-7 text-[#0055A4]">
                <svg
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.578 8.578a23.9 23.9 0 0 0-5.968 11.167A23.9 23.9 0 0 0 3.85 32.346a23.9 23.9 0 0 0 8.033 9.788 23.9 23.9 0 0 0 12.117 3.676 23.9 23.9 0 0 0 12.117-3.676 23.9 23.9 0 0 0 8.033-9.788 23.9 23.9 0 0 0 1.24-12.601A23.9 23.9 0 0 0 39.422 8.578L24 24 8.578 8.578z"></path>
                </svg>
              </div>
              <h2 className="text-md font-bold">Formations D-CLIC</h2>
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
              Votre portail pour les formations numériques au Congo.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-50 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#0055A4]"
                  to="/"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#0055A4]"
                  to="/catalogue"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#0055A4]"
                  to="/about"
                >
                  À Propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-50 mb-3">
              Légal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#0055A4]"
                  href="#"
                >
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#0055A4]"
                  href="#"
                >
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-50 mb-3">
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#0055A4]"
                  href="mailto:contact@d-clic.com"
                >
                  contact@d-clic.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>© 2024 Formations D-CLIC. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
