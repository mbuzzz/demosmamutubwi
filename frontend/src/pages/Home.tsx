
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
      {/* Minimalist Modern Hero Section with Animation */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-slate-50 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-teal/20 blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-brand-blueDark/10 blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Text Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-brand-teal uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse"></span>
                Penerimaan Siswa Baru 2026 Dibuka
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                Pendidikan <span className="text-gradien-biru-hijau">Modern</span> & Berkarakter.
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 max-w-xl leading-relaxed">
                Platform digitalisasi sekolah terpadu yang memadukan keunggulan akademik, integritas Islami, dan teknologi masa depan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a 
                  href="#portal-login"
                  className="inline-flex justify-center items-center gap-2 bg-brand-blueDark hover:bg-brand-blueDark/90 text-white font-semibold px-8 py-4 rounded-[15px] shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
                >
                  Masuk Portal SIT <ArrowRight className="w-4 h-4" />
                </a>
                <Link 
                  to="/profile" 
                  className="inline-flex justify-center items-center bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold px-8 py-4 rounded-[15px] shadow-sm hover:shadow-card transition-all duration-300"
                >
                  Jelajahi Profil
                </Link>
              </div>
            </div>

            {/* Visual/Image Content */}
            <div className="relative lg:h-[600px] flex items-center justify-center animate-in fade-in slide-in-from-right-12 duration-1000 delay-300 fill-mode-both">
              <div className="relative w-full max-w-md lg:max-w-none">
                {/* Main Image */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl z-10 border-4 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80" 
                    alt="Siswa Berprestasi" 
                    className="w-full h-auto object-cover aspect-[4/5] lg:aspect-[3/4]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blueDark/60 via-transparent to-transparent"></div>
                </div>

                {/* Floating Card 1 */}
                <div className="absolute -left-6 bottom-20 z-20 bg-white p-4 rounded-[15px] shadow-card-hover animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg"><Award className="w-6 h-6" /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Akreditasi A</p>
                      <p className="text-xs text-slate-500">Unggul & Berprestasi</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -right-6 top-20 z-20 bg-white p-4 rounded-[15px] shadow-card-hover animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-teal/10 text-brand-teal rounded-lg"><GraduationCap className="w-6 h-6" /></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Digital Terpadu</p>
                      <p className="text-xs text-slate-500">Sistem CBT & E-Rapor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-blueDark to-brand-teal rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white p-2 rounded-2xl border shadow-card hover:shadow-card-hover transition-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80" 
                  alt="Kepala Sekolah Drs. H. Suwito, M.Pd." 
                  className="w-72 h-80 object-cover rounded-xl"
                />
                <div className="mt-4 text-center pb-2">
                  <h4 className="font-bold text-slate-900 text-lg leading-tight">Drs. H. Suwito, M.Pd.</h4>
                  <p className="text-brand-teal text-sm font-semibold mt-1">Kepala Sekolah</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex p-3 bg-brand-blueDark/5 rounded-2xl text-brand-blueDark">
              <Quote className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">
              Sambutan Kepala SMAS Muhammadiyah 1 Banyuwangi
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
              <p className="font-medium text-slate-800">Assalamu’alaikum Warahmatullahi Wabarakatuh,</p>
              <p>
                Selamat datang di portal informasi resmi SMAS Muhammadiyah 1 Banyuwangi. Melalui peningkatan tata kelola lembaga pendidikan modern, kami menghadirkan <strong className="text-brand-teal">Sistem Informasi Terintegrasi (SIT)</strong>. Platform ini menghubungkan pendaftaran siswa (SPMB), administrasi sekolah, absensi, hingga bilik ujian CBT digital anti-cheat demi masa depan generasi unggulan berakhlak mulia.
              </p>
              <p className="font-semibold text-slate-900">Wassalamu’alaikum Warahmatullahi Wabarakatuh.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Widget */}
      <section className="py-12 bg-slate-50 border-t border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 border rounded-2xl shadow-card bg-white hover:shadow-card-hover transition-shadow">
            <Users className="h-8 w-8 text-brand-blueDark mx-auto mb-2" />
            <div className="text-3xl font-extrabold text-slate-900">850+</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Siswa Aktif</div>
          </div>
          <div className="p-6 border rounded-2xl shadow-card bg-white hover:shadow-card-hover transition-shadow">
            <GraduationCap className="h-8 w-8 text-brand-teal mx-auto mb-2" />
            <div className="text-3xl font-extrabold text-slate-900">45+</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Guru & Pendidik</div>
          </div>
          <div className="p-6 border rounded-2xl shadow-card bg-white hover:shadow-card-hover transition-shadow">
            <BookOpen className="h-8 w-8 text-brand-blueSlate mx-auto mb-2" />
            <div className="text-3xl font-extrabold text-slate-900">A</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Akreditasi BAN-SM</div>
          </div>
          <div className="p-6 border rounded-2xl shadow-card bg-white hover:shadow-card-hover transition-shadow">
            <Award className="h-8 w-8 text-brand-green mx-auto mb-2" />
            <div className="text-3xl font-extrabold text-slate-900">30+</div>
            <div className="text-sm text-slate-500 font-medium mt-1">Ekstrakurikuler</div>
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
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="p-3 bg-brand-yellow rounded-xl text-brand-blueDark">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Prestasi Sekolah</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="bg-brand-teal text-white p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Sekolah Adiwiyata Nasional 2025</h4>
                    <p className="text-sm text-slate-300">Penghargaan tertinggi di bidang lingkungan hidup dari Kementerian LHK.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-teal text-white p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Sekolah Penggerak Angkatan 3</h4>
                    <p className="text-sm text-slate-300">Terpilih sebagai pionir penerapan Kurikulum Merdeka yang inovatif dan terdigitalisasi.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-teal text-white p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Juara Umum Lomba Inovasi Sekolah Berkemajuan</h4>
                    <p className="text-sm text-slate-300">Penghargaan Majelis Dikdasmen PP Muhammadiyah.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Prestasi Siswa */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="p-3 bg-brand-teal rounded-xl text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Prestasi Siswa</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="bg-brand-yellow text-brand-blueDark p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Medali Emas Olimpiade Sains Nasional (OSN) Fisika</h4>
                    <p className="text-sm text-slate-300">Diraih oleh Ananda Rizky Pratama (Kelas XI IPA 1) - 2026.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-yellow text-brand-blueDark p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Juara 1 Lomba Robotik Tingkat Provinsi Jatim</h4>
                    <p className="text-sm text-slate-300">Tim Robotik SMAS Muhammadiyah 1 Banyuwangi - 2025.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-brand-yellow text-brand-blueDark p-1 rounded-full shrink-0 mt-0.5"><Award className="h-3 w-3" /></span>
                  <div>
                    <h4 className="font-semibold text-lg">Medali Perak Kejuaraan Tapak Suci Nasional</h4>
                    <p className="text-sm text-slate-300">Kontingen Tapak Suci Sekolah - 2025.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Kabar Sekolah Terbaru</h2>
              <p className="text-base text-slate-500 mt-2">Dapatkan informasi terkini mengenai agenda dan prestasi SMAS Muhammadiyah 1 Banyuwangi</p>
            </div>
            <Link 
              to="/berita"
              className="hidden sm:inline-flex bg-white hover:bg-slate-50 text-brand-blueDark border font-semibold px-5 py-2.5 rounded-xl text-sm items-center gap-2 shadow-sm transition-colors"
            >
              Lihat Semua Berita <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <div key={news.id} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border flex flex-col justify-between cursor-pointer" onClick={() => navigate(`/berita/${news.id}`)}>
                <div className="h-48 overflow-hidden bg-slate-200">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="text-xs text-brand-blueSlate font-medium block mb-3">{news.date}</span>
                  <h3 className="font-bold text-slate-900 leading-tight text-lg mb-3 line-clamp-2 group-hover:text-brand-teal transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">{news.excerpt}</p>
                  <div className="text-brand-teal font-semibold text-sm inline-flex items-center gap-1 mt-auto">
                    Baca Selengkapnya <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link 
              to="/berita"
              className="inline-flex bg-white hover:bg-slate-50 text-brand-blueDark border font-semibold px-5 py-2.5 rounded-xl text-sm items-center gap-2 shadow-sm transition-colors"
            >
              Lihat Semua Berita <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities / Gallery Preview */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="text-center max-w-3xl mx-auto mb-12 px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900">Galeri Fasilitas Sekolah</h2>
          <p className="text-slate-500 mt-2 text-lg">Dukungan infrastruktur belajar mengajar yang lengkap dan representatif untuk kenyamanan siswa.</p>
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
            <div key={idx} className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover aspect-[4/3] bg-slate-200">
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
