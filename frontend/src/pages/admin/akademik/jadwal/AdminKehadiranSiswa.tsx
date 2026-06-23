import AdminLayout from '../../../../components/admin/AdminLayout';
import { Search, CalendarDays, TrendingUp, AlertTriangle, Download } from 'lucide-react';

export default function AdminKehadiranSiswa() {
  return (
    <AdminLayout title="Monitoring Presensi Sekolah">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Rata-rata Kehadiran</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">96.5%</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Siswa Alpa Hari Ini</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">12 Siswa</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Tarik Laporan Bulanan</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 mt-1">Export data ke Excel/PDF</p>
          </div>
          <button className="bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Tanggal Laporan</label>
            <input type="date" className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white" />
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Filter Kelas</label>
            <select className="w-full sm:w-32 px-4 py-2.5 bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 dark:text-indigo-400">
              <option>Semua</option>
              <option>X-1</option>
              <option>XI-IPA-1</option>
            </select>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            Filter Data
          </button>
        </div>

        {/* Tabel Rekapitulasi */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">Rekapitulasi Kehadiran</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Senin, 15 Juli 2024</p>
              </div>
            </div>
            <div className="relative max-w-sm w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Cari siswa/kelas..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Kelas</th>
                  <th className="px-6 py-4">Wali Kelas</th>
                  <th className="px-6 py-4 text-center">Total Siswa</th>
                  <th className="px-6 py-4 text-center">Hadir</th>
                  <th className="px-6 py-4 text-center">Sakit</th>
                  <th className="px-6 py-4 text-center">Izin</th>
                  <th className="px-6 py-4 text-center">Alpa</th>
                  <th className="px-6 py-4 text-center">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                {[
                  { kelas: 'X-1', wali: 'Ahmad Hidayat, S.Pd', total: 32, h: 30, s: 1, i: 1, a: 0, pct: '93.7' },
                  { kelas: 'X-2', wali: 'Budi Santoso, M.Pd', total: 30, h: 30, s: 0, i: 0, a: 0, pct: '100' },
                  { kelas: 'XI-IPA-1', wali: 'Siti Aminah, S.Si', total: 35, h: 32, s: 0, i: 0, a: 3, pct: '91.4' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-black text-slate-800 dark:text-white">{item.kelas}</td>
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">{item.wali}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-500 dark:text-slate-400">{item.total}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">{item.h}</td>
                    <td className="px-6 py-4 text-center font-bold text-amber-500 dark:text-amber-400">{item.s}</td>
                    <td className="px-6 py-4 text-center font-bold text-blue-500 dark:text-blue-400">{item.i}</td>
                    <td className="px-6 py-4 text-center font-bold text-red-500 dark:text-red-400">{item.a}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${Number(item.pct) < 95 ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'}`}>
                        {item.pct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
