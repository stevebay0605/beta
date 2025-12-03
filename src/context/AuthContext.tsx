import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import axiosInstance from '../api/axios';
import { TokenManager } from '../utils/TokenManager';

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
  [key: string]: unknown;
}

interface RegisterFormData {
  role_id: string | number;
  name: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  register: (formData: RegisterFormData) => Promise<unknown>;
  verifyOtp: (email: string, otp: string) => Promise<unknown>;
  login: (email: string, password: string) => Promise<unknown>;
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
    const token = TokenManager.getToken();
    const storedUser = TokenManager.getUser();

    if (token && storedUser) {
      try {
        setUser(storedUser as User);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'utilisateur', err);
        TokenManager.clearAll();
      }
    }
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const register = useCallback(async (formData: RegisterFormData) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/register', formData);
      return response.data;
    } catch (err) {
      let errorMsg = 'Erreur lors de l\'inscription';
      if (err instanceof Error) {
        if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
          const response = err.response as { data?: { message?: string } };
          errorMsg = response.data?.message || errorMsg;
        } else {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
      throw err;
    }
  }, []);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/verify-otp', { email, otp });
      const { token, user: userData } = response.data as { token: string; user: User };

      TokenManager.setToken(token);
      TokenManager.setUser(userData);
      setUser(userData);
      setIsAuthenticated(true);

      return response.data;
    } catch (err) {
      let errorMsg = 'Erreur lors de la vérification OTP';
      if (err instanceof Error) {
        if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
          const response = err.response as { data?: { message?: string } };
          errorMsg = response.data?.message || errorMsg;
        } else {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
      throw err;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axiosInstance.post('/login', { email, password });
      const { token, user: userData } = response.data as { token: string; user: User };

      TokenManager.setToken(token);
      TokenManager.setUser(userData);
      setUser(userData);
      setIsAuthenticated(true);

      return response.data;
    } catch (err) {
      let errorMsg = 'Erreur lors de la connexion';
      if (err instanceof Error) {
        if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
          const response = err.response as { data?: { message?: string } };
          errorMsg = response.data?.message || errorMsg;
        } else {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/logout');
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err);
    } finally {
      TokenManager.clearAll();
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateUser = useCallback((userData: User) => {
    setUser(userData);
    TokenManager.setUser(userData);
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
