import { useState } from 'react';
import { Target, Shield, Compass, Clock, BookOpen, Quote } from 'lucide-react';

export default function About() {
  const [activeTab, setActiveTab] = useState('visi');

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
            Jelajahi sejarah perjalanan institusi kami, landasan visi-misi, serta sambutan dari kepala sekolah SMAS Muhammadiyah 1 Banyuwangi.
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
                      "Menjadi lembaga pendidikan unggulan yang melahirkan lulusan berakhlak mulia, cerdas secara intelektual, kompeten, dan berkemajuan berdasarkan nilai-nilai Islam."
                    </p>
                  </div>
                  
                  {/* Tujuan */}
                  <div className="bg-brand-blueDark/5 p-6 rounded-[15px] border border-brand-blueDark/10 dark:border-blue-500/20">
                    <div className="w-12 h-12 bg-brand-blueDark rounded-[15px] flex items-center justify-center text-white mb-4 shadow-sm">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-3">Tujuan</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                      Mencetak alumni mandiri yang siap bersaing memasuki perguruan tinggi favorit, berkomitmen keagamaan yang kokoh, serta terampil menguasai teknologi.
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
                    <li className="flex gap-3">
                      <span className="text-brand-green dark:text-emerald-400 font-bold">1.</span>
                      <span>Menyelenggarakan proses pembelajaran yang mengintegrasikan ilmu pengetahuan umum dengan nilai-nilai akhlakul karimah.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-brand-green dark:text-emerald-400 font-bold">2.</span>
                      <span>Mengembangkan potensi bakat akademis maupun non-akademis siswa secara optimal melalui program kurikuler dan ekstrakurikuler.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-brand-green dark:text-emerald-400 font-bold">3.</span>
                      <span>Mengintegrasikan pemanfaatan teknologi informasi modern (CBT, E-Rapor, SIT) dalam seluruh kegiatan operasional dan evaluasi hasil belajar.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-brand-green dark:text-emerald-400 font-bold">4.</span>
                      <span>Membangun iklim ekosistem sekolah yang Islami, kondusif, disiplin, peduli sosial, dan berwawasan lingkungan berkelanjutan.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Sejarah */}
          {activeTab === 'sejarah' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-b pb-4">Sejarah Perjalanan Kami</h2>
              <div className="prose prose-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  SMAS Muhammadiyah 1 Banyuwangi didirikan sebagai tonggak penting bagi Persyarikatan Muhammadiyah dalam memberikan kontribusi nyata untuk mencerdaskan kehidupan bangsa, khususnya di area Kabupaten Banyuwangi. Sejak awal berdirinya, sekolah ini selalu teguh pada komitmen mulia: memadukan antara kuatnya pendidikan umum dan kedalaman ilmu agama Islam.
                </p>
                <p>
                  Sepanjang dekade pelayanannya, sekolah ini telah melewati berbagai fase transformasi. Dimulai dari ruang kelas yang sederhana dengan jumlah guru yang terbatas, hingga kini berevolusi menjadi institusi rujukan yang menampung ratusan siswa dari berbagai penjuru daerah dengan fasilitas laboratorium, perpustakaan, hingga infrastruktur digital yang amat memadai.
                </p>
                <p>
                  Hari ini, dengan diraihnya akreditasi A, SMAS Muhammadiyah 1 Banyuwangi beradaptasi dengan disrupsi teknologi abad ke-21. Mengusung konsep sekolah modern berbasis tata kelola terintegrasi (SIT), kami memastikan generasi lulusan tak hanya alim dan saleh dalam beragama, namun amat cakap menguasai teknologi demi kemajuan peradaban.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Sambutan Kepsek */}
          {activeTab === 'sambutan' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 border-b pb-4">Sambutan Kepala Sekolah</h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4 flex justify-center">
                  <div className="relative p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80" 
                      alt="Kepala Sekolah Drs. H. Suwito, M.Pd." 
                      className="w-full aspect-[3/4] object-cover rounded-[15px]"
                    />
                  </div>
                </div>
                <div className="md:col-span-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Drs. H. Suwito, M.Pd.</h3>
                    <p className="text-brand-teal dark:text-emerald-400 font-semibold text-lg">Kepala Sekolah SMAS Muhammadiyah 1 Banyuwangi</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-[15px] text-slate-700 dark:text-slate-300 leading-relaxed text-lg border border-slate-100 dark:border-slate-800 relative">
                    <Quote className="absolute top-6 right-6 w-12 h-12 text-slate-200" />
                    <p className="font-semibold text-slate-900 dark:text-white mb-4">Assalamu’alaikum Warahmatullahi Wabarakatuh,</p>
                    <p className="mb-4 relative z-10">
                      Puji dan syukur senantiasa kita panjatkan ke hadirat Allah SWT. Selamat datang di portal web resmi SMAS Muhammadiyah 1 Banyuwangi. Kami terus berupaya meningkatkan mutu pendidikan tidak hanya lewat kualitas pengajaran konvensional, melainkan adaptasi sistem tata kelola digital (Sistem Informasi Terintegrasi).
                    </p>
                    <p className="mb-4 relative z-10">
                      Sistem ini lahir dari tekad untuk memastikan transparansi nilai, kemudahan pendaftaran, serta pengawasan evaluasi ujian yang berintegritas. Harapan kami, ekosistem modern ini membawa kenyamanan baik untuk peserta didik, guru, maupun orang tua dalam memantau perkembangan anak-anak kita.
                    </p>
                    <p className="mb-4 relative z-10">
                      Semoga ikhtiar kita menjadikan putra-putri bangsa yang saleh, mandiri, dan berdaya saing global mendapat keridhaan-Nya.
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white relative z-10">Wassalamu’alaikum Warahmatullahi Wabarakatuh.</p>
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
                <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Bagan Struktur Organisasi</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Dokumen bagan hierarki struktural kepemimpinan sekolah saat ini sedang dalam proses pembaharuan desain visual.</p>
                <button className="px-6 py-3 bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white font-semibold rounded-[15px] shadow-sm hover:bg-brand-blueDark/90 transition-colors">
                  Unduh Dokumen PDF
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}