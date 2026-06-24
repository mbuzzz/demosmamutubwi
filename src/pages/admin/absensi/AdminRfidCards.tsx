import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { CreditCard, Plus, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { MOCK_KARTU_RFID, MOCK_SISWA, STATUS_KARTU_BADGE, randomUid, type RfidCard, type StatusKartu } from '../../../types/rfid';
import { toast } from 'sonner';

export default function AdminRfidCards() {
  const [kartu, setKartu] = useState<RfidCard[]>(MOCK_KARTU_RFID);
  const [search, setSearch] = useState('');
  const [showRegistrasi, setShowRegistrasi] = useState(false);
  const [uidBaru, setUidBaru] = useState(randomUid());
  const [siswaIdBaru, setSiswaIdBaru] = useState('');

  const filtered = kartu.filter(k => {
    if (search && !k.nama.toLowerCase().includes(search.toLowerCase()) && !k.uid.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const siswaTanpaKartu = MOCK_SISWA.filter(s => !kartu.find(k => k.siswaId === s.id));

  const handleRegister = () => {
    if (!siswaIdBaru) { toast.error('Pilih siswa'); return; }
    const siswa = MOCK_SISWA.find(s => s.id === siswaIdBaru);
    if (!siswa) return;
    const baru: RfidCard = {
      id: `k-${Date.now()}`,
      uid: uidBaru,
      siswaId: siswa.id,
      nama: siswa.nama,
      kelas: siswa.kelas,
      status: 'aktif',
      terdaftar: new Date().toISOString().split('T')[0],
    };
    setKartu(prev => [...prev, baru]);
    toast.success(`Kartu ${uidBaru} terdaftar untuk ${siswa.nama}`);
    setShowRegistrasi(false);
    setUidBaru(randomUid());
    setSiswaIdBaru('');
  };

  const handleStatusChange = (id: string, status: StatusKartu) => {
    setKartu(prev => prev.map(k => k.id === id ? { ...k, status } : k));
    toast.success(`Status kartu diubah ke ${STATUS_KARTU_BADGE[status].label}`);
  };

  return (
    <AdminLayout title="Manajemen Kartu RFID">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <CreditCard className="w-4 h-4 text-indigo-500" />
            Total {kartu.length} Kartu
          </div>
          <div className="flex-1" />
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama/UID..." className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40" />
          </div>
          <button onClick={() => setShowRegistrasi(!showRegistrasi)} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
            <Plus className="w-3.5 h-3.5" /> Registrasi Baru
          </button>
        </div>

        {showRegistrasi && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 border-b border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-lg space-y-3">
              <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">Registrasi Kartu RFID Baru</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">UID Kartu</label>
                  <div className="flex gap-2">
                    <input type="text" value={uidBaru} onChange={e => setUidBaru(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <button onClick={() => setUidBaru(randomUid())} className="px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                      Generate
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Siswa</label>
                  <select value={siswaIdBaru} onChange={e => setSiswaIdBaru(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">-- Pilih Siswa --</option>
                    {siswaTanpaKartu.map(s => <option key={s.id} value={s.id}>{s.nama} ({s.kelas})</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowRegistrasi(false)} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Batal</button>
                <button onClick={handleRegister} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors">Simpan</button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
              <tr><th className="px-5 py-4">UID Kartu</th><th className="px-5 py-4">Siswa</th><th className="px-5 py-4">Kelas</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Terdaftar</th><th className="px-5 py-4">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filtered.map(k => (
                <tr key={k.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">{k.uid}</td>
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{k.nama}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{k.kelas}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_KARTU_BADGE[k.status].color}`}>
                      {STATUS_KARTU_BADGE[k.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">{k.terdaftar}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      {k.status !== 'aktif' && <button onClick={() => handleStatusChange(k.id, 'aktif')} className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2 py-1 rounded-lg transition-colors"><CheckCircle className="w-3.5 h-3.5 inline mr-0.5" />Aktifkan</button>}
                      {k.status === 'aktif' && <button onClick={() => handleStatusChange(k.id, 'nonaktif')} className="text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 rounded-lg transition-colors">Nonaktifkan</button>}
                      {k.status !== 'hilang' && <button onClick={() => handleStatusChange(k.id, 'hilang')} className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors"><AlertTriangle className="w-3.5 h-3.5 inline mr-0.5" />Hilang</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {siswaTanpaKartu.length > 0 && (
        <div className="mt-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5">
          <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4" /> {siswaTanpaKartu.length} siswa belum memiliki kartu RFID
          </h3>
          <div className="flex flex-wrap gap-2">
            {siswaTanpaKartu.map(s => (
              <span key={s.id} className="text-xs font-semibold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-600 text-slate-700 dark:text-slate-300">
                {s.nama} ({s.kelas})
              </span>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
