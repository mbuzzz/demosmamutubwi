import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, Image as ImageIcon, LayoutTemplate, Newspaper, Star, ArrowRight, Loader2, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSistemKonfigurasi, useUpdateSistemKonfigurasi } from '../../../hooks/useSistemKonfigurasi';
import { toast } from 'sonner';

export default function AdminBeranda() {
  const { data: config, isLoading } = useSistemKonfigurasi();
  const updateConfig = useUpdateSistemKonfigurasi();

  const [slogan, setSlogan] = useState('');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [googleMapsEmbed, setGoogleMapsEmbed] = useState('');

  useEffect(() => {
    if (config) {
      setSlogan(config.slogan ?? '');
      setTelepon(config.telepon ?? '');
      setEmail(config.email ?? '');
      setAlamat(config.alamat ?? '');
      setGoogleMapsEmbed(config.google_maps_embed ?? '');
    }
  }, [config]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateConfig.mutateAsync({ slogan, telepon, email, alamat, google_maps_embed: googleMapsEmbed });
      toast.success('Pengaturan beranda berhasil disimpan');
    } catch {
      toast.error('Gagal menyimpan pengaturan');
    }
  };

  const contentModules = [
    {
      icon: Newspaper,
      title: 'Kelola Berita & Artikel',
      desc: 'Tambah, edit, atau hapus berita dan artikel yang ditampilkan di beranda dan halaman berita.',
      to: '/panel/berita',
      color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      icon: Star,
      title: 'Kelola Testimoni',
      desc: 'Atur testimoni dari alumni dan orang tua yang ditampilkan di halaman beranda.',
      to: '/panel/faq-testimoni',
      color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      icon: ImageIcon,
      title: 'Kelola Galeri Foto',
      desc: 'Upload dan atur koleksi foto kegiatan sekolah untuk halaman galeri dan beranda.',
      to: '/panel/galeri',
      color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: LayoutTemplate,
      title: 'Profil Sekolah',
      desc: 'Edit visi, misi, sambutan kepala sekolah, dan sejarah singkat sekolah.',
      to: '/panel/profil-sekolah',
      color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <AdminLayout title="Pengaturan Halaman Beranda">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* Kolom Kiri: Form konten beranda */}
        <div className="xl:col-span-2 space-y-6">

          {/* Info */}
          <div className="flex gap-3 p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl">
            <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
              Konten utama beranda (nama, logo, headline) diatur di{' '}
              <Link to="/panel/settings" className="underline font-bold">Pengaturan Sistem</Link>.
              Di sini kamu bisa atur teks pendukung dan embed Maps yang muncul di beranda & footer.
            </p>
          </div>

          {/* Form teks beranda */}
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-indigo-500" /> Teks & Konten Beranda
            </h3>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Slogan / Deskripsi Pendek</label>
                  <textarea
                    rows={3}
                    value={slogan}
                    onChange={e => setSlogan(e.target.value)}
                    placeholder="Membentuk generasi unggul berkarakter Islami, cerdas secara akademis..."
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Slogan ini ditampilkan di Hero Section beranda dan footer.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nomor Telepon</label>
                    <input type="text" value={telepon} onChange={e => setTelepon(e.target.value)} placeholder="(0333) 421382" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Email Sekolah</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@smasmuh1bwi.sch.id" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Alamat Lengkap</label>
                  <textarea rows={2} value={alamat} onChange={e => setAlamat(e.target.value)} placeholder="Jl. Letkol Istiqlah No.109, Banyuwangi..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Embed Google Maps (kode iframe src)</label>
                  <textarea rows={3} value={googleMapsEmbed} onChange={e => setGoogleMapsEmbed(e.target.value)} placeholder='https://maps.google.com/maps?...' className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-mono text-xs"></textarea>
                  <p className="text-[11px] text-slate-400 mt-1">Ambil dari Google Maps → Share → Embed a map → copy URL dari src="..."</p>
                </div>
                <div className="pt-2">
                  <button type="submit" disabled={updateConfig.isPending} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50">
                    {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Perubahan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Shortcut ke modul konten */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800 sticky top-24">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Kelola Konten Beranda</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Akses cepat ke modul pengelolaan konten yang tampil di halaman beranda publik.</p>
            <div className="space-y-3">
              {contentModules.map((mod) => (
                <Link
                  key={mod.to}
                  to={mod.to}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${mod.color}`}>
                    <mod.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 dark:text-white truncate">{mod.title}</div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">{mod.desc}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
