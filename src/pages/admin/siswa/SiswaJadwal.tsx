import AdminLayout from '../../../components/admin/AdminLayout';
import { Calendar, Clock, Coffee } from 'lucide-react';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  label: string;
  isBreak: boolean;
}

interface ScheduleCell {
  mapel: string;
  guru: string;
}

const defaultSlots: TimeSlot[] = [
  { id: '1', start: '07:00', end: '08:30', label: 'Jam ke-1', isBreak: false },
  { id: '2', start: '08:30', end: '10:00', label: 'Jam ke-2', isBreak: false },
  { id: '3', start: '10:00', end: '10:15', label: 'Istirahat', isBreak: true },
  { id: '4', start: '10:15', end: '11:45', label: 'Jam ke-3', isBreak: false },
  { id: '5', start: '12:30', end: '14:00', label: 'Jam ke-4', isBreak: false },
  { id: '6', start: '14:00', end: '15:30', label: 'Jam ke-5', isBreak: false },
];

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

const schedule: Record<string, ScheduleCell> = {
  '0-0': { mapel: 'Matematika Wajib', guru: 'Ahmad Hidayat, S.Pd' },
  '1-1': { mapel: 'Bahasa Inggris', guru: 'Siti Aminah, M.Pd' },
  '3-0': { mapel: 'Fisika', guru: 'Bambang Wijaya, S.Pd' },
  '4-2': { mapel: 'Kimia', guru: 'Dewi Sartika, S.Pd' },
  '5-3': { mapel: 'Biologi', guru: 'Eko Prasetyo, S.Pd' },
};

const slotStyles = [
  { bg: 'bg-indigo-55 dark:bg-indigo-500/10', border: 'border-indigo-100 dark:border-indigo-500/20', text: 'text-indigo-900 dark:text-indigo-300', textSub: 'text-indigo-700 dark:text-indigo-400' },
  { bg: 'bg-emerald-55 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20', text: 'text-emerald-900 dark:text-emerald-300', textSub: 'text-emerald-700 dark:text-emerald-400' },
  { bg: 'bg-violet-55 dark:bg-violet-500/10', border: 'border-violet-100 dark:border-violet-500/20', text: 'text-violet-900 dark:text-violet-300', textSub: 'text-violet-700 dark:text-violet-400' },
  { bg: 'bg-orange-55 dark:bg-orange-500/10', border: 'border-orange-100 dark:border-orange-500/20', text: 'text-orange-900 dark:text-orange-300', textSub: 'text-orange-700 dark:text-orange-400' },
  { bg: 'bg-rose-55 dark:bg-rose-500/10', border: 'border-rose-100 dark:border-rose-500/20', text: 'text-rose-900 dark:text-rose-300', textSub: 'text-rose-700 dark:text-rose-400' },
  { bg: 'bg-cyan-55 dark:bg-cyan-500/10', border: 'border-cyan-100 dark:border-cyan-500/20', text: 'text-cyan-900 dark:text-cyan-300', textSub: 'text-cyan-700 dark:text-cyan-400' },
];

export default function SiswaJadwal() {
  function getCell(dayIdx: number, slotIdx: number): ScheduleCell | undefined {
    return schedule[`${slotIdx}-${dayIdx}`];
  }

  function getStyle(idx: number) {
    return slotStyles[idx % slotStyles.length];
  }

  return (
    <AdminLayout title="Jadwal Pelajaran Saya">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap justify-between items-center gap-4 transition-colors">
          <div>
            <h3 className="font-extrabold text-slate-850 dark:text-white text-lg flex items-center gap-2 transition-colors"><Calendar className="w-5 h-5 text-indigo-500" /> Jadwal Pelajaran Kelas X-1</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tahun Ajaran 2024/2025 • Semester Ganjil</p>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-850 dark:bg-slate-950 text-white transition-colors">
                <tr>
                  <th className="px-4 py-3 text-center border-r border-slate-700 dark:border-slate-800 w-28">Waktu</th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-center border-r border-slate-700 dark:border-slate-800 min-w-[180px]">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-slate-50 dark:bg-slate-800/20 transition-colors">
                {defaultSlots.map((slot, slotIdx) => (
                  <tr key={slot.id}>
                    <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors align-middle">
                      <div className="flex flex-col items-center justify-center min-h-[60px]">
                        {slot.isBreak ? (
                          <>
                            <Coffee className="w-5 h-5 text-amber-500 animate-pulse" />
                            <span className="font-bold text-[10px] mt-0.5 text-amber-600 dark:text-amber-400">Istirahat</span>
                          </>
                        ) : (
                          <>
                            <div className="font-bold text-xs text-slate-800 dark:text-white">{slot.label}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{slot.start} - {slot.end}</div>
                          </>
                        )}
                      </div>
                    </td>
                    {days.map((day, dayIdx) => {
                      const cell = getCell(dayIdx, slotIdx);
                      const s = getStyle(slotIdx);
                      return (
                        <td key={dayIdx} className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 transition-colors align-top h-24">
                          <div className="min-h-[70px] flex items-stretch">
                            {slot.isBreak ? (
                              <div className="flex items-center justify-center w-full">
                                <span className="text-xs font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest select-none">ISTIRAHAT</span>
                              </div>
                            ) : cell ? (
                              <div className={`w-full ${s.bg} ${s.border} border p-2 rounded-lg relative transition-colors`}>
                                <div className={`font-bold text-xs ${s.text} mb-1`}>{cell.mapel}</div>
                                <div className={`text-[10px] ${s.textSub}`}>{cell.guru}</div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-full text-slate-300 dark:text-slate-700 text-xs font-semibold">
                                Kosong
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
