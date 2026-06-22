import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminKelasList() {
  return (
    <AdminLayout title="Manajemen Kelas & Jurusan">
      <div className="bg-white rounded-[15px] shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari kelas..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Tambah Kelas
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Tingkat</th>
                <th className="px-6 py-4">Nama Kelas</th>
                <th className="px-6 py-4">Wali Kelas</th>
                <th className="px-6 py-4">Jumlah Siswa</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800">Kelas X</td>
                <td className="px-6 py-4">X-1</td>
                <td className="px-6 py-4 text-indigo-600 font-medium">Budi Santoso, S.Pd</td>
                <td className="px-6 py-4">32 Siswa</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800">Kelas XI (IPA)</td>
                <td className="px-6 py-4">XI-IPA-1</td>
                <td className="px-6 py-4 text-indigo-600 font-medium">Ahmad Hidayat, S.Pd</td>
                <td className="px-6 py-4">30 Siswa</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
