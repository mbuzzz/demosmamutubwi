import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface DownloadRecord {
  id: string;
  nama: string;
  kategori: string;
  file_name: string;
  file_path: string;
  file_size: string;
  file_type: string;
  downloads_count: number;
  created_at?: string;
  updated_at?: string;
}

export function useDownloadsList(params?: { search?: string; kategori?: string }) {
  return useQuery({
    queryKey: ['downloads', params],
    queryFn: async () => {
      const res = await api.get<DownloadRecord[]>('/downloads', { params });
      return res.data;
    },
  });
}

export function usePublicDownloadsList(params?: { search?: string }) {
  return useQuery({
    queryKey: ['public-downloads', params],
    queryFn: async () => {
      const res = await api.get<DownloadRecord[]>('/public/downloads', { params });
      return res.data;
    },
  });
}

export function useCreateDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/downloads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloads'] });
      queryClient.invalidateQueries({ queryKey: ['public-downloads'] });
      toast.success('Dokumen berhasil ditambahkan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal mengunggah dokumen');
    },
  });
}

export function useUpdateDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      // Laravel does not support PATCH/PUT with multipart/form-data directly,
      // so we use POST with _method=PUT.
      formData.append('_method', 'PUT');
      const res = await api.post(`/downloads/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloads'] });
      queryClient.invalidateQueries({ queryKey: ['public-downloads'] });
      toast.success('Dokumen berhasil diperbarui');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal memperbarui dokumen');
    },
  });
}

export function useDeleteDownload() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/downloads/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['downloads'] });
      queryClient.invalidateQueries({ queryKey: ['public-downloads'] });
      toast.success('Dokumen berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus dokumen');
    },
  });
}
