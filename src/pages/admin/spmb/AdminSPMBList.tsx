import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Eye, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminSPMBList() {
  return (
    <AdminLayout title="Data Pendaftar SPMB">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card dark:shadow-none border border-transparent dark:border-slate-800 overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-900/50">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari nama, NISN, No Reg..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <select className="px-4 py-2.5 bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all">
              <option value="">Semua Gelombang</option>
              <option value="1">Gelombang Inden</option>
              <option value="2">Gelombang 1</option>
            </select>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95 shrink-0 shadow-sm shadow-emerald-600/20">
              Export Data Excel
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-white dark:bg-slate-900 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-5">No. Registrasi</th>
                <th className="px-6 py-5">Data Calon Siswa</th>
                <th className="px-6 py-5">Asal Sekolah</th>
                <th className="px-6 py-5">Jalur & Gelombang</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4 font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">REG-2024-001</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 dark:text-white text-sm mb-1">Muhammad Rizki</div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono mb-0.5">NISN: 0081234567</div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">081234567890</div>
                </td>
                <td className="px-6 py-4 font-semibold">SMPN 1 Banyuwangi</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Prestasi Akademik</div>
                  <div className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400">Gelombang Inden</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold border border-amber-200 dark:border-amber-500/20 inline-block">
                    Verifikasi Berkas
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to="/panel/spmb/detail/1" className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20" title="Verifikasi">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4 font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">REG-2024-002</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 dark:text-white text-sm mb-1">Aisyah Nur Fitri</div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 font-mono mb-0.5">NISN: 0092345678</div>
                  <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">085234567891</div>
                </td>
                <td className="px-6 py-4 font-semibold">MTs Negeri 2 Banyuwangi</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Reguler</div>
                  <div className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400">Gelombang 1</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-200 dark:border-emerald-500/20 inline-flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3" /> Diterima
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to="/panel/spmb/detail/2" className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20" title="Verifikasi">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

