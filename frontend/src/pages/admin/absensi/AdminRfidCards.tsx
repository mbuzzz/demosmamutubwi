import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { CreditCard, Plus, Search, AlertTriangle, CheckCircle, Settings, Clock, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { useRfidCards, useCreateRfid, useUpdateRfid, useRfidConfig, useUpdateRfidConfig } from '../../../hooks/useRfid';
import { useUsers } from '../../../hooks/useUsers';
import { toast } from 'sonner';

type ActiveTab = 'kartu' | 'konfigurasi';

export default function AdminRfidCards() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('kartu');
  const [search, setSearch] = useState('');
  const [showRegistrasi, setShowRegistrasi] = useState(false);
  const [uidBaru, setUidBaru] = useState('');
  const [pinBaru, setPinBaru] = useState('');
  const [siswaIdBaru, setSiswaIdBaru] = useState('');

  // Konfigurasi states
  const [configPin, setConfigPin] = useState('');
  const [showConfigPin, setShowConfigPin] = useState(false);
  const [jamMasuk, setJamMasuk] = useState('07:00');
  const [jamPulang, setJamPulang] = useState('15:00');
  const [toleransi, setToleransi] = useState(15);
  const [batasAlpha, setBatasAlpha] = useState('08:00');

  const { data: kartu = [], isLoading } = useRfidCards();
  const { data: allSiswa = [] } = useUsers('siswa');
  const { data: allGuru = [] } = useUsers('guru');
  const { data: rfidConfig, isLoading: loadingConfig } = useRfidConfig();
  const updateConfig = useUpdateRfidConfig();
  
  const allUsers = [...allSiswa, ...allGuru];
  const createRfid = useCreateRfid();
  const updateRfid = useUpdateRfid();

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

  const randomUid = () => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  useEffect(() => {
    if (showRegistrasi && !uidBaru) {
      setUidBaru(randomUid());
    }
  }, [showRegistrasi]);

  const filtered = kartu.filter(k => {
    if (search && !k.user?.name.toLowerCase().includes(search.toLowerCase()) && !k.uid_rfid.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const siswaTanpaKartu = allUsers.filter(s => !kartu.find(k => k.user_id === parseInt(s.id)));

  const handleRegister = () => {
    if (!siswaIdBaru) { toast.error('Pilih pengguna'); return; }
    if (!uidBaru) { toast.error('UID Kartu tidak boleh kosong'); return; }
    if (!pinBaru || pinBaru.length !== 6) { toast.error('PIN harus 6 digit'); return; }

    const siswa = allUsers.find(s => s.id === siswaIdBaru);
    if (!siswa) return;

    createRfid.mutate({
      user_id: parseInt(siswa.id),
      uid_rfid: uidBaru,
      pin: pinBaru,
      status: 'aktif'
    }, {
      onSuccess: () => {
        toast.success(`Kartu ${uidBaru} terdaftar untuk ${siswa.name}`);
        setShowRegistrasi(false);
        setUidBaru(randomUid());
        setPinBaru('');
        setSiswaIdBaru('');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Gagal mendaftar kartu');
      }
    });
  };

  const handleStatusChange = (id: number, status: 'aktif' | 'nonaktif' | 'hilang') => {
    updateRfid.mutate({ id, data: { status } }, {
      onSuccess: () => {
        toast.success(`Status kartu diubah ke ${status}`);
      }
    });
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jamMasuk || !jamPulang || !batasAlpha) {
      toast.error('Jam masuk, pulang, dan batas alpha wajib diisi');
      return;
    }

    const payload: any = {
      jam_masuk: `${jamMasuk}:00`,
      jam_pulang: `${jamPulang}:00`,
      toleransi_terlambat: toleransi,
      batas_alpha: `${batasAlpha}:00`,
    };

    if (configPin && configPin.length >= 4) {
      payload.pin = configPin;
    }

    updateConfig.mutate(payload, {
      onSuccess: () => toast.success('Konfigurasi absensi berhasil disimpan'),
    });
  };

  const STATUS_KARTU_BADGE: Record<string, { label: string, color: string }> = {
    'aktif': { label: 'Aktif', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
    'nonaktif': { label: 'Nonaktif', color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400' },
    'hilang': { label: 'Hilang', color: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
  };

  return (
    <AdminLayout title="Manajemen Kartu RFID & Konfigurasi">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('kartu')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'kartu' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'}`}
        >
          <CreditCard className="w-4 h-4" /> Daftar Kartu RFID
        </button>
        <button
          onClick={() => setActiveTab('konfigurasi')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'konfigurasi' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'}`}
        >
          <Settings className="w-4 h-4" /> Konfigurasi Jam Absensi
        </button>
      </div>

      {/* === TAB: KARTU RFID === */}
      {activeTab === 'kartu' && (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <CreditCard className="w-4 h-4 text-indigo-500" />
                Total {kartu.length} Kartu
              </div>
              <div className="flex-1" />
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama/UID..." className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40 dark:text-white" />
              </div>
              <button onClick={() => setShowRegistrasi(!showRegistrasi)} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                <Plus className="w-3.5 h-3.5" /> Registrasi Baru
              </button>
            </div>

            {showRegistrasi && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 border-b border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="max-w-lg space-y-3">
                  <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">Registrasi Kartu RFID Baru</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">UID Kartu</label>
                      <div className="flex gap-2">
                        <input type="text" value={uidBaru} onChange={e => setUidBaru(e.target.value.toUpperCase())}
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                        <button onClick={() => setUidBaru(randomUid())} className="px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                          Generate
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Pengguna (Siswa / Guru)</label>
                      <select value={siswaIdBaru} onChange={e => setSiswaIdBaru(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                        <option value="">-- Pilih Pengguna --</option>
                        {siswaTanpaKartu.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role} - {s.kelas || s.jabatan || '-'})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">PIN (6 Digit)</label>
                      <input type="text" maxLength={6} value={pinBaru} onChange={e => setPinBaru(e.target.value.replace(/[^0-9]/g, ''))} placeholder="123456"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setShowRegistrasi(false)} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors">Batal</button>
                    <button onClick={handleRegister} disabled={createRfid.isPending} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50">Simpan</button>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500">Memuat data kartu...</div>
              ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr><th className="px-5 py-4">UID Kartu</th><th className="px-5 py-4">Pengguna</th><th className="px-5 py-4">Role / Kelas</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Terdaftar</th><th className="px-5 py-4">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filtered.map(k => (
                    <tr key={k.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">{k.uid_rfid}</td>
                      <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{k.user?.name}</td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        <span className="uppercase text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full mr-2">{k.user?.role}</span>
                        {k.user?.kelas || '-'}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_KARTU_BADGE[k.status]?.color || ''}`}>
                          {STATUS_KARTU_BADGE[k.status]?.label || k.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">{new Date(k.created_at).toLocaleDateString('id-ID')}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1">
                          {k.status !== 'aktif' && <button onClick={() => handleStatusChange(k.id, 'aktif')} disabled={updateRfid.isPending} className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"><CheckCircle className="w-3.5 h-3.5 inline mr-0.5" />Aktifkan</button>}
                          {k.status === 'aktif' && <button onClick={() => handleStatusChange(k.id, 'nonaktif')} disabled={updateRfid.isPending} className="text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 px-2 py-1 rounded-lg transition-colors disabled:opacity-50">Nonaktifkan</button>}
                          {k.status !== 'hilang' && <button onClick={() => handleStatusChange(k.id, 'hilang')} disabled={updateRfid.isPending} className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"><AlertTriangle className="w-3.5 h-3.5 inline mr-0.5" />Hilang</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !isLoading && (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">Tidak ada kartu RFID ditemukan</td></tr>
                  )}
                </tbody>
              </table>
              )}
            </div>
          </div>

          {siswaTanpaKartu.length > 0 && (
            <div className="mt-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5">
              <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" /> {siswaTanpaKartu.length} pengguna belum memiliki kartu RFID
              </h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                {siswaTanpaKartu.map(s => (
                  <span key={s.id} className="text-[10px] font-semibold bg-white dark:bg-slate-900 px-2 py-1 rounded border border-amber-200 dark:border-amber-600 text-slate-700 dark:text-slate-300">
                    {s.name} ({s.role})
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* === TAB: KONFIGURASI JAM ABSENSI === */}
      {activeTab === 'konfigurasi' && (
        <div className="max-w-2xl">
          {loadingConfig ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
          ) : (
            <form onSubmit={handleSaveConfig} className="space-y-6">

              {/* Konfigurasi Jam */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" /> Pengaturan Jam Sekolah
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Tentukan jam masuk, pulang, toleransi keterlambatan, dan batas jam alpha.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Jam Masuk</label>
                    <input
                      type="time"
                      value={jamMasuk}
                      onChange={e => setJamMasuk(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Jam mulai siswa wajib hadir</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Toleransi Keterlambatan</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={0}
                        max={120}
                        value={toleransi}
                        onChange={e => setToleransi(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        required
                      />
                      <span className="text-sm font-semibold text-slate-500 whitespace-nowrap">menit</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Toleransi setelah jam masuk sebelum dianggap terlambat</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Batas Jam Alpha</label>
                    <input
                      type="time"
                      value={batasAlpha}
                      onChange={e => setBatasAlpha(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Tap setelah jam ini dianggap alpha (tidak hadir)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Jam Pulang</label>
                    <input
                      type="time"
                      value={jamPulang}
                      onChange={e => setJamPulang(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      required
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Tap sebelum jam ini dianggap pulang awal</p>
                  </div>
                </div>

                {/* Visual Summary */}
                <div className="mt-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Alur Status Absensi</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full">Hadir</span>
                    <span className="text-slate-400">({jamMasuk} s/d {jamMasuk.split(':')[0]}:{String(Number(jamMasuk.split(':')[1]) + toleransi).padStart(2,'0')})</span>
                    <span className="text-slate-300 dark:text-slate-600">→</span>
                    <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-full">Terlambat</span>
                    <span className="text-slate-400">(s/d {batasAlpha})</span>
                    <span className="text-slate-300 dark:text-slate-600">→</span>
                    <span className="bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-full">Alpha</span>
                    <span className="text-slate-400">(lewat {batasAlpha})</span>
                  </div>
                </div>
              </div>

              {/* PIN Gatekeeper */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-500" /> PIN Akses Terminal Absensi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">PIN ini digunakan untuk membuka akses halaman Tap Absensi dan Tap Pembayaran di terminal. Kosongkan jika tidak ingin mengubah PIN.</p>
                {rfidConfig?.pin && (
                  <div className="mb-3 p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                    PIN saat ini sudah terdaftar. Isi field di bawah hanya jika ingin mengganti.
                  </div>
                )}
                <div className="relative max-w-xs">
                  <input
                    type={showConfigPin ? 'text' : 'password'}
                    value={configPin}
                    onChange={e => setConfigPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
                    placeholder="Masukkan PIN baru (min 4 digit)"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white pr-10"
                  />
                  <button type="button" onClick={() => setShowConfigPin(!showConfigPin)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfigPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updateConfig.isPending}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                  {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Konfigurasi
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
