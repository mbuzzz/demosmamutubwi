import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Calendar, Users, DollarSign, Save, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminGelombangList() {
  const [showForm, setShowForm] = useState(false);

  return (
    <AdminLayout title="Pengaturan Gelombang SPMB">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Table View */}
        <div className={`bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 ${showForm ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white">Daftar Gelombang Pendaftaran</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Atur jadwal, kuota, dan biaya per gelombang.</p>
            </div>
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah Gelombang Baru
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Nama Gelombang</th>
                  <th className="px-6 py-4">Periode Tanggal</th>
                  <th className="px-6 py-4">Kuota & Pendaftar</th>
                  <th className="px-6 py-4">Biaya</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50">
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">Gelombang Inden</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">1 Jan 2024<br/>s/d 28 Feb 2024</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1 max-w-[120px]">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <div className="text-[11px] font-medium mt-1.5 text-slate-500 dark:text-slate-400">45 / 100 Siswa Terisi</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-600">Rp 100.000</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-medium border border-emerald-100">Sedang Aktif</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50 opacity-60">
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">Gelombang 1 Reguler</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">1 Mar 2024<br/>s/d 30 Apr 2024</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1 max-w-[120px]">
                      <div className="bg-slate-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="text-[11px] font-medium mt-1.5 text-slate-500 dark:text-slate-400">0 / 150 Siswa Terisi</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">Rp 150.000</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700">Menunggu Jadwal</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Form Sidebar */}
        {showForm && (
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white">Tambah Gelombang Baru</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Nama Gelombang</label>
                <input type="text" placeholder="Contoh: Gelombang 2 Reguler" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Tgl Buka</label>
                  <input type="date" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Tgl Tutup</label>
                  <input type="date" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Kuota (Kursi)</label>
                  <input type="number" placeholder="Misal: 100" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5 flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" /> Biaya (Rp)</label>
                  <input type="number" placeholder="Misal: 150000" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Status Aktif?</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="aktif">Aktif (Tampil di Publik)</option>
                  <option value="draft">Draft (Menunggu Jadwal)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  <Save className="w-4 h-4" /> Simpan Gelombang
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
