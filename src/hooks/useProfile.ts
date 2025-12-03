import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  genre?: string;
  date_naissance?: string;
  bio?: string;
  role_id: number | string;
  role?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  genre?: string;
  date_naissance?: string;
  bio?: string;
}

export const useProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Mettre à jour le profil
  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await axiosInstance.patch('/user/profile', data);
      const updatedUser = response.data.user as UserProfile;

      // Mettre à jour le contexte
      updateUser(updatedUser);

      setSuccess(true);
      toast.success('Profil mis à jour avec succès! ✅');
    } catch (err) {
      let errorMsg = 'Erreur lors de la mise à jour du profil';
      if (err instanceof Error) {
        if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
          const response = err.response as { data?: { message?: string } };
          errorMsg = response.data?.message || errorMsg;
        } else {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  // Mettre à jour le mot de passe
  const updatePassword = useCallback(async (currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (newPassword !== confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      await axiosInstance.patch('/user/password', {
        current_password: currentPassword,
        new_password: newPassword,
        password_confirmation: confirmPassword,
      });

      setSuccess(true);
      toast.success('Mot de passe changé avec succès! ✅');
    } catch (err) {
      let errorMsg = 'Erreur lors du changement de mot de passe';
      if (err instanceof Error) {
        if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
          const response = err.response as { data?: { message?: string } };
          errorMsg = response.data?.message || errorMsg;
        } else {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload avatar
  const uploadAvatar = useCallback(async (file: File): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Valider le fichier
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Format d\'image non valide. Acceptés: JPEG, PNG, WebP');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image trop volumineuse (max 5MB)');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axiosInstance.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedUser = response.data.user as UserProfile;
      updateUser(updatedUser);

      toast.success('Avatar mis à jour! ✅');
    } catch (err) {
      let errorMsg = 'Erreur lors de l\'upload de l\'avatar';
      if (err instanceof Error) {
        if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
          const response = err.response as { data?: { message?: string } };
          errorMsg = response.data?.message || errorMsg;
        } else {
          errorMsg = err.message;
        }
      }
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  return {
    user: user as UserProfile | null,
    loading,
    error,
    success,
    updateProfile,
    updatePassword,
    uploadAvatar,
  };
};
