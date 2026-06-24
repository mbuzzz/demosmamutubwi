import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { CreditCard, Receipt, BarChart3, PiggyBank, ArrowRight } from 'lucide-react';
import { PEMBAYARAN_SISWA_MOCK, rupiah } from '../../../types/pembayaran';

export default function BendaharaDashboard() {
  const totalTerkumpul = PEMBAYARAN_SISWA_MOCK.reduce((a, p) => a + p.terbayar, 0);
  const totalTunggakan = PEMBAYARAN_SISWA_MOCK.reduce((a, p) => a + p.sisa, 0);
  const siswaBelumLunas = PEMBAYARAN_SISWA_MOCK.filter(p => p.status === 'belum').length;

  return (
    <AdminLayout title="Dashboard Bendahara">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Total Terkumpul</p>
          <h3 className="text-2xl font-black mt-1">{rupiah(totalTerkumpul)}</h3>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-red-100 uppercase tracking-wider">Tunggakan</p>
          <h3 className="text-2xl font-black mt-1">{rupiah(totalTunggakan)}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Siswa Belum Lunas</p>
          <h3 className="text-3xl font-black text-amber-500 mt-1">{siswaBelumLunas}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/panel/bendahara/pembayaran" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500 transition-all hover:shadow-md group flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div><h4 className="font-bold text-slate-800 dark:text-white">Pembayaran Siswa</h4><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Input bayar & riwayat transaksi</p></div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </Link>
        <Link to="/panel/bendahara/pembayaran/jenis" className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 transition-all hover:shadow-md group flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center">
              <Receipt className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div><h4 className="font-bold text-slate-800 dark:text-white">Jenis Pembayaran</h4><p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Atur tagihan wajib & sukarela</p></div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </Link>
      </div>

      <div className="mt-6 bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-5 border border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-500" /> Ringkasan Transaksi Terakhir
        </h3>
        <div className="space-y-3">
          {PEMBAYARAN_SISWA_MOCK.filter(p => p.riwayat.length > 0).flatMap(p => p.riwayat.slice(0, 1)).slice(0, 5).map((t, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <PiggyBank className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{rupiah(t.nominal)}</p>
                  <p className="text-[10px] text-slate-400">{t.tanggal} — {t.metode}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">{t.petugas}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
