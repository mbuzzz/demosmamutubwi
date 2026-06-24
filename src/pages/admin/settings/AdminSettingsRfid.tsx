import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, ShieldCheck, Lock, Clock, AlertTriangle } from 'lucide-react';
import { KONFIGURASI_RFID_DEFAULT, type KonfigurasiRfid } from '../../../types/rfid';
import { toast } from 'sonner';

export default function AdminSettingsRfid() {
  const [config, setConfig] = useState<KonfigurasiRfid>(KONFIGURASI_RFID_DEFAULT);
  const [pinBaru, setPinBaru] = useState('');
  const [pinKonfirmasi, setPinKonfirmasi] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinBaru && pinBaru !== pinKonfirmasi) {
      toast.error('PIN tidak cocok dengan konfirmasi');
      return;
    }
    if (pinBaru && pinBaru.length < 4) {
      toast.error('PIN minimal 4 digit');
      return;
    }
    const updated = {
      ...config,
      pin: pinBaru || config.pin,
      updatedAt: new Date().toISOString(),
    };
    setConfig(updated);
    toast.success('Pengaturan RFID berhasil disimpan');
  };

  return (
    <AdminLayout title="Pengaturan RFID & Absensi">
      <div className="max-w-2xl space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-500" /> PIN Akses Tap RFID
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">PIN digunakan untuk mengakses halaman tap RFID (absensi & pembayaran) di area publik.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">PIN Baru</label>
              <input type="password" maxLength={6} value={pinBaru} onChange={e => setPinBaru(e.target.value)} placeholder="Min 4 digit" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Konfirmasi PIN Baru</label>
              <input type="password" maxLength={6} value={pinKonfirmasi} onChange={e => setPinKonfirmasi(e.target.value)} placeholder="Ketik ulang PIN" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            PIN saat ini: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{'*'.repeat(config.pin.length)}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" /> Jam Absensi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Jam Masuk</label>
              <input type="time" value={config.jamMasuk} onChange={e => setConfig({ ...config, jamMasuk: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Jam Pulang</label>
              <input type="time" value={config.jamPulang} onChange={e => setConfig({ ...config, jamPulang: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                <span className="flex items-center gap-1">Toleransi Terlambat <AlertTriangle className="w-3 h-3 text-amber-500" /></span>
              </label>
              <div className="relative">
                <input type="number" min={0} max={120} value={config.toleransiTerlambat} onChange={e => setConfig({ ...config, toleransiTerlambat: Number(e.target.value) })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">menit</span>
              </div>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl text-xs text-blue-800 dark:text-blue-300">
            <strong>Logika:</strong> Tap sebelum {config.jamMasuk} + {config.toleransiTerlambat} menit = Hadir. Tap setelahnya = Terlambat. Tap setelah {config.jamPulang} = Pulang.
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors shadow-md hover:shadow-lg">
            <Save className="w-5 h-5" /> Simpan Pengaturan RFID
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
