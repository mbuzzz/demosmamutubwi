import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';
import type { PaketSoal, SoalItem, SesiUjian } from '../types/cbt';

// --- Guru & Admin Hooks ---

// 1. Get List Bank Soal
export function useBankSoalList() {
  return useQuery({
    queryKey: ['bank-soal'],
    queryFn: async () => {
      const res = await api.get<{ data: PaketSoal[] }>('/cbt/bank-soal');
      return res.data.data;
    },
  });
}

// 2. Get Detail Bank Soal
export function useBankSoalDetail(id: number | null) {
  return useQuery({
    queryKey: ['bank-soal', id],
    queryFn: async () => {
      if (!id) return null;
      // Backend returns model directly (not wrapped in { data: ... })
      const res = await api.get<PaketSoal>(`/cbt/bank-soal/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

// 3. Create Bank Soal
export function useCreateBankSoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<PaketSoal>) => {
      const res = await api.post<{ data: PaketSoal }>('/cbt/bank-soal', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-soal'] });
    },
  });
}

// 4. Update Bank Soal
export function useUpdateBankSoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<PaketSoal> & { id: number }) => {
      const res = await api.put<{ data: PaketSoal }>(`/cbt/bank-soal/${id}`, data);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bank-soal'] });
      queryClient.invalidateQueries({ queryKey: ['bank-soal', id] });
    },
  });
}

// 4.1 Delete Bank Soal
export function useDeleteBankSoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/cbt/bank-soal/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-soal'] });
      toast.success('Paket Soal berhasil dihapus');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus Paket Soal');
    }
  });
}

// 5. Save Soal (Create/Update in Bank Soal)
export function useSaveSoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bank_soal_id, soal_id, data }: { bank_soal_id: number; soal_id?: number | null; data: Partial<SoalItem> }) => {
      if (soal_id) {
        const res = await api.put<{ message: string; data: SoalItem }>(`/cbt/bank-soal/${bank_soal_id}/soals/${soal_id}`, data);
        return res.data.data;
      } else {
        const res = await api.post<{ message: string; data: SoalItem }>(`/cbt/bank-soal/${bank_soal_id}/soals`, data);
        return res.data.data;
      }
    },
    onSuccess: (_, variables) => {
      if (variables.bank_soal_id) {
        queryClient.invalidateQueries({ queryKey: ['bank-soal', variables.bank_soal_id] });
      }
      toast.success('Soal berhasil disimpan');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menyimpan soal');
    }
  });
}

export function useDeleteSoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bank_soal_id, soal_id }: { bank_soal_id: number; soal_id: number }) => {
      const res = await api.delete(`/cbt/bank-soal/${bank_soal_id}/soals/${soal_id}`);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bank-soal', variables.bank_soal_id] });
      toast.success('Soal berhasil dihapus');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus soal');
    }
  });
}

// 6. Get Sesi Ujian List (Laravel pagination: { data: [...] })
export function useSesiUjianList() {
  return useQuery({
    queryKey: ['sesi-ujian'],
    queryFn: async () => {
      const res = await api.get<any>('/cbt/sesi');
      const raw = res.data?.data ?? res.data;
      return Array.isArray(raw) ? raw : [];
    },
  });
}

// Live monitor one session
export function useCbtMonitor(sesiId: number | string | null) {
  return useQuery({
    queryKey: ['cbt-monitor', sesiId],
    enabled: !!sesiId,
    refetchInterval: 8 * 1000,
    queryFn: async () => {
      const res = await api.get(`/cbt/sesi/${sesiId}/monitor`);
      return res.data as {
        sesi: any;
        peserta: Array<{
          siswa_id: number;
          name: string;
          nip_nisn: string;
          status: string;
          dijawab: number;
          total_soal: number;
          nilai_pg?: number | null;
          hasil_ujian_id?: number | null;
        }>;
        stats: { total: number; selesai: number; mengerjakan: number; belum: number };
      };
    },
  });
}

export function useForceSelesaiUjian() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sesiId, siswaId }: { sesiId: number | string; siswaId: number }) => {
      const res = await api.post(`/cbt/sesi/${sesiId}/force-selesai/${siswaId}`);
      return res.data;
    },
    onSuccess: (_, { sesiId }) => {
      queryClient.invalidateQueries({ queryKey: ['cbt-monitor', sesiId] });
      toast.success('Ujian siswa dipaksa selesai');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal force submit');
    },
  });
}

export function useEndSesiUjian() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sesiId: number | string) => {
      const res = await api.post(`/cbt/sesi/${sesiId}/end`);
      return res.data;
    },
    onSuccess: (_, sesiId) => {
      queryClient.invalidateQueries({ queryKey: ['cbt-monitor', sesiId] });
      queryClient.invalidateQueries({ queryKey: ['sesi-ujian'] });
      toast.success('Sesi ujian diakhiri');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal mengakhiri sesi');
    },
  });
}

// 7. Create Sesi Ujian
export function useCreateSesiUjian() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<SesiUjian>) => {
      const res = await api.post<{ data: SesiUjian }>('/cbt/sesi', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sesi-ujian'] });
    },
  });
}

// --- Siswa Hooks ---

// 1. Get Active Exams
export function useUjianAktifList() {
  return useQuery({
    queryKey: ['ujian-aktif'],
    queryFn: async () => {
      // Backend returns array directly (not always wrapped)
      const res = await api.get<any>('/cbt/ujian/sesi-aktif');
      const raw = res.data?.data ?? res.data;
      return Array.isArray(raw) ? raw : [];
    },
  });
}

// 2. Start Exam (Send Token)
export function useMulaiUjian() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { jadwal_ujian_id: number; token: string }) => {
      const res = await api.post<any>('/cbt/ujian/mulai', {
         sesi_ujian_id: data.jadwal_ujian_id,
         token: data.token,
       });
      // Map backend response keys to frontend expected properties
      return {
        ujian_siswa: {
          id: res.data.hasil_ujian_id,
        },
        soal: res.data.soals || [],
        durasi_tersisa_menit: res.data.durasi_menit || 0,
      };
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ujian-aktif'] });
    }
  });
}

// 3. Save Answer (Auto-save)
export function useSimpanJawaban() {
  return useMutation({
    mutationFn: async (data: { hasil_ujian_id: number; soal_id: number; opsi_jawaban_id?: number | null; jawaban_essay?: string | null }) => {
      const res = await api.post<any>('/cbt/ujian/simpan-jawaban', data);
      return res.data;
    },
  });
}

// 4. Finish Exam
export function useSelesaiUjian() {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ujianSiswaId: number) => {
      const res = await api.post<{ message: string; nilai_pg?: number; total_nilai?: number }>('/cbt/ujian/selesai', {
        hasil_ujian_id: ujianSiswaId,
      });
      return res.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ujian-aktif'] });
    }
  });
}
