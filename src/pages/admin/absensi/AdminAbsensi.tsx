import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { UserCheck, UserX, Clock, AlertTriangle, CalendarDays, Search } from 'lucide-react';
import { MOCK_ABSENSI_HARI_INI, STATUS_ABSENSI_BADGE, type SiswaAbsensi, type StatusAbsensi } from '../../../types/absensi';
import { MOCK_SISWA } from '../../../types/rfid';
import { toast } from 'sonner';

export default function AdminAbsensi() {
  const [absensi, setAbsensi] = useState<SiswaAbsensi[]>(MOCK_ABSENSI_HARI_INI);
  const [filterKelas, setFilterKelas] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const hadir = absensi.filter(a => a.statusMasuk === 'hadir').length;
  const terlambat = absensi.filter(a => a.statusMasuk === 'terlambat').length;
  const alpha = absensi.filter(a => a.statusMasuk === 'alpha').length;

  const filtered = absensi.filter(a => {
    if (filterKelas && a.kelas !== filterKelas) return false;
    if (filterStatus && a.statusMasuk !== filterStatus) return false;
    if (search && !a.nama.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const kelasList = [...new Set(absensi.map(a => a.kelas))];
  const siswaTanpaAbsen = MOCK_SISWA.filter(s => !absensi.find(a => a.siswaId === s.id));

  const handleMarkManual = (siswaId: string, status: StatusAbsensi) => {
    const siswa = MOCK_SISWA.find(s => s.id === siswaId);
    if (!siswa) return;
    const newAbsen: SiswaAbsensi = {
      id: `manual-${Date.now()}`,
      siswaId,
      nama: siswa.nama,
      kelas: siswa.kelas,
      tanggal: new Date().toISOString().split('T')[0],
      jamMasuk: status === 'alpha' ? undefined : new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }),
      statusMasuk: status,
      metode: 'manual',
      catatan: 'Diisi manual oleh admin',
    };
    setAbsensi(prev => [...prev, newAbsen]);
    toast.success(`${siswa.nama} — ${STATUS_ABSENSI_BADGE[status].label}`);
  };

  return (
    <AdminLayout title="Absensi Harian">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Hadir</p><h3 className="text-3xl font-black mt-1">{hadir}</h3><p className="text-[10px] text-emerald-200 mt-1">Siswa</p></div>
          <UserCheck className="w-10 h-10 text-emerald-200 opacity-80" />
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-orange-100 uppercase tracking-wider">Terlambat</p><h3 className="text-3xl font-black mt-1">{terlambat}</h3><p className="text-[10px] text-orange-200 mt-1">Siswa</p></div>
          <Clock className="w-10 h-10 text-orange-200 opacity-80" />
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-red-100 uppercase tracking-wider">Alpha</p><h3 className="text-3xl font-black mt-1">{alpha}</h3><p className="text-[10px] text-red-200 mt-1">Siswa</p></div>
          <UserX className="w-10 h-10 text-red-200 opacity-80" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <CalendarDays className="w-4 h-4 text-indigo-500" />
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex-1" />
          <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 dark:text-slate-300">
            <option value="">Semua Kelas</option>
            {kelasList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 dark:text-slate-300">
            <option value="">Semua Status</option>
            {Object.entries(STATUS_ABSENSI_BADGE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama..." className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
              <tr><th className="px-5 py-4">Nama</th><th className="px-5 py-4">Kelas</th><th className="px-5 py-4">Masuk</th><th className="px-5 py-4">Pulang</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Metode</th><th className="px-5 py-4">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{a.nama}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{a.kelas}</td>
                  <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-200">{a.jamMasuk || '-'}</td>
                  <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-200">{a.jamPulang || '-'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_ABSENSI_BADGE[a.statusMasuk].color}`}>
                      {STATUS_ABSENSI_BADGE[a.statusMasuk].label}
                    </span>
                    {a.statusPulang && (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ml-1 ${STATUS_ABSENSI_BADGE[a.statusPulang].color}`}>
                        {STATUS_ABSENSI_BADGE[a.statusPulang].label}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold ${a.metode === 'rfid' ? 'text-indigo-600' : 'text-amber-600'}`}>
                      {a.metode === 'rfid' ? 'RFID' : 'Manual'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => {
                      const updated = absensi.map(ab => ab.id === a.id ? { ...ab, jamPulang: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }), statusPulang: 'hadir' as const } : ab);
                      setAbsensi(updated);
                      toast.success(`${a.nama} — Absen pulang`);
                    }} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                      Pulang
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {siswaTanpaAbsen.length > 0 && (
        <div className="mt-6 bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-5 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Siswa Belum Absen ({siswaTanpaAbsen.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {siswaTanpaAbsen.map(s => (
              <div key={s.id} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{s.nama}</span>
                <button onClick={() => handleMarkManual(s.id, 'hadir')} className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2 py-1 rounded-lg transition-colors">Hadir</button>
                <button onClick={() => handleMarkManual(s.id, 'izin')} className="text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 px-2 py-1 rounded-lg transition-colors">Izin</button>
                <button onClick={() => handleMarkManual(s.id, 'sakit')} className="text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 px-2 py-1 rounded-lg transition-colors">Sakit</button>
                <button onClick={() => handleMarkManual(s.id, 'alpha')} className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors">Alpha</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
