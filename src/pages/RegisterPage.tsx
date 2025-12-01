import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axios';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface Role {
  id: number;
  name: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: authRegister, error: authError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [step, setStep] = useState('register'); // 'register' ou 'otp'
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');

  const [formData, setFormData] = useState({
    role_id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    genre: '',
    phone: '',
    date_naissance: '',
  });

  // Récupérer les rôles depuis la DB
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await axiosInstance.get('/admin/roles');
        setRoles(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des rôles:', err);
        setError('Impossible de charger les rôles');
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const response = await authRegister(formData);
      setEmail(formData.email);
      setStep('otp');
      // En développement, afficher l'OTP
      if (response.otp) {
        console.log('OTP pour test:', response.otp);
      }
    } catch (err: any) {
      console.error('Erreur d\'inscription complète:', err);
      console.error('Response data:', err.response?.data);
      console.error('Status:', err.response?.status);
      setError(err.response?.data?.message || err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const { verifyOtp } = useAuth();

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyOtp(email, otp);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Code OTP invalide ou expiré'
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="relative flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2">
                Vérification OTP
              </h2>
              <p className="text-slate-600 mb-8">
                Un code a été envoyé à {email}
              </p>

              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleOtpSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Code OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Entrez le code 6 chiffres"
                    maxLength={6}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition text-center text-2xl tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0055A4] text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition font-bold text-base"
                >
                  {loading ? 'Vérification...' : 'Vérifier'}
                </button>
              </form>

              <button
                onClick={() => setStep('register')}
                className="w-full mt-4 text-[#0055A4] hover:text-[#003d7a] text-sm font-bold"
              >
                ← Retour à l'inscription
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Inscription
            </h2>
            <p className="text-slate-600 mb-8">
              Créez votre compte D-CLIC
            </p>

            {(error || authError) && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                {error || authError}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Rôle
                </label>
                {rolesLoading ? (
                  <div className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-100 text-slate-600">
                    Chargement des rôles...
                  </div>
                ) : (
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                    title="Sélectionner un rôle"
                  >
                    <option value="">Sélectionner un rôle</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Genre
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  >
                    <option value="">--</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                    placeholder="+33..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Date de naissance
                </label>
                <input
                  type="date"
                  name="date_naissance"
                  value={formData.date_naissance}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0055A4] text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition font-bold text-base mt-6"
              >
                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
              </button>
            </form>

            <p className="text-center mt-6 text-slate-600">
              Vous avez déjà un compte?{' '}
              <Link to="/login" className="text-[#0055A4] font-bold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
