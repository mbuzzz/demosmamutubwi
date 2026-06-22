import AdminLayout from '../../../../components/admin/AdminLayout';
import { ArrowLeft, BookOpen, Download, Users, CheckCircle, Clock, Eye, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuruMateriDetail() {
  return (
    <AdminLayout title="Detail Materi Pembelajaran">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link to="/panel/guru/materi" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Bank Materi
        </Link>
        <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
          <Edit className="w-4 h-4" /> Edit Materi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Kolom Kiri: Preview Konten Materi */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-1">Bab 1 - Sifat Logaritma</h2>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Matematika Wajib • Dipublikasikan: 12 Jul 2024</p>
              </div>
            </div>

            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-8">
              <p>Assalamualaikum wr wb. Anak-anakku kelas X-1,</p>
              <p>Hari ini kita akan mempelajari materi lanjutan tentang Sifat-sifat Logaritma. Silakan baca rangkuman di bawah ini, lalu pelajari modul PDF yang telah Bapak lampirkan.</p>
              <br/>
              <h3>Sifat Dasar yang Harus Diingat:</h3>
              <ol>
                <li><sup>a</sup>log(b × c) = <sup>a</sup>log b + <sup>a</sup>log c</li>
                <li><sup>a</sup>log(b / c) = <sup>a</sup>log b - <sup>a</sup>log c</li>
                <li><sup>a</sup>log b<sup>n</sup> = n × <sup>a</sup>log b</li>
              </ol>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Lampiran File Pembelajaran</h4>
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center rounded-lg font-black text-[10px]">PDF</div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-white text-sm">Modul_Logaritma_X.pdf</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">2.4 MB</div>
                  </div>
                </div>
                <button className="p-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 rounded-lg transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Monitoring Akses Siswa */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" /> Log Akses Siswa
            </h3>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Progress Membaca (X-1)</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">30 / 32 Siswa</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '93%' }}></div>
              </div>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
              {/* Siswa 1 */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    AS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">Agus Setiawan</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> Hari ini, 08:15</div>
                  </div>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>

              {/* Siswa 2 */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                    BR
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">Budi Raharjo</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> Hari ini, 09:20</div>
                  </div>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>

              {/* Siswa 3 (Belum) */}
              <div className="flex items-center justify-between p-3 bg-red-50/50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold text-xs">
                    CK
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">Citra Kirana</div>
                    <div className="text-[10px] text-red-500 font-bold mt-0.5">Belum Membaca</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
