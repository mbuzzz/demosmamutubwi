import AdminLayout from '../../../../components/admin/AdminLayout';
import { ArrowLeft, FileText, Download, CheckCircle, Clock, XCircle, Search, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuruTugasDetail() {
  return (
    <AdminLayout title="Detail Penugasan">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link to="/panel/guru/tugas" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Tugas
        </Link>
        <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
          <Edit className="w-4 h-4" /> Edit Instruksi Tugas
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Info Tugas Utama */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
            <div className="flex items-start gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-white leading-tight mb-1">PR LKS Hal 24-25</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Matematika Wajib • Kelas X-1</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status Tenggat Waktu</div>
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit">
                  <Clock className="w-4 h-4" /> Masih Dibuka (Besok, 23:59)
                </div>
              </div>
              
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Statistik Pengumpulan</div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-2 mb-1.5">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>25 Mengumpulkan</span>
                  <span>7 Belum</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Instruksi Tugas</div>
                <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 prose prose-sm dark:prose-invert">
                  <p>Kerjakan LKS halaman 24 sampai 25 bagian Uji Kompetensi A dan B.</p>
                  <p>Foto hasil pengerjaan di buku tulis, pastikan tulisan terbaca jelas, lalu upload ke sini dalam format PDF atau JPG.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Koreksi dan Pengumpulan */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Daftar Pengumpulan Siswa
              </h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Cari siswa..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white transition-colors" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-4">Nama Siswa</th>
                    <th className="px-5 py-4">Status & Waktu</th>
                    <th className="px-5 py-4 text-center">File Jawaban</th>
                    <th className="px-5 py-4 w-32 text-center">Beri Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  
                  {/* Siswa 1: Mengumpulkan Tepat Waktu */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800 dark:text-white">Agus Setiawan</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">NISN: 0081234501</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md mb-1">
                        <CheckCircle className="w-3 h-3" /> Tepat Waktu
                      </span>
                      <div className="text-[10px] text-slate-500">Hari ini, 09:14 WIB</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <input type="number" placeholder="0" defaultValue="90" className="w-16 px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </td>
                  </tr>

                  {/* Siswa 2: Mengumpulkan Terlambat */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800 dark:text-white">Budi Raharjo</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">NISN: 0081234502</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-md mb-1">
                        <Clock className="w-3 h-3" /> Terlambat
                      </span>
                      <div className="text-[10px] text-slate-500">Hari ini, 20:10 WIB</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20">
                        <Download className="w-3.5 h-3.5" /> JPG
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <input type="number" placeholder="0" className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                    </td>
                  </tr>

                  {/* Siswa 3: Belum Mengumpulkan */}
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors opacity-70">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800 dark:text-white">Citra Kirana</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">NISN: 0081234503</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-md mb-1">
                        <XCircle className="w-3 h-3" /> Belum
                      </span>
                      <div className="text-[10px] text-slate-500">-</div>
                    </td>
                    <td className="px-5 py-4 text-center text-xs text-slate-400 font-bold">
                      Kosong
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <input type="number" placeholder="0" disabled className="w-16 px-2 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-bold text-slate-400 cursor-not-allowed" />
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-800/30">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                Simpan Semua Nilai
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
