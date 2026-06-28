import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

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
  rumus_penilaian?: any | null;
  rapor_template?: any | null;
  deskripsi_config?: any | null;
}

export function useKurikulumList() {
  return useQuery({
    queryKey: ['kurikulum'],
    queryFn: async () => {
      const res = await api.get<KurikulumRecord[]>('/kurikulum');
      return res.data;
    },
  });
}

export function useKurikulum(id: string | undefined) {
  return useQuery({
    queryKey: ['kurikulum-detail', id],
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
  });
}
