import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { Save, AlertCircle, FileText, User } from 'lucide-react';
import { useMapelList } from '../../../../hooks/useMapel';
import { useGuruClasses } from '../../../../hooks/usePenugasan';
import { useTujuanPembelajaranList } from '../../../../hooks/useTujuanPembelajaran';
import { useStudentTpScores, useSaveTpScores } from '../../../../hooks/useNilaiTp';
import { toast } from 'sonner';

export default function GuruNilaiTp() {
  const [selectedKelasId, setSelectedKelasId] = useState('');
  const [selectedMapelId, setSelectedMapelId] = useState('');
  const [selectedTpId, setSelectedTpId] = useState('');

  // Queries & Mutations
  const { data: kelasList = [] } = useGuruClasses();
  const { data: mapelList = [] } = useMapelList();
  
  // Filter mapelList based on what the teacher teaches in the selected class
  const selectedKelasObj = kelasList.find(k => k.id === selectedKelasId);
  const taughtMapelIds = new Set(selectedKelasObj ? selectedKelasObj.mapels.map(m => m.id) : []);
  const guruMapelList = mapelList.filter(m => taughtMapelIds.has(m.id));

  // Find selected mapel to get its tingkat (X, XI, XII)
  const selectedMapel = guruMapelList.find(m => m.id === selectedMapelId);
  const tingkat = selectedMapel ? selectedMapel.tingkat : 'X';

  const { data: tpList = [] } = useTujuanPembelajaranList(selectedMapelId, tingkat);
  const { data: studentScores = [], isLoading: isScoresLoading } = useStudentTpScores(selectedKelasId, selectedMapelId, selectedTpId);

  const saveTpScoresMutation = useSaveTpScores();

  // Local state for scores inputs
  const [scores, setScores] = useState<Record<string, number>>({});

  // Initialize selectors
  if (!selectedKelasId && kelasList.length > 0) {
    setSelectedKelasId(kelasList[0].id);
  }

  // Adjust selected mapel when class changes or on load
  useEffect(() => {
    if (guruMapelList.length > 0) {
      if (!guruMapelList.find(m => m.id === selectedMapelId)) {
        setSelectedMapelId(guruMapelList[0].id);
      }
    } else {
      setSelectedMapelId('');
    }
  }, [guruMapelList, selectedMapelId]);
  
  // Set first TP as default when loaded
  useEffect(() => {
    if (tpList.length > 0) {
      setSelectedTpId(tpList[0].id);
    } else {
      setSelectedTpId('');
    }
  }, [tpList]);

  // Sync local scores state when studentScores loads
  useEffect(() => {
    if (studentScores.length > 0) {
      const initialScores: Record<string, number> = {};
      studentScores.forEach(s => {
        initialScores[s.siswa_id] = s.nilai;
      });
      setScores(initialScores);
    } else {
      setScores({});
    }
  }, [studentScores]);

  const handleScoreChange = (siswaId: string, val: string) => {
    const num = Number(val);
    if (num < 0 || num > 100) return;
    setScores({
      ...scores,
      [siswaId]: num,
    });
  };

  const handleSave = async () => {
    if (!selectedMapelId || !selectedTpId || studentScores.length === 0) {
      toast.error('Tidak ada data nilai untuk disimpan');
      return;
    }

    const payload = {
      mapel_id: selectedMapelId,
      tujuan_pembelajaran_id: selectedTpId,
      scores: studentScores.map(s => ({
        siswa_id: s.siswa_id,
        nilai: scores[s.siswa_id] || 0,
      })),
    };

    const saveToast = toast.loading('Menyimpan dan mengalkulasi nilai rapor...');

    try {
      await saveTpScoresMutation.mutateAsync(payload);
      toast.dismiss(saveToast);
      toast.success('Nilai TP dan Rapor otomatis berhasil diperbarui!');
    } catch (err) {
      toast.dismiss(saveToast);
      toast.error('Gagal menyimpan nilai TP.');
    }
  };

  return (
    <AdminLayout title="Input Nilai per Tujuan Pembelajaran">
      {/* Selectors Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm p-6 border border-slate-100 dark:border-slate-800 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 pl-1">Pilih Kelas Binaan</label>
            <select 
              value={selectedKelasId} 
              onChange={e => setSelectedKelasId(e.target.value)} 
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
            >
              {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
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

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 pl-1">Pilih Tujuan Pembelajaran (TP)</label>
            <select 
              value={selectedTpId} 
              disabled={tpList.length === 0}
              onChange={e => setSelectedTpId(e.target.value)} 
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white disabled:opacity-55 disabled:cursor-not-allowed"
            >
              {tpList.length > 0 ? (
                tpList.map(t => <option key={t.id} value={t.id}>{t.kode} - {t.deskripsi.slice(0, 40)}...</option>)
              ) : (
                <option value="">-- Belum Ada TP Terdaftar --</option>
              )}
            </select>
          </div>
        </div>

        {tpList.length === 0 && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/5 rounded-xl border border-amber-100 dark:border-amber-500/10 text-xs text-amber-800 dark:text-amber-300 flex gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Mata pelajaran ini belum memiliki Tujuan Pembelajaran (TP). Silakan isi TP terlebih dahulu di halaman <strong>Tujuan Pembelajaran (TP)</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Student Grades Table Card */}
      {selectedTpId && (
        <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Input Nilai Siswa
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Mengisi nilai tujuan pembelajaran untuk: <strong>{tpList.find(t => t.id === selectedTpId)?.deskripsi}</strong>
              </p>
            </div>
            <button 
              onClick={handleSave}
              disabled={studentScores.length === 0}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" /> Simpan & Hitung Rapor
            </button>
          </div>

          <div className="overflow-x-auto">
            {isScoresLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-semibold">Memuat daftar siswa...</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 w-16 text-center">No</th>
                    <th className="px-6 py-4">Nama Lengkap Siswa</th>
                    <th className="px-6 py-4">NISN</th>
                    <th className="px-6 py-4 text-center w-48">Nilai Angka (0 - 100)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {studentScores.length > 0 ? (
                    studentScores.map((s, index) => (
                      <tr key={s.siswa_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-center text-slate-400 font-bold">{index + 1}</td>
                        <td className="px-6 py-4 font-bold text-slate-850 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-semibold text-xs">
                            <User className="w-4 h-4" />
                          </div>
                          {s.name}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-300">{s.nip_nisn || '—'}</td>
                        <td className="px-6 py-4 text-center">
                          <input 
                            type="number" 
                            min={0}
                            max={100}
                            value={scores[s.siswa_id] !== undefined ? scores[s.siswa_id] : ''} 
                            onChange={e => handleScoreChange(s.siswa_id, e.target.value)}
                            placeholder="0"
                            className="w-24 px-3 py-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-center font-bold text-indigo-650 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                        Tidak ada siswa terdaftar di kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
