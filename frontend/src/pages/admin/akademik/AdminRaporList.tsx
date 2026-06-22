import AdminLayout from '../../../components/admin/AdminLayout';
import { Printer, Download as DownloadIcon, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminRaporList() {
  return (
    <AdminLayout title="Cetak Rapor Siswa">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card overflow-hidden">
        
        {/* Filter Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50/50 flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Tahun & Semester</label>
            <select className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>2024/2025 - Ganjil</option>
              <option>2024/2025 - Genap</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Kelas</label>
            <select className="w-full sm:w-32 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>X-1</option>
              <option>XI-IPA-1</option>
            </select>
          </div>
          <div className="w-full sm:w-auto flex items-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Tampilkan Daftar Siswa
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <Link to="/panel/rapor/catatan" className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors border border-amber-200">
            <Edit3 className="w-4 h-4" /> Input Catatan Wali Kelas & Ekskul
          </Link>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:text-slate-200 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700">
              <DownloadIcon className="w-4 h-4" /> Export Kumpulan PDF
            </button>
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <Printer className="w-4 h-4" /> Cetak Massal Rapor
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 w-16">No</th>
                <th className="px-6 py-4">NISN</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Status Nilai</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 dark:bg-slate-800/50">
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4 font-mono text-xs">0081234501</td>
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Agus Setiawan</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-medium border border-emerald-100">Lengkap (14 Mapel)</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to="/panel/rapor/cetak/1" className="inline-block p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600" title="Cetak Individu"><Printer className="w-4 h-4" /></Link>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:bg-slate-800/50">
                <td className="px-6 py-4">2</td>
                <td className="px-6 py-4 font-mono text-xs">0081234502</td>
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Budi Raharjo</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md text-xs font-medium border border-amber-100">Kurang 2 Mapel</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to="/panel/rapor/cetak/2" className="inline-block p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600" title="Cetak Individu"><Printer className="w-4 h-4" /></Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
