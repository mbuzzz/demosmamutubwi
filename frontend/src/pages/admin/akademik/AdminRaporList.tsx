import AdminLayout from '../../../components/admin/AdminLayout';
import { Printer, Download as DownloadIcon, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminRaporList() {
  return (
    <AdminLayout title="Cetak Rapor Siswa">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Filter Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Tahun & Semester</label>
            <select className="w-full sm:w-48 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
              <option>2024/2025 - Ganjil</option>
              <option>2024/2025 - Genap</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Kelas</label>
            <select className="w-full sm:w-32 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 dark:text-indigo-400">
              <option>X-1</option>
              <option>XI-IPA-1</option>
            </select>
          </div>
          <div className="w-full sm:w-auto flex items-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              Tampilkan Daftar Siswa
            </button>
          </div>
        </div>

        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900">
          <Link to="/panel/rapor/catatan" className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-amber-200 dark:border-amber-500/20">
            <Edit3 className="w-4 h-4" /> Input Catatan Wali Kelas & Ekskul
          </Link>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-slate-200 dark:border-slate-700">
              <DownloadIcon className="w-4 h-4" /> Export ZIP (PDF)
            </button>
            <button className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-slate-800 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm">
              <Printer className="w-4 h-4" /> Cetak Massal
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-y border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 w-16 text-center border-r border-slate-200 dark:border-slate-700">No</th>
                <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">NISN</th>
                <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">Nama Lengkap</th>
                <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 text-center">Status Kelengkapan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-center font-bold text-slate-400 border-r border-slate-100 dark:border-slate-800">1</td>
                <td className="px-6 py-4 font-mono text-sm border-r border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">0081234501</td>
                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white border-r border-slate-100 dark:border-slate-800">Agus Setiawan</td>
                <td className="px-6 py-4 text-center border-r border-slate-100 dark:border-slate-800">
                  <span className="px-2.5 sm:px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-500/20 whitespace-nowrap">Lengkap (14 Mapel)</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to="/panel/rapor/cetak/1" className="inline-flex p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20" title="Cetak Individu"><Printer className="w-4 h-4" /></Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-center font-bold text-slate-400 border-r border-slate-100 dark:border-slate-800">2</td>
                <td className="px-6 py-4 font-mono text-sm border-r border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">0081234502</td>
                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white border-r border-slate-100 dark:border-slate-800">Budi Raharjo</td>
                <td className="px-6 py-4 text-center border-r border-slate-100 dark:border-slate-800">
                  <span className="px-2.5 sm:px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-500/20 whitespace-nowrap">Kurang 2 Mapel</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to="/panel/rapor/cetak/2" className="inline-flex p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20" title="Cetak Individu"><Printer className="w-4 h-4" /></Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
