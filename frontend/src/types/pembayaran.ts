export type StatusPembayaran = 'lunas' | 'cicil' | 'belum' | 'bebas';
export type JenisPembayaranTipe = 'wajib' | 'sukarela';
export type BeasiswaTipe = 'persentase' | 'bebas' | 'nominal';
export type MetodePembayaran = 'rfid' | 'manual' | 'transfer';

export interface JenisPembayaran {
  id: string | number;
  nama: string;
  nominal: number;
  tipe: JenisPembayaranTipe;
  periode: string;
  deskripsi?: string;
  jatuhTempo?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BeasiswaSiswa {
  id: string | number;
  siswa_id: string | number;
  jenis_pembayaran_id: string | number;
  tipe: BeasiswaTipe;
  nilai: number;
  keterangan?: string;
}

export interface TransaksiPembayaran {
  id: string | number;
  tagihan_id?: string | number;
  tanggal: string;
  nominal: number;
  metode: MetodePembayaran;
  petugas: string;
  keterangan?: string;
  created_at?: string;
  updated_at?: string;
  siswa?: any;
}

export interface Tagihan {
  id: string | number;
  siswa_id: string | number;
  siswa?: {
    id: string | number;
    nama: string;
    kelas?: string;
  };
  jenis_pembayaran_id: string | number;
  jenis_pembayaran?: JenisPembayaran;
  nominal: number;
  terbayar: number;
  sisa: number;
  status: StatusPembayaran;
  jatuh_tempo: string;
  beasiswa?: BeasiswaSiswa;
  riwayat?: TransaksiPembayaran[];
  created_at?: string;
  updated_at?: string;
}

export interface PembayaranStatistik {
  total_penerimaan: number;
  penerimaan_hari_ini: number;
  total_tunggakan: number;
  siswa_lunas: number;
  siswa_nunggak: number;
}

export const JENIS_PEMBAYARAN_MOCK: JenisPembayaran[] = [
  { id: 'jp1', nama: 'SPP Bulanan', nominal: 150000, tipe: 'wajib', periode: 'Bulanan', deskripsi: 'Sumbangan Pembinaan Pendidikan', jatuhTempo: '10' },
  { id: 'jp2', nama: 'Uang Gedung', nominal: 500000, tipe: 'wajib', periode: 'Sekali', deskripsi: 'Biaya pembangunan & renovasi', jatuhTempo: '2026-07-01' },
];

export const STATUS_PEMBAYARAN_BADGE: Record<StatusPembayaran, { label: string; color: string }> = {
  lunas: { label: 'Lunas', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
  cicil: { label: 'Angsuran', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' },
  belum: { label: 'Belum Bayar', color: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400' },
  bebas: { label: 'Bebas', color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400' },
};

export function rupiah(n: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
}

export function hitungBeasiswa(nominal: number, beasiswa?: BeasiswaSiswa): number {
  if (!beasiswa) return nominal;
  if (beasiswa.tipe === 'bebas') return 0;
  if (beasiswa.tipe === 'persentase') return nominal - (nominal * beasiswa.nilai / 100);
  if (beasiswa.tipe === 'nominal') return Math.max(0, nominal - beasiswa.nilai);
  return nominal;
}
