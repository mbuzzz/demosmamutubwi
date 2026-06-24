import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, SmartphoneNfc, CheckCircle2, Lock, Clock, LogOut } from 'lucide-react';
import { KONFIGURASI_RFID_DEFAULT, MOCK_KARTU_RFID, waktuSekarang, statusDariJam, type KonfigurasiRfid } from '../types/rfid';
import { MOCK_ABSENSI_HARI_INI, STATUS_ABSENSI_BADGE, type SiswaAbsensi } from '../types/absensi';
import { toast } from 'sonner';

type Step = 'pin' | 'scan' | 'result';

export default function TapAbsensi() {
  const [step, setStep] = useState<Step>('pin');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [scanResult, setScanResult] = useState<SiswaAbsensi | null>(null);
  const [config] = useState<KonfigurasiRfid>(KONFIGURASI_RFID_DEFAULT);
  const [waktu, setWaktu] = useState(waktuSekarang());
  const rfidInputRef = useRef<HTMLInputElement>(null);
  const [scanCount, setScanCount] = useState(0);

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
      toast.error('Kartu RFID tidak terdaftar atau tidak aktif');
      input.value = '';
      return;
    }

    const absenHariIni = MOCK_ABSENSI_HARI_INI.find(a => a.siswaId === kartu.siswaId && a.tanggal === '2026-06-24');
    const sudahPulang = absenHariIni?.jamPulang;
    const sudahAbsenMasuk = absenHariIni?.jamMasuk;

    const now = waktu;
    const jenis = sudahPulang ? 'full' : sudahAbsenMasuk ? 'pulang' : 'masuk';

    if (jenis === 'full') {
      toast.info(`${kartu.nama} sudah absen masuk & pulang hari ini`);
      input.value = '';
      return;
    }

    const statusAbsen = jenis === 'masuk' ? statusDariJam(now, config) : 'hadir';

    setScanResult({
      id: `scan-${Date.now()}`,
      siswaId: kartu.siswaId,
      nama: kartu.nama,
      kelas: kartu.kelas,
      tanggal: new Date().toISOString().split('T')[0],
      jamMasuk: jenis === 'masuk' ? now : absenHariIni?.jamMasuk,
      jamPulang: jenis === 'pulang' ? now : undefined,
      statusMasuk: jenis === 'masuk' ? statusAbsen : (absenHariIni?.statusMasuk || 'hadir'),
      statusPulang: jenis === 'pulang' ? 'hadir' : undefined,
      metode: 'rfid',
      rfidCard: uid,
    });

    setStep('result');
    setScanCount(prev => prev + 1);
    toast.success(`${kartu.nama} - ${jenis === 'masuk' ? 'Absen Masuk' : 'Absen Pulang'} berhasil`);
    input.value = '';
  };

  const handleScanAgain = () => {
    setStep('scan');
    setScanResult(null);
    setTimeout(() => rfidInputRef.current?.focus(), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        {step === 'pin' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <SmartphoneNfc className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Absensi RFID</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Masukkan PIN untuk mengakses</p>
            </div>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input type="password" maxLength={6} value={pin} onChange={e => { setPin(e.target.value); setPinError(false); }}
                  className={`w-full text-center text-2xl tracking-[0.5em] px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${pinError ? 'border-red-400 dark:border-red-500 animate-shake' : 'border-slate-200 dark:border-slate-700'}`}
                  placeholder="******" autoFocus />
                {pinError && <p className="text-red-500 text-xs font-semibold mt-2 text-center">PIN salah. Coba lagi.</p>}
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-2xl text-sm transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                <Lock className="w-5 h-5 inline mr-2" /> Buka Akses RFID
              </button>
            </form>
          </div>
        )}

        {step === 'scan' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                <SmartphoneNfc className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Tap Kartu RFID</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Dekatkan kartu ke pembaca RFID</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4" /> {waktu}
              </div>
            </div>

            <form onSubmit={handleRfidScan}>
              <input ref={rfidInputRef} name="rfidUid" type="text" autoComplete="off"
                className="w-full text-center text-lg uppercase tracking-widest px-4 py-4 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-2xl text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-solid"
                placeholder="Scan RFID di sini..." />
              <p className="text-[10px] text-slate-400 text-center mt-2">Pembaca RFID akan memasukkan kode secara otomatis</p>
            </form>

            <div className="mt-6 flex justify-center">
              <button onClick={handleScanAgain} className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Tap Ulang
              </button>
            </div>
          </div>
        )}

        {step === 'result' && scanResult && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className={`w-20 h-20 ${!scanResult.jamPulang ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-blue-100 dark:bg-blue-500/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {!scanResult.jamPulang ? <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" /> : <LogOut className="w-10 h-10 text-blue-600 dark:text-blue-400" />}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{scanResult.nama}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{scanResult.kelas}</p>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Jenis</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{scanResult.jamPulang ? 'Absen Pulang' : scanResult.jamMasuk && !scanResult.jamPulang ? 'Absen Masuk' : 'Absen Masuk & Pulang'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Waktu Masuk</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{scanResult.jamMasuk || '-'}</span>
              </div>
              {scanResult.jamPulang && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Waktu Pulang</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{scanResult.jamPulang}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Status Masuk</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_ABSENSI_BADGE[scanResult.statusMasuk].color}`}>
                  {STATUS_ABSENSI_BADGE[scanResult.statusMasuk].label}
                </span>
              </div>
              {scanResult.statusPulang && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Status Pulang</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_ABSENSI_BADGE[scanResult.statusPulang].color}`}>
                    {STATUS_ABSENSI_BADGE[scanResult.statusPulang].label}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Metode</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">RFID</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button onClick={handleScanAgain} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                <SmartphoneNfc className="w-5 h-5 inline mr-2" /> Tap Siswa Lainnya
              </button>
              <Link to="/" className="block text-center text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-semibold transition-colors">
                Selesai
              </Link>
            </div>

            <div className="mt-4 text-center text-[10px] text-slate-400">
              Total tap hari ini: {scanCount}
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <span className="text-xs text-white/40">SMAS Muhammadiyah 1 Banyuwangi — Sistem Absensi RFID</span>
        </div>
      </div>
    </div>
  );
}
