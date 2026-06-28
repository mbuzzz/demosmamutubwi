import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { UserCheck, Clock, AlertTriangle } from 'lucide-react';
import { STATUS_ABSENSI_BADGE, type StatusAbsensi } from '../../../../types/absensi';
import { useAbsensiList, useManualAbsensi } from '../../../../hooks/useAbsensi';
import { useUsers } from '../../../../hooks/useUsers';
import { useGuruClasses } from '../../../../hooks/usePenugasan';
import { toast } from 'sonner';

export default function GuruAbsensi() {
  const today = new Date().toISOString().split('T')[0];
  const { data: absensiList = [], isLoading } = useAbsensiList({ start_date: today, end_date: today, role: 'siswa' });
  const { data: allSiswa = [] } = useUsers('siswa');
  const { data: guruClasses = [] } = useGuruClasses();
  const manualAbsen = useManualAbsensi();

  const [selectedKelasId, setSelectedKelasId] = useState('');

  // Default to first class if available
  useEffect(() => {
    if (!selectedKelasId && guruClasses.length > 0) {
      setSelectedKelasId(String(guruClasses[0].id));
    }
  }, [guruClasses, selectedKelasId]);

  const targetKelasObj = guruClasses.find(c => String(c.id) === selectedKelasId);
  const targetKelas = targetKelasObj ? targetKelasObj.nama : ''; 

  const absensi = absensiList.filter(a => a.user?.kelas === targetKelas);
  const siswaKelas = allSiswa.filter(s => s.kelas === targetKelas);
  
  // Combine absensi with all students in the class
  const classRoster = siswaKelas.map(siswa => {
    const record = absensi.find(a => a.user_id === parseInt(siswa.id));
    return {
      siswa,
      absensi: record
    };
  });

  const hadir = absensi.filter(a => a.tipe === 'hadir').length;
  const terlambat = absensi.filter(a => a.tipe === 'terlambat').length;
  const alpha = absensi.filter(a => a.tipe === 'alpha').length;

  const handleManual = (userId: string, status: StatusAbsensi) => {
    manualAbsen.mutate({
      user_id: parseInt(userId),
      tipe: status,
      tanggal: today,
      waktu_masuk: status !== 'alpha' && status !== 'izin' && status !== 'sakit' ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }) : undefined,
      keterangan: 'Diupdate oleh guru'
    }, {
      onSuccess: () => {
        toast.success(`Status diubah`);
      },
      onError: () => {
        toast.error('Gagal merubah status');
      }
    });
  };

  return (
    <AdminLayout title="Absensi Kelas Ajar">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Hadir</p>
          <h3 className="text-3xl font-black mt-1">{hadir}</h3>
          <div><UserCheck className="w-10 h-10 text-emerald-200 opacity-80 float-right -mt-8" /></div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-orange-100 uppercase tracking-wider">Terlambat</p>
          <h3 className="text-3xl font-black mt-1">{terlambat}</h3>
          <div><Clock className="w-10 h-10 text-orange-200 opacity-80 float-right -mt-8" /></div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-red-100 uppercase tracking-wider">Alpha</p>
          <h3 className="text-3xl font-black mt-1">{alpha}</h3>
          <div><AlertTriangle className="w-10 h-10 text-red-200 opacity-80 float-right -mt-8" /></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Hari ini, {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <select 
            value={selectedKelasId} 
            onChange={(e) => setSelectedKelasId(e.target.value)} 
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
          >
            <option value="">Pilih Kelas</option>
            {guruClasses.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Memuat data absensi...</div>
        ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {classRoster.map(item => {
            const statusMasuk = item.absensi?.tipe as StatusAbsensi | undefined;
            return (
            <div key={item.siswa.id} className="p-4 flex flex-wrap items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 dark:text-white text-sm">{item.siswa.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.siswa.kelas || '-'} • {item.absensi?.waktu_masuk || '-'} {item.absensi?.waktu_pulang ? `• Pulang ${item.absensi.waktu_pulang}` : ''}</p>
              </div>
              {statusMasuk ? (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_ABSENSI_BADGE[statusMasuk].color}`}>
                  {STATUS_ABSENSI_BADGE[statusMasuk].label}
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  Belum Absen
                </span>
              )}
              <div className="flex gap-1">
                <button disabled={manualAbsen.isPending} onClick={() => handleManual(item.siswa.id, 'hadir')} className="text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-50">H</button>
                <button disabled={manualAbsen.isPending} onClick={() => handleManual(item.siswa.id, 'izin')} className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-50">I</button>
                <button disabled={manualAbsen.isPending} onClick={() => handleManual(item.siswa.id, 'sakit')} className="text-[10px] font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-50">S</button>
                <button disabled={manualAbsen.isPending} onClick={() => handleManual(item.siswa.id, 'alpha')} className="text-[10px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-50">A</button>
              </div>
            </div>
          )})}
        </div>
        )}
      </div>
    </AdminLayout>
  );
}
