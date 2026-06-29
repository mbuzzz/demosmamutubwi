import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface GaleriRecord {
  id: string;
  judul: string;
  deskripsi?: string | null;
  file_url: string;
  tipe: 'image' | 'video';
  created_at: string;
  updated_at: string;
}

export function useGaleriList() {
  return useQuery({
    queryKey: ['galeri'],
    queryFn: async () => {
      const res = await api.get<GaleriRecord[]>('/galeri');
      return res.data;
    },
  });
}

export function useCreateGaleri() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post('/galeri', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galeri'] });
      toast.success('Galeri berhasil ditambahkan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan galeri');
    },
  });
}

export function useDeleteGaleri() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/galeri/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galeri'] });
      toast.success('Galeri berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus galeri');
    },
  });
}
