import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { BarChart3, Download, Search } from 'lucide-react';
import { MOCK_REKAP_ABSENSI } from '../../../types/absensi';

export default function AdminRekapAbsensi() {
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');

  const kelasList = [...new Set(MOCK_REKAP_ABSENSI.map(r => r.kelas))];
  const filtered = MOCK_REKAP_ABSENSI.filter(r => {
    if (filterKelas && r.kelas !== filterKelas) return false;
    if (search && !r.nama.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalHadir = filtered.reduce((a, r) => a + r.hadir, 0);
  const totalAlpha = filtered.reduce((a, r) => a + r.alpha, 0);
  const totalTerlambat = filtered.reduce((a, r) => a + r.terlambat, 0);
  const rataKehadiran = filtered.length > 0 ? Math.round(totalHadir / (totalHadir + totalAlpha + totalTerlambat) * 100) : 0;

  return (
    <AdminLayout title="Rekap Absensi Siswa">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Rata-rata Kehadiran</p>
          <h3 className="text-3xl font-black mt-1">{rataKehadiran}%</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Hadir</p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{totalHadir}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Terlambat</p>
          <h3 className="text-3xl font-black text-orange-500 mt-1">{totalTerlambat}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Alpha</p>
          <h3 className="text-3xl font-black text-red-500 mt-1">{totalAlpha}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            Semester Ganjil 2025/2026
          </div>
          <div className="flex-1" />
          <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 dark:text-slate-300">
            <option value="">Semua Kelas</option>
            {kelasList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari siswa..." className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40" />
          </div>
          <button className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
              <tr><th className="px-5 py-4">Nama</th><th className="px-5 py-4">Kelas</th><th className="px-5 py-4 text-center">Hadir</th><th className="px-5 py-4 text-center">Izin</th><th className="px-5 py-4 text-center">Sakit</th><th className="px-5 py-4 text-center">Alpha</th><th className="px-5 py-4 text-center">Terlambat</th><th className="px-5 py-4 text-center">%</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filtered.map(r => {
                const total = r.hadir + r.alpha + r.terlambat + r.izin + r.sakit;
                const persen = total > 0 ? Math.round(r.hadir / total * 100) : 0;
                const warna = persen >= 95 ? 'text-emerald-600' : persen >= 85 ? 'text-amber-600' : 'text-red-600';
                return (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{r.nama}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{r.kelas}</td>
                    <td className="px-5 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">{r.hadir}</td>
                    <td className="px-5 py-4 text-center font-semibold text-blue-600">{r.izin}</td>
                    <td className="px-5 py-4 text-center font-semibold text-amber-600">{r.sakit}</td>
                    <td className="px-5 py-4 text-center font-bold text-red-600 dark:text-red-400">{r.alpha}</td>
                    <td className="px-5 py-4 text-center font-semibold text-orange-600">{r.terlambat}</td>
                    <td className="px-5 py-4 text-center font-black text-lg"><span className={warna}>{persen}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
