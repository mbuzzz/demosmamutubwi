import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminSPMBList() {
  return (
    <AdminLayout title="Data Pendaftar SPMB">
      <div className="bg-white rounded-[15px] shadow-card overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Cari nama, NISN, No Reg..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Semua Gelombang</option>
              <option value="1">Gelombang Inden</option>
              <option value="2">Gelombang 1</option>
            </select>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
              Export Data
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">No. Registrasi</th>
                <th className="px-6 py-4">Data Calon Siswa</th>
                <th className="px-6 py-4">Asal Sekolah</th>
                <th className="px-6 py-4">Jalur & Gelombang</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">REG-2024-001</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">Muhammad Rizki</div>
                  <div className="text-xs text-slate-500 mt-0.5">NISN: 0081234567</div>
                  <div className="text-xs text-slate-500">081234567890</div>
                </td>
                <td className="px-6 py-4">SMPN 1 Banyuwangi</td>
                <td className="px-6 py-4">
                  <div>Prestasi Akademik</div>
                  <div className="text-xs text-indigo-600 font-medium">Gelombang Inden</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md text-xs font-medium border border-amber-100">Verifikasi Berkas</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to="/panel/spmb/detail/1" className="inline-flex p-1.5 text-slate-400 hover:text-indigo-600"><Eye className="w-4 h-4" /></Link>
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
