import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, LineChart, TrendingUp, TrendingDown, Eye } from 'lucide-react';

export default function AdminNilaiEntry() {
  return (
    <AdminLayout title="Ledger Nilai Akhir">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
            <LineChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Rata-rata Paralel</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">84.2</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Nilai Tertinggi</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">98.5</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Siswa Remedial</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">4 Siswa</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Filter Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Tahun & Semester</label>
            <select className="w-full sm:w-48 px-4 py-2.5 bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
              <option>2023/2024 - Ganjil</option>
              <option>2023/2024 - Genap</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Filter Kelas</label>
            <select className="w-full sm:w-32 px-4 py-2.5 bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 dark:text-indigo-400">
              <option>X-1</option>
              <option>XI-IPA-1</option>
            </select>
          </div>
          <div className="w-full sm:w-auto flex items-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              Tampilkan Ledger
            </button>
          </div>
        </div>
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <div className="relative max-w-sm w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari nama siswa..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-slate-200 dark:border-slate-700">
              Export Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-y border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 w-16 text-center">No</th>
                <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 min-w-[200px]">Nama Lengkap</th>
                <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 text-center w-24">MTK</th>
                <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 text-center w-24">B. INDO</th>
                <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 text-center w-24">FISIKA</th>
                <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 text-center w-24">Rata2</th>
                <th className="px-4 py-3 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
              {[
                { id: 1, nama: 'Agus Setiawan', n1: 85.5, n2: 90.0, n3: 88.0, avg: 87.8 },
                { id: 2, nama: 'Budi Raharjo', n1: 74.5, n2: 82.0, n3: 76.5, avg: 77.6 },
                { id: 3, nama: 'Citra Kirana', n1: 92.0, n2: 88.5, n3: 95.0, avg: 91.8 },
              ].map((siswa) => (
                <tr key={siswa.id} className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-400 font-bold border-r border-slate-100 dark:border-slate-800">{siswa.id}</td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-white border-r border-slate-100 dark:border-slate-800">{siswa.nama}</td>
                  <td className={`px-4 py-3 text-center font-bold border-r border-slate-100 dark:border-slate-800 ${siswa.n1 < 75 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>{siswa.n1}</td>
                  <td className={`px-4 py-3 text-center font-bold border-r border-slate-100 dark:border-slate-800 ${siswa.n2 < 75 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>{siswa.n2}</td>
                  <td className={`px-4 py-3 text-center font-bold border-r border-slate-100 dark:border-slate-800 ${siswa.n3 < 75 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>{siswa.n3}</td>
                  <td className="px-4 py-3 text-center font-black text-indigo-600 dark:text-indigo-400 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/30">{siswa.avg}</td>
                  <td className="px-4 py-3 text-center">
                    <button className="p-1.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
