import AdminLayout from '../../../../components/admin/AdminLayout';
import { CalendarDays, Save, Search, Eye, Loader2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGuruClasses } from '../../../../hooks/usePenugasan';
import { useUsers } from '../../../../hooks/useUsers';
import { useJurnalList, useCreateJurnal } from '../../../../hooks/useJurnal';
import { toast } from 'sonner';

export default function GuruJurnalPresensi() {
  const { data: guruClasses = [], isLoading: classesLoading } = useGuruClasses();
  const { data: allSiswa = [], isLoading: siswaLoading } = useUsers('siswa');
  const createJurnalMutation = useCreateJurnal();

  const [activeSessionIdx, setActiveSessionIdx] = useState(0);
  const [topik, setTopik] = useState('');
  const [search, setSearch] = useState('');
  
  // Attendance state: record of { [siswa_id]: 'hadir' | 'sakit' | 'izin' | 'alpha' }
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  const activeSession = guruClasses[activeSessionIdx] || null;
  const targetKelasId = activeSession ? activeSession.id : '';
  const targetKelasName = activeSession ? activeSession.nama : '';
  const targetMapelId = activeSession && activeSession.mapels && activeSession.mapels.length > 0 
    ? activeSession.mapels[0].id 
    : '';
  const targetMapelName = activeSession && activeSession.mapels && activeSession.mapels.length > 0 
    ? activeSession.mapels[0].nama 
    : '';

  // Get list of previous KBM jurnals for this teacher
  const { data: jurnalHistory = [], isLoading: historyLoading } = useJurnalList(
    activeSession ? { kelas_id: targetKelasId, mapel_id: targetMapelId } : undefined
  );

  const siswaKelas = allSiswa.filter(s => s.kelas === targetKelasName);

  // Default all students in the class to 'hadir' when class or active session changes
  useEffect(() => {
    if (siswaKelas.length > 0) {
      const defaultAttendance: Record<string, string> = {};
      siswaKelas.forEach(s => {
        defaultAttendance[s.id] = 'hadir';
      });
      setAttendance(defaultAttendance);
    }
  }, [targetKelasName, allSiswa]);

  const handleAttendanceChange = (siswaId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [siswaId]: status,
    }));
  };

  const handleSave = () => {
    if (!activeSession) {
      toast.error('Belum ada sesi mengajar aktif');
      return;
    }
    if (!topik.trim()) {
      toast.error('Harap isi pokok bahasan / topik hari ini');
      return;
    }

    const payload = {
      kelas_id: Number(targetKelasId),
      mapel_id: Number(targetMapelId),
      tanggal: new Date().toISOString().split('T')[0],
      topik: topik.trim(),
      kehadiran_json: attendance,
    };

    createJurnalMutation.mutate(payload, {
      onSuccess: () => {
        setTopik('');
      }
    });
  };

  const filteredHistory = jurnalHistory.filter(j => 
    j.topik.toLowerCase().includes(search.toLowerCase())
  );

  const totalSiswa = siswaKelas.length;

  return (
    <AdminLayout title="Jurnal Mengajar & Presensi Kelas">
      
      {/* Sesi Mengajar Guru */}
      <h3 className="font-extrabold text-slate-800 dark:text-white text-base mb-3.5">Pilih Sesi Mengajar Aktif Anda</h3>
      {classesLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : guruClasses.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center text-slate-500 mb-8">
          Anda tidak memiliki jadwal mengajar aktif pada tahun ajaran ini.
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 mb-8">
          {guruClasses.map((session, idx) => {
            const isSelected = idx === activeSessionIdx;
            const mapelName = session.mapels && session.mapels.length > 0 ? session.mapels[0].nama : 'Mapel';
            return (
              <button 
                key={session.id} 
                onClick={() => {
                  setActiveSessionIdx(idx);
                  setTopik('');
                }}
                className={`flex-1 min-w-[250px] rounded-2xl p-5 text-left border-2 transition-all active:scale-[0.98] ${
                  isSelected 
                    ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                  <CalendarDays className="w-3.5 h-3.5"/> Sesi Kelas Mengajar
                </div>
                <h3 className="text-lg font-black">{mapelName} — Kelas {session.nama}</h3>
                <p className={`text-xs mt-1 font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>Tingkat {session.tingkat} • {siswaKelas.length} Siswa Terdaftar</p>
              </button>
            );
          })}
        </div>
      )}

      {activeSession && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 mb-8">
          
          {/* Form Jurnal Materi */}
          <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Input Jurnal Mengajar Hari Ini
            </h3>
            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pokok Bahasan / Topik Hari Ini</label>
                <input 
                  type="text" 
                  value={topik}
                  onChange={e => setTopik(e.target.value)}
                  placeholder="Contoh: Sifat-sifat Logaritma Lanjutan" 
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white shadow-sm" 
                />
              </div>
            </div>
          </div>

          {/* Tabel Absensi */}
          <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Kehadiran Siswa Kelas {targetKelasName}</h3>
                <p className="text-xs text-slate-500 mt-1">Semua siswa default Hadir. Ubah jika berhalangan. <strong>Catatan:</strong> Presensi kelas KBM ini terpisah dari absensi gerbang RFID utama sekolah.</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={createJurnalMutation.isPending || totalSiswa === 0}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {createJurnalMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Jurnal & Absen
              </button>
            </div>

            {siswaLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
            ) : totalSiswa === 0 ? (
              <div className="text-center py-8 text-slate-400">Tidak ada siswa terdaftar di kelas ini.</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 w-16 text-center">No</th>
                      <th className="px-6 py-4">Nama Siswa</th>
                      <th className="px-6 py-4 text-center">Hadir (H)</th>
                      <th className="px-6 py-4 text-center">Sakit (S)</th>
                      <th className="px-6 py-4 text-center">Izin (I)</th>
                      <th className="px-6 py-4 text-center">Alpa (A)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                    {siswaKelas.map((siswa, index) => (
                      <tr key={siswa.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-center text-slate-400 font-bold">{index + 1}</td>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{siswa.name}</td>
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="radio" 
                            name={`status-${siswa.id}`} 
                            checked={attendance[siswa.id] === 'hadir'} 
                            onChange={() => handleAttendanceChange(siswa.id, 'hadir')}
                            className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 cursor-pointer" 
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="radio" 
                            name={`status-${siswa.id}`} 
                            checked={attendance[siswa.id] === 'sakit'} 
                            onChange={() => handleAttendanceChange(siswa.id, 'sakit')}
                            className="w-5 h-5 text-amber-500 focus:ring-amber-500 cursor-pointer" 
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="radio" 
                            name={`status-${siswa.id}`} 
                            checked={attendance[siswa.id] === 'izin'} 
                            onChange={() => handleAttendanceChange(siswa.id, 'izin')}
                            className="w-5 h-5 text-blue-500 focus:ring-blue-500 cursor-pointer" 
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="radio" 
                            name={`status-${siswa.id}`} 
                            checked={attendance[siswa.id] === 'alpha'} 
                            onChange={() => handleAttendanceChange(siswa.id, 'alpha')}
                            className="w-5 h-5 text-red-500 focus:ring-red-500 cursor-pointer" 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Riwayat Jurnal Sebelumnya */}
          <div className="p-6 lg:p-8 bg-slate-50/30 dark:bg-slate-900">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Riwayat Jurnal Sebelumnya ({targetMapelName} - {targetKelasName})</h3>
              <div className="relative max-w-sm w-64 hidden sm:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari topik jurnal..." 
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-colors" 
                />
              </div>
            </div>
            
            {historyLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400">Belum ada riwayat jurnal kelas untuk kelas & mapel ini.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHistory.map(j => {
                  const attMap = j.kehadiran_json || {};
                  const presentCount = Object.values(attMap).filter(v => v === 'hadir').length;
                  const total = Object.keys(attMap).length;
                  return (
                    <div key={j.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors group flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarDays className="w-4 h-4 text-indigo-500" />
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{j.tanggal}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 leading-tight">{j.topik}</h4>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                          {presentCount}/{total} Siswa Hadir
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link to={`/panel/guru/jurnal/detail/${j.id}`} className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 rounded-lg"><Eye className="w-4 h-4" /></Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </AdminLayout>
  );
}
