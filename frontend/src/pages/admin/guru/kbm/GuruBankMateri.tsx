import AdminLayout from '../../../../components/admin/AdminLayout';
import { Search, Trash2, BookOpen, Download, UploadCloud, Eye } from 'lucide-react';

export default function GuruBankMateri() {
  return (
    <AdminLayout title="Bank Materi & Modul Ajar">
      <div className="flex justify-end gap-2 mb-6">
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
          <UploadCloud className="w-4 h-4" /> Upload Materi Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Folder Mata Pelajaran */}
        <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-500/20 hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-indigo-900 dark:text-indigo-400 mb-1">Matematika Wajib X-1</h3>
          <p className="text-sm text-indigo-600 dark:text-indigo-300 font-medium">12 File Materi • 3 Link Video</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Matematika Wajib X-2</h3>
          <p className="text-sm text-slate-500 font-medium">8 File Materi</p>
        </div>

      </div>

      <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">Daftar Materi: Matematika Wajib X-1</h3>
          <div className="relative max-w-sm w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari materi..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white" />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            <div className="flex items-start gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center shrink-0">
                <span className="font-black text-[10px] uppercase">PDF</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 dark:text-white leading-tight mb-1">Bab 1 - Modul Logaritma Lanjutan</h4>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">Diunggah: 12 Jul 2024 • 2.4 MB</div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg w-fit">
                  <Eye className="w-3 h-3" /> Diunduh oleh 30/32 Siswa
                </div>
              </div>
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"><Download className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:text-red-600 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
