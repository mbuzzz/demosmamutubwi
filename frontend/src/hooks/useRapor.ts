import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface RaporRecord {
  id: string;
  siswa_id: string;
  tahun_ajaran: string;
  semester: 'ganjil' | 'genap';
  catatan_wali_kelas?: string | null;
  sakit: number;
  izin: number;
  alpha: number;
  terlambat: number;
  status: 'draft' | 'published';
  siswa?: any | null;
}

export function useRaporList(search?: string) {
  return useQuery({
    queryKey: ['rapors', search],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await api.get<RaporRecord[]>('/rapors', {
        params: { search },
      });
      return res.data;
    },
  });
}

export function useRapor(id: string | undefined) {
  return useQuery({
    queryKey: ['rapor-detail', id],
    staleTime: 30 * 1000,
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<RaporRecord>(`/rapors/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateRapor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<RaporRecord, 'id'>) => {
      const res = await api.post('/rapors', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rapors'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useUpdateRapor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RaporRecord> }) => {
      const res = await api.put(`/rapors/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rapors'] });
      queryClient.invalidateQueries({ queryKey: ['rapor-detail', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function usePublishRapor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/rapors/${id}/publish`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['rapors'] });
      queryClient.invalidateQueries({ queryKey: ['rapor-detail', id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}
