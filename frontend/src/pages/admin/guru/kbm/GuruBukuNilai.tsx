import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { FileText, Save, Keyboard } from 'lucide-react';
import { useGuruClasses } from '../../../../hooks/usePenugasan';
import { useMapelList } from '../../../../hooks/useMapel';
import { useStudentScores, useSaveScores, useMonitoringUH } from '../../../../hooks/useNilai';
import { toast } from 'sonner';

export default function GuruBukuNilai() {
  const { data: guruClasses = [] } = useGuruClasses();
  const { data: mapelList = [] } = useMapelList();
  
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [selectedMapelId, setSelectedMapelId] = useState('');

  // Local state for scores inputs
  const [scores, setScores] = useState<Record<string, { nilai_tugas: number | null, nilai_uts: number | null, nilai_uas: number | null }>>({});

  useEffect(() => {
    if (!selectedKelasId && guruClasses.length > 0) {
      setSelectedKelasId(String(guruClasses[0].id));
    }
  }, [guruClasses, selectedKelasId]);

  // Filter mapelList based on what the teacher teaches in the selected class
  const selectedKelasObj = guruClasses.find(k => String(k.id) === selectedKelasId);
  const taughtMapelIds = new Set(selectedKelasObj ? (selectedKelasObj.mapels || []).map((m: any) => String(m.id)) : []);
  const guruMapelList = mapelList.filter(m => taughtMapelIds.has(String(m.id)));

  // Adjust selected mapel when class changes or on load
  useEffect(() => {
    if (guruMapelList.length > 0) {
      if (!guruMapelList.find(m => String(m.id) === selectedMapelId)) {
        setSelectedMapelId(String(guruMapelList[0].id));
      }
    } else {
      setSelectedMapelId('');
    }
  }, [guruMapelList, selectedMapelId]);

  const { data: studentScores = [], isLoading: isScoresLoading } = useStudentScores(selectedKelasId, selectedMapelId);
  const saveScoresMutation = useSaveScores();
  const { data: monitoringData } = useMonitoringUH(selectedKelasId, selectedMapelId);

  function getStatusBadge(status: string) {
    if (status === 'rajin') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Rajin</span>;
    if (status === 'biasa') return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">Biasa</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">Jarang</span>;
  }

  // Sync local scores state when studentScores loads
  useEffect(() => {
    if (studentScores.length > 0) {
      const initialScores: Record<string, any> = {};
      studentScores.forEach(s => {
        initialScores[s.siswa_id] = {
          nilai_tugas: s.nilai_tugas,
          nilai_uts: s.nilai_uts,
          nilai_uas: s.nilai_uas
        };
      });
      setScores(initialScores);
    } else {
      setScores({});
    }
  }, [studentScores]);

  const targetKelasObj = guruClasses.find(c => String(c.id) === selectedKelasId);
  const targetKelasNama = targetKelasObj ? targetKelasObj.nama : '';

  const handleScoreChange = (siswaId: string, type: 'nilai_tugas' | 'nilai_uts' | 'nilai_uas', val: string) => {
    const num = val === '' ? null : Number(val);
    if (num !== null && (num < 0 || num > 100)) return;
    setScores({
      ...scores,
      [siswaId]: {
        ...scores[siswaId],
        [type]: num,
      },
    });
  };

  const handleSave = async () => {
    if (!selectedMapelId || studentScores.length === 0) {
      toast.error('Tidak ada data nilai untuk disimpan');
      return;
    }

    const payload = {
      mapel_id: selectedMapelId,
      scores: studentScores.map(s => ({
        siswa_id: s.siswa_id,
        nilai_tugas: scores[s.siswa_id]?.nilai_tugas ?? undefined,
        nilai_uts: scores[s.siswa_id]?.nilai_uts ?? undefined,
        nilai_uas: scores[s.siswa_id]?.nilai_uas ?? undefined,
      })),
    };

    const saveToast = toast.loading('Menyimpan nilai...');

    try {
      await saveScoresMutation.mutateAsync(payload);
      toast.dismiss(saveToast);
      toast.success('Nilai berhasil diperbarui!');
    } catch (err) {
      toast.dismiss(saveToast);
      toast.error('Gagal menyimpan nilai.');
    }
  };

  return (
    <AdminLayout title="Buku Nilai Harian (Spreadsheet)">
      
      {/* Selectors Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm p-6 border border-slate-100 dark:border-slate-800 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 pl-1">Pilih Kelas Binaan</label>
            <select 
              value={selectedKelasId} 
              onChange={e => setSelectedKelasId(e.target.value)} 
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
            >
              {guruClasses.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 pl-1">Pilih Mata Pelajaran</label>
            <select 
              value={selectedMapelId} 
              onChange={e => setSelectedMapelId(e.target.value)} 
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
            >
              {guruMapelList.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500"/> Lembar Penilaian {targetKelasNama || 'Kelas'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5"><Keyboard className="w-3.5 h-3.5"/> Gunakan tombol <kbd className="px-1.5 bg-slate-200 dark:bg-slate-700 dark:bg-slate-700 rounded text-[10px] mx-1">Tab</kbd> atau <kbd className="px-1.5 bg-slate-200 dark:bg-slate-700 dark:bg-slate-700 rounded text-[10px] mx-1">Enter</kbd> untuk pindah kolom cepat.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSave}
              disabled={studentScores.length === 0}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" /> Simpan Nilai
            </button>
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          {isScoresLoading ? (
             <div className="flex flex-col items-center justify-center py-16 gap-2">
               <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-xs text-slate-400 font-semibold">Memuat daftar siswa dan nilai...</p>
             </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse border border-slate-200 dark:border-slate-700">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 w-12 text-center">No</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 min-w-[200px]">Nama Siswa</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 min-w-[120px] text-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">Nilai Tugas</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 min-w-[120px] text-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">Nilai UTS</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 min-w-[120px] text-center bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">Nilai UAS</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 min-w-[120px] text-center bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">Rata-Rata</th>
                  <th className="p-3 border border-slate-200 dark:border-slate-700 min-w-[120px] text-center bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300">Status UH</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900">
                {studentScores.length > 0 ? studentScores.map((siswa, index) => {
                  const t = scores[siswa.siswa_id]?.nilai_tugas;
                  const uts = scores[siswa.siswa_id]?.nilai_uts;
                  const uas = scores[siswa.siswa_id]?.nilai_uas;
                  
                  let rata = 0;
                  let count = 0;
                  if (t !== null && t !== undefined) { rata += t; count++; }
                  if (uts !== null && uts !== undefined) { rata += uts; count++; }
                  if (uas !== null && uas !== undefined) { rata += uas; count++; }
                  
                  const avg = count > 0 ? (rata / count).toFixed(1) : '-';

                  return (
                    <tr key={siswa.siswa_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-2 border border-slate-200 dark:border-slate-700 text-center text-slate-400 font-bold">{index + 1}</td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white px-4">
                        <div className="flex items-center gap-3">
                          {siswa.name}
                        </div>
                      </td>
                      <td className="p-1 border border-slate-200 dark:border-slate-700">
                        <input type="number" value={scores[siswa.siswa_id]?.nilai_tugas ?? ''} onChange={(e) => handleScoreChange(siswa.siswa_id, 'nilai_tugas', e.target.value)} className="w-full h-full p-2 text-center bg-transparent focus:bg-indigo-50 dark:focus:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded font-bold dark:text-white" placeholder="-" />
                      </td>
                      <td className="p-1 border border-slate-200 dark:border-slate-700">
                        <input type="number" value={scores[siswa.siswa_id]?.nilai_uts ?? ''} onChange={(e) => handleScoreChange(siswa.siswa_id, 'nilai_uts', e.target.value)} className="w-full h-full p-2 text-center bg-transparent focus:bg-indigo-50 dark:focus:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded font-bold dark:text-white" placeholder="-" />
                      </td>
                      <td className="p-1 border border-slate-200 dark:border-slate-700">
                        <input type="number" value={scores[siswa.siswa_id]?.nilai_uas ?? ''} onChange={(e) => handleScoreChange(siswa.siswa_id, 'nilai_uas', e.target.value)} className="w-full h-full p-2 text-center bg-transparent focus:bg-indigo-50 dark:focus:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded font-bold dark:text-white" placeholder="-" />
                      </td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 text-center font-black text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800/50">
                        {avg}
                      </td>
                      <td className="p-2 border border-slate-200 dark:border-slate-700 text-center">
                        {(() => {
                          const mon = monitoringData?.data?.find((m: any) => String(m.siswa_id) === String(siswa.siswa_id));
                          if (!mon) return <span className="text-xs text-slate-400">-</span>;
                          return (
                            <div className="flex flex-col items-center gap-1">
                              {getStatusBadge(mon.status)}
                              <span className="text-[10px] text-slate-400">{mon.avg_percent}%</span>
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                     <td colSpan={7} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                       Tidak ada siswa terdaftar di kelas ini.
                     </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
