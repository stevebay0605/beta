# 🚀 Configuration du Projet D-CLIC Frontend

## 📋 Prérequis

- Node.js 16+ installé
- npm ou yarn
- Backend Laravel en cours d'exécution sur `http://localhost:8000`

## 🔧 Installation

### 1. Cloner le projet
```bash
cd beta
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'environnement

Créez un fichier `.env.local` à la racine du projet:

```env
VITE_API_URL=http://localhost:8000/api
```

> **Note:** Vous pouvez copier `.env.example` et le renommer en `.env.local`

### 4. Lancer le serveur de développement
```bash
npm run dev
```

L'application sera accessible à: **http://localhost:5173**

---

## 📱 Pages disponibles

| Page | URL | Description |
|------|-----|-------------|
| **Accueil** | http://localhost:5173 | Page d'accueil avec hero section |
| **Catalogue** | http://localhost:5173/catalogue | Catalogue des formations |
| **Connexion** | http://localhost:5173/login | Page de login |
| **Inscription** | http://localhost:5173/register | Page d'inscription avec OTP |
| **Dashboard** | http://localhost:5173/dashboard | Tableau de bord (protégé) |

---

## 🔐 Authentification

### Flux d'inscription
1. Allez à `/register`
2. Remplissez le formulaire:
   - **Rôle:** Sélectionnez un rôle prédéfini depuis la base de données
   - **Genre:** Sélectionnez `Male` ou `Female`
   - **Autres champs:** Complétez tous les champs requis
3. Recevez un OTP (affiché dans la console en développement)
4. Vérifiez l'OTP
5. Accédez au dashboard

### Flux de connexion
1. Allez à `/login`
2. Entrez vos identifiants
3. Vous êtes redirigé vers le dashboard

### Déconnexion
- Cliquez sur le bouton de déconnexion dans le header
- Vous êtes redirigé vers la page de connexion

---

## 🏗️ Structure du projet

```
src/
├── api/
│   └── axios.ts           # Configuration axios avec interceptors
├── context/
│   └── AuthContext.tsx    # Context API pour l'authentification
├── hooks/
│   └── useAuth.ts         # Hook personnalisé
├── components/
│   ├── Header.tsx         # Header avec navigation
│   ├── Footer.tsx         # Footer
│   ├── ProtectedRoute.tsx # Routes protégées
│   └── ...autres composants
├── pages/
│   ├── HomePage.tsx       # Accueil
│   ├── catalogues.tsx     # Catalogue
│   ├── LoginPage.tsx      # Connexion
│   ├── RegisterPage.tsx   # Inscription
│   └── DashboardPage.tsx  # Tableau de bord
└── App.tsx                # Application principale
```

---

## 🔗 Intégration Backend

### Configuration CORS (Laravel)

Assurez-vous que votre backend Laravel a CORS configuré:

```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
SESSION_DOMAIN=localhost
```

### Endpoints API requis

- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `POST /api/verify-otp` - Vérification OTP
- `POST /api/logout` - Déconnexion
- `GET /api/me` - Profil utilisateur (protégé)
- `GET /api/admin/roles` - Lister les rôles

---

## 🧪 Tests

### Test d'inscription
1. Allez à `/register`
2. Remplissez le formulaire avec des données valides
3. L'OTP s'affiche dans la console du navigateur
4. Entrez l'OTP pour vérifier

### Test de connexion
1. Allez à `/login`
2. Utilisez les identifiants créés lors de l'inscription
3. Vous devez être redirigé vers `/dashboard`

### Test de protection des routes
1. Essayez d'accéder à `/dashboard` sans être connecté
2. Vous devez être redirigé vers `/login`

---

## 📦 Build pour la production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`

---

## 🐛 Dépannage

### Erreur: "Cannot find module 'axios'"
```bash
npm install axios
```

### Erreur: "API_URL is undefined"
Assurez-vous que le fichier `.env.local` existe et contient:
```env
VITE_API_URL=http://localhost:8000/api
```

### Erreur: "401 Unauthorized"
- Vérifiez que le backend est en cours d'exécution
- Vérifiez que le token est stocké correctement dans localStorage
- Vérifiez que les CORS sont configurés correctement

### Erreur: "OTP invalide"
- L'OTP s'affiche dans la console du navigateur en développement
- Vérifiez que vous utilisez le bon OTP
- L'OTP peut expirer après un certain temps

---

## 📚 Documentation

- [Documentation API](./DOCUMENTATION_API.md)
- [Guide d'intégration React](./REACT_INTEGRATION_GUIDE.md)

---

**Dernière mise à jour:** 28 novembre 2025
