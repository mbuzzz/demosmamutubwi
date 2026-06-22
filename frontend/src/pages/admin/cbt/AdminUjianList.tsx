import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Calendar, Clock, MonitorPlay, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminUjianList() {
  return (
    <AdminLayout title="Jadwal & Sesi Ujian (CBT)">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Daftar Sesi Ujian Aktif</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Jadwalkan ujian dan bagikan token kepada siswa.</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <Plus className="w-4 h-4" /> Jadwalkan Ujian Baru
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Ujian & Kelas</th>
                <th className="px-6 py-4">Waktu Pelaksanaan</th>
                <th className="px-6 py-4">Token Akses</th>
                <th className="px-6 py-4">Status Ujian</th>
                <th className="px-6 py-4 text-right">Aksi & Monitor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 dark:text-white mb-1">PTS Ganjil Matematika X-1</div>
                  <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Pilihan Ganda (40 Soal)</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1"><Calendar className="w-3.5 h-3.5"/> 22 Okt 2024</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500"><Clock className="w-3.5 h-3.5"/> 08:00 - 09:30 WIB</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700">MTKX1PTS</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-bold border border-emerald-100 dark:border-emerald-500/20 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sedang Berlangsung
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to="/panel/cbt/monitor" className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-colors border border-indigo-100 dark:border-indigo-500/30">
                      <MonitorPlay className="w-3.5 h-3.5" /> Monitor Live
                    </Link>
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors opacity-70">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 dark:text-white mb-1">Kuis Fisika Kelas XI IPA</div>
                  <div className="text-xs font-semibold text-slate-500">Essay (5 Soal)</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1"><Calendar className="w-3.5 h-3.5"/> 25 Okt 2024</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500"><Clock className="w-3.5 h-3.5"/> 10:00 - 10:45 WIB</div>
                </td>
                <td className="px-6 py-4">
                  <button className="text-xs flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-400 font-bold transition-colors">
                    <KeyRound className="w-3 h-3" /> Generate Token
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-700">
                    Menunggu Waktu
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
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
