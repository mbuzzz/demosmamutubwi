import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface PrestasiRecord {
  id: string | number;
  judul: string;
  deskripsi: string | null;
  kategori: string | null;
  gambar: string | null;
  created_at: string;
}

export function usePrestasiList() {
  return useQuery({
    queryKey: ['prestasi'],
    queryFn: async () => {
      const res = await api.get<PrestasiRecord[]>('/prestasi');
      return res.data;
    },
  });
}

export function usePublicPrestasiList() {
  return useQuery({
    queryKey: ['public-prestasi'],
    queryFn: async () => {
      const res = await api.get<PrestasiRecord[]>('/public/prestasi');
      return res.data;
    },
  });
}

export function useCreatePrestasi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post('/prestasi', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prestasi'] });
      toast.success('Prestasi berhasil ditambahkan');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menambah prestasi');
    }
  });
}

export function useUpdatePrestasi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number, data: FormData }) => {
      // Use _method=PUT to work around PHP formData parsing issues
      data.append('_method', 'PUT');
      const res = await api.post(`/prestasi/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prestasi'] });
      toast.success('Prestasi berhasil diubah');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal mengubah prestasi');
    }
  });
}

export function useDeletePrestasi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      await api.delete(`/prestasi/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['prestasi'] });
      toast.success('Prestasi berhasil dihapus');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menghapus prestasi');
    }
  });
}
