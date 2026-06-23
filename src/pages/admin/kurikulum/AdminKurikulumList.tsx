import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminKurikulumList() {
  return (
    <AdminLayout title="Manajemen Kurikulum">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari kurikulum..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Link to="/panel/kurikulum/tambah" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Tambah Kurikulum
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Nama Kurikulum</th>
                <th className="px-6 py-4">Tahun Mulai</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Keterangan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Kurikulum Merdeka</td>
                <td className="px-6 py-4">2023/2024</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-medium border border-emerald-100 flex items-center gap-1 w-fit">
                    <CheckCircle className="w-3 h-3" /> Aktif
                  </span>
                </td>
                <td className="px-6 py-4">Diterapkan untuk Kelas X & XI</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Kurikulum 2013 (K13)</td>
                <td className="px-6 py-4">2013/2014</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700 w-fit block">Tidak Aktif</span>
                </td>
                <td className="px-6 py-4">Hanya untuk Kelas XII</td>
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
