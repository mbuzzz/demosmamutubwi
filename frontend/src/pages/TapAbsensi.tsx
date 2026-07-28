import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, SmartphoneNfc, CheckCircle2, XCircle, Lock, Clock, Zap, ZapOff } from 'lucide-react';
import { STATUS_ABSENSI_BADGE } from '../types/absensi';
import { useVerifyGatekeeperPin } from '../hooks/useRfid';
import { useTapAbsensi } from '../hooks/useAbsensi';
import { toast } from 'sonner';

type Step = 'pin' | 'scan' | 'success' | 'error';

export default function TapAbsensi() {
  const [step, setStep] = useState<Step>('pin');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState('');
  const [waktu, setWaktu] = useState(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
  const rfidInputRef = useRef<HTMLInputElement>(null);
  const [scanCount, setScanCount] = useState(0);
  const [rfidValue, setRfidValue] = useState('');
  const [autoMode, setAutoMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScans, setLastScans] = useState<Array<{nama: string; status: string; waktu: string}>>([]);
  const rfidTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoBackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const verifyGatekeeper = useVerifyGatekeeperPin();
  const tapAbsensi = useTapAbsensi();

  // Durasi tampil sukses/error sebelum kembali ke scan (ms)
  const SUCCESS_DISPLAY_MS = 1200;
  const ERROR_DISPLAY_MS = 2000;

  const resetToScan = useCallback(() => {
    setStep('scan');
    setScanResult(null);
    setScanError('');
    setRfidValue('');
    setIsProcessing(false);
    setTimeout(() => rfidInputRef.current?.focus(), 100);
  }, []);

  const processRfidScan = useCallback((uid: string) => {
    if (!uid || uid.length < 4 || isProcessing) return;
    const normalized = uid.toUpperCase().trim();
    setIsProcessing(true);

    tapAbsensi.mutate(normalized, {
      onSuccess: (data) => {
        setScanResult(data);
        setStep('success');
        setScanCount(prev => prev + 1);
        
        // Tambah ke riwayat scan terakhir (max 5)
        const nama = data.user?.name || data.nama || '—';
        const statusLabel = STATUS_ABSENSI_BADGE[data.tipe]?.label || data.tipe || '—';
        const jam = data.jam || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setLastScans(prev => [{ nama, status: statusLabel, waktu: jam }, ...prev].slice(0, 5));
        
        if (autoMode) {
          // Auto mode: langsung kembali ke scan setelah delay singkat
          if (autoBackRef.current) clearTimeout(autoBackRef.current);
          autoBackRef.current = setTimeout(resetToScan, SUCCESS_DISPLAY_MS);
        }
      },
      onError: (error: any) => {
        const msg = error.response?.data?.message || 'Kartu RFID tidak terdaftar atau tidak aktif';
        setScanError(msg);
        setStep('error');
        
        // Tambah ke riwayat dengan status error
        setLastScans(prev => [{ nama: normalized, status: 'GAGAL', waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }, ...prev].slice(0, 5));
        
        if (autoMode) {
          if (autoBackRef.current) clearTimeout(autoBackRef.current);
          autoBackRef.current = setTimeout(resetToScan, ERROR_DISPLAY_MS);
        } else {
          toast.error(msg);
        }
      }
    });

  }, [isProcessing, autoMode, resetToScan]);

  useEffect(() => {
    if (rfidValue.length < 2) return;
    if (rfidTimerRef.current) clearTimeout(rfidTimerRef.current);
    rfidTimerRef.current = setTimeout(() => {
      processRfidScan(rfidValue);
      setRfidValue('');
    }, 80);
    return () => {
      if (rfidTimerRef.current) clearTimeout(rfidTimerRef.current);
    };
  }, [rfidValue, processRfidScan]);

  useEffect(() => {
    const timer = setInterval(() => setWaktu(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-focus saat masuk ke step scan
  useEffect(() => {
    if (step === 'scan') {
      setTimeout(() => rfidInputRef.current?.focus(), 100);
    }
  }, [step]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    
    verifyGatekeeper.mutate(pin, {
      onSuccess: () => {
        setStep('scan');
        setPinError(false);
        setTimeout(() => rfidInputRef.current?.focus(), 300);
      },
      onError: () => {
        setPinError(true);
        toast.error('PIN salah');
      }
    });
  };

  const handleRfidScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (rfidValue.trim()) {
      processRfidScan(rfidValue);
      setRfidValue('');
    }
  };

  const handleScanAgain = () => {
    if (autoBackRef.current) clearTimeout(autoBackRef.current);
    resetToScan();
  };

  const toggleAutoMode = () => {
    setAutoMode(prev => !prev);
    if (!autoMode) {
      // Kalau baru nyalakan auto mode, langsung ke scan
      resetToScan();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          {step !== 'pin' && (
            <button onClick={toggleAutoMode} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${autoMode ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'}`}>
              {autoMode ? <Zap className="w-3.5 h-3.5" /> : <ZapOff className="w-3.5 h-3.5" />}
              {autoMode ? 'AUTO' : 'MANUAL'}
            </button>
          )}
        </div>

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
              <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transition-all ${autoMode ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 animate-pulse' : 'bg-gradient-to-br from-indigo-500 to-indigo-600'}`}>
                <SmartphoneNfc className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Tap Kartu RFID</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Dekatkan kartu ke pembaca RFID</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4" /> {waktu}
              </div>
              {autoMode && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-3 h-3" /> Mode Auto — Siap tap terus
                </div>
              )}
            </div>

            <form onSubmit={handleRfidScan}>
              <input ref={rfidInputRef} name="rfidUid" type="text" autoComplete="off" value={rfidValue} onChange={e => setRfidValue(e.target.value)}
                className="w-full text-center text-lg uppercase tracking-widest px-4 py-4 bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-indigo-300 dark:border-indigo-600 rounded-2xl text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-solid"
                placeholder="Scan RFID di sini..." />
              <p className="text-[10px] text-slate-400 text-center mt-2">Pembaca RFID akan mendeteksi kartu secara otomatis — tanpa perlu Enter</p>
            </form>

            {/* Riwayat Scan Terakhir */}
            {lastScans.length > 0 && (
              <div className="mt-6">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 text-center">Scan Terakhir</h4>
                <div className="space-y-1">
                  {lastScans.map((s, i) => (
                    <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${s.status === 'GAGAL' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'}`}>
                      <span className="font-semibold truncate flex-1">{s.nama}</span>
                      <span className="font-mono mx-2">{s.waktu}</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${s.status === 'GAGAL' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'}`}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 text-center text-[10px] text-slate-400">
              Total tap sesi ini: {scanCount}
            </div>
          </div>
        )}

        {step === 'success' && scanResult && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mb-1">TAP BERHASIL</h2>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">{scanResult.user?.name || scanResult.nama}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{scanResult.user?.kelas || scanResult.kelas}</p>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Jenis</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{scanResult.waktu_pulang ? 'Absen Pulang' : 'Absen Masuk'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Waktu</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">{scanResult.jam || scanResult.waktu_pulang || scanResult.waktu_masuk || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Status</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_ABSENSI_BADGE[scanResult.tipe]?.color || 'bg-slate-100'}`}>
                  {STATUS_ABSENSI_BADGE[scanResult.tipe]?.label || scanResult.tipe}
                </span>
              </div>
            </div>

            {!autoMode && (
              <div className="mt-6 space-y-3">
                <button onClick={handleScanAgain} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
                  <SmartphoneNfc className="w-5 h-5 inline mr-2" /> Tap Siswa Lainnya
                </button>
              </div>
            )}

            {autoMode && (
              <p className="mt-4 text-center text-[10px] text-emerald-500 dark:text-emerald-400 font-semibold animate-pulse">
                Kembali ke mode scan otomatis...
              </p>
            )}

            <div className="mt-4 text-center text-[10px] text-slate-400">
              Total tap sesi ini: {scanCount}
            </div>
          </div>
        )}

        {step === 'error' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-red-200 dark:border-red-700 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-500">
                <XCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-red-600 dark:text-red-400 mb-1">TAP GAGAL</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold mt-2">{scanError}</p>
            </div>

            {!autoMode && (
              <button onClick={handleScanAgain} className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold py-3.5 px-4 rounded-2xl text-sm transition-all">
                <SmartphoneNfc className="w-5 h-5 inline mr-2" /> Coba Lagi
              </button>
            )}

            {autoMode && (
              <p className="text-center text-[10px] text-red-400 font-semibold animate-pulse">Kembali ke mode scan otomatis...</p>
            )}
          </div>
        )}

        <div className="mt-4 text-center">
          <span className="text-xs text-white/40">SMAS Muhammadiyah 1 Banyuwangi — Sistem Absensi RFID</span>
        </div>
      </div>
    </div>
  );
}
