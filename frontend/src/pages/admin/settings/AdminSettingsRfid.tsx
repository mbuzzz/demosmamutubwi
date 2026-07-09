import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, Clock } from 'lucide-react';
import { useRfidConfig, useUpdateRfidConfig, type RfidConfig } from '../../../hooks/useRfid';
import { toast } from 'sonner';

export default function AdminSettingsRfid() {
  const { data: serverConfig, isLoading } = useRfidConfig();
  const updateConfig = useUpdateRfidConfig();
  
  const [config, setConfig] = useState<Partial<RfidConfig>>({
    pin: '123456',
    jam_masuk: '07:00:00',
    jam_pulang: '15:30:00',
    toleransi_terlambat: 15,
    batas_alpha: '08:00:00'
  });

  useEffect(() => {
    if (serverConfig) {
      setConfig(serverConfig);
    }
  }, [serverConfig]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig.mutate(config, {
      onSuccess: () => {
        toast.success('Pengaturan RFID berhasil disimpan');
      },
      onError: () => {
        toast.error('Gagal menyimpan pengaturan RFID');
      }
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Pengaturan RFID & Absensi">
        <div className="p-8 text-center text-slate-500">Memuat konfigurasi...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Pengaturan RFID & Absensi">
      <div className="max-w-2xl space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" /> Waktu Tap RFID
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Jam Masuk (Reguler)</label>
              <input type="time" step="1" value={config.jam_masuk || ''} onChange={e => setConfig({ ...config, jam_masuk: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Jam Pulang (Reguler)</label>
              <input type="time" step="1" value={config.jam_pulang || ''} onChange={e => setConfig({ ...config, jam_pulang: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Toleransi Terlambat (Menit)</label>
              <input type="number" min={0} value={config.toleransi_terlambat || 0} onChange={e => setConfig({ ...config, toleransi_terlambat: Number(e.target.value) })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              <p className="text-[10px] text-slate-500 mt-1">Lebih dari ini dianggap Terlambat</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Batas Waktu Alpha</label>
              <input type="time" step="1" value={config.batas_alpha || ''} onChange={e => setConfig({ ...config, batas_alpha: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              <p className="text-[10px] text-slate-500 mt-1">Lewat jam ini dianggap Alpha</p>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Global PIN Gatekeeper</label>
            <input type="text" maxLength={6} value={config.pin || ''} onChange={e => setConfig({ ...config, pin: e.target.value.replace(/[^0-9]/g, '') })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="123456" />
            <p className="text-[10px] text-slate-500 mt-1">PIN 6 digit ini digunakan untuk masuk ke layar mesin tap</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={updateConfig.isPending} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors shadow-md hover:shadow-lg disabled:opacity-50">
            <Save className="w-5 h-5" /> Simpan Konfigurasi
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
