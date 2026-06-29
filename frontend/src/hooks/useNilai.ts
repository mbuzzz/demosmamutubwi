import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface StudentScore {
  siswa_id: string;
  name: string;
  email: string;
  nip_nisn: string;
  nilai_tugas: number | null;
  nilai_uts: number | null;
  nilai_uas: number | null;
}

export function useStudentScores(kelasId: string, mapelId: string) {
  return useQuery({
    queryKey: ['student-scores', kelasId, mapelId],
    staleTime: 30 * 1000,
    queryFn: async () => {
      if (!kelasId || !mapelId) return [];
      const res = await api.get<StudentScore[]>('/nilai/siswa', {
        params: { kelas_id: kelasId, mapel_id: mapelId },
      });
      return res.data;
    },
    enabled: !!kelasId && !!mapelId,
  });
}

export function useSaveScores() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      mapel_id: string;
      scores: { siswa_id: string; nilai_tugas?: number; nilai_uts?: number; nilai_uas?: number }[];
    }) => {
      const res = await api.post('/nilai', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-scores'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['rapors'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}
