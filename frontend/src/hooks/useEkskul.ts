import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface EkskulRecord {
  id: string;
  nama: string;
  deskripsi?: string | null;
}

export function useEkskulList(search?: string) {
  return useQuery({
    queryKey: ['ekskuls', search],
    queryFn: async () => {
      const res = await api.get<EkskulRecord[]>('/ekskuls', {
        params: { search },
      });
      return res.data;
    },
  });
}

export function useEkskul(id: string | undefined) {
  return useQuery({
    queryKey: ['ekskul-detail', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<EkskulRecord>(`/ekskuls/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateEkskul() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<EkskulRecord, 'id'>) => {
      const res = await api.post('/ekskuls', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ekskuls'] });
    },
  });
}

export function useUpdateEkskul() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EkskulRecord> }) => {
      const res = await api.put(`/ekskuls/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ekskuls'] });
      queryClient.invalidateQueries({ queryKey: ['ekskul-detail', variables.id] });
    },
  });
}

export function useDeleteEkskul() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/ekskuls/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ekskuls'] });
    },
  });
}
