import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminMapelList() {
  return (
    <AdminLayout title="Manajemen Mata Pelajaran">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari mata pelajaran..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Tambah Mapel
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Kode Mapel</th>
                <th className="px-6 py-4">Nama Mata Pelajaran</th>
                <th className="px-6 py-4">Kelompok</th>
                <th className="px-6 py-4">Kurikulum</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">MAT-W</td>
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Matematika Wajib</td>
                <td className="px-6 py-4">Muatan Nasional (A)</td>
                <td className="px-6 py-4">Merdeka / K13</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">FIS-P</td>
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Fisika</td>
                <td className="px-6 py-4">Peminatan (C)</td>
                <td className="px-6 py-4">Merdeka</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
