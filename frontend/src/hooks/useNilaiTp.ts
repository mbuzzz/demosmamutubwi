import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface StudentTpScore {
  siswa_id: string;
  name: string;
  email: string;
  nip_nisn: string;
  nilai: number;
}

export function useStudentTpScores(kelasId: string, mapelId: string, tpId: string) {
  return useQuery({
    queryKey: ['student-tp-scores', kelasId, mapelId, tpId],
    staleTime: 30 * 1000,
    queryFn: async () => {
      if (!kelasId || !mapelId || !tpId) return [];
      const res = await api.get<StudentTpScore[]>('/nilai-tp/siswa', {
        params: { kelas_id: kelasId, mapel_id: mapelId, tujuan_pembelajaran_id: tpId },
      });
      return res.data;
    },
    enabled: !!kelasId && !!mapelId && !!tpId,
  });
}

export function useSaveTpScores() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      mapel_id: string;
      tujuan_pembelajaran_id: string;
      scores: { siswa_id: string; nilai: number }[];
    }) => {
      const res = await api.post('/nilai-tp', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-tp-scores'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['rapors'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}
