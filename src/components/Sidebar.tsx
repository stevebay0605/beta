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

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0055A4] rounded-lg flex items-center justify-center font-bold">
            D
          </div>
          <div>
            <h1 className="font-bold text-lg">D-CLIC</h1>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-[#0055A4] text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};
