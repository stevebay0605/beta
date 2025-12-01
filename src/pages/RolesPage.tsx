import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface Role {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/admin/roles');
        setRoles(response.data);
      } catch (err: any) {
        console.error('Erreur lors du chargement des rôles:', err);
        setError(
          err.response?.data?.message ||
          err.message ||
          'Impossible de charger les rôles'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter text-slate-900 mb-4">
              Rôles disponibles
            </h1>
            <p className="text-slate-600 text-lg">
              Liste de tous les rôles disponibles dans le système
            </p>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0055A4]"></div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {!loading && roles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#0055A4]/10 flex items-center justify-center">
                      <span className="text-[#0055A4] font-bold text-lg">{role.id}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {role.name}
                      </h3>
                      <p className="text-sm text-slate-600">ID: {role.id}</p>
                    </div>
                  </div>
                  {role.created_at && (
                    <p className="text-xs text-slate-500">
                      Créé le: {new Date(role.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && roles.length === 0 && !error && (
            <div className="bg-slate-100 rounded-lg p-8 text-center">
              <p className="text-slate-600 text-lg">Aucun rôle disponible</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
