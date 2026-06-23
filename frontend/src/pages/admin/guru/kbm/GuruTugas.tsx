import AdminLayout from '../../../../components/admin/AdminLayout';
import { Search, FileText, UploadCloud, Edit, Plus, ArrowLeft, Save, AlignLeft, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function GuruTugas() {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [content, setContent] = useState('');

  if (view === 'form') {
    return (
      <AdminLayout title="Buat Penugasan Baru">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Tugas
          </button>
          <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <Save className="w-4 h-4" /> Publikasikan Tugas
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-amber-500" /> Instruksi & Deskripsi Tugas
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Judul Tugas</label>
                  <input type="text" placeholder="Contoh: PR LKS Halaman 24" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium dark:text-white transition-colors" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Instruksi Detail (Opsional)</label>
                  <div className="bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden quill-custom-dark transition-colors">
                    <ReactQuill theme="snow" value={content} onChange={setContent} className="h-64 pb-10" placeholder="Ketik instruksi langkah pengerjaan atau format jawaban di sini..." />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Pengaturan Waktu & File</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Target Kelas</label>
                  <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium dark:text-white">
                    <option>Matematika Wajib - X-1</option>
                    <option>Semua Kelas X (X-1 & X-2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4"/> Batas Pengumpulan (Deadline)</label>
                  <input type="datetime-local" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700 dark:text-slate-300 dark:text-white" />
                </div>

                <div className="pt-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                    Lampiran File / Lembar Kerja
                  </label>
                  <div className="border-2 border-dashed border-amber-200 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-500/5 rounded-2xl p-6 text-center hover:bg-amber-100/50 dark:hover:bg-amber-500/10 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-white dark:bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-sm font-bold text-amber-900 dark:text-amber-400">Upload Lampiran Soal</p>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">Maks. 5MB per file</p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-amber-500 focus:ring-amber-500 rounded border-slate-300 dark:border-slate-600" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Wajibkan Siswa Upload File Jawaban</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manajemen Penugasan Siswa">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="w-full sm:w-64">
            <select className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white shadow-sm">
              <option>Matematika Wajib - X-1</option>
              <option>Matematika Wajib - X-2</option>
            </select>
          </div>
        </div>
        <button onClick={() => setView('form')} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
          <Plus className="w-4 h-4" /> Buat Tugas Baru
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/30 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-amber-500" /> Daftar Tugas (Kelas X-1)</h3>
          <div className="relative max-w-sm w-64 hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari judul tugas..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium dark:text-white" />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Card Tugas Aktif */}
            <div className="flex items-start gap-4 p-5 border-2 border-amber-200 dark:border-amber-500/30 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/50 transition-colors group bg-amber-50/30 dark:bg-amber-500/5">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-800 dark:text-white leading-tight">PR LKS Hal 24-25</h4>
                  <span className="text-[10px] bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold animate-pulse">Berlangsung</span>
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Tenggat: Besok, 23:59 WIB</div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-lg w-fit">
                  25/32 Telah Mengumpulkan
                </div>
              </div>
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link to="/panel/guru/tugas/detail/1" className="p-2 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-900 dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" title="Review Jawaban"><Search className="w-4 h-4" /></Link>
                <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-900 dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" title="Edit Tugas"><Edit className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Card Tugas Selesai */}
            <div className="flex items-start gap-4 p-5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/50 transition-colors group bg-white dark:bg-slate-900 opacity-70 hover:opacity-100">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-800 dark:text-white leading-tight">Tugas Bab 1: Eksponen</h4>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">Ditutup</span>
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Tenggat: 15 Jul 2024</div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg w-fit">
                  Selesai Dinilai
                </div>
              </div>
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 rounded-lg" title="Lihat Rekap"><Search className="w-4 h-4" /></button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
