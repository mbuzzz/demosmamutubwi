import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Image as ImageIcon, Tag as TagIcon, Loader2, Link as LinkIcon, Newspaper, ArrowLeft } from 'lucide-react';
import { useCreateBerita, useUpdateBerita, useBeritaDetail } from '../../../hooks/useBerita';
import { useKategoriBerita } from '../../../hooks/useKategoriBerita';
import { getFileUrl } from '../../../lib/api';
import { toast } from 'sonner';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: detail, isLoading: isLoadingDetail, isError: isDetailError } = useBeritaDetail(id || '');
  const { data: kategoris = [], isLoading: isKatLoading } = useKategoriBerita();
  const createBerita = useCreateBerita();
  const updateBerita = useUpdateBerita();

  useEffect(() => {
    if (isEdit && detail) {
      setTitle(detail.judul || '');
      setSlug(detail.slug || '');
      setCategoryId(detail.kategori_id ? String(detail.kategori_id) : '');
      setContent(detail.konten || '');
      setStatus(detail.status || 'draft');
    }
  }, [isEdit, detail]);

  useEffect(() => {
    if (!gambar) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(gambar);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [gambar]);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link'],
        ['clean'],
      ],
    }),
    []
  );

  const generateSlug = (text: string) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (!isEdit) {
      setSlug(generateSlug(e.target.value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const plain = content.replace(/<[^>]*>/g, '').trim();
    if (!title.trim()) {
      toast.error('Judul berita wajib diisi');
      return;
    }
    if (!plain) {
      toast.error('Konten berita wajib diisi');
      return;
    }
    if (!categoryId) {
      toast.error('Pilih kategori berita dulu. Buat kategori di menu Kategori Berita jika belum ada.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('judul', title.trim());
      formData.append('konten', content);
      formData.append('status', status);
      formData.append('kategori_id', categoryId);
      if (slug.trim()) formData.append('slug', slug.trim());
      if (gambar) formData.append('cover_image', gambar);

      if (isEdit) {
        await updateBerita.mutateAsync({ id: id!, data: formData });
      } else {
        await createBerita.mutateAsync(formData);
      }
      navigate('/panel/berita');
    } catch {
      // toast handled by mutation
    }
  };

  if (isEdit && isLoadingDetail) {
    return (
      <AdminLayout title="Edit Berita">
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </AdminLayout>
    );
  }

  if (isEdit && isDetailError) {
    return (
      <AdminLayout title="Edit Berita">
        <div className="text-center py-16 space-y-3">
          <p className="text-red-500 font-bold text-sm">Gagal memuat data berita</p>
          <Link to="/panel/berita" className="text-indigo-600 font-bold text-sm hover:underline">
            Kembali ke daftar
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const isSaving = createBerita.isPending || updateBerita.isPending;
  const coverSrc = previewUrl || (detail?.cover_image ? getFileUrl(detail.cover_image) : null);

  return (
    <AdminLayout title={isEdit ? 'Edit Berita' : 'Tambah Berita Baru'}>
      <div className="mb-4">
        <Link
          to="/panel/berita"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Berita
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-indigo-500" /> Konten Utama
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Judul Berita <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white"
                  placeholder="Masukkan judul berita utama..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Konten Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="berita-quill border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    placeholder="Tulis isi berita di sini..."
                    className="dark:text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">Gunakan toolbar untuk format teks, daftar, dan tautan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Pengaturan Publikasi
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="published">Langsung Publish</option>
                  <option value="draft">Simpan sebagai Draft</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <Link
                  to="/panel/berita"
                  className="flex-1 text-center py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-lg text-sm transition-colors"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isEdit ? 'Update Berita' : 'Simpan Berita'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              Klasifikasi & Media
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                  <TagIcon className="w-3.5 h-3.5" /> Kategori <span className="text-red-500">*</span>
                </label>
                {isKatLoading ? (
                  <p className="text-xs text-slate-400">Memuat kategori...</p>
                ) : (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {kategoris.map((k) => (
                      <option key={k.id} value={String(k.id)}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                )}
                {!isKatLoading && kategoris.length === 0 && (
                  <p className="text-[11px] text-amber-600 mt-1.5 font-semibold">
                    Belum ada kategori.{' '}
                    <Link to="/panel/kategori-berita" className="underline">
                      Buat kategori dulu
                    </Link>
                    .
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5" /> URL Slug
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-lg text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    /berita/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    placeholder="judul-berita-anda"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Otomatis dari judul (bisa diubah). Kosongkan agar sistem generate.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Gambar Cover / Thumbnail
                </label>
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group bg-slate-50 dark:bg-slate-800/50 block">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={(e) => setGambar(e.target.files?.[0] || null)}
                  />
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {gambar ? 'Ganti Thumbnail' : 'Pilih Thumbnail'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Maks 2MB (JPG, PNG, WEBP)</p>
                </label>
                {coverSrc && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={coverSrc} alt="Preview cover" className="w-full max-h-48 object-cover" />
                  </div>
                )}
                {gambar && (
                  <button
                    type="button"
                    onClick={() => setGambar(null)}
                    className="mt-2 text-xs font-bold text-red-500 hover:underline"
                  >
                    Hapus file terpilih
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Quill layout fixes */}
      <style>{`
        .berita-quill .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #f8fafc;
        }
        .dark .berita-quill .ql-toolbar {
          border-bottom-color: #334155 !important;
          background: #1e293b;
        }
        .berita-quill .ql-container {
          border: none !important;
          min-height: 320px;
          font-size: 14px;
        }
        .berita-quill .ql-editor {
          min-height: 320px;
        }
        .dark .berita-quill .ql-editor {
          color: #f1f5f9;
        }
        .dark .berita-quill .ql-stroke {
          stroke: #94a3b8;
        }
        .dark .berita-quill .ql-fill {
          fill: #94a3b8;
        }
        .dark .berita-quill .ql-picker {
          color: #cbd5e1;
        }
      `}</style>
    </AdminLayout>
  );
}
