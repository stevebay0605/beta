import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Erreur lors de la connexion'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
              Connexion
            </h2>
            <p className="text-slate-600 mb-8">
              Accédez à votre compte D-CLIC
            </p>

            {(error || authError) && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                {error || authError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
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

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0055A4] focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0055A4] text-white py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition font-bold text-base"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </form>

            <p className="text-center mt-6 text-slate-600">
              Vous n'avez pas de compte?{' '}
              <Link to="/register" className="text-[#0055A4] font-bold hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
