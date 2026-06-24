import { useState } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { UserCheck, Clock, AlertTriangle } from 'lucide-react';
import { MOCK_ABSENSI_HARI_INI, STATUS_ABSENSI_BADGE, type StatusAbsensi } from '../../../../types/absensi';
import { toast } from 'sonner';

export default function GuruAbsensi() {
  const [absensi, setAbsensi] = useState(MOCK_ABSENSI_HARI_INI.filter(a => a.kelas.startsWith('X-')));

  const hadir = absensi.filter(a => a.statusMasuk === 'hadir').length;
  const terlambat = absensi.filter(a => a.statusMasuk === 'terlambat').length;
  const alpha = absensi.filter(a => a.statusMasuk === 'alpha').length;

  const handleManual = (id: string, status: StatusAbsensi) => {
    setAbsensi(prev => prev.map(a => a.id === id ? { ...a, statusMasuk: status, jamMasuk: status === 'alpha' ? undefined : new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }), metode: 'manual' as const } : a));
    toast.success(`Status diubah`);
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

      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Hari ini, {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {absensi.map(a => (
            <div key={a.id} className="p-4 flex flex-wrap items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 dark:text-white text-sm">{a.nama}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{a.kelas} • {a.jamMasuk || '-'} {a.jamPulang ? `• Pulang ${a.jamPulang}` : ''}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_ABSENSI_BADGE[a.statusMasuk].color}`}>
                {STATUS_ABSENSI_BADGE[a.statusMasuk].label}
              </span>
              <div className="flex gap-1">
                <button onClick={() => handleManual(a.id, 'hadir')} className="text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2 py-1 rounded-lg transition-colors">H</button>
                <button onClick={() => handleManual(a.id, 'izin')} className="text-[10px] font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-2 py-1 rounded-lg transition-colors">I</button>
                <button onClick={() => handleManual(a.id, 'sakit')} className="text-[10px] font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 px-2 py-1 rounded-lg transition-colors">S</button>
                <button onClick={() => handleManual(a.id, 'alpha')} className="text-[10px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors">A</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
