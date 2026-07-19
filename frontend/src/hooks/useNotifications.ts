import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { requestNotificationPermission, showBrowserNotification } from '../lib/pwa';
import { toast } from 'sonner';
import { useAuth } from '../components/auth/AuthContext';

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
  const { isAuthenticated } = useAuth();
  const seenIds = useRef<Set<number>>(new Set());
  const primed = useRef(false);

  const query = useQuery({
    queryKey: ['notifications'],
    staleTime: 15 * 1000,
    refetchInterval: isAuthenticated ? 30 * 1000 : false, // poll 30s untuk keterlambatan realtime-ish
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await api.get<{ data: NotificationRecord[] }>('/notifications');
      return res.data.data ?? [];
    },
  });

  // Minta izin browser notification sekali setelah login
  useEffect(() => {
    if (!isAuthenticated) return;
    requestNotificationPermission().catch(() => {});
  }, [isAuthenticated]);

  // Deteksi notifikasi baru (keterlambatan, dll.) → toast + browser notification
  useEffect(() => {
    const list = query.data;
    if (!list || list.length === 0) return;

    if (!primed.current) {
      list.forEach((n) => seenIds.current.add(n.id));
      primed.current = true;
      return;
    }

    const fresh = list.filter((n) => !seenIds.current.has(n.id));
    fresh.forEach((n) => {
      seenIds.current.add(n.id);
      // In-app toast
      if (n.type === 'danger') {
        toast.error(n.title, { description: n.description });
      } else if (n.type === 'warning') {
        toast.warning(n.title, { description: n.description });
      } else if (n.type === 'success') {
        toast.success(n.title, { description: n.description });
      } else {
        toast(n.title, { description: n.description });
      }
      // OS / browser notification (PWA)
      showBrowserNotification(n.title, {
        body: n.description,
        tag: `notif-${n.id}`,
      });
    });
  }, [query.data]);

  useEffect(() => {
    if (!isAuthenticated) {
      seenIds.current.clear();
      primed.current = false;
    }
  }, [isAuthenticated]);

  return query;
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
