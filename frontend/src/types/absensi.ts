export type StatusAbsensi = 'hadir' | 'izin' | 'sakit' | 'alpha' | 'terlambat';
export type MetodeAbsensi = 'rfid' | 'manual';

export interface SiswaAbsensi {
  id: string;
  siswaId: string;
  nama: string;
  kelas: string;
  tanggal: string;
  jamMasuk?: string;
  jamPulang?: string;
  statusMasuk: StatusAbsensi;
  statusPulang?: StatusAbsensi;
  metode: MetodeAbsensi;
  rfidCard?: string;
  catatan?: string;
}

export interface RekapAbsensi {
  id: string;
  siswaId: string;
  nama: string;
  kelas: string;
  hadir: number;
  izin: number;
  sakit: number;
  alpha: number;
  terlambat: number;
}

export const STATUS_ABSENSI_BADGE: Record<StatusAbsensi, { label: string; color: string }> = {
  hadir: { label: 'Hadir', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
  izin: { label: 'Izin', color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400' },
  sakit: { label: 'Sakit', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' },
  alpha: { label: 'Alpha', color: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400' },
  terlambat: { label: 'Terlambat', color: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400' },
};

export const MOCK_SISWA: { id: string; nama: string; kelas: string; rfidCard: string }[] = [
  { id: 's1', nama: 'Agus Setiawan', kelas: 'X-1', rfidCard: 'RF:AB:12:CD:34' },
  { id: 's2', nama: 'Budi Santoso', kelas: 'X-1', rfidCard: 'RF:EF:56:GH:78' },
  { id: 's3', nama: 'Citra Dewi', kelas: 'X-1', rfidCard: 'RF:90:IJ:KL:12' },
  { id: 's4', nama: 'Dian Permata', kelas: 'X-1', rfidCard: 'RF:34:MN:OP:56' },
  { id: 's5', nama: 'Eko Prasetyo', kelas: 'X-1', rfidCard: 'RF:78:QR:ST:90' },
  { id: 's6', nama: 'Fitri Handayani', kelas: 'XI-IPA-1', rfidCard: 'RF:AB:34:CD:56' },
  { id: 's7', nama: 'Galih Putra', kelas: 'XI-IPA-1', rfidCard: 'RF:EF:78:GH:90' },
  { id: 's8', nama: 'Hesti Wulandari', kelas: 'XI-IPA-1', rfidCard: 'RF:12:IJ:34:KL' },
];

export const MOCK_ABSENSI_HARI_INI: SiswaAbsensi[] = [
  { id: 'a1', siswaId: 's1', nama: 'Agus Setiawan', kelas: 'X-1', tanggal: '2026-06-24', jamMasuk: '06:55', statusMasuk: 'hadir', metode: 'rfid', rfidCard: 'RF:AB:12:CD:34' },
  { id: 'a2', siswaId: 's2', nama: 'Budi Santoso', kelas: 'X-1', tanggal: '2026-06-24', jamMasuk: '07:18', statusMasuk: 'terlambat', metode: 'rfid', rfidCard: 'RF:EF:56:GH:78' },
  { id: 'a3', siswaId: 's3', nama: 'Citra Dewi', kelas: 'X-1', tanggal: '2026-06-24', jamMasuk: '06:50', statusMasuk: 'hadir', metode: 'rfid', rfidCard: 'RF:90:IJ:KL:12' },
  { id: 'a4', siswaId: 's4', nama: 'Dian Permata', kelas: 'X-1', tanggal: '2026-06-24', jamMasuk: '06:58', statusMasuk: 'hadir', metode: 'manual' },
  { id: 'a5', siswaId: 's5', nama: 'Eko Prasetyo', kelas: 'X-1', tanggal: '2026-06-24', statusMasuk: 'alpha', metode: 'manual', catatan: 'Tidak masuk tanpa keterangan' },
  { id: 'a6', siswaId: 's6', nama: 'Fitri Handayani', kelas: 'XI-IPA-1', tanggal: '2026-06-24', jamMasuk: '06:45', jamPulang: '15:10', statusMasuk: 'hadir', statusPulang: 'hadir', metode: 'rfid', rfidCard: 'RF:AB:34:CD:56' },
  { id: 'a7', siswaId: 's7', nama: 'Galih Putra', kelas: 'XI-IPA-1', tanggal: '2026-06-24', jamMasuk: '07:30', statusMasuk: 'terlambat', metode: 'rfid', rfidCard: 'RF:EF:78:GH:90' },
  { id: 'a8', siswaId: 's8', nama: 'Hesti Wulandari', kelas: 'XI-IPA-1', tanggal: '2026-06-24', jamMasuk: '06:52', statusMasuk: 'hadir', metode: 'rfid', rfidCard: 'RF:12:IJ:34:KL' },
];

export const MOCK_REKAP_ABSENSI: RekapAbsensi[] = [
  { id: 'r1', siswaId: 's1', nama: 'Agus Setiawan', kelas: 'X-1', hadir: 42, izin: 1, sakit: 2, alpha: 0, terlambat: 1 },
  { id: 'r2', siswaId: 's2', nama: 'Budi Santoso', kelas: 'X-1', hadir: 38, izin: 0, sakit: 1, alpha: 1, terlambat: 5 },
  { id: 'r3', siswaId: 's3', nama: 'Citra Dewi', kelas: 'X-1', hadir: 44, izin: 0, sakit: 0, alpha: 0, terlambat: 0 },
  { id: 'r4', siswaId: 's4', nama: 'Dian Permata', kelas: 'X-1', hadir: 40, izin: 2, sakit: 3, alpha: 0, terlambat: 2 },
  { id: 'r5', siswaId: 's5', nama: 'Eko Prasetyo', kelas: 'X-1', hadir: 35, izin: 0, sakit: 2, alpha: 5, terlambat: 3 },
  { id: 'r6', siswaId: 's6', nama: 'Fitri Handayani', kelas: 'XI-IPA-1', hadir: 43, izin: 1, sakit: 1, alpha: 0, terlambat: 0 },
  { id: 'r7', siswaId: 's7', nama: 'Galih Putra', kelas: 'XI-IPA-1', hadir: 37, izin: 0, sakit: 0, alpha: 3, terlambat: 6 },
  { id: 'r8', siswaId: 's8', nama: 'Hesti Wulandari', kelas: 'XI-IPA-1', hadir: 45, izin: 0, sakit: 0, alpha: 0, terlambat: 1 },
];
