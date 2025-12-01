import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

interface Role {
  id: number;
  name: string;
}

// Cache global pour les rôles
const roleCache: { [key: number]: string } = {};

export const useRoleName = (roleId: number | string | null | undefined) => {
  const [roleName, setRoleName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roleId) {
      setRoleName(null);
      return;
    }

    const numericId = typeof roleId === 'string' ? parseInt(roleId, 10) : roleId;

    // Vérifier le cache d'abord
    if (roleCache[numericId]) {
      setRoleName(roleCache[numericId]);
      return;
    }

    // Récupérer depuis l'API
    const fetchRoleName = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/admin/roles');
        const roles: Role[] = response.data;
        
        // Construire le cache
        roles.forEach((role) => {
          roleCache[role.id] = role.name;
        });

        // Trouver le rôle demandé
        const role = roles.find((r) => r.id === numericId);
        if (role) {
          setRoleName(role.name);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du nom du rôle:', err);
        setRoleName(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleName();
  }, [roleId]);

  return { roleName, loading };
};
