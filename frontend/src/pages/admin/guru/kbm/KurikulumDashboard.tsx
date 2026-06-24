import { Link } from 'react-router-dom';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { BookOpen, CalendarDays, School, LineChart, ArrowRight } from 'lucide-react';

export default function KurikulumDashboard() {
  return (
    <AdminLayout title="Dashboard Kurikulum">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/panel/guru/kurikulum/rumus" className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 transition-all hover:shadow-md group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div><h4 className="font-bold text-slate-800 dark:text-white text-sm">Kurikulum</h4><p className="text-[10px] text-slate-500 dark:text-slate-400">Atur & rumus</p></div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </Link>
        <Link to="/panel/guru/jadwal" className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500 transition-all hover:shadow-md group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div><h4 className="font-bold text-slate-800 dark:text-white text-sm">Jadwal</h4><p className="text-[10px] text-slate-500 dark:text-slate-400">Pelajaran & guru</p></div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </Link>
        <Link to="/panel/guru/mapel" className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-500 transition-all hover:shadow-md group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center">
              <School className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div><h4 className="font-bold text-slate-800 dark:text-white text-sm">Mapel</h4><p className="text-[10px] text-slate-500 dark:text-slate-400">Mata pelajaran</p></div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
        </Link>
        <Link to="/panel/guru/nilai" className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-500 transition-all hover:shadow-md group flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-xl flex items-center justify-center">
              <LineChart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div><h4 className="font-bold text-slate-800 dark:text-white text-sm">Nilai</h4><p className="text-[10px] text-slate-500 dark:text-slate-400">Entry nilai akhir</p></div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-colors" />
        </Link>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <h3 className="font-extrabold text-lg">Kurikulum Merdeka</h3>
        <p className="text-sm text-blue-100 mt-1">Tahun Ajaran 2025/2026 — Semester Ganjil</p>
      </div>
    </AdminLayout>
  );
}
