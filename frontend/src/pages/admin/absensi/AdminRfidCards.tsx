import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { CreditCard, Search, CheckCircle, Settings, Clock, Save, Loader2, Eye, EyeOff, Edit, ScanLine } from 'lucide-react';
import { useRfidCards, useRfidConfig, useUpdateRfidConfig } from '../../../hooks/useRfid';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

type ActiveTab = 'kartu' | 'konfigurasi';

export default function AdminRfidCards() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('kartu');
  const [search, setSearch] = useState('');

  // Konfigurasi states
  const [configPin, setConfigPin] = useState('');
  const [showConfigPin, setShowConfigPin] = useState(false);
  const [jamMasuk, setJamMasuk] = useState('07:00');
  const [jamPulang, setJamPulang] = useState('15:00');
  const [toleransi, setToleransi] = useState(15);
  const [batasAlpha, setBatasAlpha] = useState('08:00');

  const { data: kartu = [], isLoading } = useRfidCards();
  const { data: rfidConfig, isLoading: loadingConfig } = useRfidConfig();
  const updateConfig = useUpdateRfidConfig();

  // Sync config to local state
  useEffect(() => {
    if (rfidConfig) {
      setConfigPin(rfidConfig.pin || '');
      setJamMasuk(rfidConfig.jam_masuk?.slice(0, 5) || '07:00');
      setJamPulang(rfidConfig.jam_pulang?.slice(0, 5) || '15:00');
      setToleransi(rfidConfig.toleransi_terlambat || 15);
      setBatasAlpha(rfidConfig.batas_alpha?.slice(0, 5) || '08:00');
    }
  }, [rfidConfig]);

  const filtered = kartu.filter(k => {
    if (search && !k.user?.name.toLowerCase().includes(search.toLowerCase()) && !k.uid_rfid.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSaveConfig = async () => {
    if (!configPin || configPin.length !== 6) { toast.error('PIN harus 6 digit'); return; }
    try {
      await updateConfig.mutateAsync({
        pin: configPin,
        jam_masuk: jamMasuk,
        jam_pulang: jamPulang,
        toleransi_terlambat: toleransi,
        batas_alpha: batasAlpha,
      });
      toast.success('Konfigurasi absensi berhasil disimpan');
    } catch {
      toast.error('Gagal menyimpan konfigurasi');
    }
  };

  return (
    <AdminLayout title="Manajemen Kartu RFID & Absensi">
      <div className="space-y-6">

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
          <button onClick={() => setActiveTab('kartu')} className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl transition-colors ${activeTab === 'kartu' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-b-0 border-slate-200 dark:border-slate-700 -mb-px' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <CreditCard className="w-4 h-4" /> Daftar Kartu RFID
          </button>
          <button onClick={() => setActiveTab('konfigurasi')} className={`flex items-center gap-2 px-6 py-3 font-bold text-sm rounded-t-xl transition-colors ${activeTab === 'konfigurasi' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-b-0 border-slate-200 dark:border-slate-700 -mb-px' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <Settings className="w-4 h-4" /> Konfigurasi Absensi
          </button>
        </div>

        {/* TAB: DAFTAR KARTU */}
        {activeTab === 'kartu' && (
          <div className="bg-white dark:bg-slate-900 rounded-b-2xl rounded-tr-2xl border border-slate-200 dark:border-slate-700 shadow-card dark:shadow-none overflow-hidden">

            {/* Toolbar */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari nama atau UID kartu..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white transition-all"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <ScanLine className="w-4 h-4 text-indigo-500" />
                <span>{kartu.filter(k => k.status === 'aktif').length} kartu aktif dari {kartu.length} total</span>
              </div>
            </div>

            {/* Info banner */}
            <div className="mx-6 mt-4 p-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl text-xs text-indigo-700 dark:text-indigo-300 font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Untuk menambah/mengubah kartu RFID, edit data pengguna di menu <Link to="/panel/users" className="underline font-bold">Users & Pegawai</Link> → isi field "UID Kartu RFID".</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="text-xs text-slate-400 font-semibold">Memuat data kartu...</p>
                </div>
              ) : filtered.length > 0 ? (
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">UID Kartu</th>
                      <th className="px-6 py-4">Nama Pemilik</th>
                      <th className="px-6 py-4">Tipe</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.map(k => (
                      <tr key={k.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-white">{k.uid_rfid}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">{k.user?.name || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${k.siswa_id ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                            {k.siswa_id ? 'Siswa' : 'Staf/Guru'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${k.status === 'aktif' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400'}`}>
                            {k.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/panel/users/edit/${k.user_id || k.siswa_id}`} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg transition-colors inline-block" title="Edit User">
                            <Edit className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-16 text-slate-400 dark:text-slate-500 font-medium">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">Belum ada kartu RFID terdaftar</p>
                  <p className="text-xs mt-1">Daftarkan kartu melalui menu Users & Pegawai → Edit User → isi UID Kartu RFID</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: KONFIGURASI */}
        {activeTab === 'konfigurasi' && (
          <div className="bg-white dark:bg-slate-900 rounded-b-2xl rounded-tr-2xl border border-slate-200 dark:border-slate-700 shadow-card dark:shadow-none p-6">
            {loadingConfig ? (
              <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
            ) : (
              <div className="max-w-2xl space-y-6">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" /> Pengaturan Jam Absensi & PIN
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">PIN Gatekeeper (6 digit)</label>
                    <div className="relative">
                      <input
                        type={showConfigPin ? 'text' : 'password'}
                        value={configPin}
                        onChange={e => setConfigPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono dark:text-white"
                        placeholder="123456"
                      />
                      <button type="button" onClick={() => setShowConfigPin(!showConfigPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showConfigPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">PIN untuk membuka terminal tap RFID di gerbang sekolah.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Toleransi Keterlambatan (menit)</label>
                    <input type="number" value={toleransi} onChange={e => setToleransi(parseInt(e.target.value) || 0)} min={0} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Jam Masuk Normal</label>
                    <input type="time" value={jamMasuk} onChange={e => setJamMasuk(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Jam Pulang</label>
                    <input type="time" value={jamPulang} onChange={e => setJamPulang(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Batas Alpha (setelah jam ini = alpha)</label>
                    <input type="time" value={batasAlpha} onChange={e => setBatasAlpha(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                    <p className="text-[11px] text-slate-500 mt-1">Jika siswa tap setelah jam ini, status absen akan dianggap "alpha".</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button onClick={handleSaveConfig} disabled={updateConfig.isPending} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors shadow-md active:scale-95 disabled:opacity-50">
                    {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Konfigurasi
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
