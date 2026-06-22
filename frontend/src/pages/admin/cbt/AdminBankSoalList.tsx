import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, FileQuestion, Filter } from 'lucide-react';

export default function AdminBankSoalList() {
  return (
    <AdminLayout title="Bank Soal (CBT)">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-end justify-between">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="w-full sm:w-auto">
              <label className="block text-[11px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Mata Pelajaran</label>
              <select className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                <option>Semua Mapel</option>
                <option>Matematika Wajib</option>
                <option>Bahasa Indonesia</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-[11px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Tingkat Kelas</label>
              <select className="w-full sm:w-32 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 dark:text-indigo-400">
                <option>Semua</option>
                <option>Kelas X</option>
                <option>Kelas XI</option>
              </select>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <Plus className="w-4 h-4" /> Buat Paket Soal
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Cari judul paket soal..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card Paket Soal */}
            {[
              { title: 'Penilaian Tengah Semester Ganjil', mapel: 'Matematika Wajib', kelas: 'Kelas X', soal: 40, time: '90 Menit' },
              { title: 'Kuis Logaritma', mapel: 'Matematika Wajib', kelas: 'Kelas X', soal: 15, time: '30 Menit' },
              { title: 'Ujian Akhir Semester Genap', mapel: 'Bahasa Indonesia', kelas: 'Kelas XI', soal: 50, time: '120 Menit' },
            ].map((paket, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[15px] p-5 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-indigo-50 dark:bg-indigo-500/20 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <FileQuestion className="w-5 h-5" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1 leading-tight">{paket.title}</h4>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-4">{paket.mapel} • {paket.kelas}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                    {paket.soal} Butir Soal
                  </span>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Estimasi</div>
                    <div className="font-black text-slate-700 dark:text-slate-300">{paket.time}</div>
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
