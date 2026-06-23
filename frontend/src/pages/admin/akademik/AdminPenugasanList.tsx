import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { useState } from 'react';

export default function AdminPenugasanList() {
  const [activeTab, setActiveTab] = useState('mengajar');

  return (
    <AdminLayout title="Manajemen Penugasan Pegawai">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('mengajar')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'mengajar' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:text-slate-200 hover:border-slate-300 dark:border-slate-600'
            }`}
          >
            Penugasan Mengajar
          </button>
          <button
            onClick={() => setActiveTab('struktural')}
            className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'struktural' 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:text-slate-200 hover:border-slate-300 dark:border-slate-600'
            }`}
          >
            Tugas Struktural (Kepsek, Waka, dll)
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative max-w-sm w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari nama guru..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Tambah Penugasan
          </button>
        </div>
        
        {/* Table Content */}
        {activeTab === 'mengajar' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Nama Guru</th>
                  <th className="px-6 py-4">Mata Pelajaran</th>
                  <th className="px-6 py-4">Kelas yang Diajar</th>
                  <th className="px-6 py-4">Total Jam</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Ahmad Hidayat, S.Pd</td>
                  <td className="px-6 py-4">Matematika</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">X-1</span>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">X-2</span>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">XI-IPA-1</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">24 Jam</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Nama Pegawai</th>
                  <th className="px-6 py-4">Tugas Struktural</th>
                  <th className="px-6 py-4">Hak Akses Panel</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Drs. H. Sugeng, M.Pd</td>
                  <td className="px-6 py-4 font-semibold text-indigo-600">Kepala Sekolah</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium border border-purple-100">Superadmin (All Access)</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">Budi Santoso, S.Kom</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 dark:text-slate-200">Waka Kurikulum</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">Admin Akademik</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
