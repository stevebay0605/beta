# 📋 Exigences Backend pour l'Authentification

## 🔐 Endpoints requis

### 1. POST `/api/register`
**Requête:**
```json
{
  "role_id": "entreprise",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "genre": "male",
  "phone": "+33612345678",
  "date_naissance": "1990-01-15"
}
```

**Réponse (succès):**
```json
{
  "message": "Inscription réussie. Vérifiez votre email pour l'OTP.",
  "otp": "123456"
}
```

---

### 2. POST `/api/verify-otp`
**Requête:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Réponse (succès):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "role_id": "entreprise",
    "name": "John Doe",
    "email": "john@example.com",
    "genre": "male",
    "phone": "+33612345678",
    "date_naissance": "1990-01-15",
    "email_verified_at": "2025-11-30T09:53:35Z",
    "role": {
      "id": 1,
      "name": "Entreprise"
    }
  }
}
```

---

### 3. POST `/api/login`
**Requête:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse (succès):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "role_id": "entreprise",
    "name": "John Doe",
    "email": "john@example.com",
    "genre": "male",
    "phone": "+33612345678",
    "date_naissance": "1990-01-15",
    "email_verified_at": "2025-11-30T09:53:35Z",
    "role": {
      "id": 1,
      "name": "Entreprise"
    }
  }
}
```

---

### 4. POST `/api/logout`
**Requête:** (avec header Authorization)
```
Authorization: Bearer {token}
```

**Réponse (succès):**
```json
{
  "message": "Déconnecté avec succès"
}
```

---

### 5. GET `/api/me`
**Requête:** (avec header Authorization)
```
Authorization: Bearer {token}
```

**Réponse (succès):**
```json
{
  "id": 1,
  "role_id": "entreprise",
  "name": "John Doe",
  "email": "john@example.com",
  "genre": "male",
  "phone": "+33612345678",
  "date_naissance": "1990-01-15",
  "email_verified_at": "2025-11-30T09:53:35Z",
  "role": {
    "id": 1,
    "name": "Entreprise"
  }
}
```

---

## 🔑 Points importants

### Structure du rôle
Le rôle doit être retourné avec la structure suivante:
```json
"role": {
  "id": 1,
  "name": "Entreprise"
}
```

**Important:** Le frontend affiche `user?.role?.name` pour afficher le nom du rôle.

### Genres acceptés
- `male` - Homme
- `female` - Femme

### Authentification
- Utiliser **Laravel Sanctum** pour les tokens
- Les tokens doivent être retournés dans la réponse de login/verify-otp
- Le frontend stocke le token dans `localStorage` avec la clé `auth_token`

### CORS
Configurer CORS pour accepter les requêtes de:
- `http://localhost:5173`
- `http://localhost:5174`
- Tout autre domaine en production

---

## 🧪 Exemple de réponse complète

```json
{
  "token": "1|abcdefghijklmnopqrstuvwxyz",
  "user": {
    "id": 1,
    "role_id": "entreprise",
    "name": "John Doe",
    "email": "john@example.com",
    "genre": "male",
    "phone": "+33612345678",
    "date_naissance": "1990-01-15",
    "email_verified_at": "2025-11-30T09:53:35Z",
    "created_at": "2025-11-30T09:53:35Z",
    "updated_at": "2025-11-30T09:53:35Z",
    "role": {
      "id": 1,
      "name": "Entreprise"
    }
  }
}
```

---

## ⚠️ Erreurs courantes

### Erreur: "role is undefined"
**Cause:** Le backend ne retourne pas l'objet `role` avec `id` et `name`
**Solution:** Ajouter la relation `role` dans la réponse

### Erreur: "Cannot read properties of undefined"
**Cause:** Le champ `role` n'existe pas dans la réponse
**Solution:** S'assurer que le backend retourne `role: { id, name }`

### Erreur CORS
**Cause:** CORS non configuré correctement
**Solution:** Vérifier `config/cors.php` et `.env`

---

**Dernière mise à jour:** 30 novembre 2025
