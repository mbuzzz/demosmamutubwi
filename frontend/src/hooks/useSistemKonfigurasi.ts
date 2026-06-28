import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface SistemKonfigurasiRecord {
  id: string;
  tahun_ajaran_aktif: string;
  semester_aktif: 'ganjil' | 'genap';
  kurikulum_aktif_id: string | null;
  nama_sekolah?: string;
  logo_sekolah?: string;
  kop_surat?: string;
  kurikulum_aktif?: {
    id: string;
    nama: string;
    tahun_ajaran: string;
    status: string;
  };
}

export function useSistemKonfigurasi() {
  return useQuery({
    queryKey: ['sistem-konfigurasi'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<SistemKonfigurasiRecord>('/sistem-konfigurasi');
      return res.data;
    },
  });
}

export function useUpdateSistemKonfigurasi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData | {
      tahun_ajaran_aktif?: string;
      semester_aktif?: 'ganjil' | 'genap';
      kurikulum_aktif_id?: string | null;
      nama_sekolah?: string;
    }) => {
      if (data instanceof FormData) {
        data.append('_method', 'PUT');
        const res = await api.post('/sistem-konfigurasi', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
      }
      const res = await api.put('/sistem-konfigurasi', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sistem-konfigurasi'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export interface KonfigurasiOptions {
  kurikulums: { id: string; nama: string; tahun_ajaran: string; status: string }[];
}

export function useSistemKonfigurasiOptions() {
  return useQuery({
    queryKey: ['sistem-konfigurasi-options'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<KonfigurasiOptions>('/sistem-konfigurasi/options');
      return res.data;
    },
  });
}
