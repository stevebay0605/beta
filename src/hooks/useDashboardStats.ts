import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

export interface DashboardStats {
  totalFormations: number;
  totalUsers: number;
  totalEnrolments: number;
  totalRevenue: number;
  formationsByCategory: Array<{ name: string; value: number }>;
  enrollmentsByMonth: Array<{ month: string; enrollments: number }>;
  topFormations: Array<{ id: number; title: string; enrollments: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
}

export interface UserStats {
  enrolledFormations: number;
  completedFormations: number;
  certificates: number;
  hoursLearned: number;
  enrollmentsByMonth: Array<{ month: string; enrollments: number }>;
}

export const useDashboardStats = (userRole?: string) => {
  const [stats, setStats] = useState<DashboardStats | UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        let endpoint = '/dashboard/stats';
        if (userRole === 'enterprise') {
          endpoint = '/dashboard/enterprise/stats';
        } else if (userRole === 'user') {
          endpoint = '/dashboard/user/stats';
        }

        const response = await axiosInstance.get(endpoint);
        setStats(response.data.stats || response.data);
      } catch (err) {
        let errorMsg = 'Erreur lors du chargement des statistiques';
        if (err instanceof Error) {
          if ('response' in err && typeof err.response === 'object' && err.response !== null && 'data' in err.response) {
            const response = err.response as { data?: { message?: string } };
            errorMsg = response.data?.message || errorMsg;
          } else {
            errorMsg = err.message;
          }
        }
        setError(errorMsg);
        console.error('Stats error:', err);
        // Ne pas afficher le toast d'erreur pour ne pas spammer
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userRole]);

  // Stats par défaut si l'API n'est pas disponible
  const defaultStats: DashboardStats = {
    totalFormations: 45,
    totalUsers: 1250,
    totalEnrolments: 3890,
    totalRevenue: 125000000,
    formationsByCategory: [
      { name: 'Développement', value: 18 },
      { name: 'Design', value: 12 },
      { name: 'Marketing', value: 10 },
      { name: 'Gestion', value: 5 },
    ],
    enrollmentsByMonth: [
      { month: 'Jan', enrollments: 300 },
      { month: 'Fév', enrollments: 420 },
      { month: 'Mar', enrollments: 380 },
      { month: 'Avr', enrollments: 510 },
      { month: 'Mai', enrollments: 490 },
      { month: 'Jun', enrollments: 620 },
    ],
    topFormations: [
      { id: 1, title: 'Développement Web Fullstack', enrollments: 450 },
      { id: 2, title: 'Python pour la Data Science', enrollments: 380 },
      { id: 3, title: 'Marketing Digital Avancé', enrollments: 290 },
    ],
    revenueByMonth: [
      { month: 'Jan', revenue: 15000000 },
      { month: 'Fév', revenue: 18000000 },
      { month: 'Mar', revenue: 16500000 },
      { month: 'Avr', revenue: 22000000 },
      { month: 'Mai', revenue: 19500000 },
      { month: 'Jun', revenue: 25000000 },
    ],
  };

  const defaultUserStats: UserStats = {
    enrolledFormations: 5,
    completedFormations: 2,
    certificates: 2,
    hoursLearned: 120,
    enrollmentsByMonth: [
      { month: 'Jan', enrollments: 1 },
      { month: 'Fév', enrollments: 0 },
      { month: 'Mar', enrollments: 2 },
      { month: 'Avr', enrollments: 1 },
      { month: 'Mai', enrollments: 0 },
      { month: 'Jun', enrollments: 1 },
    ],
  };

  return {
    stats: stats || (userRole === 'user' ? defaultUserStats : defaultStats),
    loading,
    error,
  };
};
