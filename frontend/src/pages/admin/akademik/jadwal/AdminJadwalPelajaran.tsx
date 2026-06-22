import AdminLayout from '../../../../components/admin/AdminLayout';
import { Calendar, Plus, Edit, Save } from 'lucide-react';

export default function AdminJadwalPelajaran() {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const times = ['07:00 - 08:30', '08:30 - 10:00', '10:15 - 11:45', '12:30 - 14:00', '14:00 - 15:30'];

  return (
    <AdminLayout title="Jadwal Pelajaran Kelas">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-end transition-colors">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Tahun & Semester</label>
            <select className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white transition-colors">
              <option>2024/2025 - Ganjil</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Pilih Kelas</label>
            <select className="w-full sm:w-32 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 dark:text-indigo-400 transition-colors">
              <option>X-1</option>
              <option>XI-IPA-1</option>
            </select>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
            Tampilkan Jadwal
          </button>
        </div>

        {/* Schedule Grid */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 transition-colors"><Calendar className="w-5 h-5 text-indigo-500" /> Jadwal Kelas X-1</h3>
            <button className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-colors border border-emerald-200 dark:border-emerald-500/20">
              <Save className="w-4 h-4" /> Simpan Perubahan Jadwal
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 dark:bg-slate-950 text-white transition-colors">
                <tr>
                  <th className="px-4 py-3 text-center border-r border-slate-700 dark:border-slate-800 w-24">Waktu</th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-center border-r border-slate-700 dark:border-slate-800 min-w-[180px]">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-slate-50/30 dark:bg-slate-800/20 transition-colors">
                {times.map((time, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-center font-bold text-xs text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors">
                      {time}
                    </td>
                    {days.map((day, dayIdx) => (
                      <td key={dayIdx} className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 relative group cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-colors align-top h-24 bg-white dark:bg-slate-900/50">
                        {/* Mock data for Senin 07:00 */}
                        {day === 'Senin' && idx === 0 ? (
                          <div className="bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 p-2 rounded-lg relative transition-colors">
                            <div className="font-bold text-indigo-900 dark:text-indigo-300 text-xs mb-1">Matematika</div>
                            <div className="text-[10px] text-indigo-700 dark:text-indigo-400">Ahmad Hidayat, S.Pd</div>
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                              <button className="text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"><Edit className="w-3 h-3" /></button>
                            </div>
                          </div>
                        ) : day === 'Selasa' && idx === 1 ? (
                          <div className="bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 p-2 rounded-lg relative transition-colors">
                            <div className="font-bold text-emerald-900 dark:text-emerald-300 text-xs mb-1">Bahasa Inggris</div>
                            <div className="text-[10px] text-emerald-700 dark:text-emerald-400">Siti Aminah, M.Pd</div>
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                              <button className="text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"><Edit className="w-3 h-3" /></button>
                            </div>
                          </div>
                        ) : idx === 2 && dayIdx === 2 ? (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ISTIRAHAT</span>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button className="text-xs bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-colors">
                              <Plus className="w-3 h-3" /> Isi
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center transition-colors">Klik pada kotak kosong untuk menambahkan mata pelajaran dan guru pengajar.</p>
        </div>

      </div>
    </AdminLayout>
  );
}
