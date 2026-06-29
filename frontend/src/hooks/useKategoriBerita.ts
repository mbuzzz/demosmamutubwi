import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface KategoriBeritaRecord {
  id: string;
  nama: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export function useKategoriBerita() {
  return useQuery({
    queryKey: ['kategori-berita'],
    queryFn: async () => {
      const res = await api.get<KategoriBeritaRecord[]>('/kategori-berita');
      return res.data;
    },
  });
}

export function useCreateKategoriBerita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { nama: string }) => {
      const res = await api.post('/kategori-berita', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori-berita'] });
      toast.success('Kategori berhasil ditambahkan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan kategori');
    },
  });
}

export function useUpdateKategoriBerita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { nama: string } }) => {
      const res = await api.put(`/kategori-berita/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori-berita'] });
      toast.success('Kategori berhasil diubah');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal mengubah kategori');
    },
  });
}

export function useDeleteKategoriBerita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/kategori-berita/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kategori-berita'] });
      toast.success('Kategori berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus kategori');
    },
  });
}
