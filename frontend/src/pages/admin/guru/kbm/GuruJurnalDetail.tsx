import AdminLayout from '../../../../components/admin/AdminLayout';
import { CalendarDays, ArrowLeft, Save, Printer, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useJurnalDetail, useUpdateJurnal } from '../../../../hooks/useJurnal';
import { useUsers } from '../../../../hooks/useUsers';
import { toast } from 'sonner';

export default function GuruJurnalDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: jurnal, isLoading: isJurnalLoading, refetch } = useJurnalDetail(id ?? null);
  const { data: allSiswa = [], isLoading: isSiswaLoading } = useUsers('siswa');
  const updateJurnalMutation = useUpdateJurnal();

  const [topik, setTopik] = useState('');
  const [attendance, setAttendance] = useState<Record<string, string>>({});

  // Sync state when jurnal data loads
  useEffect(() => {
    if (jurnal) {
      setTopik(jurnal.topik);
      setAttendance(jurnal.kehadiran_json || {});
    }
  }, [jurnal]);

  const handleAttendanceChange = (siswaId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [siswaId]: status,
    }));
  };

  const handleUpdate = () => {
    if (!id) return;
    if (!topik.trim()) {
      toast.error('Topik jurnal tidak boleh kosong');
      return;
    }

    updateJurnalMutation.mutate({
      id,
      data: {
        topik: topik.trim(),
        kehadiran_json: attendance,
      }
    }, {
      onSuccess: () => {
        refetch();
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isJurnalLoading || isSiswaLoading) {
    return (
      <AdminLayout title="Detail Jurnal Mengajar">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </AdminLayout>
    );
  }

  if (!jurnal) {
    return (
      <AdminLayout title="Detail Jurnal Mengajar">
        <div className="text-center py-12 text-slate-400">Jurnal tidak ditemukan.</div>
      </AdminLayout>
    );
  }

  const attendanceMap = attendance;
  const siswaList = allSiswa.filter(s => s.kelas === jurnal.kelas?.nama);

  const countHadir = Object.values(attendanceMap).filter(v => v === 'hadir').length;
  const countSakit = Object.values(attendanceMap).filter(v => v === 'sakit').length;
  const countIzin = Object.values(attendanceMap).filter(v => v === 'izin').length;
  const countAlpha = Object.values(attendanceMap).filter(v => v === 'alpha').length;

  const totalSiswa = siswaList.length;

  return (
    <AdminLayout title="Detail Jurnal Mengajar">
      <div className="mb-6">
        <Link to="/panel/guru/jurnal" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Jurnal
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden print:border-none print:shadow-none">
        
        {/* Header Jurnal */}
        <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                <CalendarDays className="w-4 h-4" />
                <span>{jurnal.tanggal}</span>
              </div>
              <input 
                type="text"
                value={topik}
                onChange={e => setTopik(e.target.value)}
                className="w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-indigo-500 text-2xl font-black text-slate-800 dark:text-slate-100 focus:outline-none pb-1"
              />
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                {jurnal.mapel?.nama} • Kelas {jurnal.kelas?.nama} • Pengampu: {jurnal.guru?.name}
              </p>
            </div>
            <div className="flex gap-3 shrink-0 print:hidden">
              <button 
                onClick={handleUpdate}
                disabled={updateJurnalMutation.isPending}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {updateJurnalMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Perubahan
              </button>
              <button 
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:border-indigo-300 transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" /> Cetak
              </button>
            </div>
          </div>
        </div>

        {/* Ringkasan Kehadiran */}
        <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Ringkasan Kehadiran KBM</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Total Siswa', value: totalSiswa, color: 'text-slate-850 dark:text-slate-100' },
              { label: 'Hadir', value: countHadir, color: 'text-emerald-600 dark:text-emerald-450' },
              { label: 'Sakit', value: countSakit, color: 'text-amber-600 dark:text-amber-450' },
              { label: 'Izin', value: countIzin, color: 'text-blue-600 dark:text-blue-450' },
              { label: 'Alpa', value: countAlpha, color: 'text-red-600 dark:text-red-450' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daftar Kehadiran Siswa */}
        <div className="p-6 lg:p-8">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Daftar Kehadiran Siswa</h3>
          {siswaList.length === 0 ? (
            <div className="text-center py-6 text-slate-400">Tidak ada siswa terdaftar di kelas ini.</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 w-16 text-center">No</th>
                    <th className="px-6 py-4">Nama Siswa</th>
                    <th className="px-6 py-4 text-center print:table-cell hidden">Status Absen</th>
                    <th className="px-6 py-4 text-center print:hidden">Hadir (H)</th>
                    <th className="px-6 py-4 text-center print:hidden">Sakit (S)</th>
                    <th className="px-6 py-4 text-center print:hidden">Izin (I)</th>
                    <th className="px-6 py-4 text-center print:hidden">Alpa (A)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                  {siswaList.map((siswa, index) => {
                    const status = attendanceMap[siswa.id] || 'hadir';
                    return (
                      <tr key={siswa.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 text-center text-slate-400 font-bold">{index + 1}</td>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{siswa.name}</td>
                        
                        {/* Print view only status */}
                        <td className="px-6 py-4 text-center print:table-cell hidden font-bold capitalize">
                          {status}
                        </td>

                        {/* Interactive Radios (Hidden on print) */}
                        <td className="px-6 py-4 text-center print:hidden">
                          <input 
                            type="radio" 
                            name={`status-${siswa.id}`} 
                            checked={status === 'hadir'} 
                            onChange={() => handleAttendanceChange(siswa.id, 'hadir')}
                            className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 cursor-pointer" 
                          />
                        </td>
                        <td className="px-6 py-4 text-center print:hidden">
                          <input 
                            type="radio" 
                            name={`status-${siswa.id}`} 
                            checked={status === 'sakit'} 
                            onChange={() => handleAttendanceChange(siswa.id, 'sakit')}
                            className="w-5 h-5 text-amber-500 focus:ring-amber-500 cursor-pointer" 
                          />
                        </td>
                        <td className="px-6 py-4 text-center print:hidden">
                          <input 
                            type="radio" 
                            name={`status-${siswa.id}`} 
                            checked={status === 'izin'} 
                            onChange={() => handleAttendanceChange(siswa.id, 'izin')}
                            className="w-5 h-5 text-blue-500 focus:ring-blue-500 cursor-pointer" 
                          />
                        </td>
                        <td className="px-6 py-4 text-center print:hidden">
                          <input 
                            type="radio" 
                            name={`status-${siswa.id}`} 
                            checked={status === 'alpha'} 
                            onChange={() => handleAttendanceChange(siswa.id, 'alpha')}
                            className="w-5 h-5 text-red-500 focus:ring-red-500 cursor-pointer" 
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
