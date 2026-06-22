import React from 'react';
import { Award, Users, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';

interface HomeProps {
  onPageChange: (page: string) => void;
  onSelectArticle: (articleId: number) => void;
}

export default function Home({ onPageChange, onSelectArticle }: HomeProps) {
  // Mock data for latest news
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
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-emerald-950 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80')" }}></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 inline-block">Penerimaan Siswa Baru Dibuka</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Membangun Generasi Islami, Cerdas, dan Berkemajuan
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
            Selamat datang di SMAS Muhammadiyah 1 Banyuwangi. Sekolah pelopor digitalisasi pendidikan dengan sistem manajemen sekolah terpadu berstandar modern.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => onPageChange('about')}
              className="bg-emerald-600 hover:bg-emerald-500 font-semibold px-8 py-3 rounded-lg text-base shadow-md transition-colors"
            >
              Tentang Sekolah
            </button>
            <a 
              href="#portal-login"
              className="bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-bold px-8 py-3 rounded-lg text-base shadow-md transition-colors"
            >
              Pendaftaran Siswa Baru
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 border rounded-xl shadow-sm bg-slate-50">
            <Users className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-3xl font-extrabold text-slate-900">850+</div>
            <div className="text-sm text-slate-500 font-medium">Siswa Aktif</div>
          </div>
          <div className="p-4 border rounded-xl shadow-sm bg-slate-50">
            <GraduationCap className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-3xl font-extrabold text-slate-900">45+</div>
            <div className="text-sm text-slate-500 font-medium">Guru & Pendidik</div>
          </div>
          <div className="p-4 border rounded-xl shadow-sm bg-slate-50">
            <BookOpen className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-3xl font-extrabold text-slate-900">A</div>
            <div className="text-sm text-slate-500 font-medium">Akreditasi BAN-SM</div>
          </div>
          <div className="p-4 border rounded-xl shadow-sm bg-slate-50">
            <Award className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-3xl font-extrabold text-slate-900">30+</div>
            <div className="text-sm text-slate-500 font-medium">Ekstrakurikuler</div>
          </div>
        </div>
      </section>

      {/* Visi Misi Highlight */}
      <section className="py-16 px-4 max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-emerald-700 font-bold text-sm uppercase tracking-wider block mb-2">Visi & Misi Utama</span>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Mewujudkan Ekosistem Pendidikan Berdaya Saing Global</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Kami berkomitmen menyelenggarakan kegiatan akademis yang mengutamakan akhlakul karimah serta didukung integrasi teknologi informasi untuk mempersiapkan siswa bersaing di kancah nasional maupun global.
          </p>
          <button 
            onClick={() => onPageChange('about')}
            className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-2 transition-colors"
          >
            Baca selengkapnya visi dan misi kami <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg aspect-video">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80" 
            alt="Kegiatan Belajar" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-slate-100 border-t border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Kabar Sekolah Terbaru</h2>
              <p className="text-sm text-slate-500 mt-1">Dapatkan informasi terkini mengenai agenda dan prestasi SMAS Muhammadiyah 1 Banyuwangi</p>
            </div>
            <button 
              onClick={() => onPageChange('news')}
              className="hidden sm:inline-flex bg-white hover:bg-slate-50 text-slate-800 border font-semibold px-4 py-2 rounded-lg text-sm items-center gap-2 shadow-sm transition-colors"
            >
              Lihat Semua Berita <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <div key={news.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
                <div className="h-48 overflow-hidden bg-slate-200">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <span className="text-xs text-slate-400 font-medium block mb-2">{news.date}</span>
                  <h3 className="font-bold text-slate-900 leading-tight text-lg mb-3 line-clamp-2 hover:text-emerald-700 cursor-pointer" onClick={() => onSelectArticle(news.id)}>
                    {news.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">{news.excerpt}</p>
                  <button 
                    onClick={() => onSelectArticle(news.id)}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold text-sm inline-flex items-center gap-1 transition-colors"
                  >
                    Baca Selengkapnya
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities / Gallery Preview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Galeri Fasilitas Sekolah</h2>
          <p className="text-slate-500 mt-2">Dukungan infrastruktur belajar mengajar yang lengkap dan representatif untuk kenyamanan siswa.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            { title: 'Laboratorium Komputer', img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80' },
            { title: 'Perpustakaan Digital', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80' },
            { title: 'Laboratorium IPA', img: 'https://images.unsplash.com/photo-1518152006812-cdff28906ec8?w=600&auto=format&fit=crop&q=80' },
            { title: 'Ruang Kelas Nyaman', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80' },
            { title: 'Lapangan Olahraga', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop&q=80' },
            { title: 'Masjid Sekolah', img: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80' }
          ].map((item, idx) => (
            <div key={idx} className="group relative rounded-xl overflow-hidden shadow-sm aspect-[4/3] bg-slate-200">
              <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-4">
                <span className="text-white font-semibold text-base">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
