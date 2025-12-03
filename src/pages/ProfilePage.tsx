import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AvatarUpload } from '../components/AvatarUpload';
import { ProfileForm } from '../components/ProfileForm';
import { LogOut, Calendar, MapPin, Award, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const { user, loading, updateProfile, updatePassword, uploadAvatar } = useProfile();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Rediriger si pas connecté
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0055A4]"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie! 👋');
      navigate('/');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Calculer l'âge
  const getAge = () => {
    if (!user.date_naissance) return null;
    const birthDate = new Date(user.date_naissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = getAge();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Mon Profil</h1>
            <p className="text-slate-600">Gérez vos informations personnelles et vos paramètres de sécurité</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Avatar & Info */}
            <div className="lg:col-span-1">
              {/* Avatar Section */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                <AvatarUpload
                  currentAvatar={user.avatar_url}
                  userName={user.name}
                  onUpload={uploadAvatar}
                  loading={loading}
                />

                {/* User Info Summary */}
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Rôle</p>
                    <p className="text-sm font-semibold text-slate-900 capitalize">
                      {user.role?.name || 'Utilisateur'}
                    </p>
                  </div>

                  {age && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Âge</p>
                      <p className="text-sm font-semibold text-slate-900">{age} ans</p>
                    </div>
                  )}

                  {user.phone && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Téléphone</p>
                      <p className="text-sm font-semibold text-slate-900">{user.phone}</p>
                    </div>
                  )}

                  {user.email && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Email</p>
                      <p className="text-sm font-semibold text-slate-900 break-all">{user.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition"
              >
                <LogOut size={18} />
                Se déconnecter
              </button>

              {/* Logout Confirmation Modal */}
              {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                    <p className="text-lg font-bold text-slate-900 mb-4">
                      Êtes-vous sûr de vouloir vous déconnecter?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
                      >
                        Déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Form */}
              <ProfileForm
                user={user}
                loading={loading}
                onUpdateProfile={updateProfile}
                onUpdatePassword={updatePassword}
              />

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <BookOpen className="mx-auto mb-2 text-[#0055A4]" size={24} />
                  <p className="text-2xl font-black text-slate-900">0</p>
                  <p className="text-xs text-slate-600 mt-1">Formations</p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <Award className="mx-auto mb-2 text-green-600" size={24} />
                  <p className="text-2xl font-black text-slate-900">0</p>
                  <p className="text-xs text-slate-600 mt-1">Certificats</p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <Calendar className="mx-auto mb-2 text-blue-600" size={24} />
                  <p className="text-2xl font-black text-slate-900">0</p>
                  <p className="text-xs text-slate-600 mt-1">En cours</p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <MapPin className="mx-auto mb-2 text-orange-600" size={24} />
                  <p className="text-2xl font-black text-slate-900">0</p>
                  <p className="text-xs text-slate-600 mt-1">Complétées</p>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4">Informations du compte</h3>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold">ID:</span> #{user.id}
                  </p>
                  <p>
                    <span className="font-semibold">Membre depuis:</span>{' '}
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Dernière modification:</span>{' '}
                    {user.updated_at ? new Date(user.updated_at).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
