import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface JadwalRecord {
  id?: string;
  kelas_id: string;
  hari: string;
  urutan_jam: number;
  jam_mulai: string;
  jam_selesai: string;
  label?: string | null;
  is_break: boolean;
  mapel_id?: string | null;
  guru_id?: string | null;
  mapel?: { id: string; nama: string; kode: string } | null;
  guru?: { id: string; name: string } | null;
}

export function useJadwal(kelasId: string | undefined) {
  return useQuery({
    queryKey: ['jadwal', kelasId],
    staleTime: 30 * 1000,
    queryFn: async () => {
      if (!kelasId) return [];
      const res = await api.get<JadwalRecord[]>('/jadwal', {
        params: { kelas_id: kelasId },
      });
      return res.data;
    },
    enabled: !!kelasId,
  });
}

export function useSaveJadwalBulk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ kelas_id, schedules }: { kelas_id: string; schedules: JadwalRecord[] }) => {
      const res = await api.post('/jadwal/bulk', { kelas_id, schedules });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jadwal', variables.kelas_id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}
