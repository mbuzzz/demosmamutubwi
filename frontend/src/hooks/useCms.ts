import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface PublicProfilSekolah {
  nama_sekolah: string;
  sejarah_teks: string;
  sejarah_foto?: string;
  visi_teks: string;
  misi_list: string[];
  kepsek_nama: string;
  kepsek_nip?: string;
  kepsek_sambutan: string;
  kepsek_foto?: string;
  akreditasi: string;
}

export interface PublicBerita {
  id: number;
  judul: string;
  slug: string;
  ringkasan?: string;
  konten: string;
  cover_image?: string;
  published_at: string;
  kategori?: { nama: string };
  penulis?: { name: string };
}

export interface PublicTestimoni {
  id: number;
  nama: string;
  peran: string;
  teks: string;
}

export interface PublicFaq {
  id: number;
  pertanyaan: string;
  jawaban: string;
}

export interface PublicGuru {
  id: number;
  name: string;
  email: string;
  jabatan: string | null;
  foto: string | null;
  subject: string;
}

export function usePublicGuruDirectory() {
  return useQuery({
    queryKey: ['public-guru'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<PublicGuru[]>('/public/guru');
      return res.data;
    },
  });
}

export function usePublicProfil() {
  return useQuery({
    queryKey: ['public-profil'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<PublicProfilSekolah>('/public/profil');
      return res.data;
    },
  });
}

export function usePublicBeritaList() {
  return useQuery({
    queryKey: ['public-berita'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<PublicBerita[]>('/public/berita');
      // Some endpoints return data directly, some wrap in { data: ... }
      return Array.isArray(res.data) ? res.data : (res.data as any).data || [];
    },
  });
}

export function usePublicBeritaDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ['public-berita', slug],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!slug) return null;
      const res = await api.get<PublicBerita>(`/public/berita/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });
}

export function usePublicTestimoni() {
  return useQuery({
    queryKey: ['public-testimoni'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<PublicTestimoni[]>('/public/testimoni');
      return res.data;
    },
  });
}

export function usePublicFaq() {
  return useQuery({
    queryKey: ['public-faq'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<PublicFaq[]>('/public/faq');
      return res.data;
    },
  });
}

export interface PublicStrukturalItem {
  id: number;
  jabatan: string | null;
  role_akses: string;
  nama: string | null;
  nip: string | null;
  foto: string | null;
}

export function usePublicStruktural() {
  return useQuery({
    queryKey: ['public-struktural'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await api.get<PublicStrukturalItem[]>('/public/struktural');
      return res.data;
    },
  });
}
