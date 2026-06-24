export type StatusKartu = 'aktif' | 'nonaktif' | 'hilang';

export interface RfidCard {
  id: string;
  uid: string;
  siswaId: string;
  nama: string;
  kelas: string;
  status: StatusKartu;
  terdaftar: string;
}

export interface KonfigurasiRfid {
  pin: string;
  jamMasuk: string;
  jamPulang: string;
  toleransiTerlambat: number;
  updatedAt: string;
}

export const STATUS_KARTU_BADGE: Record<StatusKartu, { label: string; color: string }> = {
  aktif: { label: 'Aktif', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
  nonaktif: { label: 'Nonaktif', color: 'text-slate-600 bg-slate-100 dark:bg-slate-500/10 dark:text-slate-400' },
  hilang: { label: 'Hilang', color: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400' },
};

export { MOCK_SISWA } from './absensi';

export const KONFIGURASI_RFID_DEFAULT: KonfigurasiRfid = {
  pin: '123456',
  jamMasuk: '07:00',
  jamPulang: '15:30',
  toleransiTerlambat: 15,
  updatedAt: new Date().toISOString(),
};

export const MOCK_KARTU_RFID: RfidCard[] = [
  { id: 'k1', uid: 'RF:AB:12:CD:34', siswaId: 's1', nama: 'Agus Setiawan', kelas: 'X-1', status: 'aktif', terdaftar: '2026-01-15' },
  { id: 'k2', uid: 'RF:EF:56:GH:78', siswaId: 's2', nama: 'Budi Santoso', kelas: 'X-1', status: 'aktif', terdaftar: '2026-01-15' },
  { id: 'k3', uid: 'RF:90:IJ:KL:12', siswaId: 's3', nama: 'Citra Dewi', kelas: 'X-1', status: 'aktif', terdaftar: '2026-01-20' },
  { id: 'k4', uid: 'RF:34:MN:OP:56', siswaId: 's4', nama: 'Dian Permata', kelas: 'X-1', status: 'nonaktif', terdaftar: '2026-02-01' },
  { id: 'k5', uid: 'RF:78:QR:ST:90', siswaId: 's5', nama: 'Eko Prasetyo', kelas: 'X-1', status: 'aktif', terdaftar: '2026-01-10' },
  { id: 'k6', uid: 'RF:AB:34:CD:56', siswaId: 's6', nama: 'Fitri Handayani', kelas: 'XI-IPA-1', status: 'hilang', terdaftar: '2026-01-15' },
  { id: 'k7', uid: 'RF:EF:78:GH:90', siswaId: 's7', nama: 'Galih Putra', kelas: 'XI-IPA-1', status: 'aktif', terdaftar: '2026-01-15' },
  { id: 'k8', uid: 'RF:12:IJ:34:KL', siswaId: 's8', nama: 'Hesti Wulandari', kelas: 'XI-IPA-1', status: 'aktif', terdaftar: '2026-02-10' },
];

export function randomUid(): string {
  const hex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
  return `RF:${hex()}:${hex()}:${hex()}:${hex()}`;
}

export function waktuSekarang(): string {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function statusDariJam(jam: string, konfig: KonfigurasiRfid): 'hadir' | 'terlambat' {
  const [j, m] = jam.split(':').map(Number);
  const [jm, mm] = konfig.jamMasuk.split(':').map(Number);
  const batas = jm * 60 + mm + konfig.toleransiTerlambat;
  return (j * 60 + m) <= batas ? 'hadir' : 'terlambat';
}
