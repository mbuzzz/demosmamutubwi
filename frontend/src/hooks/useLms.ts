import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface Materi {
  id: string;
  guru_id: string;
  kelas_id: string;
  mapel_id: string;
  judul: string;
  deskripsi?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
  guru?: { id: string; nama: string };
  kelas?: { id: string; nama: string };
  mapel?: { id: string; nama: string };
  comments?: LmsComment[];
}

export interface Tugas {
  id: string;
  guru_id: string;
  kelas_id: string;
  mapel_id: string;
  judul: string;
  deskripsi?: string;
  tenggat_waktu: string;
  created_at: string;
  updated_at: string;
  guru?: { id: string; nama: string };
  kelas?: { id: string; nama: string };
  mapel?: { id: string; nama: string };
  comments?: LmsComment[];
}

export interface LmsComment {
  id: string;
  user_id: string;
  materi_id?: string;
  tugas_id?: string;
  isi_komentar: string;
  created_at: string;
  user?: { id: string; nama: string; role_akses: string };
}

export interface Submission {
  id: string;
  tugas_id: string;
  siswa_id: string;
  file_url?: string;
  nilai?: number;
  komentar_guru?: string;
  status: 'belum' | 'menunggu' | 'sudah_dinilai';
  created_at: string;
  updated_at: string;
  siswa?: { id: string; nama: string };
}

// =======================
// MATERI HOOKS
// =======================

export function useMateriList(kelasId?: string) {
  return useQuery({
    queryKey: ['materi', kelasId],
    queryFn: async () => {
      const res = await api.get<Materi[]>('/materi', { params: { kelas_id: kelasId } });
      return res.data;
    },
  });
}

export function useMateriDetail(id?: string) {
  return useQuery({
    queryKey: ['materi', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<Materi>(`/materi/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateMateri() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post('/materi', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materi'] });
      toast.success('Materi berhasil ditambahkan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan materi');
    },
  });
}

export function useUpdateMateri() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const res = await api.put(`/materi/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materi'] });
      queryClient.invalidateQueries({ queryKey: ['materi', variables.id] });
      toast.success('Materi berhasil diupdate');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal mengupdate materi');
    },
  });
}

export function useDeleteMateri() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/materi/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materi'] });
      toast.success('Materi berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus materi');
    },
  });
}

export function useAddMateriComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isi_komentar }: { id: string; isi_komentar: string }) => {
      const res = await api.post(`/materi/${id}/comments`, { isi_komentar });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materi', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan komentar');
    },
  });
}

// =======================
// TUGAS HOOKS
// =======================

export function useTugasList(kelasId?: string) {
  return useQuery({
    queryKey: ['tugas', kelasId],
    queryFn: async () => {
      const res = await api.get<Tugas[]>('/tugas', { params: { kelas_id: kelasId } });
      return res.data;
    },
  });
}

export function useTugasDetail(id?: string) {
  return useQuery({
    queryKey: ['tugas', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<Tugas>(`/tugas/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateTugas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Tugas, 'id' | 'created_at' | 'updated_at' | 'guru' | 'kelas' | 'mapel' | 'comments'>) => {
      const res = await api.post('/tugas', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tugas'] });
      toast.success('Tugas berhasil ditambahkan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan tugas');
    },
  });
}

export function useUpdateTugas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Tugas> }) => {
      const res = await api.put(`/tugas/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tugas'] });
      queryClient.invalidateQueries({ queryKey: ['tugas', variables.id] });
      toast.success('Tugas berhasil diupdate');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal mengupdate tugas');
    },
  });
}

export function useDeleteTugas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/tugas/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tugas'] });
      toast.success('Tugas berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus tugas');
    },
  });
}

export function useAddTugasComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isi_komentar }: { id: string; isi_komentar: string }) => {
      const res = await api.post(`/tugas/${id}/comments`, { isi_komentar });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tugas', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan komentar');
    },
  });
}

// =======================
// SUBMISSION HOOKS
// =======================

export function useGetSubmissions(tugasId?: string) {
  return useQuery({
    queryKey: ['tugas', tugasId, 'submissions'],
    queryFn: async () => {
      if (!tugasId) return [];
      const res = await api.get<Submission[]>(`/tugas/${tugasId}/submissions`);
      return res.data;
    },
    enabled: !!tugasId,
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tugasId, submissionId, nilai, komentar_guru }: { tugasId: string, submissionId: string, nilai: number, komentar_guru?: string }) => {
      const res = await api.put(`/tugas/${tugasId}/submissions/${submissionId}/grade`, { nilai, komentar_guru });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tugas', variables.tugasId, 'submissions'] });
      toast.success('Nilai berhasil disimpan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan nilai');
    },
  });
}

export function useSubmitTugas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tugasId, data }: { tugasId: string; data: FormData }) => {
      const res = await api.post(`/tugas/${tugasId}/submissions`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tugas'] });
      queryClient.invalidateQueries({ queryKey: ['tugas', variables.tugasId] });
      queryClient.invalidateQueries({ queryKey: ['tugas', variables.tugasId, 'submissions'] });
      toast.success('Tugas berhasil dikumpulkan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal mengumpulkan tugas');
    },
  });
}
