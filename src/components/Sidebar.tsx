import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Settings, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems: SidebarItem[] = [
    {
      label: 'Tableau de Bord',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/dashboard/entreprise',
    },
    {
      label: 'Mes Formations',
      icon: <BookOpen className="w-5 h-5" />,
      path: '/enterprise/formations',
    },
    {
      label: 'Mes Formateurs',
      icon: <Users className="w-5 h-5" />,
      path: '/enterprise/formateurs',
    },
    {
      label: 'Profil Structure',
      icon: <Settings className="w-5 h-5" />,
      path: '/enterprise/profil',
    },
    {
      label: 'Statistiques',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/enterprise/statistiques',
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  // Vérifier si le chemin actuel correspond ou commence par le chemin du menu
  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-xdark to-gray-dark text-white h-screen fixed left-0 top-0 overflow-y-auto shadow-2xl z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-dark">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
            P
          </div>
          <div>
            <h1 className="font-bold text-lg group-hover:text-accent transition-colors">PNFC</h1>
            <p className="text-xs text-gray-medium">Admin</p>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = isActivePath(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30'
                  : 'text-gray-medium hover:bg-gray-dark hover:text-white hover:translate-x-1'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-gray-medium group-hover:text-accent'} transition-colors`}>
                {item.icon}
              </span>
              <span className="font-semibold">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error/20 hover:bg-error/30 text-error border-2 border-error/30 hover:border-error/50 rounded-xl transition-all duration-200 font-bold hover:shadow-lg hover:shadow-error/20"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};
