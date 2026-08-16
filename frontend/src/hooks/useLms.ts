import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface Materi {
  id: string;
  guru_id: string;
  kelas_ids?: string[];
  mapel_id: string;
  judul: string;
  deskripsi?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
  guru?: { id: string; nama: string };
  kelas?: { id: string; nama: string }[];
  mapel?: { id: string; nama: string };
  comments?: LmsComment[];
}

export interface Tugas {
  id: string;
  guru_id: string;
  kelas_ids?: string[];
  mapel_id: string;
  judul: string;
  deskripsi?: string;
  tenggat_waktu: string;
  created_at: string;
  updated_at: string;
  guru?: { id: string; nama: string };
  kelas?: { id: string; nama: string }[];
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
  file_jawaban_url?: string;
  nilai?: number;
  komentar_guru?: string;
  feedback_guru?: string;
  status: 'belum' | 'menunggu' | 'belum_dinilai' | 'telat' | 'sudah_dinilai';
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
      const res = await api.get<any>('/lms/materi', { params: { kelas_id: kelasId } });
      const data = (res.data as any).data || res.data;
      return data.map((item: any) => ({ ...item, deskripsi: item.konten || item.deskripsi }));
    },
  });
}

export function useMateriDetail(id?: string) {
  return useQuery({
    queryKey: ['materi', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<{ data: Materi }>(`/lms/materi/${id}`);
      const item: any = (res.data as any).data || res.data;
      return { ...item, deskripsi: item.konten || item.deskripsi };
    },
    enabled: !!id,
  });
}

export function useCreateMateri() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      if (data.has('deskripsi') && !data.has('konten')) {
        data.set('konten', data.get('deskripsi') || '');
        data.delete('deskripsi');
      }
      const res = await api.post('/lms/materi', data, {
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
      if (data.has('deskripsi') && !data.has('konten')) {
        data.set('konten', data.get('deskripsi') || '');
        data.delete('deskripsi');
      }
      const res = await api.put(`/lms/materi/${id}`, data, {
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
      const res = await api.delete(`/lms/materi/${id}`);
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
      const res = await api.post(`/lms/materi/${id}/komentar`, { isi_komentar });
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
      const res = await api.get<any>('/lms/tugas', { params: { kelas_id: kelasId } });
      return (res.data as any).data || res.data;
    },
  });
}

export function useTugasDetail(id?: string) {
  return useQuery({
    queryKey: ['tugas', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get<{ data: Tugas }>(`/lms/tugas/${id}`);
      const item: any = (res.data as any).data || res.data;
      return { ...item, deskripsi: item.instruksi || item.deskripsi };
    },
    enabled: !!id,
  });
}

export function useCreateTugas() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Tugas, 'id' | 'created_at' | 'updated_at' | 'guru' | 'kelas' | 'mapel' | 'comments'>) => {
      const payload: Record<string, unknown> = { ...data };
      if (payload.deskripsi !== undefined && payload.instruksi === undefined) {
        payload.instruksi = payload.deskripsi;
        delete payload.deskripsi;
      }
      const res = await api.post('/lms/tugas', payload);
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
      const payload: Record<string, unknown> = { ...data };
      if (payload.deskripsi !== undefined && payload.instruksi === undefined) {
        payload.instruksi = payload.deskripsi;
        delete payload.deskripsi;
      }
      const res = await api.put(`/lms/tugas/${id}`, payload);
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
      const res = await api.delete(`/lms/tugas/${id}`);
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
      const res = await api.post(`/lms/tugas/${id}/komentar`, { isi_komentar });
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
      const res = await api.get<any>(`/lms/tugas/${tugasId}/submissions`);
      const data = (res.data as any).data || res.data;
      return data.map((item: any): Submission => {
        const submission = item.data_pengumpulan;
        const rawStatus = submission?.status;
        const status = submission
          ? (rawStatus === 'sudah_dinilai' || rawStatus === 'telat' ? rawStatus : 'menunggu')
          : 'belum';

        return {
          id: String(item.siswa_id),
          tugas_id: String(tugasId),
          siswa_id: String(item.siswa_id),
          file_url: submission?.file_jawaban_url,
          file_jawaban_url: submission?.file_jawaban_url,
          nilai: submission?.nilai,
          komentar_guru: submission?.feedback_guru,
          feedback_guru: submission?.feedback_guru,
          status,
          created_at: submission?.created_at || '',
          updated_at: submission?.updated_at || '',
          siswa: { id: String(item.siswa_id), nama: item.nama_siswa },
        };
      });
    },
    enabled: !!tugasId,
  });
}

export function useMySubmission(tugasId?: string) {
  return useQuery({
    queryKey: ['tugas', tugasId, 'my-submission'],
    queryFn: async () => {
      if (!tugasId) return null;
      const res = await api.get<{ data: any }>(`/lms/tugas/${tugasId}/my-submission`);
      const submission = (res.data as any).data || res.data;
      if (!submission) return null;
      return {
        ...submission,
        file_url: submission.file_url || submission.file_jawaban_url,
        komentar_guru: submission.komentar_guru || submission.feedback_guru,
        status: submission.status === 'sudah_dinilai' || submission.status === 'telat'
          ? submission.status
          : 'menunggu',
      } as Submission;
    },
    enabled: !!tugasId,
  });
}

export function useGradeSubmission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tugasId, siswaId, nilai, feedback_guru }: { tugasId: string, siswaId: string, nilai: number, feedback_guru?: string }) => {
      const res = await api.post(`/lms/tugas/${tugasId}/grade/${siswaId}`, { nilai, feedback_guru });
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
      const res = await api.post(`/lms/tugas/${tugasId}/submit`, data, {
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
