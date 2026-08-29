import { Link } from 'react-router-dom';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { BookOpen, CalendarDays, School, LineChart, ArrowRight, CheckCircle, Loader2, BookMarked, Users, ClipboardList } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../lib/api';

interface Kurikulum {
  id: number;
  nama: string;
  tahun_ajaran: string;
  status: string;
  kkm_default: number;
  metode_remedial: string;
  uses_tp: boolean;
  bobot_tugas: number;
  bobot_uts: number;
  bobot_uas: number;
}

function useKurikulumAktif() {
  return useQuery({
    queryKey: ['kurikulum'],
    queryFn: async () => {
      const res = await api.get('/kurikulum');
      return (res.data as Kurikulum[]).find(k => k.status === 'aktif') ?? null;
    },
  });
}

export default function KurikulumDashboard() {
  const { data: kurikulum, isLoading } = useKurikulumAktif();

  const menuItems = [
    {
      to: '/panel/guru/kurikulum/monitoring',
      label: 'Monitoring CBT & LMS',
      sub: 'Pantau bank soal & pengumpulan',
      icon: ClipboardList,
      color: 'border-cyan-200 dark:border-cyan-500 hover:border-cyan-300',
      iconBg: 'bg-cyan-100 dark:bg-cyan-500/20',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      arrowColor: 'group-hover:text-cyan-500',
    },
    {
      to: '/panel/guru/kurikulum/rumus',
      label: 'Kurikulum',
      sub: 'Atur & rumus penilaian',
      icon: BookOpen,
      color: 'border-indigo-200 dark:border-indigo-500 hover:border-indigo-300',
      iconBg: 'bg-indigo-100 dark:bg-indigo-500/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      arrowColor: 'group-hover:text-indigo-500',
    },
    {
      to: '/panel/guru/jadwal',
      label: 'Jadwal Pelajaran',
      sub: 'Pelajaran & guru pengampu',
      icon: CalendarDays,
      color: 'border-emerald-200 dark:border-emerald-500 hover:border-emerald-300',
      iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      arrowColor: 'group-hover:text-emerald-500',
    },
    {
      to: '/panel/guru/mapel',
      label: 'Mata Pelajaran',
      sub: 'Kelola daftar mapel',
      icon: School,
      color: 'border-amber-200 dark:border-amber-500 hover:border-amber-300',
      iconBg: 'bg-amber-100 dark:bg-amber-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      arrowColor: 'group-hover:text-amber-500',
    },
    {
      to: '/panel/guru/kelas',
      label: 'Kelas',
      sub: 'Manajemen kelas & wali',
      icon: Users,
      color: 'border-sky-200 dark:border-sky-500 hover:border-sky-300',
      iconBg: 'bg-sky-100 dark:bg-sky-500/20',
      iconColor: 'text-sky-600 dark:text-sky-400',
      arrowColor: 'group-hover:text-sky-500',
    },
    {
      to: '/panel/guru/nilai',
      label: 'Buku Nilai',
      sub: 'Entry nilai akhir semester',
      icon: LineChart,
      color: 'border-rose-200 dark:border-rose-500 hover:border-rose-300',
      iconBg: 'bg-rose-100 dark:bg-rose-500/20',
      iconColor: 'text-rose-600 dark:text-rose-400',
      arrowColor: 'group-hover:text-rose-500',
    },
    {
      to: '/panel/guru/rapor',
      label: 'Rapor',
      sub: 'Publikasi & cetak rapor',
      icon: BookMarked,
      color: 'border-purple-200 dark:border-purple-500 hover:border-purple-300',
      iconBg: 'bg-purple-100 dark:bg-purple-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      arrowColor: 'group-hover:text-purple-500',
    },
  ];

  return (
    <AdminLayout title="Dashboard Kurikulum">
      {/* Kurikulum Aktif Card */}
      <div className="mb-6">
        {isLoading ? (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">Memuat kurikulum aktif...</span>
          </div>
        ) : kurikulum ? (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Kurikulum Aktif</span>
                </div>
                <h3 className="font-extrabold text-2xl">{kurikulum.nama}</h3>
                <p className="text-sm text-blue-100 mt-1">
                  Tahun Ajaran {kurikulum.tahun_ajaran} • KKM {kurikulum.kkm_default}
                </p>
              </div>
              <div className="flex flex-col gap-2 text-right text-sm">
                <div className="bg-white/15 rounded-xl px-4 py-2">
                  <p className="text-xs text-blue-100">Bobot Penilaian</p>
                  <p className="font-bold">
                    T:{kurikulum.bobot_tugas}% · UTS:{kurikulum.bobot_uts}% · UAS:{kurikulum.bobot_uas}%
                  </p>
                </div>
                <div className="bg-white/15 rounded-xl px-4 py-2">
                  <p className="text-xs text-blue-100">Remedial</p>
                  <p className="font-bold capitalize">{kurikulum.metode_remedial.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 text-amber-700 dark:text-amber-400 text-sm font-medium">
            ⚠️ Belum ada kurikulum yang diset sebagai aktif. Silakan atur di menu Kurikulum.
          </div>
        )}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 ${item.color} transition-all hover:shadow-md group flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">{item.label}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.sub}</p>
              </div>
            </div>
            <ArrowRight className={`w-4 h-4 text-slate-300 ${item.arrowColor} transition-colors`} />
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
}
