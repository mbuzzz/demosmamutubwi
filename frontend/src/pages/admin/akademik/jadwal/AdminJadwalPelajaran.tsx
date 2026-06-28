import AdminLayout from '../../../../components/admin/AdminLayout';
import { Calendar, Plus, Edit, Save, X, Clock, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useKelasList } from '../../../../hooks/useKelas';
import { useMapelList } from '../../../../hooks/useMapel';
import { useUsers } from '../../../../hooks/useUsers';
import { useJadwal, useSaveJadwalBulk, type JadwalRecord } from '../../../../hooks/useJadwal';
import { toast } from 'sonner';

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  label: string;
  isBreak: boolean;
  urutan_jam: number;
}

interface DayItem {
  id: string;
  name: string;
}

interface ScheduleCell {
  mapel_id: string;
  guru_id: string;
}

const defaultDays: DayItem[] = [
  { id: 'senin', name: 'Senin' },
  { id: 'selasa', name: 'Selasa' },
  { id: 'rabu', name: 'Rabu' },
  { id: 'kamis', name: 'Kamis' },
  { id: 'jumat', name: 'Jumat' },
];

const slotStyles = [
  { bg: 'bg-indigo-50 dark:bg-indigo-500/20', border: 'border-indigo-200 dark:border-indigo-500/30', text: 'text-indigo-900 dark:text-indigo-300', textSub: 'text-indigo-700 dark:text-indigo-400', bar: 'bg-indigo-500' },
  { bg: 'bg-emerald-50 dark:bg-emerald-500/20', border: 'border-emerald-200 dark:border-emerald-500/30', text: 'text-emerald-900 dark:text-emerald-300', textSub: 'text-emerald-700 dark:text-emerald-400', bar: 'bg-emerald-500' },
  { bg: 'bg-violet-50 dark:bg-violet-500/20', border: 'border-violet-200 dark:border-violet-500/30', text: 'text-violet-900 dark:text-violet-300', textSub: 'text-violet-700 dark:text-violet-400', bar: 'bg-violet-500' },
  { bg: 'bg-orange-50 dark:bg-orange-500/20', border: 'border-orange-200 dark:border-orange-500/30', text: 'text-orange-900 dark:text-orange-300', textSub: 'text-orange-700 dark:text-orange-400', bar: 'bg-orange-500' },
  { bg: 'bg-rose-50 dark:bg-rose-500/20', border: 'border-rose-200 dark:border-rose-500/30', text: 'text-rose-900 dark:text-rose-300', textSub: 'text-rose-700 dark:text-rose-400', bar: 'bg-rose-500' },
  { bg: 'bg-cyan-50 dark:bg-cyan-500/20', border: 'border-cyan-200 dark:border-cyan-500/30', text: 'text-cyan-900 dark:text-cyan-300', textSub: 'text-cyan-700 dark:text-cyan-400', bar: 'bg-cyan-500' },
];

function generateId() {
  return crypto.randomUUID();
}

export default function AdminJadwalPelajaran() {
  const [selectedKelasId, setSelectedKelasId] = useState('');
  
  // Master Data
  const { data: kelasList = [] } = useKelasList();
  const { data: mapelList = [] } = useMapelList();
  const { data: guruList = [] } = useUsers('guru'); // fetches all educators

  // Initialize selected class
  useEffect(() => {
    if (!selectedKelasId && kelasList.length > 0) {
      setSelectedKelasId(String(kelasList[0].id));
    }
  }, [kelasList, selectedKelasId]);

  // Schedule Data for selected class
  const { data: dbSchedules = [], isLoading: isJadwalLoading } = useJadwal(selectedKelasId);
  const saveBulkMutation = useSaveJadwalBulk();

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [days] = useState<DayItem[]>(defaultDays);
  const [schedule, setSchedule] = useState<Record<string, ScheduleCell>>({});

  // Reconstruct UI state from DB data
  useEffect(() => {
    if (dbSchedules.length > 0) {
      // Extract unique time slots
      const uniqueSlotsMap = new Map<number, TimeSlot>();
      dbSchedules.forEach(item => {
        if (!uniqueSlotsMap.has(item.urutan_jam)) {
          uniqueSlotsMap.set(item.urutan_jam, {
            id: String(item.urutan_jam),
            urutan_jam: item.urutan_jam,
            start: item.jam_mulai.substring(0, 5), // '07:00:00' -> '07:00'
            end: item.jam_selesai.substring(0, 5),
            label: item.label || '',
            isBreak: item.is_break,
          });
        }
      });
      
      const newSlots = Array.from(uniqueSlotsMap.values()).sort((a, b) => a.urutan_jam - b.urutan_jam);
      setSlots(newSlots);

      // Reconstruct schedule grid mapping
      const newSchedule: Record<string, ScheduleCell> = {};
      dbSchedules.forEach(item => {
        if (!item.is_break && item.mapel_id) {
          const dayIdx = days.findIndex(d => d.name.toLowerCase() === item.hari.toLowerCase());
          const slotIdx = newSlots.findIndex(s => s.urutan_jam === item.urutan_jam);
          if (dayIdx !== -1 && slotIdx !== -1) {
            newSchedule[`${slotIdx}-${dayIdx}`] = {
              mapel_id: String(item.mapel_id),
              guru_id: item.guru_id ? String(item.guru_id) : '',
            };
          }
        }
      });
      setSchedule(newSchedule);
    } else {
      // Default empty state
      setSlots([
        { id: '1', urutan_jam: 1, start: '07:00', end: '08:30', label: 'Jam ke-1', isBreak: false },
        { id: '2', urutan_jam: 2, start: '08:30', end: '10:00', label: 'Jam ke-2', isBreak: false },
        { id: '3', urutan_jam: 3, start: '10:00', end: '10:30', label: 'Istirahat', isBreak: true },
        { id: '4', urutan_jam: 4, start: '10:30', end: '12:00', label: 'Jam ke-3', isBreak: false },
      ]);
      setSchedule({});
    }
  }, [dbSchedules, days]);

  // Modals state
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [slotForm, setSlotForm] = useState({ start: '', end: '', isBreak: false });

  const [showCellModal, setShowCellModal] = useState(false);
  const [cellPos, setCellPos] = useState<{ dayIdx: number; slotIdx: number } | null>(null);
  const [cellForm, setCellForm] = useState({ mapel_id: '', guru_id: '' });

  // Slots Logic
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
      const isBreak = slotForm.isBreak;
      const urutan = slots.length > 0 ? Math.max(...slots.map(s => s.urutan_jam)) + 1 : 1;
      const label = isBreak ? 'Istirahat' : `Jam ke-${slots.filter(s => !s.isBreak).length + 1}`;
      
      const newSlot: TimeSlot = { 
        id: generateId(), 
        urutan_jam: urutan,
        start: slotForm.start, 
        end: slotForm.end, 
        isBreak,
        label
      };
      setSlots(prev => [...prev, newSlot].sort((a, b) => a.start.localeCompare(b.start)));
    }
    setShowSlotModal(false);
    setEditingSlot(null);
  }

  function deleteSlot(id: string) {
    setSlots(prev => prev.filter(s => s.id !== id));
    // Also remove any schedule assignments in this slot index
    const slotIdx = slots.findIndex(s => s.id === id);
    if (slotIdx !== -1) {
      const newSched = { ...schedule };
      for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
        delete newSched[`${slotIdx}-${dayIdx}`];
      }
      setSchedule(newSched);
    }
  }

  // Cells Logic
  function openCellModal(dayIdx: number, slotIdx: number) {
    const key = `${slotIdx}-${dayIdx}`;
    const existing = schedule[key];
    setCellPos({ dayIdx, slotIdx });
    setCellForm(existing ? { mapel_id: existing.mapel_id, guru_id: existing.guru_id } : { mapel_id: '', guru_id: '' });
    setShowCellModal(true);
  }

  function saveCell() {
    if (!cellPos || !cellForm.mapel_id) return;
    const key = `${cellPos.slotIdx}-${cellPos.dayIdx}`;
    setSchedule(prev => ({ ...prev, [key]: { mapel_id: cellForm.mapel_id, guru_id: cellForm.guru_id } }));
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

  const handleSaveToDatabase = async () => {
    if (!selectedKelasId) return;

    // Build the bulk array
    const payload: JadwalRecord[] = [];

    slots.forEach((slot, slotIdx) => {
      if (slot.isBreak) {
        // Break slot applies to all days
        days.forEach(day => {
          payload.push({
            kelas_id: selectedKelasId,
            hari: day.name,
            urutan_jam: slot.urutan_jam,
            jam_mulai: slot.start,
            jam_selesai: slot.end,
            is_break: true,
            label: slot.label,
            mapel_id: null,
            guru_id: null,
          });
        });
      } else {
        // Normal slot, check schedule assignments
        days.forEach((day, dayIdx) => {
          const key = `${slotIdx}-${dayIdx}`;
          const cell = schedule[key];
          
          payload.push({
            kelas_id: selectedKelasId,
            hari: day.name,
            urutan_jam: slot.urutan_jam,
            jam_mulai: slot.start,
            jam_selesai: slot.end,
            is_break: false,
            label: slot.label,
            mapel_id: cell ? cell.mapel_id : null,
            guru_id: (cell && cell.guru_id) ? cell.guru_id : null,
          });
        });
      }
    });

    const saveToast = toast.loading('Menyimpan jadwal ke server...');
    try {
      await saveBulkMutation.mutateAsync({
        kelas_id: selectedKelasId,
        schedules: payload
      });
      toast.dismiss(saveToast);
      toast.success('Jadwal kelas berhasil disimpan!');
    } catch (err: any) {
      toast.dismiss(saveToast);
      toast.error(err.response?.data?.message || 'Gagal menyimpan jadwal kelas.');
    }
  };

  return (
    <AdminLayout title="Pembuat Jadwal Pelajaran">
      
      {/* Header Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Kelas</label>
            <select 
              value={selectedKelasId} 
              onChange={e => setSelectedKelasId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>
        </div>

        <button 
          onClick={handleSaveToDatabase}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <Save className="w-4 h-4" /> Simpan Perubahan Jadwal
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Editor Jadwal Interaktif</h3>
          <button onClick={() => openSlotModal()} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors shadow-sm">
            <Plus className="w-3.5 h-3.5" /> Tambah Sesi Waktu
          </button>
        </div>

        {/* Builder Grid */}
        <div className="p-4 overflow-x-auto">
          {isJadwalLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-semibold">Memuat jadwal kelas...</p>
            </div>
          ) : (
            <div className="min-w-[800px]">
              {/* Header Days */}
              <div className="flex ml-32">
                {days.map((day) => (
                  <div key={day.id} className="flex-1 text-center font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest text-xs py-3 border-b-2 border-slate-200 dark:border-slate-700">
                    {day.name}
                  </div>
                ))}
              </div>

              {/* Time Slots & Cells */}
              <div className="mt-4 space-y-3">
                {slots.map((slot, slotIdx) => (
                  <div key={slot.id} className="flex gap-4">
                    
                    {/* Time Column */}
                    <div className="w-28 shrink-0 flex flex-col items-end pt-2 group relative">
                      <div className="flex items-center gap-2 mb-0.5">
                        <button onClick={() => deleteSlot(slot.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity p-1"><Trash2 className="w-3 h-3"/></button>
                        <button onClick={() => openSlotModal(slot)} className="opacity-0 group-hover:opacity-100 text-indigo-400 hover:text-indigo-600 transition-opacity p-1"><Edit className="w-3 h-3"/></button>
                        <span className="font-bold text-slate-800 dark:text-white text-sm">{slot.start}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{slot.label}</span>
                      <span className="text-xs font-semibold text-slate-500 mt-1">{slot.end}</span>
                    </div>

                    {/* Day Columns */}
                    <div className="flex-1 flex gap-2">
                      {slot.isBreak ? (
                        <div className="flex-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 border-dashed">
                          <span className="font-bold text-xs uppercase tracking-[0.2em]">{slot.label}</span>
                        </div>
                      ) : (
                        days.map((day, dayIdx) => {
                          const key = `${slotIdx}-${dayIdx}`;
                          const cell = schedule[key];
                          const style = slotStyles[(dayIdx + slotIdx) % slotStyles.length];

                          return (
                            <div key={day.id} className="flex-1 min-h-[90px] relative group">
                              {cell ? (
                                <div className={`h-full w-full rounded-2xl border p-3 flex flex-col justify-between transition-all hover:shadow-md ${style.bg} ${style.border}`}>
                                  <div>
                                    <div className={`w-6 h-1 rounded-full mb-2 ${style.bar}`}></div>
                                    <div className={`font-bold text-xs leading-tight mb-1 ${style.text}`}>
                                      {mapelList.find(m => String(m.id) === cell.mapel_id)?.nama || 'Mata Pelajaran'}
                                    </div>
                                  </div>
                                  <div className={`text-[10px] font-semibold leading-tight ${style.textSub}`}>
                                    {guruList.find(g => String(g.id) === cell.guru_id)?.name || 'Tanpa Guru'}
                                  </div>

                                  <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-white/50 dark:border-slate-700/50 shadow-sm overflow-hidden">
                                    <button onClick={() => openCellModal(dayIdx, slotIdx)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                                    <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
                                    <button onClick={() => deleteCell(dayIdx, slotIdx)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                  </div>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => openCellModal(dayIdx, slotIdx)}
                                  className="w-full h-full rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-indigo-500 transition-all opacity-0 hover:opacity-100"
                                >
                                  <Plus className="w-6 h-6" />
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Waktu & Sesi */}
      {showSlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSlotModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" /> {editingSlot ? 'Edit Sesi' : 'Tambah Sesi Baru'}
              </h3>
              <button onClick={() => setShowSlotModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Jam Mulai</label>
                  <input type="time" value={slotForm.start} onChange={e => setSlotForm({ ...slotForm, start: e.target.value })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Jam Selesai</label>
                  <input type="time" value={slotForm.end} onChange={e => setSlotForm({ ...slotForm, end: e.target.value })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white" />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl cursor-pointer transition-colors">
                  <input type="checkbox" checked={slotForm.isBreak} onChange={e => setSlotForm({ ...slotForm, isBreak: e.target.checked })} className="w-4 h-4 text-amber-500 focus:ring-amber-500 rounded border-amber-300" />
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">Tandai sebagai Waktu Istirahat</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button onClick={() => setShowSlotModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl text-sm transition-colors">Batal</button>
              <button onClick={saveSlot} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm">Simpan Waktu</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Input Mapel Cell */}
      {showCellModal && cellPos !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCellModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                Input Jadwal Mapel
              </h3>
              <button onClick={() => setShowCellModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-xs font-semibold text-slate-500 mb-6">
              Hari {days[cellPos.dayIdx].name} • {slots[cellPos.slotIdx]?.start} - {slots[cellPos.slotIdx]?.end}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Mata Pelajaran</label>
                <select 
                  value={cellForm.mapel_id} 
                  onChange={e => setCellForm({ ...cellForm, mapel_id: e.target.value })} 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
                >
                  <option value="">-- Pilih Mapel --</option>
                  {mapelList.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Guru Pengajar</label>
                <select 
                  value={cellForm.guru_id} 
                  onChange={e => setCellForm({ ...cellForm, guru_id: e.target.value })} 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold dark:text-white"
                >
                  <option value="">-- Pilih Guru --</option>
                  {guruList.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-8 flex gap-2">
              <button onClick={() => setShowCellModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl text-sm transition-colors">Batal</button>
              <button onClick={saveCell} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm">Terapkan</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
