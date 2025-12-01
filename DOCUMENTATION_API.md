# 📚 Documentation API PNFC-BACK

## Table des matières
1. [Configuration initiale](#configuration-initiale)
2. [Endpoints API](#endpoints-api)
3. [Tests API](#tests-api)
4. [Intégration React](#intégration-react)
5. [Gestion des erreurs](#gestion-des-erreurs)

---

## 🔧 Configuration Initiale

### Étape 1 : Configuration de la Base de Données MySQL

Créez un fichier `.env` à la racine du projet :

```env
APP_NAME=PNFC
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de données MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pnfc_db
DB_USERNAME=root
DB_PASSWORD=

# Mail (optionnel)
MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS=contact@pnfc.local
MAIL_FROM_NAME="${APP_NAME}"

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
SESSION_DOMAIN=localhost
```

### Étape 2 : Installer les dépendances

```bash
# Installer les dépendances PHP
composer install

# Générer la clé d'application
php artisan key:generate

# Créer la base de données MySQL
# Utilisez phpMyAdmin ou l'invite de commande MySQL
# CREATE DATABASE pnfc_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exécuter les migrations
php artisan migrate

# Remplir les données de base (seeders)
php artisan db:seed

# Installer les dépendances Frontend
npm install
```

### Étape 3 : Lancer le serveur

```bash
# Terminal 1 : Serveur Laravel
php artisan serve

# Terminal 2 : Vite (pour les assets)
npm run dev
```

Le serveur sera accessible à : `http://localhost:8000`

---

## 📡 Endpoints API

### 🔐 AUTHENTIFICATION

#### 1️⃣ Inscription (Register)
```
POST /api/register
Content-Type: application/json

{
  "role_id": 2,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "genre": "M",
  "phone": "+33612345678",
  "date_naissance": "1990-01-15"
}
```

**Réponse (201):**
```json
{
  "message": "Compte créé. Vérifiez votre email/SMS pour l'OTP.",
  "otp": 123456
}
```

**Validation:**
- `role_id` : doit exister dans la table roles
- `email` : doit être unique et valide
- `password` : minimum 6 caractères
- `date_naissance` : format YYYY-MM-DD

---

#### 2️⃣ Connexion (Login)
```
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse (200):**
```json
{
  "message": "Connexion réussie",
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz...",
  "user": {
    "id": 1,
    "role_id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "genre": "M",
    "phone": "+33612345678",
    "date_naissance": "1990-01-15",
    "email_verified_at": null,
    "role": {
      "id": 2,
      "name": "entreprise",
      "description": "Compte entreprise"
    }
  }
}
```

**Erreurs possibles:**
- `401` : Identifiants incorrects
- `403` : Compte non activé (OTP non validé)

---

#### 3️⃣ Vérifier l'OTP
```
POST /api/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Réponse (200):**
```json
{
  "message": "Compte activé avec succès !",
  "token": "1|AbCdEfGhIjKlMnOpQrStUvWxYz...",
  "user": {
    "id": 1,
    "role_id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": "2025-11-28T10:30:00Z",
    "entreprise": {
      "id": 1,
      "user_id": 1,
      "name": "John Doe Entreprise",
      "status": "pending",
      "documents": []
    }
  }
}
```

**Erreurs possibles:**
- `422` : OTP invalide ou expiré

---

#### 4️⃣ Profil Utilisateur (Protégé)
```
GET /api/me
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "id": 1,
  "role_id": 2,
  "name": "John Doe",
  "email": "john@example.com",
  "role": {
    "id": 2,
    "name": "entreprise"
  }
}
```

---

#### 5️⃣ Déconnexion (Protégé)
```
POST /api/logout
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "message": "Déconnecté avec succès"
}
```

---

### 🏢 ENTREPRISE (Protégé - Rôle: entreprise)

#### 1️⃣ Créer une entreprise
```
POST /api/entreprise
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Tech Solutions SARL",
  "sector": "IT",
  "adresse": "123 Rue de la Paix, Paris",
  "description": "Entreprise de solutions informatiques",
  "logo": "https://example.com/logo.png",
  "country_id": 1,
  "city_id": 5
}
```

**Réponse (201):**
```json
{
  "message": "Entreprise créée avec succès",
  "data": {
    "id": 1,
    "user_id": 1,
    "name": "Tech Solutions SARL",
    "sector": "IT",
    "adresse": "123 Rue de la Paix, Paris",
    "description": "Entreprise de solutions informatiques",
    "status": "pending",
    "country": { "id": 1, "name": "France" },
    "city": { "id": 5, "name": "Paris" }
  }
}
```

---

#### 2️⃣ Modifier une entreprise
```
PUT /api/entreprise/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Tech Solutions Updated",
  "sector": "Software",
  "description": "Mise à jour de l'entreprise"
}
```

**Réponse (200):**
```json
{
  "message": "Entreprise mise à jour avec succès",
  "data": { /* données mises à jour */ }
}
```

---

#### 3️⃣ Afficher une entreprise
```
GET /api/entreprise/{id}
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "name": "Tech Solutions SARL",
  "sector": "IT",
  "adresse": "123 Rue de la Paix, Paris",
  "status": "pending",
  "documents": [],
  "formations": []
}
```

---

### 🌍 ADMIN - PAYS & VILLES (Protégé)

#### Pays
```
GET    /api/admin/countries          # Lister tous les pays
POST   /api/admin/countries          # Créer un pays
GET    /api/admin/countries/{id}     # Afficher un pays
PUT    /api/admin/countries/{id}     # Modifier un pays
DELETE /api/admin/countries/{id}     # Supprimer un pays
```

#### Villes
```
GET    /api/admin/cities             # Lister toutes les villes
POST   /api/admin/cities             # Créer une ville
GET    /api/admin/cities/{id}        # Afficher une ville
PUT    /api/admin/cities/{id}        # Modifier une ville
DELETE /api/admin/cities/{id}        # Supprimer une ville
```

#### Rôles
```
GET    /api/admin/roles              # Lister tous les rôles
POST   /api/admin/roles              # Créer un rôle
GET    /api/admin/roles/{id}         # Afficher un rôle
PUT    /api/admin/roles/{id}         # Modifier un rôle
DELETE /api/admin/roles/{id}         # Supprimer un rôle
```

---

## 🧪 Tests API

### Option 1 : Avec Postman

1. **Créer une collection Postman** : `File → New → Collection`
2. **Ajouter les requêtes** selon les endpoints documentés ci-dessus

### Option 2 : Avec cURL

#### Test d'inscription
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "role_id": 2,
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "genre": "M",
    "phone": "+33612345678",
    "date_naissance": "1990-01-15"
  }'
```

#### Test de connexion
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### Test de vérification OTP
```bash
curl -X POST http://localhost:8000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

#### Test du profil utilisateur (protégé)
```bash
curl -X GET http://localhost:8000/api/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 3 : Tests automatisés (PHPUnit)

Créer un fichier `tests/Feature/AuthTest.php` :

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use Tests\TestCase;

class AuthTest extends TestCase
{
    public function test_user_can_register()
    {
        $response = $this->postJson('/api/register', [
            'role_id' => 2,
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'genre' => 'M',
            'phone' => '+33612345678',
            'date_naissance' => '1990-01-15',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'otp']);
    }

    public function test_user_can_login()
    {
        // Créer d'abord un utilisateur
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'email_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'token', 'user']);
    }

    public function test_user_can_get_profile()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)->getJson('/api/me');

        $response->assertStatus(200)
                 ->assertJsonStructure(['id', 'name', 'email']);
    }
}
```

Lancer les tests :
```bash
php artisan test
```

---

## ⚛️ Intégration React

### Structure du projet React

```
src/
├── api/
│   ├── axios.js           # Configuration axios
│   └── endpoints.js       # URLs des endpoints
├── components/
│   ├── Auth/
│   │   ├── Register.jsx
│   │   ├── Login.jsx
│   │   └── VerifyOTP.jsx
│   ├── Entreprise/
│   │   ├── EntrepriseForm.jsx
│   │   └── EntrepriseDetail.jsx
│   └── Common/
│       ├── ProtectedRoute.jsx
│       └── Loading.jsx
├── hooks/
│   ├── useAuth.js         # Hook d'authentification
│   └── useEntreprise.js   # Hook pour entreprise
├── context/
│   └── AuthContext.jsx    # Context API pour auth
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── EntreprisePage.jsx
├── App.jsx
└── main.jsx
```

### 1️⃣ Configuration Axios

**Fichier : `src/api/axios.js`**

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ajouter le token à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gérer les réponses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

### 2️⃣ Context API pour l'authentification

**Fichier : `src/context/AuthContext.jsx`**

```javascript
import { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (formData) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/register', formData);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
      setError(message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la connexion';
      setError(message);
      throw err;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/verify-otp', { email, otp });
      const { token, user } = response.data;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Erreur lors de la vérification OTP';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        verifyOtp,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### 3️⃣ Hook d'authentification

**Fichier : `src/hooks/useAuth.js`**

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
};
```

### 4️⃣ Route protégée

**Fichier : `src/components/Common/ProtectedRoute.jsx`**

```javascript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

### 5️⃣ Composant d'inscription

**Fichier : `src/components/Auth/Register.jsx`**

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../api/axios';

export const Register = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [otp, setOtp] = useState(null);
  
  const [formData, setFormData] = useState({
    role_id: '',
    name: '',
    email: '',
    password: '',
    genre: '',
    phone: '',
    date_naissance: '',
  });

  // Récupérer les rôles au chargement
  useState(() => {
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authRegister(formData);
      setOtp(response.otp); // Afficher OTP pour test
      // En production, rediriger vers page de vérification OTP
      alert('Un OTP a été envoyé. Veuillez le vérifier.');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Inscription</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {otp && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">OTP: {otp}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Rôle</label>
          <select
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner un rôle</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Genre</label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Date de naissance</label>
          <input
            type="date"
            name="date_naissance"
            value={formData.date_naissance}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>
    </div>
  );
};
```

### 6️⃣ Composant de connexion

**Fichier : `src/components/Auth/Login.jsx`**

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Connexion</h2>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};
```

### 7️⃣ Configuration Vite (.env.local)

**Fichier : `.env.local`** (à la racine du projet React)

```env
VITE_API_URL=http://localhost:8000/api
```

### 8️⃣ Application principale

**Fichier : `src/App.jsx`**

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Common/ProtectedRoute';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

---

## ⚠️ Gestion des Erreurs

### Codes d'erreur courants

| Code | Message | Solution |
|------|---------|----------|
| 401 | Non authentifié | Vérifier le token ou se reconnecter |
| 403 | Accès refusé | Vérifier le rôle utilisateur |
| 404 | Ressource non trouvée | Vérifier l'ID ou l'URL |
| 422 | Validation échouée | Vérifier les données envoyées |
| 500 | Erreur serveur | Vérifier les logs Laravel |

### Gestion des erreurs en React

```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Le serveur a répondu avec un code d'erreur
    const status = error.response.status;
    const message = error.response.data?.message || 'Une erreur est survenue';
    
    switch (status) {
      case 401:
        // Rediriger vers login
        window.location.href = '/login';
        break;
      case 422:
        // Afficher les erreurs de validation
        console.log(error.response.data.errors);
        break;
      case 500:
        // Erreur serveur
        console.error('Erreur serveur:', message);
        break;
      default:
        console.error(message);
    }
  } else if (error.request) {
    console.error('Pas de réponse du serveur');
  } else {
    console.error('Erreur:', error.message);
  }
};
```

---

## 📋 Checklist de déploiement

### Backend
- [ ] `.env` configuré avec MySQL
- [ ] Migrations exécutées
- [ ] Base de données remplie avec les données de base
- [ ] CORS configuré pour React
- [ ] Erreurs de validation en place
- [ ] Logs activés

### Frontend React
- [ ] `.env.local` configuré
- [ ] Axios interceptors mis en place
- [ ] Context API pour auth configuré
- [ ] Routes protégées en place
- [ ] Gestion des erreurs complète
- [ ] Stockage du token en localStorage

---

## 🔗 Ressources utiles

- [Documentation Laravel](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [React Router](https://reactrouter.com/)
- [Axios Documentation](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Dernière mise à jour** : 28 novembre 2025
