
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NewsHub() {
  const navigate = useNavigate();
  const articles = [
    {
      id: 1,
      title: 'SMAS Muhammadiyah 1 Banyuwangi Raih Juara 1 Lomba Karya Tulis Ilmiah Nasional',
      excerpt: 'Siswa SMAS Muhammadiyah 1 Banyuwangi berhasil menorehkan prestasi gemilang dengan meraih juara pertama dalam kompetisi LKTI tingkat nasional yang diselenggarakan...',
      date: '20 Juni 2026',
      category: 'Prestasi',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      title: 'Pelaksanaan Ujian Akhir Semester Menggunakan Sistem CBT Anti-Cheat Baru',
      excerpt: 'Sekolah meluncurkan platform Computer Based Test (CBT) terintegrasi yang dilengkapi dengan fitur pengawasan anti-tab-switching untuk menjamin kejujuran ujian...',
      date: '15 Juni 2026',
      category: 'Akademik',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      title: 'Kunjungan Studi Banding dari Dinas Pendidikan Provinsi Jawa Timur',
      excerpt: 'Dinas Pendidikan Jawa Timur melakukan kunjungan kerja dalam rangka meninjau pemanfaatan digitalisasi tata kelola sekolah yang telah berhasil diterapkan di sini...',
      date: '10 Juni 2026',
      category: 'Pengumuman',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 4,
      title: 'Pendaftaran Siswa Baru (SPMB) Gelombang Kedua Resmi Dibuka',
      excerpt: 'SMAS Muhammadiyah 1 Banyuwangi resmi membuka pendaftaran peserta didik baru (SPMB) untuk gelombang kedua dengan kuota terbatas. Daftarkan diri Anda segera...',
      date: '05 Juni 2026',
      category: 'Pengumuman',
      image: 'https://images.unsplash.com/photo-1525921429573-05911ed24129?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 5,
      title: 'Kegiatan Baitul Arqam Ramadhan Menanamkan Nilai Kepemimpinan Islami',
      excerpt: 'Dalam menyemarakkan bulan suci Ramadhan, seluruh siswa kelas XI mengikuti kegiatan pembinaan karakter dan kepemimpinan Baitul Arqam secara intensif selama...',
      date: '28 Mei 2026',
      category: 'Kegiatan',
      image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=60'
    }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Portal Berita & Kabar Sekolah</h1>
          <p className="text-slate-500 dark:text-slate-400">Kumpulan cerita, pengumuman resmi, dan pencapaian civitas akademika kami.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-card dark:shadow-none hover:shadow-card dark:shadow-none-hover transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col justify-between cursor-pointer" onClick={() => navigate(`/berita/${article.id}`)}>
              <div>
                <div className="h-48 overflow-hidden bg-slate-200 dark:bg-slate-700 relative">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 bg-brand-teal text-white text-xs font-semibold px-2.5 sm:px-3 py-1 rounded whitespace-nowrap">
                    {article.category}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs text-slate-400 font-medium block mb-2">{article.date}</span>
                  <h2 className="font-bold text-slate-900 dark:text-white leading-tight text-lg mb-3 line-clamp-2 group-hover:text-brand-teal dark:text-emerald-400 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed mb-4">{article.excerpt}</p>
                </div>
              </div>
              <div className="px-6 pb-6 mt-auto">
                <div className="text-brand-teal dark:text-emerald-400 font-semibold text-sm inline-flex items-center gap-1 transition-colors">
                  Baca Lengkap <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
