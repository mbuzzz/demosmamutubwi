import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface AbsensiRecord {
  id: number;
  user_id: number;
  tipe: 'hadir' | 'izin' | 'sakit' | 'alpha' | 'terlambat';
  tanggal: string;
  waktu_masuk: string | null;
  waktu_pulang: string | null;
  keterangan: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    nip_nisn: string;
    kelas?: string;
  };
}

export interface AbsensiRekap {
  user_id: number;
  name: string;
  nip_nisn: string;
  kelas?: string;
  total_hadir: number;
  total_izin: number;
  total_sakit: number;
  total_alpha: number;
  total_terlambat: number;
}

export function useAbsensiList(params?: { start_date?: string; end_date?: string; role?: string; kelas?: string; user_id?: string; search?: string }) {
  return useQuery({
    queryKey: ['absensi', params],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await api.get<AbsensiRecord[]>('/absensi', { params });
      return res.data;
    },
  });
}

export function useAbsensiRekap(params?: { bulan?: string; tahun?: string; role?: string; kelas?: string }) {
  return useQuery({
    queryKey: ['absensi-rekap', params],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await api.get<AbsensiRekap[]>('/absensi/rekap', { params });
      return res.data;
    },
  });
}

export function useAbsensiRekapSiswa(student_id: string, params?: { tahun_ajaran?: string; semester?: string }) {
  return useQuery({
    queryKey: ['absensi-rekap-siswa', student_id, params],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await api.get<AbsensiRekap>(`/absensi/rekap/${student_id}`, { params });
      return res.data;
    },
    enabled: !!student_id,
  });
}

export function useTapAbsensi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (uid_rfid: string) => {
      const res = await api.post('/absensi/tap', { uid_rfid });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absensi'] });
      queryClient.invalidateQueries({ queryKey: ['absensi-rekap'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useManualAbsensi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { user_id: number; tipe: string; tanggal: string; keterangan?: string; waktu_masuk?: string; waktu_pulang?: string }) => {
      const res = await api.post('/absensi/manual', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absensi'] });
      queryClient.invalidateQueries({ queryKey: ['absensi-rekap'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}
