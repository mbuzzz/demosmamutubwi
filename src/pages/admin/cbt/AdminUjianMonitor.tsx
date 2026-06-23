import AdminLayout from '../../../components/admin/AdminLayout';
import { ArrowLeft, Clock, Users, CheckCircle, RefreshCcw, AlertOctagon, StopCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminUjianMonitor() {
  return (
    <AdminLayout title="Live Monitoring Ujian">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/panel/cbt/jadwal" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Jadwal
        </Link>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
          <StopCircle className="w-4 h-4 text-red-500" /> Akhiri Ujian Secara Paksa
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Kolom Kiri: Info Ujian */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-indigo-600 rounded-[20px] shadow-sm p-6 text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white dark:bg-slate-900/10 rounded-full blur-2xl"></div>
            
            <h3 className="font-black text-xl mb-1 leading-tight relative z-10">PTS Ganjil Matematika</h3>
            <p className="text-indigo-200 text-sm font-semibold mb-6 relative z-10">Kelas X-1 • 40 Soal PG</p>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-white dark:bg-slate-900/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Sisa Waktu Ujian</div>
                <div className="text-2xl font-black tabular-nums">45:20</div>
              </div>
              
              <div className="bg-white dark:bg-slate-900/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Status Peserta</div>
                <div className="flex justify-between items-end mt-2">
                  <div>
                    <div className="text-2xl font-black leading-none">32</div>
                    <div className="text-[10px] font-bold text-indigo-200 mt-1">Total Siswa</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-300">15 Selesai</div>
                    <div className="text-sm font-bold text-amber-300">17 Mengerjakan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Siswa Live */}
        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-bold text-slate-800 dark:text-white">Status Live Peserta</h3>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Manual
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Nama Siswa</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Soal Dijawab</th>
                    <th className="px-6 py-4 text-center">IP Address</th>
                    <th className="px-6 py-4 text-right">Aksi Darurat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-white">Agus Setiawan</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">NISN: 0081234501</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" /> Selesai
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-slate-800 dark:text-slate-200">40 / 40</div>
                      <div className="text-[10px] text-emerald-500 font-bold mt-0.5">Skor: 92.5</div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-xs text-slate-400">192.168.1.101</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-200 dark:border-slate-700" title="Ulangi Ujian">
                        <RefreshCcw className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-white">Budi Raharjo</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">NISN: 0081234502</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-xs font-bold border border-amber-100 dark:border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Mengerjakan
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-slate-800 dark:text-slate-200">28 / 40</div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 max-w-[80px] mx-auto overflow-hidden">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-xs text-slate-400">192.168.1.105</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors border border-red-100 dark:border-red-500/20 flex items-center gap-1 ml-auto">
                        <AlertOctagon className="w-3.5 h-3.5" /> Force Submit
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/30 transition-colors opacity-60">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-white">Citra Kirana</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">NISN: 0081234503</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-700">
                        Belum Login
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400">-</td>
                    <td className="px-6 py-4 text-center text-slate-400">-</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 cursor-not-allowed">
                        Force Submit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
