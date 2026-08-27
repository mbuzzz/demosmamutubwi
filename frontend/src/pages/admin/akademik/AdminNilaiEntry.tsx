import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, LineChart, TrendingUp, TrendingDown, Inbox } from 'lucide-react';
import { useState } from 'react';
import { useKelasList } from '../../../hooks/useKelas';
import { useUsers } from '../../../hooks/useUsers';

export default function AdminNilaiEntry() {
  const { data: kelasList = [] } = useKelasList();
  const [selectedKelas, setSelectedKelas] = useState('');
  const [search, setSearch] = useState('');

  const kelas = (Array.isArray(kelasList) ? kelasList : []).find((k: any) => String(k.id) === selectedKelas);
  const { data: siswaList = [], isLoading: siswaLoading } = useUsers(
    'siswa',
    undefined,
    kelas?.nama || undefined
  );

  const siswa = (Array.isArray(siswaList) ? siswaList : [])
    .filter((s: any) => s.name.toLowerCase().includes(search.toLowerCase()))
    .map((s: any, idx: number) => ({ id: idx + 1, nama: s.name }));

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
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">—</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Nilai Tertinggi</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">—</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Siswa Remedial</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">—</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Filter Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">Pilih Kelas</label>
            <select
              value={selectedKelas}
              onChange={e => setSelectedKelas(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
            >
              <option value="">Pilih kelas...</option>
              {(Array.isArray(kelasList) ? kelasList : []).map((k: any) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-auto flex items-end">
            <button
              disabled={!selectedKelas}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              Tampilkan Ledger
            </button>
          </div>
        </div>
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
          <div className="relative max-w-sm w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          {!selectedKelas ? (
            <div className="text-center py-12">
              <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Pilih kelas untuk menampilkan daftar siswa.
              </p>
            </div>
          ) : siswaLoading ? (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Memuat siswa...</p>
            </div>
          ) : siswa.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Tidak ada siswa di kelas {kelas?.nama}.
              </p>
            </div>
          ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-y border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 w-16 text-center">No</th>
                <th className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 min-w-[200px]">Nama Lengkap</th>
                <th className="px-4 py-3 text-center text-slate-400 font-semibold">Nilai akhir belum tersedia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
              {siswa.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-center text-slate-400 font-bold border-r border-slate-100 dark:border-slate-800">{s.id}</td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-white border-r border-slate-100 dark:border-slate-800">{s.nama}</td>
                  <td className="px-4 py-3 text-center text-slate-400 italic">—</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
