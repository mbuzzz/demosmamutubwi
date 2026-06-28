import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, Clock } from 'lucide-react';
import { useRfidConfig, useUpdateRfidConfig, type RfidConfig } from '../../../hooks/useRfid';
import { toast } from 'sonner';

export default function AdminSettingsRfid() {
  const { data: serverConfig, isLoading } = useRfidConfig();
  const updateConfig = useUpdateRfidConfig();
  
  const [config, setConfig] = useState<Partial<RfidConfig>>({
    waktu_masuk_mulai: '06:00:00',
    waktu_masuk_akhir: '07:30:00',
    waktu_pulang_mulai: '13:00:00',
    waktu_pulang_akhir: '16:00:00',
    mode: 'bebas'
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
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Waktu Masuk Mulai</label>
              <input type="time" step="1" value={config.waktu_masuk_mulai || ''} onChange={e => setConfig({ ...config, waktu_masuk_mulai: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Waktu Masuk Akhir</label>
              <input type="time" step="1" value={config.waktu_masuk_akhir || ''} onChange={e => setConfig({ ...config, waktu_masuk_akhir: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Waktu Pulang Mulai</label>
              <input type="time" step="1" value={config.waktu_pulang_mulai || ''} onChange={e => setConfig({ ...config, waktu_pulang_mulai: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Waktu Pulang Akhir</label>
              <input type="time" step="1" value={config.waktu_pulang_akhir || ''} onChange={e => setConfig({ ...config, waktu_pulang_akhir: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
          </div>
          <div className="mt-4">
             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Mode Mesin Tap</label>
             <select value={config.mode || 'bebas'} onChange={e => setConfig({ ...config, mode: e.target.value as any })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                <option value="absen_masuk">Absen Masuk Saja</option>
                <option value="absen_pulang">Absen Pulang Saja</option>
                <option value="bebas">Otomatis berdasarkan jam</option>
                <option value="tutup">Tutup Mesin Tap</option>
             </select>
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
