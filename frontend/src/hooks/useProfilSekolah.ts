import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface ProfilSekolahRecord {
  id: number;
  nama_sekolah?: string;
  akreditasi?: string;
  sejarah_teks: string | null;
  sejarah_foto?: string | null;
  visi_teks: string | null;
  misi_list: string[] | null;
  kepsek_nama: string | null;
  kepsek_nip: string | null;
  kepsek_foto?: string | null;
  kepsek_sambutan: string | null;
}

export function useProfilSekolah() {
  return useQuery({
    queryKey: ['profil-sekolah'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      // Public endpoint — works for both authenticated and unauthenticated users
      const res = await api.get<ProfilSekolahRecord>('/public/profil');
      return res.data;
    },
  });
}

export function useUpdateProfilSekolah() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      data:
        | FormData
        | {
            sejarah_teks?: string;
            visi_teks?: string;
            misi_list?: string[];
            kepsek_nama?: string;
            kepsek_nip?: string;
            kepsek_sambutan?: string;
          }
    ) => {
      if (data instanceof FormData) {
        data.append('_method', 'PUT');
        const res = await api.post('/profil-sekolah', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data;
      }
      const res = await api.put('/profil-sekolah', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profil-sekolah'] });
      queryClient.invalidateQueries({ queryKey: ['public-profil'] });
      toast.success('Profil sekolah berhasil disimpan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan profil sekolah');
    },
  });
}
