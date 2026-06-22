
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const mockArticles = [
    {
      id: 1,
      title: 'SMAS Muhammadiyah 1 Banyuwangi Raih Juara 1 Lomba Karya Tulis Ilmiah Nasional',
      content: `Siswa SMAS Muhammadiyah 1 Banyuwangi berhasil menorehkan prestasi gemilang dengan meraih juara pertama dalam kompetisi Karya Tulis Ilmiah (LKTI) tingkat nasional yang diselenggarakan di Surabaya pada Juni 2026.\n\nDalam perlombaan bergengsi ini, tim peneliti sekolah mengusung konsep solusi pengelolaan limbah organik berbasis sirkular ekonomi untuk lingkungan pedesaan. Presentasi yang lugas dan landasan ilmiah yang kuat dinilai tim juri sebagai pemaparan terbaik dibanding puluhan sekolah perwakilan provinsi lain.\n\nKepala Sekolah SMAS Muhammadiyah 1 Banyuwangi mengungkapkan kebanggaannya atas raihan prestasi luar biasa tersebut. Sekolah akan terus konsisten membina minat bakat riset siswa melalui program ekstrakurikuler Karya Ilmiah Remaja (KIR) secara terstruktur.`,
      date: '20 Juni 2026',
      category: 'Prestasi',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      title: 'Pelaksanaan Ujian Akhir Semester Menggunakan Sistem CBT Anti-Cheat Baru',
      content: `Menghadapi evaluasi akhir semester, SMAS Muhammadiyah 1 Banyuwangi resmi menerapkan modul ujian Computer Based Test (CBT) terintegrasi yang dilengkapi pengawas cerdas.\n\nSistem ini mendeteksi aktivitas pemindahan tab (tab-switching) browser oleh peserta ujian secara real-time. Jika siswa terdeteksi berpindah layar lebih dari batas toleransi (3 kali peringatan), lembar ujian akan terkunci secara otomatis. Dengan ini, integritas ujian dapat ditegakkan dengan objektif tanpa mengurangi kenyamanan operasional siswa.\n\nUji coba modul berjalan dengan lancar, dan mayoritas siswa memuji responsivitas tampilan antarmuka bilik ujian yang bersih dan minim kendala teknis.`,
      date: '15 Juni 2026',
      category: 'Akademik',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      title: 'Kunjungan Studi Banding dari Dinas Pendidikan Provinsi Jawa Timur',
      content: `Tim pengawas dan pembuat kebijakan dari Dinas Pendidikan Provinsi Jawa Timur berkunjung ke SMAS Muhammadiyah 1 Banyuwangi untuk melakukan evaluasi lapangan atas pemanfaatan platform tata kelola terintegrasi sekolah (SIT).\n\nSekolah terpilih menjadi salah satu percontohan terbaik berkat digitalisasi menyeluruh pada rumpun Core (RBAC), humas, pendaftaran (SPMB), dan rekapitulasi data akademik (ledger nilai dan rapor).\n\nDengan sistem terpusat, pengolahan laporan nilai rapor dapat diselesaikan dalam hitungan menit tanpa penundaan manual, serta didukung audit trail log yang transparan guna mengantisipasi manipulasi data nilai.`,
      date: '10 Juni 2026',
      category: 'Pengumuman',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80'
    }
  ];

  const article = mockArticles.find(a => a.id === Number(id)) || mockArticles[0];

  return (
    <div className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden p-6 sm:p-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/berita')}
          className="text-slate-500 hover:text-brand-blueDark font-semibold text-sm flex items-center gap-2 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Berita
        </button>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
          {article.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs sm:text-sm mb-8 pb-4 border-b border-slate-100">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-slate-400" /> {article.date}</span>
          <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium"><Tag className="h-3 w-3 text-slate-500" /> {article.category}</span>
        </div>

        {/* Featured Image */}
        <div className="rounded-xl overflow-hidden mb-8 aspect-video bg-slate-100">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Body Text */}
        <div className="prose max-w-none text-slate-600 leading-relaxed text-lg space-y-4 whitespace-pre-line">
          {article.content}
        </div>
      </div>
    </div>
  );
}
