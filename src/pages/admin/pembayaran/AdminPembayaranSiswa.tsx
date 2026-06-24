import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Banknote, PiggyBank, History } from 'lucide-react';
import { PEMBAYARAN_SISWA_MOCK, STATUS_PEMBAYARAN_BADGE, rupiah, hitungBeasiswa, type PembayaranSiswa, type TransaksiPembayaran, type BeasiswaTipe } from '../../../types/pembayaran';
import { toast } from 'sonner';

export default function AdminPembayaranSiswa() {
  const [data, setData] = useState<PembayaranSiswa[]>(PEMBAYARAN_SISWA_MOCK);
  const [search, setSearch] = useState('');
  const [selectedSiswa, setSelectedSiswa] = useState<PembayaranSiswa | null>(null);
  const [showBayar, setShowBayar] = useState(false);
  const [nominalBayar, setNominalBayar] = useState('');
  const [showBeasiswa, setShowBeasiswa] = useState(false);
  const [beasiswaTipe, setBeasiswaTipe] = useState<BeasiswaTipe>('persentase');
  const [beasiswaNilai, setBeasiswaNilai] = useState('');

  const filtered = data.filter(p => !search || p.nama.toLowerCase().includes(search.toLowerCase()));

  const handleBayar = () => {
    if (!selectedSiswa) return;
    const nominal = Number(nominalBayar);
    if (!nominal || nominal <= 0) { toast.error('Nominal tidak valid'); return; }
    if (nominal > selectedSiswa.sisa) { toast.error('Melebihi sisa tagihan'); return; }

    const trxBaru: TransaksiPembayaran = {
      id: `trx-${Date.now()}`,
      tanggal: new Date().toISOString().split('T')[0],
      nominal,
      metode: 'manual',
      petugas: 'Admin',
    };

    setData(prev => prev.map(p =>
      p.id === selectedSiswa.id
        ? {
            ...p,
            terbayar: p.terbayar + nominal,
            sisa: p.sisa - nominal,
            status: p.sisa - nominal <= 0 ? 'lunas' : 'cicil',
            riwayat: [...p.riwayat, trxBaru],
          }
        : p
    ));
    setShowBayar(false);
    setNominalBayar('');
    toast.success(`Pembayaran ${rupiah(nominal)} berhasil`);
  };

  const handleBeasiswa = () => {
    if (!selectedSiswa) return;
    const nilai = Number(beasiswaNilai);
    if (!nilai || nilai <= 0) { toast.error('Nilai beasiswa tidak valid'); return; }
    if (beasiswaTipe === 'persentase' && (nilai < 0 || nilai > 100)) { toast.error('Persentase 0-100'); return; }

    const nominalAsli = selectedSiswa.nominal;
    const sisaBaru = hitungBeasiswa(nominalAsli, { id: `b-${Date.now()}`, siswaId: selectedSiswa.siswaId, jenisPembayaranId: selectedSiswa.jenisPembayaranId, tipe: beasiswaTipe, nilai });

    setData(prev => prev.map(p =>
      p.id === selectedSiswa.id
        ? {
            ...p,
            beasiswa: { id: `b-${Date.now()}`, siswaId: p.siswaId, jenisPembayaranId: p.jenisPembayaranId, tipe: beasiswaTipe, nilai, keterangan: 'Beasiswa dari admin' },
            sisa: sisaBaru - p.terbayar,
            status: sisaBaru - p.terbayar <= 0 ? 'lunas' : beasiswaTipe === 'bebas' ? 'bebas' : p.status,
          }
        : p
    ));
    setShowBeasiswa(false);
    setBeasiswaNilai('');
    toast.success('Beasiswa diterapkan');
  };

  return (
    <AdminLayout title="Pembayaran Siswa">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari siswa..." className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b">
              <tr><th className="px-5 py-4">Siswa</th><th className="px-5 py-4">Kelas</th><th className="px-5 py-4">Jenis</th><th className="px-5 py-4 text-right">Tagihan</th><th className="px-5 py-4 text-right">Terkumpul</th><th className="px-5 py-4 text-right">Sisa</th><th className="px-5 py-4 text-center">Status</th><th className="px-5 py-4">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{p.nama}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{p.kelas}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{p.jenisPembayaranNama}</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800 dark:text-white">{rupiah(p.nominal)}</td>
                  <td className="px-5 py-4 text-right font-semibold text-emerald-600">{rupiah(p.terbayar)}</td>
                  <td className="px-5 py-4 text-right font-bold text-red-600">{rupiah(p.sisa)}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_PEMBAYARAN_BADGE[p.status].color}`}>{STATUS_PEMBAYARAN_BADGE[p.status].label}</span>
                    {p.beasiswa && <span className="ml-1 text-[10px] font-bold text-purple-600">🅱</span>}
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => { setSelectedSiswa(p); setShowBayar(true); }} className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2 py-1 rounded-lg transition-colors">
                      <Banknote className="w-3.5 h-3.5 inline mr-0.5" />Bayar
                    </button>
                    <button onClick={() => { setSelectedSiswa(p); setShowBeasiswa(true); }} className="text-xs font-bold text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10 px-2 py-1 rounded-lg transition-colors ml-1">
                      <PiggyBank className="w-3.5 h-3.5 inline mr-0.5" />Beasiswa
                    </button>
                    <button onClick={() => setSelectedSiswa(p)} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-2 py-1 rounded-lg transition-colors ml-1">
                      <History className="w-3.5 h-3.5 inline mr-0.5" />Riwayat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showBayar && selectedSiswa && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowBayar(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-1">Input Pembayaran</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{selectedSiswa.nama} — {selectedSiswa.jenisPembayaranNama}</p>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Tagihan</span><span className="font-bold text-slate-800 dark:text-white">{rupiah(selectedSiswa.nominal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Sisa</span><span className="font-bold text-red-600">{rupiah(selectedSiswa.sisa)}</span></div>
            </div>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
              <input type="number" value={nominalBayar} onChange={e => setNominalBayar(e.target.value)} placeholder="0" className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowBayar(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl text-sm transition-colors">Batal</button>
              <button onClick={handleBayar} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-colors">Bayar</button>
            </div>
          </div>
        </div>
      )}

      {showBeasiswa && selectedSiswa && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowBeasiswa(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-1">Atur Beasiswa</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{selectedSiswa.nama}</p>

            {selectedSiswa.beasiswa && (
              <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
                <p className="text-xs font-bold text-purple-700 dark:text-purple-300">Beasiswa aktif: {selectedSiswa.beasiswa.tipe === 'bebas' ? 'Bebas Bayar' : selectedSiswa.beasiswa.tipe === 'persentase' ? `${selectedSiswa.beasiswa.nilai}%` : rupiah(selectedSiswa.beasiswa.nilai)}</p>
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tipe Beasiswa</label>
                <select value={beasiswaTipe} onChange={e => setBeasiswaTipe(e.target.value as BeasiswaTipe)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="persentase">Potongan Persen (%)</option>
                  <option value="nominal">Potongan Nominal (Rp)</option>
                  <option value="bebas">Bebas Total</option>
                </select>
              </div>
              {beasiswaTipe !== 'bebas' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {beasiswaTipe === 'persentase' ? 'Persentase (0-100)' : 'Nominal Potongan'}
                  </label>
                  <input type="number" value={beasiswaNilai} onChange={e => setBeasiswaNilai(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowBeasiswa(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold py-3 rounded-xl text-sm">Batal</button>
              <button onClick={handleBeasiswa} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-sm">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {selectedSiswa && !showBayar && !showBeasiswa && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedSiswa(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-1">Riwayat Pembayaran</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{selectedSiswa.nama} — {selectedSiswa.jenisPembayaranNama}</p>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Tagihan</span><span className="font-bold">{rupiah(selectedSiswa.nominal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Terkumpul</span><span className="font-bold text-emerald-600">{rupiah(selectedSiswa.terbayar)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Sisa</span><span className="font-bold text-red-600">{rupiah(selectedSiswa.sisa)}</span></div>
            </div>
            {selectedSiswa.riwayat.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedSiswa.riwayat.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{rupiah(t.nominal)}</p>
                      <p className="text-[10px] text-slate-400">{t.tanggal} — {t.metode === 'rfid' ? 'RFID' : t.metode === 'transfer' ? 'Transfer' : 'Manual'}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">{t.petugas}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-slate-400 py-4">Belum ada riwayat pembayaran</p>
            )}
            <button onClick={() => setSelectedSiswa(null)} className="w-full mt-4 bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold py-3 rounded-xl text-sm">Tutup</button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
