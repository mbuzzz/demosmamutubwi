import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../lib/errors';

export interface KurikulumRecord {
  id: string;
  nama: string;
  tahun_ajaran: string;
  status: 'aktif' | 'draft';
  kkm_default: number;
  metode_remedial: string;
  uses_tp: boolean;
  bobot_tugas: number;
  bobot_uts: number;
  bobot_uas: number;
  rumus_penilaian?: unknown;
  rapor_template?: unknown;
  deskripsi_config?: DeskripsiConfig | null;
}

export interface DeskripsiConfig {
  threshold_tinggi: number;
  threshold_rendah: number;
  template_tinggi: string;
  template_rendah: string;
}

export function useKurikulumList() {
  return useQuery({
    queryKey: ['kurikulum'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<KurikulumRecord[]>('/kurikulum');
      return res.data;
    },
  });
}

export function useKurikulum(id: string | undefined) {
  return useQuery({
    queryKey: ['kurikulum-detail', id],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<{ kurikulum: KurikulumRecord; kelas_ids: string[] }>(`/kurikulum/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateKurikulum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<KurikulumRecord, 'id'> & { kelas_ids?: string[] }) => {
      const res = await api.post('/kurikulum', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kurikulum'] });
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menyimpan data'));
    },
  });
}

export function useUpdateKurikulum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<KurikulumRecord> & { kelas_ids?: string[] } }) => {
      const res = await api.put(`/kurikulum/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kurikulum'] });
      queryClient.invalidateQueries({ queryKey: ['kurikulum-detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menyimpan data'));
    },
  });
}

export function useDeleteKurikulum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/kurikulum/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kurikulum'] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menyimpan data'));
    },
  });
}
