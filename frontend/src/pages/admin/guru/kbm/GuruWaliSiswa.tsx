import { useState } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { Search, GraduationCap, UserCheck, X, AlertCircle } from 'lucide-react';
import { STATUS_ABSENSI_BADGE } from '../../../../types/absensi';
import { useAuth } from '../../../../components/auth/AuthContext';
import { useUsers } from '../../../../hooks/useUsers';
import { useAbsensiList, useManualAbsensi } from '../../../../hooks/useAbsensi';
import { useEkskulList } from '../../../../hooks/useEkskul';
import { useRaporList, useSaveNilaiEkskul, useDeleteNilaiEkskul } from '../../../../hooks/useRapor';
import { toast } from 'sonner';

const MOCK_WALI_KELAS = {
  kelas: 'Kelas X-1',
  waliKelas: 'Ahmad Fauzi, S.Pd',
  periode: '2025/2026',
};

export default function GuruWaliSiswa() {
  const { user } = useAuth();
  const kelasBinaan = user?.kelas || 'X-1';
  const todayStr = new Date().toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState<'siswa' | 'perizinan' | 'ekskul'>('siswa');
  const [search, setSearch] = useState('');
  
  // Real Queries & Mutations
  const { data: students = [] } = useUsers('siswa', search, kelasBinaan);
  const { data: todayAbsensi = [] } = useAbsensiList({ start_date: todayStr, end_date: todayStr });
  const { data: ekskulList = [] } = useEkskulList();
  const { data: raporResponse } = useRaporList();
  const rapors = Array.isArray(raporResponse) ? raporResponse : (raporResponse as any)?.data || [];

  const manualAbsensiMutation = useManualAbsensi();
  const saveEkskulMutation = useSaveNilaiEkskul();
  const deleteEkskulMutation = useDeleteNilaiEkskul();

  // Inline forms states
  const [inlinePermitSiswaId, setInlinePermitSiswaId] = useState<string | null>(null);
  const [permitStatus, setPermitStatus] = useState<'izin' | 'sakit'>('izin');
  const [permitReason, setPermitReason] = useState('');

  const [inlineEkskulSiswaId, setInlineEkskulSiswaId] = useState<string | null>(null);
  const [selectedEkskulId, setSelectedEkskulId] = useState('');
  const [ekskulNilai, setEkskulNilai] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [ekskulKeterangan, setEkskulKeterangan] = useState('');

  const filteredStudents = students;

  const handleSavePermit = (siswaId: string) => {
    if (!permitReason) {
      toast.error('Keterangan izin/sakit wajib diisi');
      return;
    }
    
    manualAbsensiMutation.mutate({
      user_id: Number(siswaId),
      tipe: permitStatus,
      tanggal: todayStr,
      keterangan: permitReason,
      waktu_masuk: '07:00:00',
    }, {
      onSuccess: () => {
        setInlinePermitSiswaId(null);
        setPermitReason('');
        toast.success('Dispensasi berhasil diajukan');
      }
    });
  };

  const handleSaveEkskul = (siswaId: string, _namaSiswa: string) => {
    if (!selectedEkskulId) {
      toast.error('Pilih ekstrakurikuler terlebih dahulu');
      return;
    }
    
    saveEkskulMutation.mutate({
      siswa_id: siswaId,
      ekskul_id: selectedEkskulId,
      nilai: ekskulNilai,
      keterangan: ekskulKeterangan,
    }, {
      onSuccess: () => {
        setInlineEkskulSiswaId(null);
        setSelectedEkskulId('');
        setEkskulKeterangan('');
      }
    });
  };

  return (
    <AdminLayout title="Wali Kelas Binaan">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm p-6 border border-slate-100 dark:border-slate-800 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">{MOCK_WALI_KELAS.kelas}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Wali Kelas: {MOCK_WALI_KELAS.waliKelas} • {MOCK_WALI_KELAS.periode}</p>
          </div>
        </div>
        <div className="relative max-w-xs w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Cari siswa..." 
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button 
            onClick={() => { setActiveTab('siswa'); setSelectedBayarSiswaNull(); }}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'siswa' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Daftar Siswa Kelas
          </button>
          <button 
            onClick={() => { setActiveTab('perizinan'); setSelectedBayarSiswaNull(); }}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'perizinan' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Presensi & Perizinan RFID
          </button>
          <button 
            onClick={() => { setActiveTab('ekskul'); setSelectedBayarSiswaNull(); }}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'ekskul' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            Input Nilai Ekstrakurikuler
          </button>
        </div>

        {/* Tab 1: Daftar Siswa */}
        {activeTab === 'siswa' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">ID Siswa</th>
                  <th className="px-6 py-4">Nama Siswa</th>
                  <th className="px-6 py-4">UID RFID</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-white">SISWA-{s.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{s.name}</td>
                    <td className="px-6 py-4 font-mono text-xs">{s.uid_rfid || 'Belum Registrasi'}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full">
                        Aktif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Presensi & Perizinan RFID */}
        {activeTab === 'perizinan' && (
          <div>
            <div className="bg-amber-50 dark:bg-amber-500/5 p-4 border-b border-amber-100 dark:border-amber-500/10 text-xs text-amber-800 dark:text-amber-300 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
              <div>
                Menampilkan log tap RFID gerbang utama hari ini (<strong>{todayStr}</strong>). Anda dapat memberikan dispensasi (Izin/Sakit) untuk siswa yang statusnya Alpha atau Terlambat.
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Nama Siswa</th>
                    <th className="px-6 py-4 text-center">Jam Tap Masuk</th>
                    <th className="px-6 py-4 text-center">Status Presensi</th>
                    <th className="px-6 py-4">Keterangan / Catatan</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredStudents.map((s) => {
                    const absensi = todayAbsensi.find((a: any) => String(a.siswa_id || a.user_id) === String(s.id)) as any;
                    const status = absensi ? (absensi.status_masuk || absensi.tipe) : 'alpha';
                    const jam = absensi?.jam_masuk || absensi?.waktu_masuk || '—';
                    const catatan = absensi?.catatan || absensi?.keterangan || '—';
                    
                    return (
                      <tr key={s.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${inlinePermitSiswaId === s.id ? 'bg-indigo-50/20 dark:bg-indigo-500/5' : ''}`}>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{s.name}</td>
                        <td className="px-6 py-4 text-center font-mono font-medium text-slate-600 dark:text-slate-300">{jam}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_ABSENSI_BADGE[status as any]?.color || 'bg-slate-100'}`}>
                            {STATUS_ABSENSI_BADGE[status as any]?.label || status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{catatan}</td>
                        <td className="px-6 py-4 text-right">
                          {status !== 'hadir' ? (
                            <button 
                              onClick={() => {
                                setInlinePermitSiswaId(inlinePermitSiswaId === s.id ? null : s.id);
                                setInlineEkskulSiswaId(null);
                              }}
                              className="text-xs font-bold text-indigo-600 hover:underline"
                            >
                              {inlinePermitSiswaId === s.id ? 'Batal' : 'Validasi Izin'}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Inline Permission Form Drawer */}
            {inlinePermitSiswaId && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
                <div className="max-w-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                      Form Dispensasi Kehadiran: <span className="text-indigo-600">{filteredStudents.find(s => s.id === inlinePermitSiswaId)?.name}</span>
                    </h4>
                    <button onClick={() => setInlinePermitSiswaId(null)} className="text-slate-400"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <label onClick={() => setPermitStatus('izin')} className={`p-3 border-2 rounded-xl text-center cursor-pointer transition-all flex flex-col justify-center items-center ${permitStatus === 'izin' ? 'border-indigo-600 bg-white dark:bg-slate-900 font-bold' : 'border-slate-200 dark:border-slate-700'}`}>
                      <span className="text-sm text-slate-800 dark:text-white">Izin</span>
                      <span className="text-[10px] text-slate-400">Ada surat dispensasi</span>
                    </label>
                    <label onClick={() => setPermitStatus('sakit')} className={`p-3 border-2 rounded-xl text-center cursor-pointer transition-all flex flex-col justify-center items-center ${permitStatus === 'sakit' ? 'border-indigo-600 bg-white dark:bg-slate-900 font-bold' : 'border-slate-200 dark:border-slate-700'}`}>
                      <span className="text-sm text-slate-800 dark:text-white">Sakit</span>
                      <span className="text-[10px] text-slate-400">Ada surat keterangan dokter</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Alasan / Keterangan</label>
                    <textarea 
                      value={permitReason} 
                      onChange={e => setPermitReason(e.target.value)} 
                      placeholder="Contoh: Mengikuti kejuaraan taekwondo tingkat kabupaten / Demam tinggi" 
                      rows={2} 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleSavePermit(inlinePermitSiswaId)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition-all active:scale-95 shadow-md shadow-indigo-600/10">
                      Simpan Izin / Sakit
                    </button>
                    <button onClick={() => setInlinePermitSiswaId(null)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold px-4 py-2 rounded-xl text-xs">
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Input Nilai Ekstrakurikuler */}
        {activeTab === 'ekskul' && (
          <div>
            <div className="bg-indigo-50/50 dark:bg-indigo-500/5 p-4 border-b border-indigo-100 dark:border-indigo-500/10 text-xs text-indigo-800 dark:text-indigo-300 flex gap-2">
              <UserCheck className="w-4 h-4 shrink-0 text-indigo-500" />
              <div>
                Tentukan nilai keikutsertaan kegiatan ekstrakurikuler siswa kelas binaan untuk dicantumkan di rapor semester akhir.
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Nama Siswa</th>
                    <th className="px-6 py-4">Ekstrakurikuler Diikuti</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredStudents.map((s) => {
                    const studentRapor = rapors.find((r: any) => String(r.siswa_id) === String(s.id));
                    const nilaiEkskul = (studentRapor?.nilai_ekskuls || []).map((ne: any) => ({
                      id: ne.id,
                      ekskulNama: ne.ekskul?.nama || 'Ekskul',
                      nilai: ne.nilai,
                      keterangan: ne.keterangan,
                    }));
                    
                    return (
                      <tr key={s.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${inlineEkskulSiswaId === s.id ? 'bg-indigo-50/20 dark:bg-indigo-500/5' : ''}`}>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{s.name}</td>
                        <td className="px-6 py-4">
                          {nilaiEkskul.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {nilaiEkskul.map((ne: any) => (
                                <span key={ne.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-bold border border-indigo-200 dark:border-indigo-500/20">
                                  {ne.ekskulNama} ({ne.nilai})
                                  <button onClick={() => {
                                    if (window.confirm(`Hapus keikutsertaan ekskul ${ne.ekskulNama} siswa ${s.name}?`)) {
                                      deleteEkskulMutation.mutate(ne.id);
                                    }
                                  }} className="text-red-500 hover:text-red-700 font-bold ml-1">×</button>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">Belum ada ekskul</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              setInlineEkskulSiswaId(inlineEkskulSiswaId === s.id ? null : s.id);
                              setInlinePermitSiswaId(null);
                              setSelectedEkskulId(ekskulList[0]?.id || '');
                            }}
                            className="text-xs font-bold text-indigo-600 hover:underline"
                          >
                            {inlineEkskulSiswaId === s.id ? 'Batal' : 'Input Nilai Ekskul'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Inline Extracurricular Input Form */}
            {inlineEkskulSiswaId && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom-3 duration-200">
                <div className="max-w-md space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                      Input Nilai Ekstrakurikuler: <span className="text-indigo-600">{filteredStudents.find(s => s.id === inlineEkskulSiswaId)?.name}</span>
                    </h4>
                    <button onClick={() => setInlineEkskulSiswaId(null)} className="text-slate-400"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Kegiatan Ekskul</label>
                    <select 
                      value={selectedEkskulId} 
                      onChange={e => setSelectedEkskulId(e.target.value)} 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    >
                      <option value="">Pilih ekstrakurikuler...</option>
                      {ekskulList.map(e => <option key={e.id} value={e.id}>{e.nama}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-bold">Predikat Nilai</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['A', 'B', 'C', 'D'] as const).map(score => (
                        <button 
                          key={score}
                          type="button"
                          onClick={() => setEkskulNilai(score)}
                          className={`py-2 text-center text-xs rounded-xl font-bold transition-all border-2 ${ekskulNilai === score ? 'border-indigo-600 bg-white dark:bg-slate-900 text-indigo-600' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500'}`}
                        >
                          {score === 'A' ? 'A (Sgt Baik)' : score === 'B' ? 'B (Baik)' : score === 'C' ? 'C (Cukup)' : 'D (Kurang)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Deskripsi Pencapaian / Keterangan</label>
                    <textarea 
                      value={ekskulKeterangan} 
                      onChange={e => setEkskulKeterangan(e.target.value)} 
                      placeholder="Contoh: Menunjukkan kemajuan pesat dalam baris-berbaris dan aktif dalam kepanitiaan." 
                      rows={2} 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSaveEkskul(inlineEkskulSiswaId, filteredStudents.find(s => s.id === inlineEkskulSiswaId)?.name || '')} 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition-all active:scale-95 shadow-md shadow-indigo-600/10"
                    >
                      Simpan Nilai Ekskul
                    </button>
                    <button onClick={() => setInlineEkskulSiswaId(null)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold px-4 py-2 rounded-xl text-xs">
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );

  function setSelectedBayarSiswaNull() {
    setInlinePermitSiswaId(null);
    setInlineEkskulSiswaId(null);
  }
}
