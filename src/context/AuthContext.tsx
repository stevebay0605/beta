import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axiosInstance from '../api/axios';

interface User {
  id: number;
  role_id: number | string;
  name: string;
  email: string;
  genre?: string;
  phone?: string;
  date_naissance?: string;
  email_verified_at?: string;
  role?: {
    id: number;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (formData: any) => Promise<any>;
  verifyOtp: (email: string, otp: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (userData: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const register = useCallback(async (formData: any) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/register', formData);
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Erreur lors de l\'inscription';
      setError(message);
      throw err;
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/verify-otp', { email, otp });
      const { token, user: userData } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Erreur lors de la vérification OTP';
      setError(message);
      throw err;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      return response.data;
    } catch (err: any) {
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

  const updateUser = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const value: AuthContextType = {
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
