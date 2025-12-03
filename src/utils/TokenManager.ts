/**
 * Utility pour gérer les tokens d'authentification
 * Les tokens sont stockés en httpOnly cookies (géré par le backend)
 * Cette classe est juste pour la gestion locale
 */

interface User {
  id: number;
  [key: string]: unknown;
}

export class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'auth_user';

  /**
   * Récupère le token depuis localStorage
   * En production, ce sera géré par les httpOnly cookies
   */
  static getToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      console.error('Erreur lors de la récupération du token');
      return null;
    }
  }

  /**
   * Stocke le token (temporairement en localStorage)
   * À migrer vers httpOnly cookies côté backend
   */
  static setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch {
      console.error('Erreur lors du stockage du token');
    }
  }

  /**
   * Récupère l'utilisateur depuis localStorage
   */
  static getUser(): User | null {
    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      console.error('Erreur lors de la récupération de l\'utilisateur');
      return null;
    }
  }

  /**
   * Stocke l'utilisateur
   */
  static setUser(user: User): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch {
      console.error('Erreur lors du stockage de l\'utilisateur');
    }
  }

  /**
   * Supprime le token et l'utilisateur
   */
  static clearAll(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch {
      console.error('Erreur lors de la suppression des données');
    }
  }

  /**
   * Vérifie si un token est expiré (optionnel)
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
