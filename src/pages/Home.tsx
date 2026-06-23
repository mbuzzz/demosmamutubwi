
import { Link, useNavigate } from 'react-router-dom';
import { Award, Users, BookOpen, GraduationCap, ArrowRight, Quote } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const latestNews = [
    {
      id: 1,
      title: 'SMAS Muhammadiyah 1 Banyuwangi Raih Juara 1 Lomba Karya Tulis Ilmiah Nasional',
      excerpt: 'Siswa SMAS Muhammadiyah 1 Banyuwangi berhasil menorehkan prestasi gemilang dengan meraih juara pertama...',
      date: '20 Juni 2026',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      title: 'Pelaksanaan Ujian Akhir Semester Menggunakan Sistem CBT Anti-Cheat Baru',
      excerpt: 'Sekolah meluncurkan platform Computer Based Test (CBT) terintegrasi yang dilengkapi dengan fitur pengawasan anti-tab-switching...',
      date: '15 Juni 2026',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      title: 'Kunjungan Studi Banding dari Dinas Pendidikan Provinsi Jawa Timur',
      excerpt: 'Dinas Pendidikan Jawa Timur melakukan kunjungan kerja dalam rangka meninjau pemanfaatan digitalisasi tata kelola sekolah...',
      date: '10 Juni 2026',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60'
    }
  ];

  return (
    <div className="space-y-0">
      {/* Modern Bento Grid Hero Section (Static, No Animations, Mobile-First) */}
      <section className="bg-slate-50 dark:bg-slate-800 pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile-First Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[minmax(180px,auto)]">
            
            {/* Bento Block 1: Main Value Proposition (Span 2 cols on md, 2 cols on lg) */}
            <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-white dark:bg-slate-900 rounded-[15px] p-8 md:p-10 shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-brand-blueDark dark:text-brand-yellow uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-brand-green"></span>
                  Penerimaan Siswa Baru Dibuka
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
                  Pendidikan <span className="text-gradien-biru-hijau">Modern</span> Berbasis Karakter.
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
                  Mengintegrasikan kurikulum unggulan dengan teknologi tata kelola digital untuk melahirkan generasi yang cerdas dan Islami.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="#daftar-sekarang"
                    className="inline-flex items-center justify-center bg-brand-blueDark hover:bg-brand-blueDark/90 text-white font-bold px-6 py-3.5 rounded-[15px] shadow-sm transition-colors text-sm sm:text-base"
                  >
                    Daftar Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                  <Link 
                    to="/profile" 
                    className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-6 py-3.5 rounded-[15px] transition-colors text-sm sm:text-base"
                  >
                    Profil Sekolah
                  </Link>
                </div>
              </div>
            </div>

            {/* Bento Block 2: Featured Image (Span 1 col on md, 2 cols on lg) */}
            <div className="md:col-span-1 lg:col-span-2 row-span-1 lg:row-span-2 rounded-[15px] overflow-hidden shadow-card dark:shadow-none relative">
              <img 
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80" 
                alt="Kegiatan Belajar" 
                className="w-full h-full object-cover min-h-[250px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blueDark/80 to-transparent flex flex-col justify-end p-6">
                <span className="text-brand-yellow font-bold text-sm mb-1">Fasilitas Lengkap</span>
                <span className="text-white font-semibold text-lg">Lingkungan Belajar yang Nyaman</span>
              </div>
            </div>

            {/* Bento Block 3: Quick Stat / Mini Feature 1 */}
            <div className="md:col-span-1 lg:col-span-1 bg-brand-teal text-white rounded-[15px] p-6 shadow-card dark:shadow-none flex flex-col justify-center">
              <Award className="w-8 h-8 text-brand-yellow mb-4" />
              <h3 className="text-2xl font-bold mb-1">Akreditasi A</h3>
              <p className="text-teal-100 text-sm">Terakreditasi unggul oleh BAN-SM secara konsisten.</p>
            </div>

            {/* Bento Block 4: Quick Stat / Mini Feature 2 */}
            <div className="md:col-span-2 lg:col-span-1 bg-brand-yellow text-brand-blueDark dark:text-brand-yellow rounded-[15px] p-6 shadow-card dark:shadow-none flex flex-col justify-center">
              <GraduationCap className="w-8 h-8 mb-4" />
              <h3 className="text-2xl font-bold mb-1">CBT & E-Rapor</h3>
              <p className="text-brand-blueDark dark:text-brand-yellow/80 text-sm">Sistem evaluasi akademik digital terintegrasi anti-curang.</p>
            </div>

            {/* Bento Block 5: Small Image / Extra context */}
            <div className="hidden lg:block lg:col-span-2 bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden flex items-center">
              <div className="flex h-full w-full">
                <div className="w-1/3 h-full">
                  <img src="https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=400&auto=format&fit=crop&q=80" alt="Masjid" className="w-full h-full object-cover" />
                </div>
                <div className="w-2/3 p-6 flex flex-col justify-center">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Pembinaan Karakter Islami</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">Program Baitul Arqam, shalat berjamaah, dan pendalaman Al-Islam Kemuhammadiyahan.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-blueDark to-brand-teal rounded-[15px] blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative bg-white dark:bg-slate-900 p-2 rounded-[15px] border shadow-card dark:shadow-none hover:shadow-card dark:shadow-none-hover transition-shadow">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80" 
                    alt="Kepala Sekolah Drs. H. Suwito, M.Pd." 
                    className="w-72 h-80 object-cover rounded-[15px]"
                  />
                  <div className="mt-4 text-center pb-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">Drs. H. Suwito, M.Pd.</h4>
                    <p className="text-brand-teal dark:text-emerald-400 text-sm font-semibold mt-1">Kepala Sekolah</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex p-3 bg-brand-blueDark/5 rounded-[15px] text-brand-blueDark dark:text-brand-yellow">
                <Quote className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                Sambutan Kepala SMAS Muhammadiyah 1 Banyuwangi
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                <p className="font-medium text-slate-800 dark:text-slate-200">Assalamu’alaikum Warahmatullahi Wabarakatuh,</p>
                <p>
                  Selamat datang di portal resmi SMAS Muhammadiyah 1 Banyuwangi. Kami terus berkomitmen memberikan layanan pendidikan unggulan dengan mengintegrasikan sistem akademik modern (SIT). Melalui platform digital ini, kami berharap dapat mewujudkan transparansi dan kemudahan tata kelola sekolah bagi pendidik, siswa, dan wali murid demi membentuk generasi yang cerdas dan berakhlak mulia.
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">Wassalamu’alaikum Warahmatullahi Wabarakatuh.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Widget */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800 border-t border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 text-center">
            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-[15px] shadow-card dark:shadow-none bg-white dark:bg-slate-900 hover:shadow-card dark:shadow-none-hover transition-shadow">
              <Users className="h-8 w-8 text-brand-blueDark dark:text-brand-yellow mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">850+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Siswa Aktif</div>
            </div>
            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-[15px] shadow-card dark:shadow-none bg-white dark:bg-slate-900 hover:shadow-card dark:shadow-none-hover transition-shadow">
              <GraduationCap className="h-8 w-8 text-brand-teal dark:text-emerald-400 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">45+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Guru & Pendidik</div>
            </div>
            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-[15px] shadow-card dark:shadow-none bg-white dark:bg-slate-900 hover:shadow-card dark:shadow-none-hover transition-shadow">
              <BookOpen className="h-8 w-8 text-brand-blueSlate dark:text-brand-yellow mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">A</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Akreditasi BAN-SM</div>
            </div>
            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-[15px] shadow-card dark:shadow-none bg-white dark:bg-slate-900 hover:shadow-card dark:shadow-none-hover transition-shadow">
              <Award className="h-8 w-8 text-brand-green dark:text-emerald-400 mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">30+</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Ekstrakurikuler</div>
            </div>
          </div>
        </div>
      </section>

      {/* Prestasi Section */}
      <section className="py-20 bg-brand-blueDark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold">Prestasi Unggulan</h2>
            <p className="text-slate-300 mt-2 text-lg">Dedikasi dan kerja keras civitas akademika kami membuahkan hasil membanggakan di tingkat nasional maupun internasional.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Prestasi Sekolah */}
            <div className="bg-white dark:bg-slate-900/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white dark:bg-slate-900/15 transition-colors text-slate-900 dark:text-white">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="p-3 bg-brand-yellow rounded-xl text-brand-blueDark dark:text-brand-yellow">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Prestasi Sekolah</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="bg-brand-teal text-white p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Sekolah Adiwiyata Nasional 2025</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-300">Penghargaan tertinggi di bidang lingkungan hidup dari Kementerian LHK.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-teal text-white p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Sekolah Penggerak Angkatan 3</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-300">Terpilih sebagai pionir penerapan Kurikulum Merdeka yang inovatif dan terdigitalisasi.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-teal text-white p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Juara Umum Lomba Inovasi Sekolah Berkemajuan</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-300">Penghargaan Majelis Dikdasmen PP Muhammadiyah.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Prestasi Siswa */}
            <div className="bg-white dark:bg-slate-900/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white dark:bg-slate-900/15 transition-colors text-slate-900 dark:text-white">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="p-3 bg-brand-teal rounded-xl text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Prestasi Siswa</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="bg-brand-yellow text-brand-blueDark dark:text-brand-yellow p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Medali Emas Olimpiade Sains Nasional (OSN) Fisika</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-300">Diraih oleh Ananda Rizky Pratama (Kelas XI IPA 1) - 2026.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-yellow text-brand-blueDark dark:text-brand-yellow p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Juara 1 Lomba Robotik Tingkat Provinsi Jatim</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-300">Tim Robotik SMAS Muhammadiyah 1 Banyuwangi - 2025.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-yellow text-brand-blueDark dark:text-brand-yellow p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Medali Perak Kejuaraan Tapak Suci Nasional</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-300">Kontingen Tapak Suci Sekolah - 2025.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Kabar Sekolah Terbaru</h2>
              <p className="text-base text-slate-500 dark:text-slate-400 mt-2">Dapatkan informasi terkini mengenai agenda dan prestasi SMAS Muhammadiyah 1 Banyuwangi</p>
            </div>
            <Link 
              to="/berita"
              className="hidden sm:inline-flex bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800dark:hover:bg-slate-800 dark:bg-slate-800 text-brand-blueDark dark:text-brand-yellow border font-semibold px-5 py-2.5 rounded-xl text-sm items-center gap-2 shadow-sm transition-colors"
            >
              Lihat Semua Berita <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <div key={news.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-card dark:shadow-none hover:shadow-card dark:shadow-none-hover transition-all duration-300 border flex flex-col justify-between cursor-pointer" onClick={() => navigate(`/berita/${news.id}`)}>
                <div className="h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs text-brand-blueSlate dark:text-brand-yellow font-medium block mb-3">{news.date}</span>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight text-lg mb-3 line-clamp-2 group-hover:text-brand-teal dark:text-emerald-400 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">{news.excerpt}</p>
                  <div className="text-brand-teal dark:text-emerald-400 font-semibold text-sm inline-flex items-center gap-1 mt-auto">
                    Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link 
              to="/berita"
              className="inline-flex bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800dark:hover:bg-slate-800 dark:bg-slate-800 text-brand-blueDark dark:text-brand-yellow border font-semibold px-5 py-2.5 rounded-xl text-sm items-center gap-2 shadow-sm transition-colors"
            >
              Lihat Semua Berita <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities / Gallery Preview */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800 border-t">
        <div className="text-center max-w-3xl mx-auto mb-12 px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Galeri Fasilitas Sekolah</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Dukungan infrastruktur belajar mengajar yang lengkap dan representatif untuk kenyamanan siswa.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: 'Laboratorium Komputer', img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80' },
            { title: 'Perpustakaan Digital', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80' },
            { title: 'Laboratorium IPA', img: 'https://images.unsplash.com/photo-1518152006812-cdff28906ec8?w=600&auto=format&fit=crop&q=80' },
            { title: 'Ruang Kelas Nyaman', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80' },
            { title: 'Lapangan Olahraga', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80' },
            { title: 'Masjid Sekolah', img: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80' }
          ].map((item, idx) => (
            <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-card dark:shadow-none hover:shadow-card dark:shadow-none-hover aspect-[4/3] bg-slate-200 dark:bg-slate-700">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blueDark/90 via-black/20 to-transparent flex items-end p-6">
                <span className="text-white font-semibold text-lg">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
