import { useState } from 'react';
import { ArrowRight, FileText, CheckCircle, ClipboardList, Info, Calendar, CreditCard, Users, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePublicGelombangAktif } from '../hooks/useSPMB';
import { useSistemKonfigurasi } from '../hooks/useSistemKonfigurasi';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

export default function SPMB() {
  const [activeTab, setActiveTab] = useState('informasi');
  const navigate = useNavigate();
  const { data: gelombangData, isLoading } = usePublicGelombangAktif();
  const { data: config } = useSistemKonfigurasi();

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
                    {[
                      {
                        title: '1. Pengisian Formulir Online',
                        text: config?.spmb_alur_online || 'Calon siswa memilih gelombang yang tersedia dan melengkapi biodata diri secara penuh. Dokumen pendukung seperti KK, Akta Kelahiran, dan Surat Keterangan Lulus bisa diunggah di akhir.',
                        icon: FileText,
                        box: 'bg-slate-100 dark:bg-slate-800 text-brand-blueDark dark:text-brand-yellow border-slate-200 dark:border-slate-700',
                      },
                      {
                        title: '2. Verifikasi Data',
                        text: config?.spmb_alur_verifikasi || 'Panitia memvalidasi berkas pendaftaran sebelum tahap berikutnya.',
                        icon: ClipboardList,
                        box: 'bg-brand-teal/10 text-brand-teal dark:text-emerald-400 border-brand-teal/20 dark:border-emerald-500/30',
                      },
                      {
                        title: '3. Pembayaran',
                        text: config?.spmb_alur_pembayaran || 'Lakukan pembayaran formulir / registrasi sesuai instruksi panitia dan unggah bukti transfer bila diminta.',
                        icon: CreditCard,
                        box: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
                      },
                      {
                        title: '4. Tes / CBT',
                        text: config?.spmb_alur_tes || 'Siswa mengikuti tes pemetaan (CBT) sesuai jadwal atau token ujian mandiri yang diberikan panitia.',
                        icon: Users,
                        box: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30',
                      },
                      {
                        title: '5. Pengumuman Kelulusan',
                        text: config?.spmb_alur_pengumuman || 'Surat Keputusan (SK) Kelulusan dapat diakses di dashboard pendaftaran, diikuti instruksi registrasi ulang.',
                        icon: CheckCircle,
                        box: 'bg-brand-green/10 text-brand-green dark:text-emerald-400 border-brand-green/20 dark:border-emerald-500/30',
                      },
                    ].map((step) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.title} className="flex gap-4">
                          <div className={`w-12 h-12 rounded-[15px] flex items-center justify-center shrink-0 shadow-sm border ${step.box}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">{step.text}</p>
                          </div>
                        </div>
                      );
                    })}
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
              
              {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gelombangData?.length === 0 && (
                  <div className="col-span-full text-center py-12 text-slate-400">Belum ada gelombang pendaftaran yang dibuka</div>
                )}
                {gelombangData?.map((gel) => {
                  const filled = gel.pendaftars_count || 0;
                  const quota = gel.kuota || 999;
                  const fillRatio = quota > 0 ? filled / quota : 0;
                  const now = new Date().toISOString().split('T')[0];
                  const start = gel.tanggal_mulai.split('T')[0];
                  const end = gel.tanggal_selesai.split('T')[0];
                  const isOpen = gel.is_active && start <= now && end >= now;
                  const isUpcoming = gel.is_active && start > now;
                  const isAlmostFull = fillRatio > 0.9;
                  let statusText = 'Dibuka';
                  if (!gel.is_active) statusText = 'Ditutup';
                  else if (isUpcoming) statusText = 'Akan Datang';
                  else if (isAlmostFull) statusText = 'Hampir Penuh';
                  else if (end < now) statusText = 'Berakhir';
                  else statusText = 'Berlangsung';

                  return (
                  <div key={gel.id} className={`rounded-[15px] p-6 border ${isOpen ? 'border-brand-teal/30 dark:border-emerald-500/40 bg-white dark:bg-slate-900 shadow-card dark:shadow-none hover:shadow-card transition-shadow' : isUpcoming ? 'border-blue-200 dark:border-blue-500/40 bg-blue-50/30 dark:bg-blue-500/5' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 sm:px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${
                        isAlmostFull ? 'bg-orange-100 text-orange-700' :
                        isOpen ? 'bg-brand-green/10 text-brand-green dark:text-emerald-400' :
                        isUpcoming ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                        'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {statusText}
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold mb-1 ${!isOpen && 'text-slate-500 dark:text-slate-400'}`}>{gel.nama}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                      <Calendar className="w-4 h-4" /> {formatDate(gel.tanggal_mulai)} - {formatDate(gel.tanggal_selesai)}
                    </div>
                    
                    {gel.kuota && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Terisi: {filled}</span>
                        <span className="text-slate-900 dark:text-white font-bold">Total Kuota: {gel.kuota}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className={`h-2 rounded-full ${isAlmostFull ? 'bg-orange-500' : 'bg-brand-teal'}`} style={{ width: `${Math.min(fillRatio * 100, 100)}%` }}></div>
                      </div>
                    </div>
                    )}

                    <div className="text-sm font-semibold text-brand-blueDark dark:text-brand-yellow mb-6 flex items-start gap-2 h-10">
                      <Info className="w-4 h-4 shrink-0 mt-0.5 text-brand-yellow" />
                      <span className="leading-snug">Biaya pendaftaran: Rp {gel.biaya_pendaftaran.toLocaleString('id-ID')}</span>
                    </div>

                    <button 
                      onClick={() => navigate(`/spmb/form/${gel.id}`)}
                      disabled={!isOpen}
                      className={`w-full py-3 rounded-[15px] font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                        isOpen 
                          ? 'bg-brand-teal hover:bg-brand-teal/90 text-white shadow-sm' 
                          : isUpcoming
                          ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 cursor-not-allowed'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isOpen ? 'Daftar Gelombang Ini' : isUpcoming ? 'Belum Dibuka' : 'Pendaftaran Ditutup'}
                    </button>
                  </div>
                  );
                })}
              </div>
              )}
            </div>
          )}

          {/* TAB 3: PEMBAYARAN */}
          {activeTab === 'pembayaran' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 border-b pb-4">Rincian Biaya Pendidikan</h2>
              
              <div className="bg-slate-50 dark:bg-slate-800 rounded-[15px] p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-[15px] flex items-center justify-center text-brand-blueDark dark:text-brand-yellow shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
                    <Info className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Informasi Pembayaran</h3>
                    <div 
                      className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line font-mono text-sm"
                      dangerouslySetInnerHTML={{ __html: config?.spmb_biaya_info ? config.spmb_biaya_info.replace(/\n/g, '<br/>') : 'Silakan hubungi panitia untuk informasi detail biaya pendidikan.' }}
                    />
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
