export type TipeUjian = 'ujian' | 'ulangan_harian' | 'kuis';

export type TipeSoal = 'pg' | 'pgk' | 'pg_kompleks' | 'bs' | 'essay';

export interface SoalItem {
  id: string;
  nomor: number;
  tipe: TipeSoal;
  pertanyaan: string;
  options?: string[];
  kunciJawaban: string;
  bobot: number;
}

export interface PaketSoal {
  id: string;
  title: string;
  mapel: string;
  kelas: string;
  soalCount: number;
  time: string;
  tipe: TipeUjian;
  soal: SoalItem[];
}

export type StatusSesi = 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai';

export interface SesiUjian {
  id: string;
  tipe: TipeUjian;
  title: string;
  mapel: string;
  kelas: string;
  paketSoalId: string;
  tanggal: string;
  jamMulai: string;
  durasi: number;
  token: string;
  status: StatusSesi;
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
};

export const TIPE_BADGE: Record<TipeUjian, { label: string; color: string }> = {
  ujian: { label: 'UJIAN', color: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400' },
  ulangan_harian: { label: 'ULANGAN', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' },
  kuis: { label: 'KUIS', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
};

export function generateToken(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const MOCK_PAKET_SOAL: PaketSoal[] = [
  {
    id: 'p1',
    title: 'Paket PTS Matematika',
    mapel: 'Matematika Wajib',
    kelas: 'Kelas X',
    soalCount: 5,
    time: '90 Menit',
    tipe: 'ujian',
    soal: [
      { id: 'q1', nomor: 1, tipe: 'pg', pertanyaan: 'Nilai dari ²log 8 + ³log 27 adalah...', options: ['4', '5', '6', '7', '8'], kunciJawaban: 'C', bobot: 20 },
      { id: 'q2', nomor: 2, tipe: 'pg', pertanyaan: 'Bentuk sederhana dari (x²y³)⁴ adalah...', options: ['x⁸y¹²', 'x⁶y⁷', 'x⁸y⁷', 'x⁶y¹²', 'x⁴y⁷'], kunciJawaban: 'A', bobot: 20 },
      { id: 'q3', nomor: 3, tipe: 'pgk', pertanyaan: 'Manakah dari pernyataan berikut yang BENAR?', options: ['²log 4 = 2', '³log 9 = 3', '⁵log 25 = 2', '²log 8 = 4'], kunciJawaban: 'A, C', bobot: 25 },
      { id: 'q4', nomor: 4, tipe: 'essay', pertanyaan: 'Jelaskan secara singkat apa itu logaritma!', kunciJawaban: 'Logaritma adalah invers dari eksponen', bobot: 35 },
      { id: 'q5', nomor: 5, tipe: 'pg', pertanyaan: 'Jika ³log x = 4, maka nilai x adalah...', options: ['12', '27', '64', '81', '243'], kunciJawaban: 'D', bobot: 20 },
    ],
  },
  {
    id: 'p2',
    title: 'UH Fisika Gerak',
    mapel: 'Fisika',
    kelas: 'Kelas XI',
    soalCount: 3,
    time: '30 Menit',
    tipe: 'ulangan_harian',
    soal: [
      { id: 'q6', nomor: 1, tipe: 'pg', pertanyaan: 'Satuan dari kecepatan adalah...', options: ['m/s', 'm/s²', 'N', 'J', 'kg'], kunciJawaban: 'A', bobot: 33 },
      { id: 'q7', nomor: 2, tipe: 'pgk', pertanyaan: 'Manakah yang termasuk besaran vektor?', options: ['Kecepatan', 'Massa', 'Perpindahan', 'Waktu'], kunciJawaban: 'A, C', bobot: 33 },
      { id: 'q8', nomor: 3, tipe: 'essay', pertanyaan: 'Jelaskan hukum Newton I!', kunciJawaban: 'Benda cenderung mempertahankan keadaannya', bobot: 34 },
    ],
  },
  {
    id: 'p3',
    title: 'Kuis Kimia Atom',
    mapel: 'Kimia',
    kelas: 'Kelas X',
    soalCount: 2,
    time: '10 Menit',
    tipe: 'kuis',
    soal: [
      { id: 'q9', nomor: 1, tipe: 'pg', pertanyaan: 'Partikel terkecil dari suatu unsur adalah...', options: ['Atom', 'Molekul', 'Elektron', 'Proton', 'Neutron'], kunciJawaban: 'A', bobot: 50 },
      { id: 'q10', nomor: 2, tipe: 'essay', pertanyaan: 'Apa yang dimaksud dengan isotop?', kunciJawaban: 'Atom dengan jumlah proton sama tapi neutron berbeda', bobot: 50 },
    ],
  },
];

export const MOCK_SESI_UJIAN: SesiUjian[] = [
  {
    id: 's1',
    tipe: 'ujian',
    title: 'PTS Ganjil Matematika X-1',
    mapel: 'Matematika Wajib',
    kelas: 'Kelas X',
    paketSoalId: 'p1',
    tanggal: '2026-07-15',
    jamMulai: '08:00',
    durasi: 90,
    token: 'MTKX1PTS',
    status: 'Sedang Berlangsung',
  },
  {
    id: 's2',
    tipe: 'ulangan_harian',
    title: 'UH Gerak Lurus Fisika XI',
    mapel: 'Fisika',
    kelas: 'Kelas XI',
    paketSoalId: 'p2',
    tanggal: '2026-07-20',
    jamMulai: '10:00',
    durasi: 30,
    token: 'FISIKA26',
    status: 'Akan Datang',
  },
  {
    id: 's3',
    tipe: 'kuis',
    title: 'Kuis Struktur Atom X',
    mapel: 'Kimia',
    kelas: 'Kelas X',
    paketSoalId: 'p3',
    tanggal: '2026-07-22',
    jamMulai: '13:00',
    durasi: 10,
    token: 'KIMIA10',
    status: 'Akan Datang',
  },
  {
    id: 's4',
    tipe: 'ujian',
    title: 'PAS Genap Matematika X-1',
    mapel: 'Matematika Wajib',
    kelas: 'Kelas X',
    paketSoalId: 'p1',
    tanggal: '2026-06-10',
    jamMulai: '08:00',
    durasi: 90,
    token: 'MTKPAS26',
    status: 'Selesai',
  },
];
