import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Image as ImageIcon, Calendar, Tag as TagIcon, Settings, Link as LinkIcon, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBeritaForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Berita');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Berita berhasil disimpan!');
    navigate('/panel/berita');
  };

  return (
    <AdminLayout title="Tambah Berita Baru">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Main Content Form */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <NewspaperIcon className="w-4 h-4 text-indigo-500" /> Konten Utama
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Judul Berita</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium"
                  placeholder="Masukkan judul berita utama..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Kutipan Singkat (Excerpt)</label>
                <textarea 
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ringkasan singkat yang akan tampil di halaman depan..."
                ></textarea>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Opsional: Jika dikosongkan, akan mengambil otomatis dari paragraf pertama konten.</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Konten Lengkap Berita</label>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                  <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent} 
                    modules={modules}
                    className="h-[400px] pb-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Pengaturan SEO & URL
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5 flex items-center gap-2"><LinkIcon className="w-3.5 h-3.5" /> URL Slug</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-sm text-slate-500 dark:text-slate-400">domain.com/berita/</span>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="judul-berita-anda"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Meta Keywords (Opsional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Pisahkan dengan koma (contoh: prestasi, osn, sains)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Pengaturan Publikasi</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Status Publish</label>
                <select className="w-full px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="published">Langsung Publish</option>
                  <option value="draft">Simpan sbg Draft</option>
                  <option value="scheduled">Jadwalkan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Tanggal Publikasi</label>
                <input 
                  type="datetime-local" 
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <Link to="/panel/berita" className="flex-1 text-center py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-lg text-sm transition-colors">
                Batal
              </Link>
              <button type="submit" className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm">
                <Save className="w-4 h-4" /> Simpan Berita
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Klasifikasi & Media</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5 flex items-center gap-2"><TagIcon className="w-3.5 h-3.5" /> Kategori</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Berita Utama">Berita Utama</option>
                  <option value="Pengumuman">Pengumuman</option>
                  <option value="Prestasi">Prestasi</option>
                  <option value="Event">Event Sekolah</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Penulis (Author)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" defaultValue="Superadmin SIT" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" readOnly />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Gambar Thumbnail</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50 transition-colors cursor-pointer group bg-slate-50 dark:bg-slate-800/50/50">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200">Pilih Thumbnail</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 dark:text-slate-400 mt-1">Maks 2MB (JPG, PNG, WEBP)</p>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="mt-0.5">
                    <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" defaultChecked />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 block">Izinkan Komentar</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Siswa & Guru bisa mengomentari berita ini.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
// Helper icon for title
function NewspaperIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
      <path d="M18 14h-8"/>
      <path d="M15 18h-5"/>
      <path d="M10 6h8v4h-8V6Z"/>
    </svg>
  );
}
