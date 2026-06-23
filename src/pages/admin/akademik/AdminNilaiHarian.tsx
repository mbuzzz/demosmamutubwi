import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, CalendarDays, FileText } from 'lucide-react';

export default function AdminNilaiHarian() {
  return (
    <AdminLayout title="Buku Nilai Harian (Guru)">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50/50 flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Tahun & Semester</label>
            <select className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold">
              <option>2024/2025 - Ganjil</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Pilih Kelas</label>
            <select className="w-full sm:w-32 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700">
              <option>X-1</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Mata Pelajaran</label>
            <select className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold">
              <option>Matematika Wajib</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500" /> Komponen Nilai Harian</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Buat tugas/kuis untuk kelas ini. Rata-ratanya akan masuk ke Ledger Rapor.</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              <Plus className="w-4 h-4" /> Buat Tugas Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card Tugas */}
            {[
              { title: 'Tugas Bab 1: Eksponen', date: '15 Jul 2024', status: 'Selesai Dinilai', avg: '82.5' },
              { title: 'Kuis Harian Logaritma', date: '22 Jul 2024', status: 'Selesai Dinilai', avg: '75.0' },
              { title: 'PR LKS Hal 24-25', date: '01 Aug 2024', status: 'Belum Dinilai (Draft)', avg: '-' },
            ].map((tugas, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[15px] p-5 hover:border-indigo-300 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1 leading-tight">{tugas.title}</h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">{tugas.date}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${tugas.avg !== '-' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {tugas.status}
                  </span>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 uppercase">Rata-Rata</div>
                    <div className="font-black text-indigo-700">{tugas.avg}</div>
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
