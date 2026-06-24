import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { CreditCard, CheckCircle2, Banknote } from 'lucide-react';
import { PEMBAYARAN_SISWA_MOCK, STATUS_PEMBAYARAN_BADGE, rupiah, hitungBeasiswa } from '../../../types/pembayaran';

export default function SiswaPembayaran() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const tagihanSaya = PEMBAYARAN_SISWA_MOCK.filter(p => p.siswaId === 's1');
  const totalTagihan = tagihanSaya.reduce((a, p) => a + p.nominal, 0);
  const totalTerkumpul = tagihanSaya.reduce((a, p) => a + p.terbayar, 0);
  const totalSisa = tagihanSaya.reduce((a, p) => a + p.sisa, 0);

  return (
    <AdminLayout title="Pembayaran Saya">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Total Tagihan</p>
          <h3 className="text-2xl font-black mt-1">{rupiah(totalTagihan)}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Telah Dibayar</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{rupiah(totalTerkumpul)}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sisa Tagihan</p>
          <h3 className="text-2xl font-black text-red-500 mt-1">{rupiah(totalSisa)}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Riwayat Tagihan</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {tagihanSaya.map(p => {
            const nominalSetelahBeasiswa = hitungBeasiswa(p.nominal, p.beasiswa);
            return (
              <div key={p.id}>
                <div onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                  className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-500" />
                      <span className="font-bold text-slate-800 dark:text-white text-sm">{p.jenisPembayaranNama}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_PEMBAYARAN_BADGE[p.status].color}`}>
                      {STATUS_PEMBAYARAN_BADGE[p.status].label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 ml-6">
                    <span>Tagihan: {rupiah(nominalSetelahBeasiswa)}</span>
                    <span>Sisa: <strong className={p.sisa > 0 ? 'text-red-500' : 'text-emerald-500'}>{rupiah(p.sisa)}</strong></span>
                  </div>
                  {p.beasiswa && (
                    <div className="ml-6 mt-1 text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                      Beasiswa: {p.beasiswa.tipe === 'bebas' ? 'Bebas Bayar' : p.beasiswa.tipe === 'persentase' ? `${p.beasiswa.nilai}%` : rupiah(p.beasiswa.nilai)}
                    </div>
                  )}
                </div>

                {selectedId === p.id && p.riwayat.length > 0 && (
                  <div className="px-4 pb-4 pl-10 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Riwayat Pembayaran</p>
                    {p.riwayat.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <div>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{rupiah(t.nominal)}</p>
                            <p className="text-[10px] text-slate-400">{t.tanggal}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">{t.metode === 'rfid' ? 'RFID' : t.metode}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Banknote className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg">Pembayaran via RFID</h3>
            <p className="text-sm text-emerald-100">Tap kartu di mesin RFID sekolah untuk bayar tagihan</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
