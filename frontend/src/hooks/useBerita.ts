import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';
import type { KategoriBeritaRecord } from './useKategoriBerita';

export interface BeritaRecord {
  id: string;
  judul: string;
  slug: string;
  konten: string;
  gambar?: string | null;
  penulis_id: string;
  kategori_id?: string | null;
  status: 'draft' | 'published';
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  kategori?: KategoriBeritaRecord;
}

export function useBeritaList(params?: { status?: string, limit?: number, public?: boolean }) {
  return useQuery({
    queryKey: ['berita', params],
    queryFn: async () => {
      // Public listing (unauthenticated) uses /public/berita
      // Admin listing (authenticated, may filter by status) uses /berita
      const endpoint = params?.public ? '/public/berita' : '/berita';
      const res = await api.get<BeritaRecord[]>(endpoint, { params: { ...params, public: undefined } });
      return res.data;
    },
  });
}

export function useBeritaDetailPublic(slug: string) {
  return useQuery({
    queryKey: ['berita-public', slug],
    queryFn: async () => {
      const res = await api.get<BeritaRecord>(`/public/berita/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });
}

export function useBeritaDetail(id: string) {
  return useQuery({
    queryKey: ['berita', id],
    queryFn: async () => {
      // Admin detail by ID uses authenticated route
      const res = await api.get<BeritaRecord>(`/berita/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateBerita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post('/berita', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['berita'] });
      toast.success('Berita berhasil ditambahkan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan berita');
    },
  });
}

export function useUpdateBerita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      data.append('_method', 'PUT');
      const res = await api.post(`/berita/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['berita'] });
      toast.success('Berita berhasil diubah');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal mengubah berita');
    },
  });
}

export function useDeleteBerita() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/berita/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['berita'] });
      toast.success('Berita berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus berita');
    },
  });
}
