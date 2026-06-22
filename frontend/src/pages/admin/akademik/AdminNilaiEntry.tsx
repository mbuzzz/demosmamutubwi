import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Save } from 'lucide-react';

export default function AdminNilaiEntry() {
  return (
    <AdminLayout title="Entry Nilai Siswa">
      <div className="bg-white rounded-[15px] shadow-card overflow-hidden">
        
        {/* Filter Toolbar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Tahun & Semester</label>
            <select className="w-full sm:w-48 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>2023/2024 - Ganjil</option>
              <option>2023/2024 - Genap</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Kelas</label>
            <select className="w-full sm:w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>X-1</option>
              <option>XI-IPA-1</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Mata Pelajaran</label>
            <select className="w-full sm:w-48 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Matematika</option>
              <option>Bahasa Indonesia</option>
            </select>
          </div>
          <div className="w-full sm:w-auto flex items-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Tampilkan Data
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari nama siswa..." className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> Simpan Semua Nilai
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 w-16">No</th>
                <th className="px-6 py-4">NISN</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4 w-32">Nilai Tugas</th>
                <th className="px-6 py-4 w-32">Nilai UTS</th>
                <th className="px-6 py-4 w-32">Nilai UAS</th>
                <th className="px-6 py-4 w-32">Nilai Akhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4 font-mono text-xs">0051234567</td>
                <td className="px-6 py-4 font-medium text-slate-800">Agus Setiawan</td>
                <td className="px-6 py-4"><input type="number" defaultValue="85" className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:border-indigo-500 focus:outline-none" /></td>
                <td className="px-6 py-4"><input type="number" defaultValue="80" className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:border-indigo-500 focus:outline-none" /></td>
                <td className="px-6 py-4"><input type="number" defaultValue="90" className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:border-indigo-500 focus:outline-none" /></td>
                <td className="px-6 py-4 font-bold text-slate-800">85.5</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">2</td>
                <td className="px-6 py-4 font-mono text-xs">0051234568</td>
                <td className="px-6 py-4 font-medium text-slate-800">Budi Raharjo</td>
                <td className="px-6 py-4"><input type="number" defaultValue="75" className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:border-indigo-500 focus:outline-none" /></td>
                <td className="px-6 py-4"><input type="number" defaultValue="70" className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:border-indigo-500 focus:outline-none" /></td>
                <td className="px-6 py-4"><input type="number" defaultValue="78" className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-sm focus:border-indigo-500 focus:outline-none" /></td>
                <td className="px-6 py-4 font-bold text-slate-800">74.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
