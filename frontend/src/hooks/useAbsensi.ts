import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface AbsensiRecord {
  id: number;
  user_id: number;
  siswa_id?: number;
  tipe: 'hadir' | 'izin' | 'sakit' | 'alpha' | 'terlambat';
  status_masuk?: string;
  tanggal: string;
  waktu_masuk: string | null;
  waktu_pulang: string | null;
  jam_masuk?: string | null;
  jam_pulang?: string | null;
  keterangan: string | null;
  catatan?: string | null;
  metode?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    nip_nisn: string;
    kelas?: string;
    role?: string;
  };
}

export interface AbsensiRekap {
  user_id: number;
  siswa_id?: number;
  name: string;
  nip_nisn: string;
  kelas?: string;
  total_hadir: number;
  total_izin: number;
  total_sakit: number;
  total_alpha: number;
  total_terlambat: number;
}

export function useAbsensiList(params?: {
  tanggal?: string;
  start_date?: string;
  end_date?: string;
  role?: string;
  kelas?: string;
  kelas_id?: string;
  user_id?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['absensi', params],
    staleTime: 15 * 1000,
    queryFn: async () => {
      const res = await api.get<AbsensiRecord[]>('/absensi', { params });
      const data = res.data;
      return Array.isArray(data) ? data : [];
    },
  });
}

export function useAbsensiRekap(params?: {
  bulan?: string | number;
  tahun?: string | number;
  role?: string;
  kelas?: string;
  kelas_id?: string;
}) {
  return useQuery({
    queryKey: ['absensi-rekap', params],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await api.get<AbsensiRekap[]>('/absensi/rekap', { params });
      const data = res.data;
      return Array.isArray(data) ? data : [];
    },
  });
}

export function useAbsensiRekapSiswa(student_id: string, params?: { tahun_ajaran?: string; semester?: string }) {
  return useQuery({
    queryKey: ['absensi-rekap-siswa', student_id, params],
    staleTime: 30 * 1000,
    queryFn: async () => {
      const res = await api.get<AbsensiRekap>(`/absensi/siswa/${student_id}`, { params });
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
    mutationFn: async (data: {
      user_id: number;
      tipe: string;
      tanggal: string;
      keterangan?: string;
      waktu_masuk?: string;
      waktu_pulang?: string;
    }) => {
      // Backend accepts aliases and maps to siswa_id / status_masuk / jam_*
      const res = await api.post('/absensi', {
        user_id: data.user_id,
        tipe: data.tipe,
        tanggal: data.tanggal,
        keterangan: data.keterangan,
        waktu_masuk: data.waktu_masuk,
        waktu_pulang: data.waktu_pulang,
        metode: 'manual',
      });
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
