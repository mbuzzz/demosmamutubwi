import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../lib/errors';
import {
  type HariPiket,
  type JadwalPiketItem,
  type AbsensiPiketItem,
  type LaporanPiketItem,
  type RingkasanPiket,
  type StatusPiket,
  type UserPiket,
} from '../types/piket';

// --- Daftar Guru ---

export function useGuruPiket() {
  return useQuery({
    queryKey: ['piket-guru'],
    queryFn: async () => {
      const res = await api.get<UserPiket[]>('/piket/guru');
      return res.data;
    },
  });
}

// --- Jadwal ---

export function useJadwalPiket() {
  return useQuery({
    queryKey: ['piket-jadwal'],
    queryFn: async () => {
      const res = await api.get<Record<HariPiket, JadwalPiketItem[]>>('/piket/jadwal');
      return res.data;
    },
  });
}

export function useCreateJadwalPiket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { user_id: string | number; hari: HariPiket; keterangan?: string }) => {
      const res = await api.post('/piket/jadwal', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Jadwal piket berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['piket-jadwal'] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menambahkan jadwal piket'));
    },
  });
}

export function useUpdateJadwalPiket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: { user_id: string | number; hari: HariPiket; keterangan?: string } }) => {
      const res = await api.put(`/piket/jadwal/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Jadwal piket berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['piket-jadwal'] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal memperbarui jadwal piket'));
    },
  });
}

export function useDeleteJadwalPiket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await api.delete(`/piket/jadwal/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Jadwal piket berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['piket-jadwal'] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menghapus jadwal piket'));
    },
  });
}

// --- Absensi ---

export function useAbsensiPiketTanggal(tanggal?: string) {
  return useQuery({
    queryKey: ['piket-absensi', tanggal],
    queryFn: async () => {
      const res = await api.get<{ tanggal: string; hari: HariPiket; data: AbsensiPiketItem[] }>('/piket/absensi', { params: { tanggal } });
      return res.data;
    },
  });
}

export function useAbsensiPiketBulan(bulan?: string) {
  return useQuery({
    queryKey: ['piket-absensi-bulan', bulan],
    queryFn: async () => {
      const res = await api.get<AbsensiPiketItem[]>('/piket/absensi', { params: { bulan } });
      return res.data;
    },
    enabled: !!bulan,
  });
}

export function useStoreAbsensiPiket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { user_id: string | number; tanggal: string; status: StatusPiket; catatan?: string; jadwal_piket_id?: string | number }) => {
      const res = await api.post('/piket/absensi', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['piket-absensi'] });
      queryClient.invalidateQueries({ queryKey: ['piket-absensi-bulan'] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menyimpan absensi piket'));
    },
  });
}

export function useUpdateAbsensiPiket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: { status: StatusPiket; catatan?: string } }) => {
      const res = await api.put(`/piket/absensi/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['piket-absensi'] });
      queryClient.invalidateQueries({ queryKey: ['piket-absensi-bulan'] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal memperbarui absensi piket'));
    },
  });
}

export function useDeleteAbsensiPiket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await api.delete(`/piket/absensi/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Absensi piket dihapus');
      queryClient.invalidateQueries({ queryKey: ['piket-absensi'] });
      queryClient.invalidateQueries({ queryKey: ['piket-absensi-bulan'] });
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Gagal menghapus absensi piket'));
    },
  });
}

// --- Laporan ---

export function useLaporanPiket(bulan?: string) {
  return useQuery({
    queryKey: ['piket-laporan', bulan],
    queryFn: async () => {
      const res = await api.get<{ ringkasan: RingkasanPiket; data: LaporanPiketItem[] }>('/piket/laporan', {
        params: { bulan },
      });
      return res.data;
    },
    enabled: !!bulan,
  });
}
