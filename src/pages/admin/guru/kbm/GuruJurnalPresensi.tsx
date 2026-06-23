import AdminLayout from '../../../../components/admin/AdminLayout';
import { CalendarDays, Save, Search, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuruJurnalPresensi() {
  return (
    <AdminLayout title="Jurnal Mengajar & Presensi Kelas">
      
      {/* Card Filter Guru */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="flex-1 min-w-[250px] bg-indigo-600 border-2 border-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-600/20 text-left transition-transform active:scale-95">
          <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CalendarDays className="w-4 h-4"/> Sesi Saat Ini</div>
          <h3 className="text-xl font-black">Matematika X-1</h3>
          <p className="text-sm font-medium text-indigo-100 mt-1">Senin, 07:00 - 08:30 WIB</p>
        </button>
        <button className="flex-1 min-w-[250px] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400 dark:hover:border-indigo-500 text-left transition-all group">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CalendarDays className="w-4 h-4"/> Sesi Berikutnya</div>
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Matematika X-2</h3>
          <p className="text-sm font-medium text-slate-500 mt-1">Senin, 08:30 - 10:00 WIB</p>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Form Jurnal Materi */}
        <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Input Materi Pembelajaran</h3>
          <div className="space-y-4 max-w-3xl">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pokok Bahasan / Topik Hari Ini</label>
              <input type="text" placeholder="Contoh: Sifat-sifat Logaritma Lanjutan" className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white shadow-sm" />
            </div>
          </div>
        </div>

        {/* Tabel Absensi */}
        <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Kehadiran Siswa Kelas X-1</h3>
              <p className="text-sm text-slate-500 mt-1">Semua siswa default Hadir. Ubah jika ada yang berhalangan.</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              <Save className="w-4 h-4" /> Simpan Jurnal & Absen
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 w-16 text-center">No</th>
                  <th className="px-6 py-4">Nama Siswa</th>
                  <th className="px-6 py-4 text-center">Hadir (H)</th>
                  <th className="px-6 py-4 text-center">Sakit (S)</th>
                  <th className="px-6 py-4 text-center">Izin (I)</th>
                  <th className="px-6 py-4 text-center">Alpa (A)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                {[
                  { id: 1, nama: 'Agus Setiawan' },
                  { id: 2, nama: 'Budi Raharjo' },
                  { id: 3, nama: 'Citra Kirana' },
                ].map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-center text-slate-400 font-bold">{siswa.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{siswa.nama}</td>
                    <td className="px-6 py-4 text-center">
                      <input type="radio" name={`status-${siswa.id}`} defaultChecked className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input type="radio" name={`status-${siswa.id}`} className="w-5 h-5 text-amber-500 focus:ring-amber-500 cursor-pointer" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input type="radio" name={`status-${siswa.id}`} className="w-5 h-5 text-blue-500 focus:ring-blue-500 cursor-pointer" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <input type="radio" name={`status-${siswa.id}`} className="w-5 h-5 text-red-500 focus:ring-red-500 cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Riwayat Jurnal Sebelumnya */}
        <div className="p-6 lg:p-8 bg-slate-50/30 dark:bg-slate-900">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Riwayat Jurnal Sebelumnya</h3>
            <div className="relative max-w-sm w-64 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Cari topik jurnal..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 1, tanggal: 'Senin, 15 Jul 2024', topik: 'Sifat-Sifat Logaritma Lanjutan', hadir: 30, total: 32 },
              { id: 2, tanggal: 'Rabu, 10 Jul 2024', topik: 'Pengenalan Logaritma Dasar', hadir: 32, total: 32 },
            ].map(j => (
              <div key={j.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors group flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarDays className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{j.tanggal}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{j.topik}</h4>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    {j.hadir}/{j.total} Siswa Hadir
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/panel/guru/jurnal/detail/${j.id}`} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 rounded-lg"><Eye className="w-4 h-4" /></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
