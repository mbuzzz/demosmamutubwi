import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface NotificationRecord {
  id: number;
  user_id: number;
  type: 'info' | 'success' | 'warning' | 'danger';
  title: string;
  description: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    staleTime: 15 * 1000, // consider fresh for 15 seconds
    queryFn: async () => {
      const res = await api.get<{ data: NotificationRecord[] }>('/notifications');
      return res.data.data;
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/notifications/read-all');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
