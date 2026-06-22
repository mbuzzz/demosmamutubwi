import AdminLayout from '../../../../components/admin/AdminLayout';
import { Save, CalendarDays, Search } from 'lucide-react';

export default function AdminKehadiranSiswa() {
  return (
    <AdminLayout title="Input Presensi / Kehadiran Siswa">
      <div className="bg-white rounded-[15px] shadow-card overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Tanggal Presensi</label>
            <input type="date" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Pilih Kelas</label>
            <select className="w-full sm:w-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700">
              <option>X-1</option>
              <option>XI-IPA-1</option>
            </select>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
            Tampilkan Data
          </button>
        </div>

        {/* Tabel Input */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-indigo-500" />
              <div>
                <h3 className="font-bold text-slate-800">Presensi Kelas X-1</h3>
                <p className="text-xs text-slate-500">Senin, 15 Juli 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative max-w-sm w-48">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Cari siswa..." className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                <Save className="w-4 h-4" /> Simpan Kehadiran
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-bold">
                <tr>
                  <th className="px-4 py-3 w-16 text-center">No</th>
                  <th className="px-4 py-3">NISN</th>
                  <th className="px-4 py-3">Nama Siswa</th>
                  <th className="px-4 py-3 text-center">Hadir (H)</th>
                  <th className="px-4 py-3 text-center">Sakit (S)</th>
                  <th className="px-4 py-3 text-center">Izin (I)</th>
                  <th className="px-4 py-3 text-center">Alpa (A)</th>
                  <th className="px-4 py-3">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 1, nisn: '0081234501', nama: 'Agus Setiawan' },
                  { id: 2, nisn: '0081234502', nama: 'Budi Raharjo' },
                  { id: 3, nisn: '0081234503', nama: 'Citra Kirana' },
                ].map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-center text-slate-500">{siswa.id}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{siswa.nisn}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{siswa.nama}</td>
                    <td className="px-4 py-3 text-center">
                      <input type="radio" name={`status-${siswa.id}`} defaultChecked className="w-4 h-4 text-emerald-500 focus:ring-emerald-500" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input type="radio" name={`status-${siswa.id}`} className="w-4 h-4 text-amber-500 focus:ring-amber-500" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input type="radio" name={`status-${siswa.id}`} className="w-4 h-4 text-blue-500 focus:ring-blue-500" />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input type="radio" name={`status-${siswa.id}`} className="w-4 h-4 text-red-500 focus:ring-red-500" />
                    </td>
                    <td className="px-4 py-3">
                      <input type="text" placeholder="Catatan opsional..." className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
