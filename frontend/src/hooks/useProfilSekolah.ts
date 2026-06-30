import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

export interface ProfilSekolahRecord {
  id: string;
  konten: string;
  gambar_utama?: string | null;
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
    mutationFn: async (data: FormData | { konten: string }) => {
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
      toast.success('Profil sekolah berhasil disimpan');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan profil sekolah');
    },
  });
}
