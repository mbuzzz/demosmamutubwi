import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface CbtTemplate {
  id: number;
  nama: string;
  layout: 'standar' | 'compact' | 'wide';
  primary_color: string;
  accent_color: string;
  bg_color: string;
  text_color: string;
  card_bg: string;
  font_size: number;
  font_family: string;
  header_logo?: string;
  header_text?: string;
  footer_text?: string;
  show_timer: boolean;
  show_progress: boolean;
  show_question_nav: boolean;
  created_by?: number;
  creator?: { id: number; name: string };
  created_at?: string;
  updated_at?: string;
}

export function useCbtTemplateList() {
  return useQuery({
    queryKey: ['cbt-templates'],
    queryFn: async () => {
      const res = await api.get<{ data: CbtTemplate[] }>('/cbt/templates');
      return res.data.data;
    },
  });
}

export function useCbtTemplateDetail(id: number | null) {
  return useQuery({
    queryKey: ['cbt-templates', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<{ data: CbtTemplate }>(`/cbt/templates/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateCbtTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post('/cbt/templates', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cbt-templates'] });
      toast.success('Template CBT berhasil dibuat');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal membuat template');
    },
  });
}

export function useUpdateCbtTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      data.append('_method', 'PUT');
      const res = await api.post(`/cbt/templates/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cbt-templates'] });
      toast.success('Template CBT berhasil diupdate');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal mengupdate template');
    },
  });
}

export function useDeleteCbtTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/cbt/templates/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cbt-templates'] });
      toast.success('Template CBT berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus template');
    },
  });
}
