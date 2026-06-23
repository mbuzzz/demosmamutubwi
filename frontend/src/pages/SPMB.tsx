import { useState } from 'react';
import { ArrowRight, FileText, CheckCircle, ClipboardList, Info, Calendar, CreditCard, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SPMB() {
  const [activeTab, setActiveTab] = useState('informasi');
  const navigate = useNavigate();

  // Mock Data Gelombang
  const gelombangData = [
    {
      id: 'gel-1',
      title: 'Gelombang 1 (Inden/Prestasi)',
      period: '01 Januari 2026 - 31 Maret 2026',
      quota: 150,
      filled: 145,
      status: 'Hampir Penuh',
      isOpen: true,
      priceInfo: 'Diskon formulir 50% & Potongan Uang Gedung 20%'
    },
    {
      id: 'gel-2',
      title: 'Gelombang 2 (Reguler)',
      period: '01 April 2026 - 30 Juni 2026',
      quota: 200,
      filled: 40,
      status: 'Dibuka',
      isOpen: true,
      priceInfo: 'Harga Normal'
    },
    {
      id: 'gel-3',
      title: 'Gelombang 3 (Pemenuhan Kuota)',
      period: '01 Juli 2026 - 15 Juli 2026',
      quota: 50,
      filled: 0,
      status: 'Ditutup Sementara',
      isOpen: false,
      priceInfo: 'Jika Kuota Masih Tersedia'
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-800 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header SPMB */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 text-xs font-bold text-brand-blueDark dark:text-brand-yellow uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
            Tahun Ajaran 2026/2027
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">Penerimaan Siswa Baru</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Portal resmi pendaftaran calon siswa/siswi baru SMAS Muhammadiyah 1 Banyuwangi. Pilih gelombang yang tersedia dan pantau kuota penerimaan.
          </p>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button 
            onClick={() => setActiveTab('informasi')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[15px] font-bold text-sm transition-all duration-200 ${
              activeTab === 'informasi' 
                ? 'bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white shadow-card dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Info className="w-4 h-4" /> Informasi & Alur
          </button>
          <button 
            onClick={() => setActiveTab('gelombang')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[15px] font-bold text-sm transition-all duration-200 ${
              activeTab === 'gelombang' 
                ? 'bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white shadow-card dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" /> Jadwal & Gelombang
          </button>
          <button 
            onClick={() => setActiveTab('pembayaran')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[15px] font-bold text-sm transition-all duration-200 ${
              activeTab === 'pembayaran' 
                ? 'bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white shadow-card dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Rincian Biaya
          </button>
        </div>

        {/* Content Container (Bento Layout style) */}
        <div className="bg-white dark:bg-slate-900 rounded-[15px] p-8 sm:p-12 shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 min-h-[400px]">
          
          {/* TAB 1: INFORMASI & ALUR */}
          {activeTab === 'informasi' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Alur Pendaftaran Digital</h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-[15px] flex items-center justify-center text-brand-blueDark dark:text-brand-yellow shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">1. Pengisian Formulir Online</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Calon siswa memilih gelombang yang tersedia dan melengkapi biodata diri secara penuh. Dokumen pendukung seperti KK, Akta Kelahiran, dan Surat Keterangan Lulus bisa diunggah di akhir.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-brand-teal/10 rounded-[15px] flex items-center justify-center text-brand-teal dark:text-emerald-400 shrink-0 shadow-sm border border-brand-teal/20 dark:border-emerald-500/30">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">2. Verifikasi Data & Tes CBT</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Panitia memvalidasi berkas pendaftaran. Siswa akan mendapatkan Token Ujian Mandiri (CBT) untuk melakukan tes pemetaan kelas dari rumah.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-brand-green/10 rounded-[15px] flex items-center justify-center text-brand-green dark:text-emerald-400 shrink-0 shadow-sm border border-brand-green/20 dark:border-emerald-500/30">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">3. Pengumuman Kelulusan</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Surat Keputusan (SK) Kelulusan dapat diakses dan diunduh di dashboard pendaftaran masing-masing siswa, diikuti instruksi registrasi ulang.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white p-8 rounded-[15px] shadow-card dark:shadow-none relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-teal/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <h3 className="text-2xl font-bold mb-4 relative z-10">Info Kuota Tersedia</h3>
                  <div className="bg-white dark:bg-slate-900/10 border border-white/20 p-6 rounded-[15px] relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-brand-yellow font-bold text-sm uppercase">Total Pagu 2026/2027</span>
                      <Users className="w-5 h-5 text-brand-yellow" />
                    </div>
                    <p className="text-5xl font-extrabold mb-4">400 <span className="text-lg font-normal text-slate-300">Siswa/Kursi</span></p>
                    <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                      <div className="bg-brand-teal h-3 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-sm text-slate-300">Sekitar 45% kuota telah terpenuhi melalui jalur inden/prestasi.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('gelombang')}
                    className="mt-6 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-blueDark dark:text-brand-yellow font-bold px-6 py-3 rounded-[15px] transition-colors inline-flex items-center justify-center gap-2 relative z-10"
                  >
                    Lihat Ketersediaan Gelombang <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: GELOMBANG PENDAFTARAN */}
          {activeTab === 'gelombang' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Jadwal & Ketersediaan Gelombang</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Pilih gelombang yang sedang berstatus dibuka untuk melanjutkan proses pendaftaran.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gelombangData.map((gel) => (
                  <div key={gel.id} className={`rounded-[15px] p-6 border ${gel.isOpen ? 'border-brand-teal/30 dark:border-emerald-500/40 bg-white dark:bg-slate-900 shadow-card dark:shadow-none hover:shadow-card dark:shadow-none-hover transition-shadow' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        gel.status === 'Hampir Penuh' ? 'bg-orange-100 text-orange-700' :
                        gel.status === 'Dibuka' ? 'bg-brand-green/10 text-brand-green dark:text-emerald-400' :
                        'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {gel.status}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold mb-1 ${!gel.isOpen && 'text-slate-500 dark:text-slate-400'}`}>{gel.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <Calendar className="w-4 h-4" /> {gel.period}
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Terisi: {gel.filled}</span>
                        <span className="text-slate-900 dark:text-white font-bold">Total Kuota: {gel.quota}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${gel.filled / gel.quota > 0.9 ? 'bg-orange-500' : 'bg-brand-teal'}`} 
                          style={{ width: `${(gel.filled / gel.quota) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-brand-blueDark dark:text-brand-yellow mb-6 flex items-start gap-2 h-10">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-brand-yellow" />
                      <span className="leading-snug">{gel.priceInfo}</span>
                    </div>

                    <button 
                      onClick={() => navigate(`/spmb/form/${gel.id}`)}
                      disabled={!gel.isOpen}
                      className={`w-full py-3 rounded-[15px] font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        gel.isOpen 
                          ? 'bg-brand-teal hover:bg-brand-teal/90 text-white shadow-sm' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {gel.isOpen ? 'Daftar Gelombang Ini' : 'Pendaftaran Ditutup'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PEMBAYARAN */}
          {activeTab === 'pembayaran' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Rincian Biaya Pendaftaran & SPP</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Rincian Masuk */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[15px] shadow-sm overflow-hidden">
                  <div className="bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white p-4 font-bold text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-yellow" /> Biaya Awal (Daftar Ulang)
                  </div>
                  <div className="p-0">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:hover:bg-slate-800 dark:bg-slate-800"><td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">Formulir Pendaftaran</td><td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-right">Rp 200.000</td></tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:hover:bg-slate-800 dark:bg-slate-800"><td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">Uang Seragam (4 Stel)</td><td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-right">Rp 1.500.000</td></tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:hover:bg-slate-800 dark:bg-slate-800"><td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">Uang Kegiatan 1 Tahun</td><td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-right">Rp 800.000</td></tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:hover:bg-slate-800 dark:bg-slate-800"><td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">Uang Infaq Gedung (DPP)</td><td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-right">Rp 3.500.000</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Estimasi Total</span>
                    <span className="text-xl font-extrabold text-brand-teal dark:text-emerald-400">Rp 6.000.000</span>
                  </div>
                </div>

                {/* SPP Bulanan */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[15px] shadow-sm overflow-hidden">
                  <div className="bg-brand-teal text-white p-4 font-bold text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-yellow" /> SPP Bulanan
                  </div>
                  <div className="p-0">
                    <table className="w-full text-sm text-left">
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:hover:bg-slate-800 dark:bg-slate-800"><td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">SPP Pendidikan</td><td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-right">Rp 450.000</td></tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800dark:hover:bg-slate-800 dark:bg-slate-800"><td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400">Ekstrakurikuler Wajib</td><td className="px-6 py-4 font-bold text-slate-900 dark:text-white text-right">Rp 50.000</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center mt-auto">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Total SPP Bulanan</span>
                    <span className="text-xl font-extrabold text-brand-teal dark:text-emerald-400">Rp 500.000</span>
                  </div>
                  <div className="p-6 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                    *Terdapat program keringanan biaya dan beasiswa penuh bagi siswa Yatim/Piatu berprestasi yang lolos seleksi berkas Lazismu.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
