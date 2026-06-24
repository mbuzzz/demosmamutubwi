import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { CalendarDays, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { MOCK_ABSENSI_HARI_INI, MOCK_REKAP_ABSENSI, STATUS_ABSENSI_BADGE } from '../../../types/absensi';

export default function SiswaAbsensi() {
  const [activeTab, setActiveTab] = useState<'harian' | 'rekap'>('harian');

  const absenSaya = MOCK_ABSENSI_HARI_INI.filter(a => a.siswaId === 's1');
  const rekapSaya = MOCK_REKAP_ABSENSI.find(r => r.siswaId === 's1');
  const totalHari = rekapSaya ? rekapSaya.hadir + rekapSaya.izin + rekapSaya.sakit + rekapSaya.alpha + rekapSaya.terlambat : 0;
  const persenKehadiran = totalHari > 0 ? Math.round((rekapSaya?.hadir || 0) / totalHari * 100) : 0;

  return (
    <AdminLayout title="Absensi Saya">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Kehadiran</p>
          <h3 className="text-3xl font-black mt-1">{persenKehadiran}%</h3>
          <p className="text-[10px] text-indigo-200 mt-1">Semester Ganjil 2025/2026</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Hadir</p>
          <h3 className="text-3xl font-black text-emerald-600 mt-1">{rekapSaya?.hadir || 0}</h3>
          <p className="text-[10px] text-slate-400 mt-1">Hari</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tanpa Keterangan</p>
          <h3 className="text-3xl font-black text-red-500 mt-1">{rekapSaya?.alpha || 0}</h3>
          <p className="text-[10px] text-slate-400 mt-1">Hari</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          {([
            { key: 'harian' as const, label: 'Absen Harian' },
            { key: 'rekap' as const, label: 'Rekap Semester' },
          ]).map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t.key ? 'border-indigo-600 text-indigo-600 bg-indigo-50/20 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'harian' && (
            <div className="space-y-3">
              {absenSaya.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-8">Belum ada data absensi</p>
              ) : (
                absenSaya.map(a => (
                  <div key={a.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-indigo-500" />
                        <span className="font-bold text-slate-800 dark:text-white text-sm">{a.tanggal}</span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_ABSENSI_BADGE[a.statusMasuk].color}`}>
                        {STATUS_ABSENSI_BADGE[a.statusMasuk].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      {a.jamMasuk && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Masuk: {a.jamMasuk}</span>}
                      {a.jamPulang && <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Pulang: {a.jamPulang}</span>}
                      <span>Metode: {a.metode === 'rfid' ? 'RFID' : 'Manual'}</span>
                    </div>
                    {a.catatan && <p className="text-xs text-slate-400 mt-2 italic">{a.catatan}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'rekap' && rekapSaya && (
            <div className="max-w-md mx-auto">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-6 text-center mb-6">
                <BarChart3 className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                <h3 className="font-black text-4xl text-indigo-600 dark:text-indigo-400">{persenKehadiran}%</h3>
                <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 mt-1">Persentase Kehadiran</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Hadir', value: rekapSaya.hadir, color: 'text-emerald-600' },
                  { label: 'Izin', value: rekapSaya.izin, color: 'text-blue-600' },
                  { label: 'Sakit', value: rekapSaya.sakit, color: 'text-amber-600' },
                  { label: 'Terlambat', value: rekapSaya.terlambat, color: 'text-orange-600' },
                  { label: 'Alpha (Tanpa Ket.)', value: rekapSaya.alpha, color: 'text-red-600' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{item.label}</span>
                    <span className={`text-lg font-black ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
