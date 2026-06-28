import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { type UserRecord } from './useUsers';
import { type MapelRecord } from './useMapel';
import { type KelasRecord } from './useKelas';

export interface PenugasanRecord {
  id: string;
  guru_id: string;
  mapel_id: string;
  kelas_id: string;
  total_jam: number;
  guru?: UserRecord | null;
  mapel?: MapelRecord | null;
  kelas?: KelasRecord | null;
}

export function usePenugasanList(search?: string) {
  return useQuery({
    queryKey: ['penugasan', search],
    queryFn: async () => {
      const res = await api.get<PenugasanRecord[]>('/penugasan', {
        params: { search },
      });
      return res.data;
    },
  });
}

export function useCreatePenugasan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<PenugasanRecord, 'id'>) => {
      const res = await api.post('/penugasan', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penugasan'] });
    },
  });
}

export function useUpdatePenugasan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PenugasanRecord> }) => {
      const res = await api.put(`/penugasan/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penugasan'] });
    },
  });
}

export function useDeletePenugasan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/penugasan/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['penugasan'] });
    },
  });
}

// Structural Tasks Hooks
export function useStrukturalList() {
  return useQuery({
    queryKey: ['struktural'],
    queryFn: async () => {
      const res = await api.get<UserRecord[]>('/penugasan/struktural');
      return res.data;
    },
  });
}

export function useUpdateStruktural() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { role: string; jabatan: string } }) => {
      const res = await api.put(`/penugasan/struktural/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['struktural'] });
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Invalidate general users list too
    },
  });
}
