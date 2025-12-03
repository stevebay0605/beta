import axios from 'axios';
import { TokenManager } from '../utils/TokenManager';
import { ApiErrorHandler } from '../utils/ApiErrorHandler';

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
    const token = TokenManager.getToken();
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
    // Traiter l'erreur avec ApiErrorHandler
    const apiError = ApiErrorHandler.handleError(error);
    
    // Gestion spéciale pour 401 (authentification expirée)
    if (apiError.status === 401) {
      TokenManager.clearAll();
      // Rediriger vers login si pas déjà sur la page de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Log en développement
    ApiErrorHandler.logError(apiError, 'API Response');

    return Promise.reject(apiError);
  }
);

export default axiosInstance;
