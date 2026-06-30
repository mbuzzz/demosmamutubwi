import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';
import { type JenisPembayaran, type Tagihan, type TransaksiPembayaran, type PembayaranStatistik } from '../types/pembayaran';

// --- Jenis Pembayaran ---

export function useJenisPembayaranList() {
  return useQuery({
    queryKey: ['jenis-pembayaran'],
    queryFn: async () => {
      const res = await api.get<JenisPembayaran[]>('/pembayaran/jenis');
      return res.data;
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
      const res = await api.get<Tagihan[]>('/pembayaran/tagihan', { params });
      return res.data;
    },
  });
}

// --- Transaksi ---

export function useTransaksiList(params?: any) {
  return useQuery({
    queryKey: ['transaksi', params],
    queryFn: async () => {
      const res = await api.get<TransaksiPembayaran[]>('/pembayaran/transaksi', { params });
      return res.data;
    },
  });
}

// --- Bayar ---

export function useProsesPembayaran() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { tagihan_id: string | number; nominal: number; metode: string; keterangan?: string }) => {
      const res = await api.post('/pembayaran/proses', data);
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
      const res = await api.get<PembayaranStatistik>('/pembayaran/statistik');
      return res.data;
    },
  });
}
