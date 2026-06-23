import AdminLayout from '../../../../components/admin/AdminLayout';
import { FileText, Save, Plus, Keyboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuruBukuNilai() {
  return (
    <AdminLayout title="Buku Nilai Harian (Spreadsheet)">
      
      {/* Card Filter Guru */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button className="flex-1 min-w-[200px] bg-indigo-600 border-2 border-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-600/20 text-left transition-transform active:scale-95">
          <h3 className="text-xl font-black">Matematika X-1</h3>
          <p className="text-sm font-medium text-indigo-200 mt-1">32 Siswa</p>
        </button>
        <button className="flex-1 min-w-[200px] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400 dark:hover:border-indigo-500 text-left transition-all group">
          <h3 className="text-xl font-black text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Matematika X-2</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">30 Siswa</p>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/30">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500"/> Lembar Penilaian Kelas X-1</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5"><Keyboard className="w-3.5 h-3.5"/> Gunakan tombol <kbd className="px-1.5 bg-slate-200 dark:bg-slate-700 dark:bg-slate-700 rounded text-[10px] mx-1">Tab</kbd> atau <kbd className="px-1.5 bg-slate-200 dark:bg-slate-700 dark:bg-slate-700 rounded text-[10px] mx-1">Enter</kbd> untuk pindah kolom cepat.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              <Plus className="w-4 h-4" /> Tambah Kolom Tugas
            </button>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              <Save className="w-4 h-4" /> Simpan Nilai
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full text-left text-sm border-collapse border border-slate-200 dark:border-slate-700">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 border border-slate-200 dark:border-slate-700 w-12 text-center">No</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 min-w-[200px]">Nama Siswa</th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 min-w-[120px] text-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 cursor-pointer transition-colors group">
                  <Link to="/panel/guru/nilai/detail/1" className="flex items-center justify-center gap-1">Tugas 1 (Eksponen) <span className="opacity-0 group-hover:opacity-100 text-[10px]">✎</span></Link>
                </th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 min-w-[120px] text-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 cursor-pointer transition-colors group">
                  <Link to="/panel/guru/nilai/detail/2" className="flex items-center justify-center gap-1">Tugas 2 (Logaritma) <span className="opacity-0 group-hover:opacity-100 text-[10px]">✎</span></Link>
                </th>
                <th className="p-3 border border-slate-200 dark:border-slate-700 min-w-[120px] text-center bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">Rata-Rata NH</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900">
              {[
                { id: 1, nama: 'Agus Setiawan', t1: '85', t2: '90' },
                { id: 2, nama: 'Budi Raharjo', t1: '78', t2: '80' },
                { id: 3, nama: 'Citra Kirana', t1: '95', t2: '' },
              ].map((siswa) => (
                <tr key={siswa.id} className="hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-2 border border-slate-200 dark:border-slate-700 text-center text-slate-400 font-bold">{siswa.id}</td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white px-4">{siswa.nama}</td>
                  <td className="p-1 border border-slate-200 dark:border-slate-700">
                    <input type="number" defaultValue={siswa.t1} className="w-full h-full p-2 text-center bg-transparent focus:bg-indigo-50 dark:focus:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded font-bold dark:text-white" />
                  </td>
                  <td className="p-1 border border-slate-200 dark:border-slate-700">
                    <input type="number" defaultValue={siswa.t2} className="w-full h-full p-2 text-center bg-transparent focus:bg-indigo-50 dark:focus:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded font-bold dark:text-white" placeholder="-" />
                  </td>
                  <td className="p-2 border border-slate-200 dark:border-slate-700 text-center font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800/50">
                    {siswa.t2 ? ((Number(siswa.t1) + Number(siswa.t2)) / 2).toFixed(1) : siswa.t1}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AdminLayout>
  );
}
