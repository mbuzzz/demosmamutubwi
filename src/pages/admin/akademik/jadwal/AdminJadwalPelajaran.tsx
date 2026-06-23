import AdminLayout from '../../../../components/admin/AdminLayout';
import { Calendar, Plus, Edit, Save, X, GripVertical, Clock, Trash2, Coffee, Sun } from 'lucide-react';
import { useState } from 'react';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  label: string;
  isBreak: boolean;
}

interface DayItem {
  id: string;
  name: string;
}

interface ScheduleCell {
  mapel: string;
  guru: string;
}

const defaultSlots: TimeSlot[] = [
  { id: '1', start: '07:00', end: '08:30', label: 'Jam ke-1', isBreak: false },
  { id: '2', start: '08:30', end: '10:00', label: 'Jam ke-2', isBreak: false },
  { id: '3', start: '10:15', end: '11:45', label: 'Jam ke-3', isBreak: false },
  { id: '4', start: '12:30', end: '14:00', label: 'Jam ke-4', isBreak: false },
  { id: '5', start: '14:00', end: '15:30', label: 'Jam ke-5', isBreak: false },
];

const defaultDays: DayItem[] = [
  { id: 'senin', name: 'Senin' },
  { id: 'selasa', name: 'Selasa' },
  { id: 'rabu', name: 'Rabu' },
  { id: 'kamis', name: 'Kamis' },
  { id: 'jumat', name: 'Jumat' },
];

const slotStyles = [
  { bg: 'bg-indigo-50 dark:bg-indigo-500/20', border: 'border-indigo-200 dark:border-indigo-500/30', text: 'text-indigo-900 dark:text-indigo-300', textSub: 'text-indigo-700 dark:text-indigo-400', icon: 'text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300', bar: 'bg-indigo-500' },
  { bg: 'bg-emerald-50 dark:bg-emerald-500/20', border: 'border-emerald-200 dark:border-emerald-500/30', text: 'text-emerald-900 dark:text-emerald-300', textSub: 'text-emerald-700 dark:text-emerald-400', icon: 'text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300', bar: 'bg-emerald-500' },
  { bg: 'bg-violet-50 dark:bg-violet-500/20', border: 'border-violet-200 dark:border-violet-500/30', text: 'text-violet-900 dark:text-violet-300', textSub: 'text-violet-700 dark:text-violet-400', icon: 'text-violet-400 hover:text-violet-700 dark:hover:text-violet-300', bar: 'bg-violet-500' },
  { bg: 'bg-orange-50 dark:bg-orange-500/20', border: 'border-orange-200 dark:border-orange-500/30', text: 'text-orange-900 dark:text-orange-300', textSub: 'text-orange-700 dark:text-orange-400', icon: 'text-orange-400 hover:text-orange-700 dark:hover:text-orange-300', bar: 'bg-orange-500' },
  { bg: 'bg-rose-50 dark:bg-rose-500/20', border: 'border-rose-200 dark:border-rose-500/30', text: 'text-rose-900 dark:text-rose-300', textSub: 'text-rose-700 dark:text-rose-400', icon: 'text-rose-400 hover:text-rose-700 dark:hover:text-rose-300', bar: 'bg-rose-500' },
  { bg: 'bg-cyan-50 dark:bg-cyan-500/20', border: 'border-cyan-200 dark:border-cyan-500/30', text: 'text-cyan-900 dark:text-cyan-300', textSub: 'text-cyan-700 dark:text-cyan-400', icon: 'text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300', bar: 'bg-cyan-500' },
  { bg: 'bg-teal-50 dark:bg-teal-500/20', border: 'border-teal-200 dark:border-teal-500/30', text: 'text-teal-900 dark:text-teal-300', textSub: 'text-teal-700 dark:text-teal-400', icon: 'text-teal-400 hover:text-teal-700 dark:hover:text-teal-300', bar: 'bg-teal-500' },
  { bg: 'bg-lime-50 dark:bg-lime-500/20', border: 'border-lime-200 dark:border-lime-500/30', text: 'text-lime-900 dark:text-lime-300', textSub: 'text-lime-700 dark:text-lime-400', icon: 'text-lime-400 hover:text-lime-700 dark:hover:text-lime-300', bar: 'bg-lime-500' },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function AdminJadwalPelajaran() {
  const [slots, setSlots] = useState<TimeSlot[]>(defaultSlots);
  const [days, setDays] = useState<DayItem[]>(defaultDays);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [slotForm, setSlotForm] = useState({ start: '', end: '', isBreak: false });

  const [showDayModal, setShowDayModal] = useState(false);
  const [dayInput, setDayInput] = useState('');

  const [showCellModal, setShowCellModal] = useState(false);
  const [cellPos, setCellPos] = useState<{ dayIdx: number; slotIdx: number } | null>(null);
  const [cellForm, setCellForm] = useState({ mapel: '', guru: '' });

  const [schedule, setSchedule] = useState<Record<string, ScheduleCell>>({
    '0-0': { mapel: 'Matematika', guru: 'Ahmad Hidayat, S.Pd' },
    '1-1': { mapel: 'Bahasa Inggris', guru: 'Siti Aminah, M.Pd' },
  });

  function openSlotModal(slot?: TimeSlot) {
    if (slot) {
      setEditingSlot(slot);
      setSlotForm({ start: slot.start, end: slot.end, isBreak: slot.isBreak });
    } else {
      setEditingSlot(null);
      setSlotForm({ start: '07:00', end: '08:30', isBreak: false });
    }
    setShowSlotModal(true);
  }

  function saveSlot() {
    if (!slotForm.start || !slotForm.end) return;
    if (editingSlot) {
      setSlots(prev => prev.map(s => s.id === editingSlot.id ? { ...s, ...slotForm } : s));
    } else {
      const newSlot: TimeSlot = { id: generateId(), ...slotForm, label: `Jam ke-${slots.filter(s => !s.isBreak).length + 1}` };
      setSlots(prev => [...prev, newSlot]);
    }
    setShowSlotModal(false);
    setEditingSlot(null);
  }

  function deleteSlot(id: string) {
    setSlots(prev => prev.filter(s => s.id !== id));
  }

  function openCellModal(dayIdx: number, slotIdx: number) {
    const key = `${slotIdx}-${dayIdx}`;
    const existing = schedule[key];
    setCellPos({ dayIdx, slotIdx });
    setCellForm(existing ? { mapel: existing.mapel, guru: existing.guru } : { mapel: '', guru: '' });
    setShowCellModal(true);
  }

  function saveCell() {
    if (!cellPos || !cellForm.mapel) return;
    const key = `${cellPos.slotIdx}-${cellPos.dayIdx}`;
    setSchedule(prev => ({ ...prev, [key]: { mapel: cellForm.mapel, guru: cellForm.guru } }));
    setShowCellModal(false);
    setCellPos(null);
  }

  function deleteCell(dayIdx: number, slotIdx: number) {
    const key = `${slotIdx}-${dayIdx}`;
    setSchedule(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function addDay() {
    const name = dayInput.trim();
    if (!name) return;
    if (days.some(d => d.name.toLowerCase() === name.toLowerCase())) return;
    setDays(prev => [...prev, { id: generateId(), name }]);
    setDayInput('');
  }

  function deleteDay(id: string) {
    setDays(prev => prev.filter(d => d.id !== id));
  }

  function getCell(dayIdx: number, slotIdx: number): ScheduleCell | undefined {
    return schedule[`${slotIdx}-${dayIdx}`];
  }

  function getStyle(idx: number) {
    return slotStyles[idx % slotStyles.length];
  }

  return (
    <AdminLayout title="Jadwal Pelajaran Kelas">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-end transition-colors">
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
          <button onClick={() => setShowDayModal(true)} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-5 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
            <Sun className="w-4 h-4" /> Atur Hari
          </button>
          <button onClick={() => openSlotModal()} className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
            <Clock className="w-4 h-4" /> Atur Jam
          </button>
        </div>

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
                  <th className="px-4 py-3 text-center border-r border-slate-700 dark:border-slate-800 w-28">Jam ke-</th>
                  {days.map(day => (
                    <th key={day.id} className="px-4 py-3 text-center border-r border-slate-700 dark:border-slate-800 min-w-[180px]">{day.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-slate-50 dark:bg-slate-800/20 transition-colors">
                {slots.map((slot, slotIdx) => (
                  <tr key={slot.id}>
                    <td className="px-4 py-3 text-center border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors align-middle">
                      <div className="flex flex-col items-center justify-center min-h-[60px]">
                        {slot.isBreak ? (
                          <>
                            <Coffee className="w-5 h-5 text-amber-500" />
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
                        <td key={dayIdx} className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 relative group cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-colors align-top bg-white dark:bg-slate-900/50">
                          <div className="min-h-[70px] flex items-stretch">
                            {slot.isBreak ? (
                              <div className="flex items-center justify-center w-full">
                                <span className="text-xs font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest select-none">ISTIRAHAT</span>
                              </div>
                            ) : cell ? (
                              <div className={`w-full ${s.bg} ${s.border} border p-2 rounded-lg relative transition-colors`}>
                                <div className={`font-bold text-xs ${s.text} mb-1`}>{cell.mapel}</div>
                                <div className={`text-[10px] ${s.textSub}`}>{cell.guru}</div>
                                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1">
                                  <button onClick={(e) => { e.stopPropagation(); openCellModal(dayIdx, slotIdx); }} className={s.icon}>
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button onClick={(e) => { e.stopPropagation(); deleteCell(dayIdx, slotIdx); }} className="text-red-400 hover:text-red-600">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button onClick={() => openCellModal(dayIdx, slotIdx)} className="text-xs bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-colors">
                                  <Plus className="w-3 h-3" /> Isi
                                </button>
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
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center transition-colors">
            Klik "Atur Jam" untuk mengelola sesi jam pelajaran • Klik kotak kosong untuk menambahkan mata pelajaran dan guru.
          </p>
        </div>
      </div>

      {/* Modal Atur Jam Pelajaran */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSlotModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" /> {editingSlot ? 'Edit Jam Pelajaran' : 'Atur Jam Pelajaran'}
              </h3>
              <button onClick={() => setShowSlotModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-5">
                {slots.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6">Belum ada sesi jam pelajaran. Tambah sesi baru di bawah.</p>
                )}
                {slots.map((slot, i) => {
                  const s = getStyle(i);
                  return (
                    <div key={slot.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 group">
                      <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 cursor-grab" />
                      {slot.isBreak ? (
                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                            <Coffee className="w-4 h-4 text-amber-500" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">Istirahat</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-mono">{slot.start} - {slot.end}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-1.5 h-8 rounded-full ${s.bar}`}></div>
                          <div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white">{slot.label}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{slot.start} - {slot.end}</div>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openSlotModal(slot)} className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteSlot(slot.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  {editingSlot ? 'Edit Sesi' : 'Tambah Sesi Baru'}
                </h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">Mulai</label>
                    <input type="time" value={slotForm.start} onChange={e => setSlotForm(prev => ({ ...prev, start: e.target.value }))} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">Selesai</label>
                    <input type="time" value={slotForm.end} onChange={e => setSlotForm(prev => ({ ...prev, end: e.target.value }))} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white font-mono" />
                  </div>
                </div>
                <label className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer mb-4">
                  <input type="checkbox" checked={slotForm.isBreak} onChange={e => setSlotForm(prev => ({ ...prev, isBreak: e.target.checked }))} className="w-4 h-4 text-amber-500 focus:ring-amber-500 rounded border-slate-300 dark:border-slate-600" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Coffee className="w-4 h-4 text-amber-500" /> Jadikan Waktu Istirahat</span>
                </label>
                <div className="flex gap-3">
                  <button onClick={() => { setShowSlotModal(false); setEditingSlot(null); }} className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    Selesai
                  </button>
                  <button onClick={saveSlot} disabled={!slotForm.start || !slotForm.end} className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm active:scale-95">
                    {editingSlot ? 'Simpan Perubahan' : 'Tambah Sesi'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Atur Hari */}
      {showDayModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDayModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" /> Atur Hari Belajar
              </h3>
              <button onClick={() => setShowDayModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-5">
                {days.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-6">Belum ada hari. Tambah hari baru di bawah.</p>
                )}
                {days.map((day) => (
                  <div key={day.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 group">
                    <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 cursor-grab" />
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs shrink-0">
                      {day.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-white flex-1">{day.name}</span>
                    <button onClick={() => deleteDay(day.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Tambah Hari Baru</h4>
                <div className="flex gap-3">
                  <input type="text" value={dayInput} onChange={e => setDayInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addDay()} placeholder="Contoh: Sabtu" className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white" />
                  <button onClick={addDay} disabled={!dayInput.trim()} className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm active:scale-95">
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Isi Mata Pelajaran */}
      {showCellModal && cellPos && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCellModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" /> Isi Jadwal
              </h3>
              <button onClick={() => setShowCellModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">{days[cellPos.dayIdx]?.name}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="font-mono">{slots[cellPos.slotIdx]?.start} - {slots[cellPos.slotIdx]?.end}</span>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Mata Pelajaran</label>
                <select value={cellForm.mapel} onChange={e => setCellForm(prev => ({ ...prev, mapel: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                  <option value="">Pilih Mapel...</option>
                  <option value="Matematika">Matematika</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Fisika">Fisika</option>
                  <option value="Kimia">Kimia</option>
                  <option value="Biologi">Biologi</option>
                  <option value="Sejarah">Sejarah</option>
                  <option value="Pendidikan Agama">Pendidikan Agama</option>
                  <option value="PKN">PKN</option>
                  <option value="Penjaskes">Penjaskes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Guru Pengajar</label>
                <select value={cellForm.guru} onChange={e => setCellForm(prev => ({ ...prev, guru: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                  <option value="">Pilih Guru...</option>
                  <option value="Ahmad Hidayat, S.Pd">Ahmad Hidayat, S.Pd</option>
                  <option value="Siti Aminah, M.Pd">Siti Aminah, M.Pd</option>
                  <option value="Bambang Wijaya, S.Pd">Bambang Wijaya, S.Pd</option>
                  <option value="Dewi Sartika, S.Pd">Dewi Sartika, S.Pd</option>
                  <option value="Eko Prasetyo, S.Pd">Eko Prasetyo, S.Pd</option>
                  <option value="Fitri Handayani, S.Pd">Fitri Handayani, S.Pd</option>
                  <option value="Hadi Susanto, S.Pd">Hadi Susanto, S.Pd</option>
                  <option value="Indah Permata Sari, S.Pd">Indah Permata Sari, S.Pd</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowCellModal(false); if (cellPos) deleteCell(cellPos.dayIdx, cellPos.slotIdx); }} className="flex-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 py-2.5 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                  Hapus
                </button>
                <button onClick={saveCell} disabled={!cellForm.mapel} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm active:scale-95">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
