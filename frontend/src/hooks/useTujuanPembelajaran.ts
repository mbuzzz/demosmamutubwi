import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface TujuanPembelajaranRecord {
  id: string;
  mapel_id: string;
  tingkat: 'X' | 'XI' | 'XII';
  kode: string;
  deskripsi: string;
}

export function useTujuanPembelajaranList(mapelId?: string, tingkat?: string) {
  return useQuery({
    queryKey: ['tujuan_pembelajarans', mapelId, tingkat],
    queryFn: async () => {
      const res = await api.get<TujuanPembelajaranRecord[]>('/tujuan-pembelajaran', {
        params: { mapel_id: mapelId, tingkat },
      });
      return res.data;
    },
    enabled: !!mapelId,
  });
}

export function useCreateTujuanPembelajaran() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<TujuanPembelajaranRecord, 'id'>) => {
      const res = await api.post('/tujuan-pembelajaran', data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tujuan_pembelajarans', variables.mapel_id, variables.tingkat] });
    },
  });
}

export function useUpdateTujuanPembelajaran() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TujuanPembelajaranRecord> }) => {
      const res = await api.put(`/tujuan-pembelajaran/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tujuan_pembelajarans', data.tp.mapel_id, data.tp.tingkat] });
    },
  });
}

export function useDeleteTujuanPembelajaran() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; mapelId: string; tingkat: string }) => {
      const res = await api.delete(`/tujuan-pembelajaran/${id}`);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tujuan_pembelajarans', variables.mapelId, variables.tingkat] });
    },
  });
}
