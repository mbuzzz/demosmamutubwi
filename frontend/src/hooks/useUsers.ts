import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  nip_nisn: string;
  role: 'superadmin' | 'guru' | 'siswa' | 'admin' | 'walikelas' | 'kepala_sekolah' | 'kurikulum' | 'bendahara';
  kelas?: string | null;
  jabatan?: string | null;
  phone?: string | null;
  uid_rfid?: string | null;
  is_active?: boolean;
}

export function useUsers(role?: string, search?: string) {
  return useQuery({
    queryKey: ['users', role, search],
    queryFn: async () => {
      const res = await api.get<UserRecord[]>('/users', {
        params: { role, search },
      });
      return res.data;
    },
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<UserRecord>(`/users/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<UserRecord, 'id'> & { password?: string }) => {
      const res = await api.post('/users', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<UserRecord> & { password?: string } }) => {
      const res = await api.put(`/users/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
