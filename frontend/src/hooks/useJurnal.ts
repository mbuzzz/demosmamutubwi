import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface JurnalRecord {
  id: number;
  guru_id: number;
  kelas_id: number;
  mapel_id: number;
  tanggal: string;
  jam_mulai?: string;
  jam_selesai?: string;
  topik: string;
  kehadiran_json?: Record<string, string>; // { siswa_id: 'hadir' | 'sakit' | 'izin' | 'alpha' }
  created_at?: string;
  updated_at?: string;
  
  // Relations loaded by backend
  kelas?: { id: number; nama: string };
  mapel?: { id: number; nama: string };
  guru?: { id: number; name: string };
}

export function useJurnalList(params?: { kelas_id?: string | number; mapel_id?: string | number }) {
  return useQuery({
    queryKey: ['jurnals', params],
    queryFn: async () => {
      const res = await api.get<JurnalRecord[]>('/jurnal', { params });
      return res.data;
    },
  });
}

export function useJurnalDetail(id: number | string | null) {
  return useQuery({
    queryKey: ['jurnal', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<JurnalRecord>(`/jurnal/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateJurnal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<JurnalRecord>) => {
      const res = await api.post<{ message: string; data: JurnalRecord }>('/jurnal', data);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Jurnal & absensi KBM berhasil disimpan');
      queryClient.invalidateQueries({ queryKey: ['jurnals'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan jurnal');
    },
  });
}

export function useUpdateJurnal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: Partial<JurnalRecord> }) => {
      const res = await api.put<{ message: string; data: JurnalRecord }>(`/jurnal/${id}`, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Jurnal & absensi KBM berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['jurnals'] });
      queryClient.invalidateQueries({ queryKey: ['jurnal', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal memperbarui jurnal');
    },
  });
}

export function useDeleteJurnal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await api.delete(`/jurnal/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Jurnal berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['jurnals'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus jurnal');
    },
  });
}
