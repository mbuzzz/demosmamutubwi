
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
      {/* Hero Section */}
      <section className="relative bg-gradien-biru-hijau text-white py-28 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[2rem] shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <span className="bg-white/10 backdrop-blur-md text-brand-yellow px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block border border-white/20">
            Penerimaan Siswa Baru (SPMB) Dibuka
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Pendidikan Berkualitas dengan Sentuhan Digital Terpadu
          </h1>
          <p className="text-lg sm:text-xl text-slate-100 max-w-3xl mx-auto">
            Membentuk generasi cerdas yang bertakwa, adaptif terhadap teknologi masa kini, dan siap memimpin masa depan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link to="/profile" className="bg-brand-teal hover:bg-brand-teal/90 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all duration-200 text-center">
              Profil Sekolah
            </Link>
            <a href="#portal-login" className="bg-brand-yellow hover:bg-brand-yellow/90 text-brand-blueDark font-bold px-8 py-3.5 rounded-xl shadow-md transition-all duration-200 text-center">
              Daftar Sekarang
            </a>
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
