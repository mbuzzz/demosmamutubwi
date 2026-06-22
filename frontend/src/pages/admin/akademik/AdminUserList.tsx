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
      <div className="bg-white rounded-[15px] shadow-card overflow-hidden">
        
        {/* Tabs & Import/Export Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 px-2 sm:px-0">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 p-2 sm:p-0 sm:pr-4">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              <Download className="w-3.5 h-3.5" /> Export Excel
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200">
              <Upload className="w-3.5 h-3.5" /> Import Excel
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative max-w-sm w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari nama, email, NIP/NISN..." 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
              />
            </div>
            <button className="p-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors shrink-0">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <Link to="/panel/users/tambah" className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shrink-0 shadow-sm">
            <Plus className="w-4 h-4" /> Tambah User Baru
          </Link>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">NIP / NISN</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Info Tambahan</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                      AH
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Ahmad Hidayat, S.Pd</div>
                      <div className="text-xs text-slate-500">ahmad@smasmuh1.sch.id</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">198001012005011002</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md text-xs font-medium border border-amber-100">Guru</span>
                </td>
                <td className="px-6 py-4">Guru Matematika</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                      SN
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">Siti Nurhaliza</div>
                      <div className="text-xs text-slate-500">siti.siswa@smasmuh1.sch.id</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">0051234567</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-medium border border-emerald-100">Siswa</span>
                </td>
                <td className="px-6 py-4">Kelas X-1</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Menampilkan 1-2 dari 2 data</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Seb</button>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Sel</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
