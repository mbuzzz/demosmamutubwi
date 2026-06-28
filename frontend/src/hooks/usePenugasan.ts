import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { type UserRecord } from './useUsers';
import { type MapelRecord } from './useMapel';
import { type KelasRecord } from './useKelas';
import { toast } from 'sonner';

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

export interface PenugasanStrukturalRecord {
  id: string;
  user_id: string;
  role_akses: string;
  jabatan: string | null;
  kelas_id: string | null;
  user?: UserRecord | null;
  kelas?: KelasRecord | null;
}

export function usePenugasanList(search?: string) {
  return useQuery({
    queryKey: ['penugasan', search],
    staleTime: 5 * 60 * 1000,
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
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
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
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
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
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

// Structural Tasks Hooks
export function useStrukturalList() {
  return useQuery({
    queryKey: ['struktural'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<PenugasanStrukturalRecord[]>('/penugasan-struktural');
      return res.data;
    },
  });
}

export function useCreateStruktural() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<PenugasanStrukturalRecord, 'id' | 'user' | 'kelas'>) => {
      const res = await api.post('/penugasan-struktural', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['struktural'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useUpdateStruktural() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PenugasanStrukturalRecord> }) => {
      const res = await api.put(`/penugasan-struktural/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['struktural'] });
      queryClient.invalidateQueries({ queryKey: ['users'] }); // Invalidate general users list too
      queryClient.invalidateQueries({ queryKey: ['kelas'] }); // Invalidate kelas list to refresh wali kelas relation
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useDeleteStruktural() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/penugasan-struktural/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['struktural'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useGuruClasses() {
  return useQuery({
    queryKey: ['guruClasses'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<KelasRecord[]>('/guru/classes');
      return res.data;
    },
  });
}
