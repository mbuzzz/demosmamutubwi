import { useState, useEffect } from 'react';
import { api } from '../lib/api';

export interface DashboardStats {
  cards: Array<{
    name: string;
    value: string | number;
    icon: string;
    color: string;
  }>;
  kehadiran?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  [key: string]: any;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/stats');
        setStats(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard stats');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}
