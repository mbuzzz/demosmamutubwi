import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminBeritaList() {
  return (
    <AdminLayout title="Manajemen Berita">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari berita..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <Link to="/panel/berita/tambah" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Tambah Berita
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Judul Berita</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Tanggal Publish</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Prestasi Gemilang Siswa di OSN 2024</td>
                <td className="px-6 py-4"><span className="px-2.5 sm:px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium whitespace-nowrap">Prestasi</span></td>
                <td className="px-6 py-4">12 Jan 2024</td>
                <td className="px-6 py-4"><span className="px-2.5 sm:px-3 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-medium whitespace-nowrap">Published</span></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              {/* More rows would go here */}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div>Menampilkan 1-1 dari 1 data</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-slate-400 dark:text-slate-500 dark:text-slate-400 cursor-not-allowed">Seb</button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded">1</button>
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded text-slate-400 dark:text-slate-500 dark:text-slate-400 cursor-not-allowed">Sel</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
