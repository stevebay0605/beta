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
