export type TipeUjian = 'ujian' | 'ulangan_harian' | 'kuis' | 'matrikulasi';

export type TipeSoal = 'pg' | 'pgk' | 'pg_kompleks' | 'bs' | 'essay';

export interface OpsiJawaban {
  id?: number;
  soal_id?: number;
  teks_opsi: string;
  is_benar: boolean;
}

export interface SoalItem {
  id: number;
  bank_soal_id: number;
  jenis: TipeSoal;
  pertanyaan: string;
  opsiJawabans?: OpsiJawaban[];
  bobot_nilai: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaketSoal {
  id: number;
  guru_id: number;
  mapel_id: number;
  tingkat: number;
  judul: string;
  deskripsi?: string;
  tipe: TipeUjian;
  waktu_pengerjaan: number;
  status: 'draft' | 'published';
  soal?: SoalItem[];
  created_at?: string;
  updated_at?: string;
  
  // Relations or mapped properties if any
  mapel?: { nama_mapel: string };
  guru?: { nama: string };
}

export type StatusSesi = 'draft' | 'published' | 'completed' | 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai';

export interface SesiUjian {
  id: number;
  bank_soal_id: number;
  nama_sesi: string;
  waktu_mulai: string;
  waktu_selesai: string;
  durasi: number;
  token?: string;
  status: 'draft' | 'published' | 'completed';
  created_at?: string;
  updated_at?: string;
  
  // Relations
  bank_soal?: PaketSoal;
  pengawas?: { id: number; name: string }[];
  template_id?: number;
  template?: any;
}

// Interfaces for siswa responses
export interface UjianSiswaSesi {
    id: number;
    jadwal_ujian_id: number;
    siswa_id: number;
    waktu_mulai?: string;
    waktu_selesai?: string;
    status: 'sedang_dikerjakan' | 'selesai';
    nilai?: number;
    
    jadwal_ujian?: SesiUjian;
}

export interface UjianJawabanSiswa {
  id: number;
  ujian_siswa_id: number;
  soal_id: number;
  jawaban: string;
  skor?: number;
  ragu_ragu: boolean;
}

export type AntiCheatLevel = 'strict' | 'warning' | 'none';

export interface CbtConfig {
  needToken: boolean;
  fullscreen: boolean;
  antiCheat: AntiCheatLevel;
}

export const CBT_CONFIG: Record<TipeUjian, CbtConfig> = {
  ujian: {
    needToken: true,
    fullscreen: true,
    antiCheat: 'strict',
  },
  ulangan_harian: {
    needToken: false,
    fullscreen: false,
    antiCheat: 'warning',
  },
  kuis: {
    needToken: false,
    fullscreen: false,
    antiCheat: 'none',
  },
  matrikulasi: {
    needToken: true,
    fullscreen: true,
    antiCheat: 'warning',
  },
};

export const TIPE_BADGE: Record<TipeUjian, { label: string; color: string }> = {
  ujian: { label: 'UJIAN', color: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400' },
  ulangan_harian: { label: 'ULANGAN', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' },
  kuis: { label: 'KUIS', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
  matrikulasi: { label: 'MATRIKULASI', color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400' },
};

export function generateToken(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
