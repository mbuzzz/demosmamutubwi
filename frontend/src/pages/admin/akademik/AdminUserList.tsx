import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, Filter, Upload, Download } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminUserList() {
  const [activeTab, setActiveTab] = useState('semua');
  
  const tabs = [
    { id: 'semua', label: 'Semua User' },
    { id: 'guru', label: 'Guru & Karyawan' },
    { id: 'siswa', label: 'Siswa' },
    { id: 'admin', label: 'Admin' },
  ];

  return (
    <AdminLayout title="Manajemen Pengguna (Users)">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card dark:shadow-none border border-transparent dark:border-slate-800 overflow-hidden">
        
        {/* Tabs & Import/Export Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 px-2 sm:px-0 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-900/50">
          <div className="flex overflow-x-auto custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-[3px] transition-colors ${
                  activeTab === tab.id 
                    ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 p-3 sm:p-0 sm:pr-4 bg-white dark:bg-slate-900 dark:bg-transparent">
            <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-sm">
              <Download className="w-4 h-4" /> Export Excel
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-500/30 shadow-sm">
              <Upload className="w-4 h-4" /> Import Excel
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative max-w-sm w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari nama, email, NIP/NISN..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium dark:text-white transition-all"
              />
            </div>
            <button className="p-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-sm">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <Link to="/panel/users/tambah" className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95 shrink-0 shadow-sm shadow-indigo-600/20">
            <Plus className="w-4 h-4" /> Tambah User Baru
          </Link>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider">
              <tr>
                <th className="px-6 py-5">Nama Lengkap</th>
                <th className="px-6 py-5">NIP / NISN</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5">Info Tambahan</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-sm shadow-inner">
                      AH
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white text-sm">Ahmad Hidayat, S.Pd</div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">ahmad@smasmuh1.sch.id</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">198001012005011002</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-500/20">Guru</span>
                </td>
                <td className="px-6 py-4 font-medium">Guru Matematika</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-sm shadow-inner">
                      SN
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white text-sm">Siti Nurhaliza</div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">siti.siswa@smasmuh1.sch.id</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">0051234567</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-500/20">Siswa</span>
                </td>
                <td className="px-6 py-4 font-medium">Kelas X-1</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 dark:bg-slate-900/30">
          <div>Menampilkan 1-2 dari 2 data</div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 dark:text-slate-400 cursor-not-allowed font-bold">Seb</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-sm font-bold">1</button>
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 dark:text-slate-400 cursor-not-allowed font-bold">Sel</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
