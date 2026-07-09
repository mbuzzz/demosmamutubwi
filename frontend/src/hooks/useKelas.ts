import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { type UserRecord } from './useUsers';
import { type MapelRecord } from './useMapel';
import { toast } from 'sonner';

export interface KelasRecord {
  id: string;
  nama: string;
  tingkat: string;
  jurusan: string;
  tahun_ajaran: string;
  wali_kelas_id: string | null;
  wali_kelas?: UserRecord | null;
  mapels?: MapelRecord[];
}

export function useKelasList(search?: string) {
  return useQuery({
    queryKey: ['kelas', search ?? ''],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get('/kelas', {
        params: search ? { search } : undefined,
      });
      const raw = res.data;
      // Normalize: plain array or Laravel-wrapped { data: [...] }
      if (Array.isArray(raw)) return raw as KelasRecord[];
      if (raw && Array.isArray((raw as { data?: unknown }).data)) {
        return (raw as { data: KelasRecord[] }).data;
      }
      return [] as KelasRecord[];
    },
  });
}

export function useKelas(id: string | undefined) {
  return useQuery({
    queryKey: ['kelas-detail', id],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<KelasRecord>(`/kelas/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateKelas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<KelasRecord, 'id' | 'wali_kelas'>) => {
      const res = await api.post('/kelas', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useUpdateKelas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<KelasRecord> }) => {
      const res = await api.put(`/kelas/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
      queryClient.invalidateQueries({ queryKey: ['kelas-detail', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useDeleteKelas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/kelas/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}
