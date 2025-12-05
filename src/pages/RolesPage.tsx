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
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-bg-light via-white to-primary/5">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="mb-10">
            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Rôles disponibles
            </h1>
            <p className="text-gray-dark text-lg">
              Liste de tous les rôles disponibles dans le système
            </p>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0055A4]"></div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-md">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {!loading && roles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="bg-white rounded-2xl border border-gray-medium shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">{role.id}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-xdark group-hover:text-primary transition-colors">
                        {role.name}
                      </h3>
                      <p className="text-sm text-gray-dark">ID: {role.id}</p>
                    </div>
                  </div>
                  {role.created_at && (
                    <p className="text-xs text-gray-dark flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Créé le: {new Date(role.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && roles.length === 0 && !error && (
            <div className="bg-white rounded-2xl border border-gray-medium shadow-md p-12 text-center">
              <div className="w-16 h-16 bg-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-gray-dark text-lg font-semibold">Aucun rôle disponible</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
