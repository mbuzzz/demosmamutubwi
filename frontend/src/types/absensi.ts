export type StatusAbsensi = 'hadir' | 'izin' | 'sakit' | 'alpha' | 'terlambat';

export const STATUS_ABSENSI_BADGE: Record<StatusAbsensi, { label: string; color: string }> = {
  hadir: { label: 'Hadir', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
  izin: { label: 'Izin', color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400' },
  sakit: { label: 'Sakit', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' },
  alpha: { label: 'Alpha', color: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400' },
  terlambat: { label: 'Terlambat', color: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400' },
};
