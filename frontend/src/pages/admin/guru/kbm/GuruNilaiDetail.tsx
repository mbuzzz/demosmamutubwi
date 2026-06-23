import AdminLayout from '../../../../components/admin/AdminLayout';
import { ArrowLeft, Save, FileText, CheckCircle, Search, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuruNilaiDetail() {
  return (
    <AdminLayout title="Detail Nilai Tugas">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/panel/guru/nilai" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Buku Nilai
        </Link>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-200 dark:border-indigo-500/20">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm active:scale-95">
            <Save className="w-4 h-4" /> Simpan Nilai
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
            <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-4 mb-4 border border-indigo-100 dark:border-indigo-500/20">
              <div className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Komponen Penilaian</div>
              <h3 className="font-black text-indigo-900 dark:text-indigo-300 text-lg leading-tight">Tugas 1 (Eksponen)</h3>
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400 mt-1">Matematika Wajib • X-1</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Kolom Tugas</label>
                <input type="text" defaultValue="Tugas 1 (Eksponen)" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold dark:text-white focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Statistik Nilai</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-center">
                    <div className="text-xl font-black text-slate-800 dark:text-white">85.2</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Rata-rata</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-center">
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">95</div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase">Tertinggi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white">Daftar Nilai Siswa (32 Siswa)</h3>
              <div className="relative w-48 hidden sm:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Cari..." className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium dark:text-white" />
              </div>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50 h-[500px] overflow-y-auto custom-scrollbar">
              {[
                { id: 1, init: 'AS', nama: 'Agus Setiawan', nisn: '0081234501', nilai: 85 },
                { id: 2, init: 'BR', nama: 'Budi Raharjo', nisn: '0081234502', nilai: 78 },
                { id: 3, init: 'CK', nama: 'Citra Kirana', nisn: '0081234503', nilai: 95 },
                { id: 4, init: 'DL', nama: 'Dewi Lestari', nisn: '0081234504', nilai: null },
              ].map((siswa) => (
                <div key={siswa.id} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">{siswa.init}</div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white text-sm">{siswa.nama}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{siswa.nisn}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {siswa.nilai && siswa.nilai < 80 ? (
                      <span className="text-[11px] sm:text-xs bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 sm:px-3 py-1 rounded font-bold border border-amber-200 dark:border-amber-500/20 whitespace-nowrap">Remedial</span>
                    ) : siswa.nilai ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : null}
                    <input 
                      type="number" 
                      defaultValue={siswa.nilai ?? ''} 
                      placeholder="-"
                      className={`w-16 h-10 text-center font-black rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${siswa.nilai === null ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white' : siswa.nilai < 80 ? 'bg-amber-50 dark:bg-slate-800 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400' : 'bg-indigo-50 dark:bg-slate-800 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400'}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
