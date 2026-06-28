import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface RfidCard {
  id: number;
  user_id: number;
  uid_rfid: string;
  status: 'aktif' | 'nonaktif' | 'hilang';
  pin?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    nip_nisn: string;
    role: string;
    kelas?: string;
  };
}

export interface RfidConfig {
  id: number;
  waktu_masuk_mulai: string;
  waktu_masuk_akhir: string;
  waktu_pulang_mulai: string;
  waktu_pulang_akhir: string;
  mode: 'absen_masuk' | 'absen_pulang' | 'bebas' | 'tutup';
  created_at: string;
  updated_at: string;
}

export function useRfidCards(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['rfid-cards', params],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<RfidCard[]>('/rfid', { params });
      return res.data;
    },
  });
}

export function useCreateRfid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { user_id: number; uid_rfid: string; pin?: string; status?: string }) => {
      const res = await api.post('/rfid', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfid-cards'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useUpdateRfid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<RfidCard> }) => {
      const res = await api.put(`/rfid/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfid-cards'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useDeleteRfid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/rfid/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfid-cards'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useRfidConfig() {
  return useQuery({
    queryKey: ['rfid-config'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<RfidConfig>('/rfid/config');
      return res.data;
    },
  });
}

export function useUpdateRfidConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<RfidConfig>) => {
      const res = await api.post('/rfid/config', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfid-config'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useVerifyRfidPin() {
  return useMutation({
    mutationFn: async (data: { uid_rfid: string; pin: string }) => {
      const res = await api.post<{ success: boolean; message?: string; user?: any }>('/rfid/verify-pin', data);
      return res.data;
    },
  });
}
