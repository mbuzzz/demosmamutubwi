import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, FileText, Download } from 'lucide-react';

export default function AdminDownloadsList() {
  return (
    <AdminLayout title="Manajemen Pusat Unduhan">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari file dokumen..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Tambah File
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Nama Dokumen</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Ukuran & Tipe</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-500 rounded-lg"><FileText className="w-5 h-5" /></div>
                    <div className="font-medium text-slate-800 dark:text-white">Kalender Akademik 2024/2025</div>
                  </div>
                </td>
                <td className="px-6 py-4">Akademik</td>
                <td className="px-6 py-4 text-xs">1.2 MB (PDF)</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-emerald-600 mr-1" title="Download"><Download className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600 mr-1"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><FileText className="w-5 h-5" /></div>
                    <div className="font-medium text-slate-800 dark:text-white">Brosur PPDB 2024</div>
                  </div>
                </td>
                <td className="px-6 py-4">Informasi Publik</td>
                <td className="px-6 py-4 text-xs">2.5 MB (PDF)</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-emerald-600 mr-1" title="Download"><Download className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600 mr-1"><Edit className="w-4 h-4" /></button>
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
