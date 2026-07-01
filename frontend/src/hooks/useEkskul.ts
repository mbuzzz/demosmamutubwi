import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface EkskulRecord {
  id: string;
  nama: string;
  deskripsi?: string | null;
}

export function useEkskulList(search?: string) {
  return useQuery({
    queryKey: ['ekskuls', search],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<EkskulRecord[]>('/ekskuls', {
        params: { search },
      });
      return res.data;
    },
  });
}

export function useEkskul(id: string | undefined) {
  return useQuery({
    queryKey: ['ekskul-detail', id],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<EkskulRecord>(`/ekskuls/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateEkskul() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<EkskulRecord, 'id'>) => {
      const res = await api.post('/ekskuls', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ekskuls'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useUpdateEkskul() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EkskulRecord> }) => {
      const res = await api.put(`/ekskuls/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ekskuls'] });
      queryClient.invalidateQueries({ queryKey: ['ekskul-detail', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

export function useDeleteEkskul() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/ekskuls/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ekskuls'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}

// --- Jadwal Ekskul Hooks ---

export interface JadwalEkskulRecord {
  id: string;
  ekskul_id: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  pola: string;
  ruang?: string;
  pembina_id?: string;
  pembina?: { id: number; name: string; nip_nisn?: string };
}

export function useJadwalEkskul(ekskulId?: string) {
  return useQuery({
    queryKey: ['jadwal-ekskul', ekskulId],
    queryFn: async () => {
      if (!ekskulId) return [];
      const res = await api.get<JadwalEkskulRecord[]>(`/ekskuls/${ekskulId}/jadwal`);
      return res.data;
    },
    enabled: !!ekskulId,
  });
}

export function useCreateJadwalEkskul() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ekskulId, data }: { ekskulId: string; data: Partial<JadwalEkskulRecord> }) => {
      const res = await api.post(`/ekskuls/${ekskulId}/jadwal`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jadwal-ekskul', variables.ekskulId] });
      queryClient.invalidateQueries({ queryKey: ['ekskuls'] });
      toast.success('Jadwal ekskul berhasil ditambahkan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan jadwal');
    },
  });
}

export function useUpdateJadwalEkskul() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ekskulId, jadwalId, data }: { ekskulId: string; jadwalId: string; data: Partial<JadwalEkskulRecord> }) => {
      const res = await api.put(`/ekskuls/${ekskulId}/jadwal/${jadwalId}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jadwal-ekskul', variables.ekskulId] });
      queryClient.invalidateQueries({ queryKey: ['ekskuls'] });
      toast.success('Jadwal ekskul berhasil diupdate');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal mengupdate jadwal');
    },
  });
}

export function useDeleteJadwalEkskul() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ekskulId, jadwalId }: { ekskulId: string; jadwalId: string }) => {
      const res = await api.delete(`/ekskuls/${ekskulId}/jadwal/${jadwalId}`);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jadwal-ekskul', variables.ekskulId] });
      queryClient.invalidateQueries({ queryKey: ['ekskuls'] });
      toast.success('Jadwal ekskul berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus jadwal');
    },
  });
}
