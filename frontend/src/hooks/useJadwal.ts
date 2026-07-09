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
  kelas?: { id: string; nama: string; tingkat: string } | null;
}

/**
 * Fetch jadwal.
 * - Without kelasId (undefined): backend resolves from current user (siswa/guru/ortu).
 * - With empty string: query is disabled (wait until kelas is selected in admin editor).
 * - With a kelas id: filter by that class.
 */
export function useJadwal(kelasId?: string) {
  const hasExplicitEmpty = kelasId === '';
  const enabled = !hasExplicitEmpty;

  return useQuery({
    queryKey: ['jadwal', kelasId || 'auto'],
    staleTime: 30 * 1000,
    enabled,
    queryFn: async () => {
      const params = kelasId ? { kelas_id: kelasId } : {};
      const res = await api.get<JadwalRecord[]>('/jadwal', { params });
      const data = res.data;
      return Array.isArray(data) ? data : [];
    },
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
      queryClient.invalidateQueries({ queryKey: ['jadwal', 'auto'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan data');
    },
  });
}
