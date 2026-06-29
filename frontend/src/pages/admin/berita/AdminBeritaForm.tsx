import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Image as ImageIcon, Tag as TagIcon, Loader2, Link as LinkIcon } from 'lucide-react';
import { useCreateBerita, useUpdateBerita, useBeritaDetail } from '../../../hooks/useBerita';
import { useKategoriBerita } from '../../../hooks/useKategoriBerita';

export default function AdminBeritaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('published');
  const [gambar, setGambar] = useState<File | null>(null);

  const { data: detail, isLoading: isLoadingDetail } = useBeritaDetail(id || '');
  const { data: kategoris } = useKategoriBerita();
  const createBerita = useCreateBerita();
  const updateBerita = useUpdateBerita();

  useEffect(() => {
    if (isEdit && detail) {
      setTitle(detail.judul);
      setSlug(detail.slug);
      setCategoryId(detail.kategori_id || '');
      setContent(detail.konten);
      setStatus(detail.status);
    }
  }, [isEdit, detail]);
  
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
    if (!isEdit) {
      setSlug(generateSlug(e.target.value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const formData = new FormData();
      formData.append('judul', title);
      formData.append('slug', slug);
      formData.append('konten', content);
      formData.append('status', status);
      if (categoryId) formData.append('kategori_id', categoryId);
      if (gambar) formData.append('gambar', gambar);

      if (isEdit) {
        await updateBerita.mutateAsync({ id: id!, data: formData });
      } else {
        await createBerita.mutateAsync(formData);
      }
      navigate('/panel/berita');
    } catch {}
  };

  if (isEdit && isLoadingDetail) {
    return (
      <AdminLayout title="Edit Berita">
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? "Edit Berita" : "Tambah Berita Baru"}>
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
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium dark:text-white"
                  placeholder="Masukkan judul berita utama..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Konten Lengkap Berita</label>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                  <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent} 
                    modules={modules}
                    className="h-[400px] pb-10 dark:text-white"
                  />
                </div>
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
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-800 font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="published">Langsung Publish</option>
                  <option value="draft">Simpan sbg Draft</option>
                </select>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <Link to="/panel/berita" className="flex-1 text-center py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-lg text-sm transition-colors">
                  Batal
                </Link>
                <button type="submit" disabled={createBerita.isPending || updateBerita.isPending} className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50">
                  {(createBerita.isPending || updateBerita.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Berita
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Klasifikasi & Media</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5 flex items-center gap-2"><TagIcon className="w-3.5 h-3.5" /> Kategori</label>
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {kategoris?.map(k => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5 flex items-center gap-2"><LinkIcon className="w-3.5 h-3.5" /> URL Slug</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-sm text-slate-500 dark:text-slate-400">domain.com/</span>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    placeholder="judul-berita-anda"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Gambar Thumbnail</label>
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group bg-slate-50 dark:bg-slate-800/50 block">
                  <input type="file" className="hidden" accept="image/*" onChange={e => setGambar(e.target.files?.[0] || null)} />
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pilih Thumbnail</p>
                  <p className="text-[11px] text-slate-500 mt-1">Maks 2MB (JPG, PNG, WEBP)</p>
                </label>
                {detail?.gambar && !gambar && (
                  <div className="mt-4">
                    <img src={detail.gambar} alt="Thumbnail" className="w-full rounded-lg" />
                  </div>
                )}
                {gambar && (
                  <div className="mt-4 text-sm font-medium text-emerald-500">File terpilih: {gambar.name}</div>
                )}
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
