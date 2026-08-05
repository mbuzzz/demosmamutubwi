export type HariPiket = 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu' | 'minggu';

export const HARI_PIKET: HariPiket[] = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

export const HARI_LABEL: Record<HariPiket, string> = {
  senin: 'Senin',
  selasa: 'Selasa',
  rabu: 'Rabu',
  kamis: 'Kamis',
  jumat: 'Jumat',
  sabtu: 'Sabtu',
  minggu: 'Minggu',
};

export type StatusPiket = 'hadir' | 'izin' | 'sakit' | 'alpha' | 'terlambat' | 'belum';

export const STATUS_PIKET_LABEL: Record<StatusPiket, string> = {
  hadir: 'Hadir',
  izin: 'Izin',
  sakit: 'Sakit',
  alpha: 'Alpha',
  terlambat: 'Terlambat',
  belum: 'Belum',
};

export interface UserPiket {
  id: string | number;
  name: string;
  nip_nisn?: string | null;
  jabatan?: string | null;
  foto?: string | null;
  role?: string;
  roles?: string[] | null;
}

export interface JadwalPiketItem {
  id: string | number;
  user_id: string | number;
  hari: HariPiket;
  keterangan?: string | null;
  user?: UserPiket | null;
}

export interface AbsensiPiketItem {
  id?: string | number | null;
  user_id: string | number;
  jadwal_piket_id?: string | number | null;
  hari?: HariPiket;
  tanggal: string;
  keterangan?: string | null;
  status: StatusPiket;
  catatan?: string | null;
  user?: UserPiket | null;
}

export interface LaporanPiketItem {
  user_id: string | number;
  user?: UserPiket | null;
  total_jadwal: number;
  hadir: number;
  izin: number;
  sakit: number;
  alpha: number;
  terlambat: number;
  total_terisi: number;
  detail: { id: string | number; tanggal: string; status: StatusPiket; catatan?: string | null }[];
}

export interface RingkasanPiket {
  bulan: string;
  total_guru: number;
  total_hadir: number;
  total_izin: number;
  total_sakit: number;
  total_alpha: number;
  total_terlambat: number;
}
