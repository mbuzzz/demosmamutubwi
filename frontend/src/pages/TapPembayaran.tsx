import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wallet, CheckCircle2, XCircle, Lock, Receipt, SmartphoneNfc, CreditCard, Loader2, Zap, ZapOff } from 'lucide-react';
import { useProsesPembayaran } from '../hooks/usePembayaran';
import { api } from '../lib/api';
import { toast } from 'sonner';

type Step = 'pin' | 'scan' | 'student' | 'confirm' | 'done';

function rupiah(angka: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

export default function TapPembayaran() {
  const [step, setStep] = useState<Step>('pin');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  const [studentData, setStudentData] = useState<any>(null);
  const [tagihanList, setTagihanList] = useState<any[]>([]);
  const [selectedTagihan, setSelectedTagihan] = useState<string | null>(null);
  const [nominalBayar, setNominalBayar] = useState<string>('');
  
  const [terminalToken, setTerminalToken] = useState<string | null>(sessionStorage.getItem('terminal_token'));
  const [petugasNama, setPetugasNama] = useState<string | null>(sessionStorage.getItem('terminal_petugas'));

  const [scanError, setScanError] = useState('');
  const rfidInputRef = useRef<HTMLInputElement>(null);
  const [rfidValue, setRfidValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const rfidTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoBackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Riwayat Session
  const [trxCount, setTrxCount] = useState(0);
  const [trxNominal, setTrxNominal] = useState(0);
  const [lastTrx, setLastTrx] = useState<any[]>([]);

  const bayarMutation = useProsesPembayaran();

  // Reset to Scan (Auto mode)
  const resetToScan = useCallback(() => {
    setStep('scan');
    setStudentData(null);
    setTagihanList([]);
    setSelectedTagihan(null);
    setNominalBayar('');
    setScanError('');
    setRfidValue('');
    setIsProcessing(false);
    setTimeout(() => rfidInputRef.current?.focus(), 100);
  }, []);

  // Hook axios to use terminal token specifically for this page
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      // If we're on the kiosk page and have a terminal token, use it!
      // This overrides the normal token logic for the kiosk flow.
      const token = sessionStorage.getItem('terminal_token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, []);

  // If token exists on load, skip PIN
  useEffect(() => {
    if (terminalToken) {
      setStep('scan');
    }
  }, [terminalToken]);

  // Auto-focus logic
  useEffect(() => {
    if (step === 'scan') {
      setTimeout(() => rfidInputRef.current?.focus(), 100);
    }
  }, [step]);

  // RFID Auto Scan Logic
  const processRfidScan = useCallback(async (uid: string) => {
    if (!uid || uid.length < 4 || isProcessing) return;
    const normalized = uid.toUpperCase().trim();
    setIsProcessing(true);

    try {
      const res = await api.get<any>(`/pembayaran/rfid/${normalized}`);
      
      if (res.data.tagihan?.length === 0) {
        setScanError(`Siswa ${res.data.siswa.nama} tidak memiliki tagihan (Semua Lunas)`);
        setStep('student'); // Tampil error di layar siswa
        setStudentData(res.data.siswa);
        setTagihanList([]);
        setTimeout(() => setIsProcessing(false), 500);
        return;
      }
      
      setStudentData(res.data.siswa);
      setTagihanList(res.data.tagihan);
      setStep('student');
      setTimeout(() => setIsProcessing(false), 500);
      
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Kartu RFID tidak terdaftar atau bukan siswa';
      setScanError(msg);
      setStudentData(null);
      setTagihanList([]);
      setStep('student'); // Tampil error state
      toast.error(msg);
      
      if (autoBackRef.current) clearTimeout(autoBackRef.current);
      autoBackRef.current = setTimeout(resetToScan, 2000);
    }
  }, [isProcessing, resetToScan]);

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

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    setIsProcessing(true);
    try {
      const res = await api.post('/pembayaran/verify-pin', { pin });
      if (res.data.token) {
        sessionStorage.setItem('terminal_token', res.data.token);
        sessionStorage.setItem('terminal_petugas', res.data.petugas || 'Petugas');
        setTerminalToken(res.data.token);
        setPetugasNama(res.data.petugas || 'Petugas');
        setStep('scan');
        setPinError(false);
      } else {
        throw new Error('No token returned');
      }
    } catch (err) {
      setPinError(true);
      toast.error('PIN terminal pembayaran salah');
    } finally {
      setIsProcessing(false);
    }
  };

  const logoutTerminal = () => {
    sessionStorage.removeItem('terminal_token');
    sessionStorage.removeItem('terminal_petugas');
    setTerminalToken(null);
    setStep('pin');
    setPin('');
  };

  const handleBayar = async () => {
    if (!selectedTagihan) return;
    const nominal = parseInt(nominalBayar.replace(/\D/g, ''));
    if (!nominal || nominal <= 0) { toast.error('Nominal tidak valid'); return; }
    
    const tagihan = tagihanList.find(t => t.id === selectedTagihan);
    if (!tagihan) return;
    if (nominal > tagihan.sisa) { toast.error(`Melebihi sisa tagihan (${rupiah(tagihan.sisa)})`); return; }

    setIsProcessing(true);
    bayarMutation.mutate({
      tagihan_id: tagihan.id,
      nominal,
      metode: 'rfid',
      keterangan: `Pembayaran Kiosk RFID`
    }, {
      onSuccess: (data) => {
        setTrxCount(c => c + 1);
        setTrxNominal(n => n + nominal);
        setLastTrx(prev => [{ nama: studentData?.nama, nominal, jenis: tagihan.jenis_pembayaran.nama, waktu: new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit'}) }, ...prev].slice(0, 5));
        
        setStep('done');
        setIsProcessing(false);
        toast.success('Pembayaran Berhasil!');

        // Auto reset
        if (autoBackRef.current) clearTimeout(autoBackRef.current);
        autoBackRef.current = setTimeout(resetToScan, 4000);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Gagal memproses pembayaran');
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-slate-800 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Beranda
          </Link>
          {terminalToken && (
            <button onClick={logoutTerminal} className="text-xs text-white/50 hover:text-white px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/40 transition-colors">
              Tutup Terminal
            </button>
          )}
        </div>

        {step === 'pin' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-teal-100 dark:bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-10 h-10 text-teal-600 dark:text-teal-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Terminal Pembayaran</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Masukkan PIN Bendahara untuk akses terminal</p>
            </div>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <input type="password" maxLength={6} value={pin} onChange={e => { setPin(e.target.value); setPinError(false); }}
                  className={`w-full text-center text-2xl tracking-[0.5em] px-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 rounded-2xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all ${pinError ? 'border-red-400 dark:border-red-500 animate-shake' : 'border-slate-200 dark:border-slate-700'}`}
                  placeholder="******" autoFocus disabled={isProcessing} />
              </div>
              <button type="submit" disabled={isProcessing} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-4 rounded-2xl text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50">
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <><Lock className="w-5 h-5 inline mr-2" /> Buka Terminal</>}
              </button>
            </form>
          </div>
        )}

        {step === 'scan' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden">
            <div className="absolute top-4 left-4 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-full text-[10px] font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1.5 border border-teal-200 dark:border-teal-500/20">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> Terminal Aktif
            </div>
            {petugasNama && (
              <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-400">
                Petugas: {petugasNama}
              </div>
            )}
            
            <div className="mt-8 mb-6">
              <div className="w-28 h-28 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                <SmartphoneNfc className="w-14 h-14 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Tap Kartu Siswa</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Scan RFID untuk menampilkan tagihan pembayaran</p>
            </div>

            <form onSubmit={e => { e.preventDefault(); processRfidScan(rfidValue); }}>
              <input ref={rfidInputRef} type="text" value={rfidValue} onChange={e => setRfidValue(e.target.value)}
                className="w-full text-center text-lg uppercase tracking-widest px-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-teal-300 dark:border-teal-600 rounded-2xl text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Menunggu scan..." disabled={isProcessing} />
            </form>

            {/* Riwayat Scan Terakhir */}
            {lastTrx.length > 0 && (
              <div className="mt-8 text-left">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">Riwayat Sesi Ini</h4>
                <div className="space-y-1.5">
                  {lastTrx.map((t, i) => (
                    <div key={i} className="flex justify-between items-center text-xs bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-lg">
                      <div>
                        <div className="font-bold text-slate-700 dark:text-slate-300">{t.nama}</div>
                        <div className="text-[10px] text-slate-500">{t.jenis}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">{rupiah(t.nominal)}</div>
                        <div className="text-[10px] text-slate-500">{t.waktu}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-between text-[10px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-800/30 rounded-lg p-2">
              <span>Transaksi: {trxCount}</span>
              <span className="text-emerald-500">{rupiah(trxNominal)}</span>
            </div>
          </div>
        )}

        {step === 'student' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {scanError ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{scanError}</h2>
                <button onClick={resetToScan} className="mt-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-xl text-sm font-bold transition-all">Kembali Scan</button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-white leading-tight">{studentData?.nama}</h2>
                    <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mt-0.5">Kelas {studentData?.kelas || '—'}</p>
                  </div>
                  <button onClick={resetToScan} className="text-xs text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-bold">Batal</button>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3">Pilih Tagihan</h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {tagihanList.map(t => (
                      <label key={t.id} className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedTagihan === t.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10' : 'border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800 bg-white dark:bg-slate-900'}`}>
                        <input type="radio" name="tagihan" checked={selectedTagihan === t.id} onChange={() => { setSelectedTagihan(t.id); setNominalBayar(t.sisa.toString()); }} className="mt-1 text-teal-600 focus:ring-teal-500 w-4 h-4" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-slate-800 dark:text-white">{t.jenis_pembayaran.nama}</span>
                            <span className="text-sm font-extrabold text-red-500">{rupiah(t.sisa)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Total: {rupiah(t.nominal)}</span>
                            <span className={`px-2 py-0.5 rounded-md font-bold ${t.status === 'cicil' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{t.status.toUpperCase()}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedTagihan && (
                  <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-bottom-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Input Nominal Pembayaran</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                      <input type="text" value={nominalBayar.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setNominalBayar(val);
                      }} className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-lg focus:ring-2 focus:ring-teal-500 focus:outline-none dark:text-white" />
                    </div>
                  </div>
                )}

                <button onClick={handleBayar} disabled={!selectedTagihan || !nominalBayar || isProcessing} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-2xl transition-all disabled:opacity-50 shadow-lg active:scale-95 flex items-center justify-center gap-2">
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CreditCard className="w-5 h-5" /> Proses Pembayaran</>}
                </button>
              </>
            )}
          </div>
        )}

        {step === 'done' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mb-2">PEMBAYARAN BERHASIL</h2>
            <p className="text-slate-600 dark:text-slate-300 font-medium">{studentData?.nama} — {rupiah(parseInt(nominalBayar.replace(/\D/g,'')))}</p>
            
            <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 text-left">
              <div className="flex items-start gap-3">
                <Receipt className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-slate-800 dark:text-white">Bukti Tersimpan</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Pembayaran telah tercatat di sistem oleh petugas <strong>{petugasNama}</strong>. Siswa/Wali Murid dapat melihat struk digital di panel masing-masing.</p>
                </div>
              </div>
            </div>

            <button onClick={resetToScan} className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-95">
              Siap Scan Berikutnya (Auto dalam 3s)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}