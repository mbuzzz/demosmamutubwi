export type StatusPembayaran = 'lunas' | 'cicil' | 'belum' | 'bebas';
export type JenisPembayaranTipe = 'wajib' | 'sukarela';
export type BeasiswaTipe = 'persentase' | 'bebas' | 'nominal';
export type MetodePembayaran = 'rfid' | 'manual' | 'transfer';

export interface JenisPembayaran {
  id: string;
  nama: string;
  nominal: number;
  tipe: JenisPembayaranTipe;
  periode: string;
  deskripsi?: string;
  jatuhTempo?: string;
}

export interface BeasiswaSiswa {
  id: string;
  siswaId: string;
  jenisPembayaranId: string;
  tipe: BeasiswaTipe;
  nilai: number;
  keterangan?: string;
}

export interface TransaksiPembayaran {
  id: string;
  tanggal: string;
  nominal: number;
  metode: MetodePembayaran;
  petugas: string;
  keterangan?: string;
}

export interface PembayaranSiswa {
  id: string;
  siswaId: string;
  nama: string;
  kelas: string;
  jenisPembayaranId: string;
  jenisPembayaranNama: string;
  nominal: number;
  terbayar: number;
  sisa: number;
  status: StatusPembayaran;
  jatuhTempo: string;
  beasiswa?: BeasiswaSiswa;
  riwayat: TransaksiPembayaran[];
}

export const STATUS_PEMBAYARAN_BADGE: Record<StatusPembayaran, { label: string; color: string }> = {
  lunas: { label: 'Lunas', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
  cicil: { label: 'Angsuran', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' },
  belum: { label: 'Belum Bayar', color: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400' },
  bebas: { label: 'Bebas', color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400' },
};

export const JENIS_PEMBAYARAN_MOCK: JenisPembayaran[] = [
  { id: 'jp1', nama: 'SPP Bulanan', nominal: 150000, tipe: 'wajib', periode: 'Bulanan', deskripsi: 'Sumbangan Pembinaan Pendidikan', jatuhTempo: 'Setiap tanggal 10' },
  { id: 'jp2', nama: 'Uang Gedung', nominal: 500000, tipe: 'wajib', periode: 'Sekali', deskripsi: 'Biaya pembangunan & renovasi', jatuhTempo: 'Semester 1' },
  { id: 'jp3', nama: 'Dana Kegiatan', nominal: 75000, tipe: 'sukarela', periode: 'Bulanan', deskripsi: 'Iuran kegiatan ekstrakurikuler' },
  { id: 'jp4', nama: 'Buku & LKS', nominal: 200000, tipe: 'sukarela', periode: 'Semester', deskripsi: 'Pembelian buku paket & LKS' },
];

export const PEMBAYARAN_SISWA_MOCK: PembayaranSiswa[] = [
  {
    id: 'ps1', siswaId: 's1', nama: 'Agus Setiawan', kelas: 'X-1',
    jenisPembayaranId: 'jp1', jenisPembayaranNama: 'SPP Bulanan',
    nominal: 150000, terbayar: 150000, sisa: 0, status: 'lunas', jatuhTempo: '2026-06-10',
    riwayat: [
      { id: 't1', tanggal: '2026-06-01', nominal: 150000, metode: 'rfid', petugas: 'Bendahara', keterangan: 'Bayar SPP Juni via RFID' },
    ],
  },
  {
    id: 'ps2', siswaId: 's2', nama: 'Budi Santoso', kelas: 'X-1',
    jenisPembayaranId: 'jp1', jenisPembayaranNama: 'SPP Bulanan',
    nominal: 150000, terbayar: 75000, sisa: 75000, status: 'cicil', jatuhTempo: '2026-06-10',
    beasiswa: { id: 'b1', siswaId: 's2', jenisPembayaranId: 'jp1', tipe: 'persentase', nilai: 50, keterangan: 'Beasiswa prestasi' },
    riwayat: [
      { id: 't2', tanggal: '2026-05-25', nominal: 75000, metode: 'manual', petugas: 'Bendahara', keterangan: 'Bayar angsuran via RFID' },
    ],
  },
  {
    id: 'ps3', siswaId: 's3', nama: 'Citra Dewi', kelas: 'X-1',
    jenisPembayaranId: 'jp2', jenisPembayaranNama: 'Uang Gedung',
    nominal: 500000, terbayar: 500000, sisa: 0, status: 'lunas', jatuhTempo: '2026-07-01',
    riwayat: [
      { id: 't3', tanggal: '2026-05-20', nominal: 500000, metode: 'transfer', petugas: 'Siswa', keterangan: 'Transfer mandiri' },
    ],
  },
  {
    id: 'ps4', siswaId: 's4', nama: 'Dian Permata', kelas: 'X-1',
    jenisPembayaranId: 'jp1', jenisPembayaranNama: 'SPP Bulanan',
    nominal: 150000, terbayar: 0, sisa: 150000, status: 'belum', jatuhTempo: '2026-06-10',
    riwayat: [],
  },
  {
    id: 'ps5', siswaId: 's6', nama: 'Fitri Handayani', kelas: 'XI-IPA-1',
    jenisPembayaranId: 'jp1', jenisPembayaranNama: 'SPP Bulanan',
    nominal: 150000, terbayar: 0, sisa: 0, status: 'bebas', jatuhTempo: '2026-06-10',
    beasiswa: { id: 'b2', siswaId: 's6', jenisPembayaranId: 'jp1', tipe: 'bebas', nilai: 100, keterangan: 'Beasiswa full dari yayasan' },
    riwayat: [],
  },
];

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
