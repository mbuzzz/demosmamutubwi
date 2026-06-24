import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, SmartphoneNfc, CreditCard, CheckCircle2, Clock, Receipt, Banknote } from 'lucide-react';
import { KONFIGURASI_RFID_DEFAULT, MOCK_KARTU_RFID, waktuSekarang, type KonfigurasiRfid } from '../types/rfid';
import { PEMBAYARAN_SISWA_MOCK, STATUS_PEMBAYARAN_BADGE, rupiah, hitungBeasiswa, type PembayaranSiswa, type TransaksiPembayaran } from '../types/pembayaran';
import { toast } from 'sonner';

type Step = 'pin' | 'scan' | 'student' | 'confirm' | 'done';

export default function TapPembayaran() {
  const [step, setStep] = useState<Step>('pin');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [config] = useState<KonfigurasiRfid>(KONFIGURASI_RFID_DEFAULT);
  const [kartuTerdaftar, setKartuTerdaftar] = useState<typeof MOCK_KARTU_RFID[0] | null>(null);
  const [tagihan, setTagihan] = useState<PembayaranSiswa[]>([]);
  const [selectedTagihan, setSelectedTagihan] = useState<string | null>(null);
  const [nominalBayar, setNominalBayar] = useState('');
  const [transaksi, setTransaksi] = useState<TransaksiPembayaran | null>(null);
  const [waktu, setWaktu] = useState(waktuSekarang());
  const rfidInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setWaktu(waktuSekarang()), 10000);
    return () => clearInterval(timer);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === config.pin) {
      setStep('scan');
      setPinError(false);
      setTimeout(() => rfidInputRef.current?.focus(), 300);
    } else {
      setPinError(true);
      toast.error('PIN salah');
    }
  };

  const handleRfidScan = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('rfidUid') as HTMLInputElement;
    const uid = input.value.toUpperCase().trim();
    if (!uid) return;

    const kartu = MOCK_KARTU_RFID.find(k => k.uid === uid && k.status === 'aktif');
    if (!kartu) {
      toast.error('Kartu tidak terdaftar atau tidak aktif');
      input.value = '';
      return;
    }

    const tagihanSiswa = PEMBAYARAN_SISWA_MOCK.filter(p => p.siswaId === kartu.siswaId && p.status !== 'lunas' && p.status !== 'bebas');
    setKartuTerdaftar(kartu);
    setTagihan(tagihanSiswa);
    input.value = '';

    if (tagihanSiswa.length === 0) {
      toast.info(`${kartu.nama} — semua tagihan sudah lunas`);
    }
    setStep('student');
  };

  const handleBayar = () => {
    const tagihanDipilih = tagihan.find(t => t.id === selectedTagihan);
    if (!tagihanDipilih) {
      toast.error('Pilih jenis tagihan');
      return;
    }

    const nominal = Number(nominalBayar);
    if (!nominal || nominal <= 0) {
      toast.error('Masukkan nominal pembayaran');
      return;
    }

    const sisaSetelahBayar = tagihanDipilih.sisa - nominal;
    if (sisaSetelahBayar < 0) {
      toast.error(`Nominal melebihi sisa tagihan (${rupiah(tagihanDipilih.sisa)})`);
      return;
    }

    setTransaksi({
      id: `trx-${Date.now()}`,
      tanggal: new Date().toISOString().split('T')[0],
      nominal,
      metode: 'rfid',
      petugas: 'Petugas RFID',
      keterangan: `Bayar ${tagihanDipilih.jenisPembayaranNama} via RFID`,
    });
    setStep('confirm');
    toast.success(`Pembayaran ${rupiah(nominal)} dicatat`);
  };

  const handleKonfirmasi = () => {
    setStep('done');
    toast.success('Pembayaran berhasil!');
  };

  const handleReset = () => {
    setStep('scan');
    setKartuTerdaftar(null);
    setTagihan([]);
    setSelectedTagihan(null);
    setNominalBayar('');
    setTransaksi(null);
    setTimeout(() => rfidInputRef.current?.focus(), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        {step === 'pin' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Pembayaran RFID</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Masukkan PIN untuk mengakses</p>
            </div>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input type="password" maxLength={6} value={pin} onChange={e => { setPin(e.target.value); setPinError(false); }}
                  className={`w-full text-center text-2xl tracking-[0.5em] px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${pinError ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'}`}
                  placeholder="******" autoFocus />
                {pinError && <p className="text-red-500 text-xs font-semibold mt-2 text-center">PIN salah.</p>}
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                Buka Akses Pembayaran
              </button>
            </form>
          </div>
        )}

        {step === 'scan' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                <SmartphoneNfc className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Tap Kartu Pembayaran</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Dekatkan kartu untuk melihat tagihan</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4" /> {waktu}
              </div>
            </div>
            <form onSubmit={handleRfidScan}>
              <input ref={rfidInputRef} name="rfidUid" type="text" autoComplete="off"
                className="w-full text-center text-lg uppercase tracking-widest px-4 py-4 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-emerald-300 dark:border-emerald-600 rounded-2xl text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-solid"
                placeholder="Scan RFID di sini..." />
            </form>
          </div>
        )}

        {step === 'student' && kartuTerdaftar && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">{kartuTerdaftar.nama}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{kartuTerdaftar.kelas}</p>
            </div>

            {tagihan.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Semua tagihan sudah lunas</p>
                <button onClick={handleReset} className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  Tap kartu lain
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-3">Tagihan Tertunda:</h3>
                <div className="space-y-3 mb-6">
                  {tagihan.map(t => {
                    const nominalSetelahBeasiswa = hitungBeasiswa(t.nominal, t.beasiswa);
                    return (
                      <label key={t.id} onClick={() => { setSelectedTagihan(t.id); setNominalBayar(String(t.sisa)); }}
                        className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedTagihan === t.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-600'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-slate-800 dark:text-white">{t.jenisPembayaranNama}</span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_PEMBAYARAN_BADGE[t.status].color}`}>
                            {STATUS_PEMBAYARAN_BADGE[t.status].label}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">Tagihan: {rupiah(nominalSetelahBeasiswa)}</span>
                          <span className="font-bold text-slate-800 dark:text-white">Sisa: {rupiah(t.sisa)}</span>
                        </div>
                        {t.beasiswa && (
                          <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-semibold">
                            Beasiswa: {t.beasiswa.tipe === 'bebas' ? 'Bebas Bayar' : t.beasiswa.tipe === 'persentase' ? `${t.beasiswa.nilai}%` : rupiah(t.beasiswa.nilai)}
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>

                {selectedTagihan && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nominal Pembayaran</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                        <input type="number" min={1} value={nominalBayar} onChange={e => setNominalBayar(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                    </div>
                    <button onClick={handleBayar} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                      <Banknote className="w-5 h-5 inline mr-2" /> Bayar {nominalBayar ? rupiah(Number(nominalBayar)) : ''}
                    </button>
                  </div>
                )}
                <div className="mt-4 text-center">
                  <button onClick={handleReset} className="text-sm text-slate-500 dark:text-slate-400 font-semibold hover:text-emerald-600 transition-colors">
                    Ganti kartu
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'confirm' && transaksi && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Receipt className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">Konfirmasi Pembayaran</h2>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 space-y-3 mb-6">
              <div className="flex justify-between"><span className="text-sm text-slate-500 dark:text-slate-400">Siswa</span><span className="text-sm font-bold text-slate-800 dark:text-white">{kartuTerdaftar?.nama}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500 dark:text-slate-400">Jenis</span><span className="text-sm font-bold text-slate-800 dark:text-white">{tagihan.find(t => t.id === selectedTagihan)?.jenisPembayaranNama}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500 dark:text-slate-400">Nominal</span><span className="text-lg font-black text-emerald-600">{rupiah(transaksi.nominal)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500 dark:text-slate-400">Metode</span><span className="text-sm font-bold text-slate-800 dark:text-white">RFID</span></div>
              <div className="flex justify-between"><span className="text-sm text-slate-500 dark:text-slate-400">Waktu</span><span className="text-sm font-bold text-slate-800 dark:text-white">{waktu}</span></div>
            </div>

            <div className="space-y-3">
              <button onClick={handleKonfirmasi} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-4 rounded-2xl text-sm transition-all shadow-lg">
                <CheckCircle2 className="w-5 h-5 inline mr-2" /> Konfirmasi Pembayaran
              </button>
              <button onClick={() => setStep('student')} className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 px-4 rounded-2xl text-sm transition-all">
                Batal
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Pembayaran Berhasil!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Transaksi telah dicatat</p>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white text-center mb-6">
              <p className="text-sm opacity-80 font-semibold">Nominal Dibayar</p>
              <p className="text-4xl font-black mt-1">{rupiah(transaksi?.nominal || 0)}</p>
            </div>

            <div className="space-y-3">
              <button onClick={handleReset} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-md">
                <SmartphoneNfc className="w-5 h-5 inline mr-2" /> Bayar Lagi
              </button>
              <Link to="/" className="block text-center text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 font-semibold transition-colors">
                Selesai
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
