import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { type JenisPembayaran } from '../types/pembayaran';

// --- Jenis Pembayaran ---

export function useJenisPembayaranList() {
  return useQuery({
    queryKey: ['jenis-pembayaran'],
    queryFn: async () => {
      const res = await api.get<any>('/pembayaran/jenis');
      return res.data.data || res.data;
    },
  });
}

export function useCreateJenisPembayaran() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<JenisPembayaran>) => {
      const res = await api.post('/pembayaran/jenis', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Jenis pembayaran berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['jenis-pembayaran'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan jenis pembayaran');
    },
  });
}

export function useUpdateJenisPembayaran() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<JenisPembayaran> }) => {
      const res = await api.put(`/pembayaran/jenis/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Jenis pembayaran berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['jenis-pembayaran'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal memperbarui jenis pembayaran');
    },
  });
}

export function useDeleteJenisPembayaran() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await api.delete(`/pembayaran/jenis/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Jenis pembayaran berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['jenis-pembayaran'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus jenis pembayaran');
    },
  });
}

// --- Tagihan ---

export function useTagihanList(params?: any) {
  return useQuery({
    queryKey: ['tagihan', params],
    queryFn: async () => {
      const res = await api.get<any>('/pembayaran/tagihan', { params });
      return res.data.data || res.data;
    },
  });
}

export function useCreateTagihan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { jenis_pembayaran_id: string | number; siswa_ids: (string | number)[]; nama_tagihan: string; nominal_tagihan?: number; tenggat_waktu?: string }) => {
      const res = await api.post('/pembayaran/tagihan', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Tagihan berhasil ditambahkan');
      queryClient.invalidateQueries({ queryKey: ['tagihan'] });
      queryClient.invalidateQueries({ queryKey: ['pembayaran-statistik'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan tagihan');
    },
  });
}

export function useUpdateBeasiswa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, tipe, nilai, keterangan }: { id: string | number; tipe: string; nilai?: number; keterangan?: string }) => {
      const res = await api.put(`/pembayaran/tagihan/${id}/beasiswa`, { tipe, nilai, keterangan });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Beasiswa berhasil diupdate');
      queryClient.invalidateQueries({ queryKey: ['tagihan'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan beasiswa');
    },
  });
}

// --- Transaksi ---

export function useTransaksiList(params?: any) {
  return useQuery({
    queryKey: ['transaksi', params],
    queryFn: async () => {
      const res = await api.get<any>('/pembayaran/transaksi', { params });
      return res.data.data || res.data;
    },
  });
}

export function useUpdateTransaksi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, jumlah_bayar }: { id: string | number; jumlah_bayar: number }) => {
      const res = await api.put(`/pembayaran/transaksi/${id}`, { jumlah_bayar });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Transaksi berhasil diupdate');
      queryClient.invalidateQueries({ queryKey: ['tagihan'] });
      queryClient.invalidateQueries({ queryKey: ['transaksi'] });
      queryClient.invalidateQueries({ queryKey: ['pembayaran-statistik'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal mengupdate transaksi');
    },
  });
}

export function useDeleteTransaksi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await api.delete(`/pembayaran/transaksi/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Transaksi berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['tagihan'] });
      queryClient.invalidateQueries({ queryKey: ['transaksi'] });
      queryClient.invalidateQueries({ queryKey: ['pembayaran-statistik'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus transaksi');
    },
  });
}

// --- Bayar ---

export function useProsesPembayaran() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { tagihan_id: string | number; nominal: number; metode: string; keterangan?: string }) => {
      const payload = {
        tagihan_id: data.tagihan_id,
        jumlah_bayar: data.nominal,
        metode: data.metode,
        catatan: data.keterangan,
      };
      const res = await api.post('/pembayaran/proses', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Pembayaran berhasil diproses');
      queryClient.invalidateQueries({ queryKey: ['tagihan'] });
      queryClient.invalidateQueries({ queryKey: ['transaksi'] });
      queryClient.invalidateQueries({ queryKey: ['pembayaran-statistik'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal memproses pembayaran');
    },
  });
}

// --- Statistik ---

export function usePembayaranStatistik() {
  return useQuery({
    queryKey: ['pembayaran-statistik'],
    queryFn: async () => {
      const res = await api.get<any>('/pembayaran/statistik');
      return res.data.data || res.data;
    },
  });
}

export function useStudentByRfid(uid?: string) {
  return useQuery({
    queryKey: ['student-rfid', uid],
    queryFn: async () => {
      if (!uid) return null;
      const res = await api.get<any>(`/pembayaran/rfid/${uid}`);
      return res.data;
    },
    enabled: !!uid,
  });
}
