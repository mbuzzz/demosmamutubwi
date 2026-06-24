import { Link } from 'react-router-dom';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { FileText, Users, ArrowRight, Award } from 'lucide-react';
import { MOCK_REKAP_ABSENSI } from '../../../../types/absensi';

export default function KepsekDashboard() {
  const totalSiswa = MOCK_REKAP_ABSENSI.length;
  const rataKehadiran = Math.round(MOCK_REKAP_ABSENSI.reduce((a, r) => a + r.hadir, 0) / (MOCK_REKAP_ABSENSI.reduce((a, r) => a + r.hadir + r.alpha + r.terlambat, 0)) * 100);

  return (
    <AdminLayout title="Dashboard Kepala Sekolah">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Total Siswa</p>
          <h3 className="text-3xl font-black mt-1">{totalSiswa}</h3>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Rata-rata Kehadiran</p>
          <h3 className="text-3xl font-black mt-1">{rataKehadiran}%</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Semester Aktif</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1">Ganjil 2025/2026</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/panel/guru/rapor" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 transition-all hover:shadow-md group flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div><h4 className="font-bold text-slate-800 dark:text-white">Rapor Siswa</h4><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Nilai & capaian belajar</p></div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </Link>
        <Link to="/panel/guru/absensi/rekap" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500 transition-all group flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div><h4 className="font-bold text-slate-800 dark:text-white">Rekap Absensi</h4><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Kehadiran siswa per kelas</p></div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </Link>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <Award className="w-8 h-8 text-amber-200 mb-2" />
          <h4 className="font-bold">Selamat Datang</h4>
          <p className="text-xs text-amber-100 mt-1">Drs. H. Sugeng, M.Pd — Kepala Sekolah</p>
        </div>
      </div>
    </AdminLayout>
  );
}
