import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface FaqRecord {
  id: string;
  pertanyaan: string;
  jawaban: string;
  urutan: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useFaqList() {
  return useQuery({
    queryKey: ['faq'],
    queryFn: async () => {
      const res = await api.get<FaqRecord[]>('/faq');
      return res.data;
    },
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<FaqRecord, 'id' | 'created_at' | 'updated_at'>) => {
      const res = await api.post('/faq', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
      toast.success('FAQ berhasil ditambahkan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan FAQ');
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FaqRecord> }) => {
      const res = await api.put(`/faq/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
      toast.success('FAQ berhasil diubah');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal mengubah FAQ');
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/faq/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faq'] });
      toast.success('FAQ berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus FAQ');
    },
  });
}
