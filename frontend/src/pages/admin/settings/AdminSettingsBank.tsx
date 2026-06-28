import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, CreditCard, QrCode, FileText } from 'lucide-react';
import { useBankSettings, updateBankSettings } from '../../../stores/bankSettingsStore';
import { toast } from 'sonner';

export default function AdminSettingsBank() {
  const settings = useBankSettings();
  const [bankName, setBankName] = useState(settings.bankName);
  const [noRekening, setNoRekening] = useState(settings.noRekening);
  const [atasNama, setAtasNama] = useState(settings.atasNama);
  const [qrisImage, setQrisImage] = useState(settings.qrisImage);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !noRekening || !atasNama) {
      toast.error('Lengkapi semua data transfer bank');
      return;
    }
    updateBankSettings({
      bankName,
      noRekening,
      atasNama,
      qrisImage
    });
    toast.success('Pengaturan Transfer & QRIS berhasil disimpan');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload by setting a mock data URL or standard local name
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setQrisImage(reader.result);
          toast.success('QRIS berhasil diunggah (Mock)');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout title="Pengaturan Rekening & QRIS">
      <div className="max-w-3xl space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Kolom Kiri: Rekening Bank */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <CreditCard className="w-5 h-5 text-indigo-500" /> Informasi Transfer Bank
              </h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Nama Bank</label>
                <input 
                  type="text" 
                  value={bankName} 
                  onChange={e => setBankName(e.target.value)} 
                  placeholder="Contoh: Bank Syariah Indonesia" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Nomor Rekening</label>
                <input 
                  type="text" 
                  value={noRekening} 
                  onChange={e => setNoRekening(e.target.value)} 
                  placeholder="Contoh: 7112008899" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5">Atas Nama Rekening</label>
                <input 
                  type="text" 
                  value={atasNama} 
                  onChange={e => setAtasNama(e.target.value)} 
                  placeholder="Contoh: SMAS Muhammadiyah 1 BWI" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                />
              </div>
            </div>

            {/* Kolom Kanan: QRIS */}
            <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <QrCode className="w-5 h-5 text-indigo-500" /> Barcode QRIS Pembayaran
              </h3>
              
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-center space-y-3">
                <img 
                  src={qrisImage} 
                  alt="QRIS Barcode" 
                  className="w-40 h-40 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white"
                  onError={(e) => {
                    // fall back to default mock QRIS
                    (e.target as HTMLImageElement).src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SMAS-MUHAMMADIYAH-1-BANYUWANGI';
                  }}
                />
                
                <div className="w-full">
                  <label className="inline-flex items-center justify-center w-full px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold rounded-xl text-xs cursor-pointer transition-colors border border-indigo-200 dark:border-indigo-500/20 shadow-sm">
                    Unggah Gambar QRIS Baru
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-400">Rasio rekomendasi 1:1 format JPG/PNG</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-500/20 text-xs text-indigo-800 dark:text-indigo-300 flex gap-2">
            <FileText className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
            <div>
              <strong>Catatan:</strong> Informasi rekening bank dan barcode QRIS di atas akan secara otomatis tertampil di halaman pembayaran siswa agar siswa/wali murid dapat melakukan transfer secara mandiri.
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95">
              <Save className="w-4 h-4" /> Simpan Pengaturan Bank & QRIS
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
