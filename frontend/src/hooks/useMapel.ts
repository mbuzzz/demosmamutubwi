import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface MapelRecord {
  id: string;
  nama: string;
  kode: string;
  kkm: number;
  tingkat: string;
}

export function useMapelList(search?: string) {
  return useQuery({
    queryKey: ['mapels', search],
    queryFn: async () => {
      const res = await api.get<MapelRecord[]>('/mapels', {
        params: { search },
      });
      return res.data;
    },
  });
}

export function useMapel(id: string | undefined) {
  return useQuery({
    queryKey: ['mapel-detail', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<MapelRecord>(`/mapels/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateMapel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<MapelRecord, 'id'>) => {
      const res = await api.post('/mapels', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mapels'] });
    },
  });
}

export function useUpdateMapel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MapelRecord> }) => {
      const res = await api.put(`/mapels/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mapels'] });
      queryClient.invalidateQueries({ queryKey: ['mapel-detail', variables.id] });
    },
  });
}

export function useDeleteMapel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/mapels/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mapels'] });
    },
  });
}
