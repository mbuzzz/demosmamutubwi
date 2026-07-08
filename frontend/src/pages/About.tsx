import { useState } from 'react';
import { Target, Shield, Compass, Clock, BookOpen, Quote, Loader2, AlertCircle } from 'lucide-react';
import { usePublicProfil } from '../hooks/useCms';
import { getFileUrl } from '../lib/api';

export default function About() {
  const [activeTab, setActiveTab] = useState('visi');
  const { data: profil, isLoading, error } = usePublicProfil();

  if (isLoading) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 py-16 px-4 min-h-screen flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm text-slate-500 font-semibold">Memuat profil sekolah...</p>
      </div>
    );
  }

  if (error || !profil) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 py-16 px-4 min-h-screen">
        <div className="max-w-md mx-auto bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 p-5 rounded-2xl flex items-center gap-3 border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="font-black text-sm">Gagal memuat profil</h4>
            <p className="text-xs text-red-500 dark:text-red-450 mt-0.5">Silakan coba beberapa saat lagi.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Profile */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blueDark/10 text-xs font-bold text-brand-blueDark dark:text-brand-yellow uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-teal"></span>
            Mengenal Kami
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Profil Lengkap Sekolah</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Jelajahi sejarah perjalanan institusi kami, landasan visi-misi, serta sambutan dari kepala sekolah {profil.nama_sekolah || 'SMAS Muhammadiyah 1 Banyuwangi'}.
          </p>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button 
            onClick={() => setActiveTab('visi')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[15px] font-bold text-sm transition-all duration-200 ${
              activeTab === 'visi' 
                ? 'bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white shadow-card dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Target className="w-4 h-4" /> Visi & Misi
          </button>
          <button 
            onClick={() => setActiveTab('sejarah')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[15px] font-bold text-sm transition-all duration-200 ${
              activeTab === 'sejarah' 
                ? 'bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white shadow-card dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" /> Sejarah Singkat
          </button>
          <button 
            onClick={() => setActiveTab('sambutan')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[15px] font-bold text-sm transition-all duration-200 ${
              activeTab === 'sambutan' 
                ? 'bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white shadow-card dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Quote className="w-4 h-4" /> Sambutan Kepsek
          </button>
          <button 
            onClick={() => setActiveTab('struktur')}
            className={`flex items-center gap-2 px-6 py-3 rounded-[15px] font-bold text-sm transition-all duration-200 ${
              activeTab === 'struktur' 
                ? 'bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white shadow-card dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Struktur Organisasi
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="bg-white dark:bg-slate-900 rounded-[15px] p-8 sm:p-12 shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 min-h-[400px]">
          
          {/* Tab 1: Visi & Misi */}
          {activeTab === 'visi' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 border-b pb-4">Landasan Visi, Misi & Tujuan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                  {/* Visi */}
                  <div className="bg-brand-teal/5 p-6 rounded-[15px] border border-brand-teal/10 dark:border-emerald-500/20">
                    <div className="w-12 h-12 bg-brand-teal rounded-[15px] flex items-center justify-center text-white mb-4 shadow-sm">
                      <Target className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3">Visi Kami</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{profil.visi_teks || 'Menjadi lembaga pendidikan unggulan yang melahirkan lulusan berakhlak mulia.'}"
                    </p>
                  </div>
                  
                  {/* Akreditasi */}
                  <div className="bg-brand-blueDark/5 p-6 rounded-[15px] border border-brand-blueDark/10 dark:border-blue-500/20">
                    <div className="w-12 h-12 bg-brand-blueDark rounded-[15px] flex items-center justify-center text-white mb-4 shadow-sm">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3">Akreditasi</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-bold">
                      Sekolah terakreditasi peringkat: {profil.akreditasi || 'A'}
                    </p>
                  </div>
                </div>

                {/* Misi */}
                <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800 p-6 sm:p-8 rounded-[15px] border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-brand-green rounded-[15px] flex items-center justify-center text-white shadow-sm shrink-0">
                      <Compass className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-2xl">Misi Utama</h3>
                  </div>
                  <ul className="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                    {profil.misi_list && profil.misi_list.length > 0 ? (
                      profil.misi_list.map((misi, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="text-brand-green dark:text-emerald-400 font-bold">{index + 1}.</span>
                          <span>{misi}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex gap-3">
                          <span className="text-brand-green dark:text-emerald-400 font-bold">1.</span>
                          <span>Menyelenggarakan proses pembelajaran yang mengintegrasikan ilmu pengetahuan umum dengan nilai-nilai Islam.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-brand-green dark:text-emerald-400 font-bold">2.</span>
                          <span>Mengembangkan potensi bakat akademis maupun non-akademis siswa secara optimal.</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Sejarah */}
          {activeTab === 'sejarah' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-b pb-4">Sejarah Perjalanan Kami</h2>
              <div 
                className="prose prose-lg text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: profil.sejarah_teks || 'Detail sejarah sekolah sedang diperbarui.' }}
              />
            </div>
          )}

          {/* Tab 3: Sambutan Kepsek */}
          {activeTab === 'sambutan' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 border-b pb-4">Sambutan Kepala Sekolah</h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] shadow-sm max-w-[280px]">
                    <img 
                      src={profil.kepsek_foto ? getFileUrl(profil.kepsek_foto) : "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80"} 
                      alt={`Kepala Sekolah ${profil.kepsek_nama}`} 
                      className="w-full aspect-[3/4] object-cover rounded-[15px]"
                    />
                  </div>
                </div>
                <div className="md:col-span-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{profil.kepsek_nama || 'Kepala Sekolah'}</h3>
                    <p className="text-brand-teal dark:text-emerald-400 font-semibold text-lg">Kepala Sekolah {profil.nama_sekolah}</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[15px] text-slate-700 dark:text-slate-300 leading-relaxed text-lg border border-slate-100 dark:border-slate-800 relative">
                    <Quote className="absolute top-6 right-6 w-12 h-12 text-slate-200 dark:text-slate-700" />
                    <p className="font-semibold text-slate-900 dark:text-white mb-4">Assalamu’alaikum Warahmatullahi Wabarakatuh,</p>
                    <div 
                      className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: profil.kepsek_sambutan || 'Sambutan kepala sekolah sedang disiapkan.' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Struktur Organisasi */}
          {activeTab === 'struktur' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-b pb-4">Struktur Organisasi Sekolah</h2>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-[15px] border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center min-h-[300px]">
                <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-655 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Bagan Struktur Organisasi</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Dokumen bagan hierarki struktural kepemimpinan sekolah saat ini sedang dalam proses pembaharuan desain visual.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
