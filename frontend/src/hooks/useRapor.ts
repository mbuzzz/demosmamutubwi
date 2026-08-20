import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../lib/errors';

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
  siswa?: Record<string, unknown> | null;
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
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menyimpan data'));
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
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menyimpan data'));
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
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menyimpan data'));
    },
  });
}

export function useSaveNilaiEkskul() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { siswa_id: string | number; ekskul_id: string | number; nilai: string; keterangan?: string }) => {
      const res = await api.post('/rapors/ekskul', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Nilai ekskul berhasil disimpan');
      queryClient.invalidateQueries({ queryKey: ['rapors'] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menyimpan nilai ekskul'));
    },
  });
}

export function useDeleteNilaiEkskul() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await api.delete(`/rapors/ekskul/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Nilai ekskul berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['rapors'] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menghapus nilai ekskul'));
    },
  });
}
