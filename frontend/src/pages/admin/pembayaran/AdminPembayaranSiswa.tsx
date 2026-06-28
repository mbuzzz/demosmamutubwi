import { useState, useRef } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Banknote, Award, History, Plus, Pencil, Trash2, X, Filter, Printer, CheckCircle2 } from 'lucide-react';
import { MOCK_SISWA } from '../../../types/absensi';
import {
  STATUS_PEMBAYARAN_BADGE,
  rupiah,
  hitungBeasiswa,
  type Tagihan,
  type TransaksiPembayaran,
  type BeasiswaTipe,
  type StatusPembayaran,
} from '../../../types/pembayaran';
import {
  useTagihanList,
  useJenisPembayaranList,
  useProsesPembayaran,
} from '../../../hooks/usePembayaran';
import { toast } from 'sonner';

export default function AdminPembayaranSiswa() {
  const { data: list = [] } = useTagihanList();
  const { data: jenisList = [] } = useJenisPembayaranList();
  const bayarMutation = useProsesPembayaran();

  const receiptRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusPembayaran | ''>('');

  const [selectedSiswa, setSelectedSiswa] = useState<Tagihan | null>(null);
  const [selectedBayarSiswa, setSelectedBayarSiswa] = useState<Tagihan | null>(null);
  const [nominalBayar, setNominalBayar] = useState('');

  const [showReceipt, setShowReceipt] = useState<{ siswa: Tagihan; trx: TransaksiPembayaran } | null>(null);

  const [showBeasiswa, setShowBeasiswa] = useState(false);
  const [beasiswaTipe, setBeasiswaTipe] = useState<BeasiswaTipe>('persentase');
  const [beasiswaNilai, setBeasiswaNilai] = useState('');
  const [beasiswaKeterangan, setBeasiswaKeterangan] = useState('');

  const [showTambah, setShowTambah] = useState(false);
  const [tambahSiswaId, setTambahSiswaId] = useState('');
  const [tambahJenisId, setTambahJenisId] = useState('');
  const [tambahNominal, setTambahNominal] = useState('');
  const [tambahJatuhTempo, setTambahJatuhTempo] = useState('');

  const [editTrx, setEditTrx] = useState<{ recordId: string | number; trx: TransaksiPembayaran } | null>(null);
  const [editTrxNominal, setEditTrxNominal] = useState('');

  const kelasList = [...new Set(list.map(s => s.siswa?.kelas).filter(Boolean))];

  const filtered = list.filter(p => {
    if (search && !p.siswa?.nama.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterKelas && p.siswa?.kelas !== filterKelas) return false;
    if (filterJenis && String(p.jenis_pembayaran_id) !== filterJenis) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  });

  const handleBayar = () => {
    if (!selectedBayarSiswa) return;
    const nominal = Number(nominalBayar);
    if (!nominal || nominal <= 0) { toast.error('Nominal tidak valid'); return; }
    if (nominal > selectedBayarSiswa.sisa) { toast.error(`Melebihi sisa tagihan (${rupiah(selectedBayarSiswa.sisa)})`); return; }

    bayarMutation.mutate({
      tagihan_id: selectedBayarSiswa.id,
      nominal,
      metode: 'manual'
    }, {
      onSuccess: (data) => {
        setShowReceipt({ siswa: selectedBayarSiswa, trx: data.transaksi || {
          id: `trx-${Date.now()}`,
          tanggal: new Date().toISOString().split('T')[0],
          nominal,
          metode: 'manual',
          petugas: 'Admin',
        } });
        setNominalBayar('');
        setSelectedBayarSiswa(null);
      }
    });
  };

  const handleBeasiswa = () => {
    toast.info('Fitur beasiswa perlu disesuaikan dengan API backend');
    setShowBeasiswa(false);
  };

  const handleTambahTagihan = () => {
    toast.info('Fitur tambah tagihan manual perlu disesuaikan dengan API backend');
    setShowTambah(false);
  };

  const handleEditTrx = () => {
    toast.info('Fitur edit transaksi perlu disesuaikan dengan API backend');
    setEditTrx(null);
  };

  const handleDeleteTrx = (_recordId: string | number, _trxId: string | number) => {
    toast.info('Fitur hapus transaksi perlu disesuaikan dengan API backend');
  };

  const openBayar = (p: Tagihan) => {
    if (p.status === 'lunas' || p.status === 'bebas') { toast.info('Tagihan sudah lunas'); return; }
    setSelectedBayarSiswa(p);
    setNominalBayar(String(p.sisa));
    setSelectedSiswa(null);
  };

  const openBeasiswa = (p: Tagihan) => {
    setSelectedSiswa(p);
    setBeasiswaTipe(p.beasiswa?.tipe || 'persentase');
    setBeasiswaNilai(String(p.beasiswa?.nilai || ''));
    setBeasiswaKeterangan(p.beasiswa?.keterangan || '');
    setShowBeasiswa(true);
  };

  const openRiwayat = (p: Tagihan) => {
    setSelectedSiswa(p);
    setSelectedBayarSiswa(null);
  };

  const cetakReceipt = () => {
    if (!receiptRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) { toast.error('Izinkan popup untuk mencetak'); return; }
    printWindow.document.write(`
      <html><head><title>Struk Pembayaran</title>
      <style>
        body { font-family: 'Courier New', monospace; font-size: 12px; width: 280px; margin: 0 auto; padding: 16px; }
        h2 { text-align: center; font-size: 14px; margin: 0 0 4px; }
        .sub { text-align: center; font-size: 10px; color: #666; margin-bottom: 12px; }
        .line { border-top: 1px dashed #333; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; margin: 4px 0; }
        .total { font-size: 16px; font-weight: bold; text-align: center; margin: 8px 0; }
        .footer { text-align: center; font-size: 10px; color: #666; margin-top: 12px; }
      </style></head><body>
      <h2>SMAS Muhammadiyah 1 BWI</h2>
      <p class="sub">Struk Pembayaran</p>
      <div class="line"></div>
      <div class="row"><span>No.</span><span>${showReceipt?.trx.id || '-'}</span></div>
      <div class="row"><span>Tanggal</span><span>${showReceipt?.trx.tanggal || '-'}</span></div>
      <div class="row"><span>Siswa</span><span>${showReceipt?.siswa.siswa?.nama || '-'}</span></div>
      <div class="row"><span>Kelas</span><span>${showReceipt?.siswa.siswa?.kelas || '-'}</span></div>
      <div class="row"><span>Tagihan</span><span>${showReceipt?.siswa.jenis_pembayaran?.nama || '-'}</span></div>
      <div class="line"></div>
      <div class="total">${rupiah(showReceipt?.trx.nominal || 0)}</div>
      <div class="row"><span>Metode</span><span>Manual</span></div>
      <div class="row"><span>Petugas</span><span>Admin</span></div>
      <div class="line"></div>
      <p class="footer">Terima kasih</p>
      <script>window.print();window.close();</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  return (
    <AdminLayout title="Pembayaran Siswa">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari siswa..." className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Semua Kelas</option>
            {kelasList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
              <select value={filterJenis} onChange={e => setFilterJenis(e.target.value)} className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Semua Jenis</option>
                {jenisList.map((j: any) => <option key={j.id} value={j.id}>{j.nama}</option>)}
              </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as StatusPembayaran | '')} className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Semua Status</option>
            <option value="belum">Belum Bayar</option>
            <option value="cicil">Angsuran</option>
            <option value="lunas">Lunas</option>
            <option value="bebas">Bebas</option>
          </select>
          <Filter className="w-4 h-4 text-slate-400" />
          <button onClick={() => setShowTambah(true)} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ml-auto">
            <Plus className="w-3.5 h-3.5" /> Tambah Tagihan
          </button>
        </div>

        {selectedBayarSiswa && (
          <div className="p-5 bg-emerald-50 dark:bg-emerald-500/10 border-b border-emerald-200 dark:border-emerald-500/20 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
                  <Banknote className="w-4 h-4" /> Input Pembayaran
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedBayarSiswa.siswa?.nama} — {selectedBayarSiswa.jenis_pembayaran?.nama}
                </p>
              </div>
              <button onClick={() => { setSelectedBayarSiswa(null); setNominalBayar(''); }} className="text-emerald-500 hover:text-emerald-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4 max-w-lg">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500 font-semibold">Tagihan</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{rupiah(selectedBayarSiswa.nominal)}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500 font-semibold">Telah Dibayar</p>
                <p className="text-sm font-bold text-emerald-600">{rupiah(selectedBayarSiswa.terbayar)}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-3 text-center">
                <p className="text-[10px] text-slate-500 font-semibold">Sisa Tagihan</p>
                <p className="text-sm font-bold text-red-600">{rupiah(selectedBayarSiswa.sisa)}</p>
              </div>
            </div>
            <div className="flex items-end gap-3 max-w-md">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mb-1">Nominal Bayar</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Rp</span>
                  <input type="number" value={nominalBayar} onChange={e => setNominalBayar(e.target.value)} className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-600 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <button onClick={handleBayar} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg text-sm transition-all whitespace-nowrap">
                <Banknote className="w-4 h-4 inline mr-1.5" />Bayar {nominalBayar ? rupiah(Number(nominalBayar)) : ''}
              </button>
              <button onClick={() => { setSelectedBayarSiswa(null); setNominalBayar(''); }} className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-4 py-2 rounded-lg text-sm transition-all">
                Batal
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b">
              <tr>
                <th className="px-5 py-4">Siswa</th>
                <th className="px-5 py-4">Kelas</th>
                <th className="px-5 py-4">Jenis</th>
                <th className="px-5 py-4 text-right">Tagihan</th>
                <th className="px-5 py-4 text-right">Terkumpul</th>
                <th className="px-5 py-4 text-right">Sisa</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4">Beasiswa</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filtered.map(p => (
                <tr key={p.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${selectedBayarSiswa?.id === p.id ? 'bg-emerald-50/50 dark:bg-emerald-500/5' : ''}`}>
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{p.siswa?.nama}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{p.siswa?.kelas}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{p.jenis_pembayaran?.nama}</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-800 dark:text-white">{rupiah(p.nominal)}</td>
                  <td className="px-5 py-4 text-right font-semibold text-emerald-600">{rupiah(p.terbayar)}</td>
                  <td className="px-5 py-4 text-right font-bold text-red-600">{rupiah(p.sisa)}</td>
                  <td className="px-5 py-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_PEMBAYARAN_BADGE[p.status].color}`}>
                      {STATUS_PEMBAYARAN_BADGE[p.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {p.beasiswa ? (
                      <span title={p.beasiswa.keterangan || ''} className="text-xs bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full px-2 py-0.5 font-bold whitespace-nowrap">
                        {p.beasiswa.tipe === 'bebas' ? 'Bebas' : p.beasiswa.tipe === 'persentase' ? `${p.beasiswa.nilai}%` : rupiah(p.beasiswa.nilai)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button onClick={() => openBayar(p)} className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2 py-1 rounded-lg transition-colors">
                        <Banknote className="w-3.5 h-3.5 inline mr-0.5" />Bayar
                      </button>
                      <button onClick={() => openBeasiswa(p)} className="text-xs font-bold text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/10 px-2 py-1 rounded-lg transition-colors">
                        <Award className="w-3.5 h-3.5 inline mr-0.5" />Beasiswa
                      </button>
                      <button onClick={() => openRiwayat(p)} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-2 py-1 rounded-lg transition-colors">
                        <History className="w-3.5 h-3.5 inline mr-0.5" />Riwayat
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showReceipt && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowReceipt(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4" ref={receiptRef}>
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Pembayaran Berhasil</h3>
              <div className="mt-4 border-t border-dashed border-slate-200 dark:border-slate-700 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Transaksi</span>
                  <span className="font-bold text-slate-800 dark:text-white text-[10px]">{showReceipt.trx.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{showReceipt.trx.tanggal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Siswa</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{showReceipt.siswa.siswa?.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tagihan</span>
                  <span className="font-semibold text-slate-800 dark:text-white">{showReceipt.siswa.jenis_pembayaran?.nama}</span>
                </div>
                <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-2 mt-2">
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-slate-800 dark:text-white">Total Dibayar</span>
                    <span className="font-black text-emerald-600 text-lg">{rupiah(showReceipt.trx.nominal)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={cetakReceipt} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl text-sm transition-all">
                <Printer className="w-4 h-4 inline mr-1.5" /> Cetak
              </button>
              <button onClick={() => setShowReceipt(null)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-all">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showTambah && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTambah(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Tambah Tagihan Baru</h3>
              <button onClick={() => setShowTambah(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Siswa</label>
                <select value={tambahSiswaId} onChange={e => setTambahSiswaId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Pilih siswa...</option>
                  {MOCK_SISWA.map(s => <option key={s.id} value={s.id}>{s.nama} — {s.kelas}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Jenis Pembayaran</label>
                  <select value={tambahJenisId} onChange={e => setTambahJenisId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Pilih jenis...</option>
                    {jenisList.map((j: any) => <option key={j.id} value={j.id}>{j.nama} — {rupiah(j.nominal)}</option>)}
                  </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nominal Tagihan</label>
                <input type="number" value={tambahNominal} onChange={e => setTambahNominal(e.target.value)} placeholder="0" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Jatuh Tempo</label>
                <input type="date" value={tambahJatuhTempo} onChange={e => setTambahJatuhTempo(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowTambah(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl text-sm transition-colors">Batal</button>
              <button onClick={handleTambahTagihan} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-colors">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {showBeasiswa && selectedSiswa && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowBeasiswa(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Atur Beasiswa</h3>
              <button onClick={() => setShowBeasiswa(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{selectedSiswa.siswa?.nama} — {selectedSiswa.jenis_pembayaran?.nama}</p>

            {selectedSiswa.beasiswa && (
              <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl">
                <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
                  Beasiswa aktif: {selectedSiswa.beasiswa.tipe === 'bebas' ? 'Bebas Bayar' : selectedSiswa.beasiswa.tipe === 'persentase' ? `${selectedSiswa.beasiswa.nilai}%` : rupiah(selectedSiswa.beasiswa.nilai)}
                </p>
                {selectedSiswa.beasiswa.keterangan && (
                  <p className="text-[10px] text-purple-500 dark:text-purple-400 mt-0.5">{selectedSiswa.beasiswa.keterangan}</p>
                )}
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Tipe Beasiswa</label>
                <select value={beasiswaTipe} onChange={e => setBeasiswaTipe(e.target.value as BeasiswaTipe)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="persentase">Potongan Persen (%)</option>
                  <option value="nominal">Potongan Nominal (Rp)</option>
                  <option value="bebas">Bebas Total</option>
                </select>
              </div>
              {beasiswaTipe !== 'bebas' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {beasiswaTipe === 'persentase' ? 'Persentase (0-100)' : 'Nominal Potongan'}
                  </label>
                  <input type="number" value={beasiswaNilai} onChange={e => setBeasiswaNilai(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Keterangan</label>
                <textarea value={beasiswaKeterangan} onChange={e => setBeasiswaKeterangan(e.target.value)} placeholder="Alasan beasiswa (opsional)..." rows={2} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowBeasiswa(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl text-sm">Batal</button>
              <button onClick={handleBeasiswa} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-sm">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {selectedSiswa && !showBeasiswa && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedSiswa(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Riwayat Pembayaran</h3>
              <button onClick={() => setSelectedSiswa(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{selectedSiswa.siswa?.nama} — {selectedSiswa.jenis_pembayaran?.nama}</p>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Tagihan</span><span className="font-bold text-slate-800 dark:text-white">{rupiah(selectedSiswa.nominal)}</span></div>
              {selectedSiswa.beasiswa && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Setelah Beasiswa</span>
                  <span className="font-bold text-purple-600">{rupiah(hitungBeasiswa(selectedSiswa.nominal, selectedSiswa.beasiswa))}</span>
                </div>
              )}
              <div className="flex justify-between text-sm"><span className="text-slate-500">Terkumpul</span><span className="font-bold text-emerald-600">{rupiah(selectedSiswa.terbayar)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">Sisa</span><span className="font-bold text-red-600">{rupiah(selectedSiswa.sisa)}</span></div>
              </div>
            {selectedSiswa.riwayat && selectedSiswa.riwayat.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedSiswa.riwayat.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl group">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{rupiah(t.nominal)}</p>
                      <p className="text-[10px] text-slate-400">{t.tanggal} — {t.metode === 'rfid' ? 'RFID' : t.metode === 'transfer' ? 'Transfer' : 'Manual'}</p>
                      {t.keterangan && <p className="text-[10px] text-slate-400">{t.keterangan}</p>}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditTrx({ recordId: selectedSiswa.id, trx: t }); setEditTrxNominal(String(t.nominal)); }} className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-1.5 py-0.5 rounded transition-colors"><Pencil className="w-3 h-3 inline" /></button>
                      <button onClick={() => handleDeleteTrx(selectedSiswa.id, t.id)} className="text-[10px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-1.5 py-0.5 rounded transition-colors"><Trash2 className="w-3 h-3 inline" /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-slate-400 py-4">Belum ada riwayat pembayaran</p>
            )}
            <button onClick={() => setSelectedSiswa(null)} className="w-full mt-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl text-sm">Tutup</button>
          </div>
        </div>
      )}

      {editTrx && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setEditTrx(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg mb-4">Edit Transaksi</h3>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
              <input type="number" value={editTrxNominal} onChange={e => setEditTrxNominal(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditTrx(null)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold py-3 rounded-xl text-sm">Batal</button>
              <button onClick={handleEditTrx} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
