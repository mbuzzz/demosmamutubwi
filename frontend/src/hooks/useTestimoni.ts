import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface TestimoniRecord {
  id: string;
  nama: string;
  peran: string;
  isi_testimoni: string;
  foto?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useTestimoniList() {
  return useQuery({
    queryKey: ['testimoni'],
    queryFn: async () => {
      const res = await api.get<TestimoniRecord[]>('/testimoni');
      return res.data;
    },
  });
}

export function useCreateTestimoni() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post('/testimoni', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimoni'] });
      toast.success('Testimoni berhasil ditambahkan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan testimoni');
    },
  });
}

export function useUpdateTestimoni() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      data.append('_method', 'PUT');
      const res = await api.post(`/testimoni/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimoni'] });
      toast.success('Testimoni berhasil diubah');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal mengubah testimoni');
    },
  });
}

export function useDeleteTestimoni() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/testimoni/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimoni'] });
      toast.success('Testimoni berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus testimoni');
    },
  });
}
