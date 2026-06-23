import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminKategoriList() {
  return (
    <AdminLayout title="Manajemen Kategori Berita">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari kategori..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Tambah Kategori
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 items-start">
          
          {/* Quick Add Form on the side */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">Tambah Kategori Cepat</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Nama Kategori</label>
                <input type="text" placeholder="Contoh: Prestasi Siswa" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Deskripsi Singkat</label>
                <textarea rows={3} placeholder="Deskripsi opsional..." className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>
              <button type="button" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Simpan Kategori
              </button>
            </form>
          </div>

          {/* Table Area */}
          <div className="md:col-span-2 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Nama Kategori</th>
                    <th className="px-6 py-4">Slug URL</th>
                    <th className="px-6 py-4">Jumlah Berita</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white dark:bg-slate-900">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">Berita Utama</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">berita-utama</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md font-medium">12 Artikel</span></td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">Prestasi</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">prestasi</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md font-medium">5 Artikel</span></td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">Pengumuman</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">pengumuman</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md font-medium">8 Artikel</span></td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
