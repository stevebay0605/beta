# 🎯 Guide d'Intégration React - PNFC-BACK

## 📱 Mise en place du Frontend React

### Étape 1 : Créer le projet React avec Vite

```bash
# À côté du dossier PNFC-BACK
npm create vite@latest PNFC-FRONT -- --template react
cd PNFC-FRONT
npm install
```

### Étape 2 : Installer les dépendances

```bash
npm install axios react-router-dom tailwindcss -D
npm install -D @tailwindcss/vite
npx tailwindcss init -p
```

### Étape 3 : Structure des dossiers

```bash
mkdir -p src/{api,context,hooks,components/{Auth,Entreprise,Common},pages}
```

---

## 🔧 Configuration des fichiers

### 1️⃣ `src/api/axios.js` - Configuration Axios

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur de requête : ajouter le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : gérer les erreurs
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestion de l'erreur 401
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Rediriger vers login si pas déjà sur la page de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Gestion de l'erreur 403
    if (error.response?.status === 403) {
      console.error('Accès refusé : permissions insuffisantes');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 2️⃣ `src/context/AuthContext.jsx` - Context API

```javascript
import { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Erreur lors du parsing de l\'utilisateur stocké', err);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const register = useCallback(async (formData) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/register', formData);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Erreur lors de l\'inscription';
      setError(message);
      throw err;
    }
  }, []);

  const verifyOtp = useCallback(async (email, otp) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/verify-otp', { email, otp });
      const { token, user: userData } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Erreur lors de la vérification OTP';
      setError(message);
      throw err;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Erreur lors de la connexion';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/logout');
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    verifyOtp,
    login,
    logout,
    clearError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### 3️⃣ `src/hooks/useAuth.js` - Hook personnalisé

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth doit être utilisé dans un composant enveloppé par AuthProvider'
    );
  }
  return context;
};
```

### 4️⃣ `src/components/Common/ProtectedRoute.jsx` - Route protégée

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier le rôle si spécifié
  if (requiredRole && user?.role?.name !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

### 5️⃣ `src/components/Auth/Register.jsx` - Inscription

```javascript
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../api/axios';

export const Register = () => {
  const navigate = useNavigate();
  const { register: authRegister, error: authError, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
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

  // Récupérer les rôles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/admin/roles');
        setRoles(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des rôles', err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
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
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { verifyOtp } = useAuth();
      await verifyOtp(email, otp);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Code OTP invalide ou expiré'
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Vérification OTP
          </h2>
          <p className="text-gray-600 mb-6">
            Un code a été envoyé à {email}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Entrez le code 6 chiffres"
                maxLength="6"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>
          </form>

          <button
            onClick={() => setStep('register')}
            className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm"
          >
            ← Retour à l'inscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Inscription</h2>

        {(error || authError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error || authError}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner un rôle</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">--</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de naissance
            </label>
            <input
              type="date"
              name="date_naissance"
              value={formData.date_naissance}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Vous avez déjà un compte?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};
```

### 6️⃣ `src/components/Auth/Login.jsx` - Connexion

```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Erreur lors de la connexion'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Connexion</h2>

        {(error || authError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error || authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Vous n'avez pas de compte?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};
```

### 7️⃣ `src/App.jsx` - Application principale

```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Common/ProtectedRoute';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

### 8️⃣ `.env.local` - Variables d'environnement

```env
VITE_API_URL=http://localhost:8000/api
```

### 9️⃣ `vite.config.js` - Configuration Vite

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: false,
  },
})
```

---

## 🎨 Exemple de page Dashboard

Créer `src/pages/DashboardPage.jsx` :

```javascript
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">PNFC Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Bienvenue, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-bold mb-4">Profil Utilisateur</h2>
            <div className="space-y-2">
              <p><strong>Nom:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Rôle:</strong> {user?.role?.name}</p>
              <p><strong>Téléphone:</strong> {user?.phone}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
```

---

## 🧪 Tests d'intégration

Créer `src/__tests__/auth.test.js` :

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { Login } from '../components/Auth/Login';

describe('Login Component', () => {
  test('should render login form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  });

  test('should handle form submission', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: /Se connecter/i });

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Connexion en cours...');
    });
  });
});
```

---

## 📋 Checklist d'intégration

- [ ] Dossiers `src/api`, `src/context`, `src/hooks`, `src/components` créés
- [ ] Fichier `axios.js` configuré avec interceptors
- [ ] Context `AuthContext.jsx` mis en place
- [ ] Hook `useAuth.js` créé
- [ ] Composant `ProtectedRoute.jsx` en place
- [ ] Pages Login et Register complètes
- [ ] Fichier `.env.local` créé avec `VITE_API_URL`
- [ ] `App.jsx` avec routes configurées
- [ ] Tests d'intégration écrits
- [ ] Styles Tailwind CSS appliqués
- [ ] Gestion des erreurs complète
- [ ] Tokens stockés correctement dans localStorage
- [ ] Redirection automatique pour 401

---

## 🚀 Lancer l'application

```bash
# Terminal 1 : Backend Laravel
cd PNFC-BACK
php artisan serve

# Terminal 2 : Frontend React
cd PNFC-FRONT
npm run dev

# Terminal 3 : Logs backend (optionnel)
cd PNFC-BACK
php artisan pail
```

- Backend : **http://localhost:8000**
- Frontend : **http://localhost:5173**

---

**Documentation créée** : 28 novembre 2025
