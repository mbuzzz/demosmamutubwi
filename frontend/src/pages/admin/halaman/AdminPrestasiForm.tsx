import AdminLayout from '../../../components/admin/AdminLayout';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { usePrestasiList, useCreatePrestasi, useUpdatePrestasi } from '../../../hooks/usePrestasi';
import { toast } from 'sonner';
import { getFileUrl } from '../../../lib/api';

export default function AdminPrestasiForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: prestasiList, isLoading: isLoadingData } = usePrestasiList();
  const createPrestasi = useCreatePrestasi();
  const updatePrestasi = useUpdatePrestasi();

  const [form, setForm] = useState({
    judul: '',
    kategori: 'akademik',
    deskripsi: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && prestasiList) {
      const prestasi = prestasiList.find(p => p.id === Number(id));
      if (prestasi) {
        setForm({
          judul: prestasi.judul,
          kategori: prestasi.kategori || 'akademik',
          deskripsi: prestasi.deskripsi || '',
        });
        if (prestasi.gambar) {
          setExistingImage(prestasi.gambar);
        }
      } else {
        toast.error('Data prestasi tidak ditemukan');
        navigate('/panel/prestasi');
      }
    }
  }, [isEdit, prestasiList, id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul) { toast.error('Judul harus diisi'); return; }

    const payload = new FormData();
    payload.append('judul', form.judul);
    payload.append('kategori', form.kategori);
    payload.append('deskripsi', form.deskripsi);
    if (image) payload.append('gambar', image);

    try {
      if (isEdit) {
        await updatePrestasi.mutateAsync({ id: Number(id), data: payload });
      } else {
        await createPrestasi.mutateAsync(payload);
      }
      navigate('/panel/prestasi');
    } catch {
      toast.error('Gagal menyimpan');
    }
  };

  const isSaving = createPrestasi.isPending || updatePrestasi.isPending;

  return (
    <AdminLayout title={isEdit ? "Edit Prestasi" : "Tambah Prestasi Baru"}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/panel/prestasi" className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              {isEdit ? 'Edit Data Prestasi' : 'Form Prestasi Baru'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Silakan lengkapi formulir di bawah ini</p>
          </div>
        </div>

        {isLoadingData && isEdit ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 flex justify-center border border-slate-100 dark:border-slate-800">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Judul Prestasi</label>
                <input 
                  type="text" 
                  value={form.judul}
                  onChange={e => setForm({ ...form, judul: e.target.value })}
                  placeholder="Contoh: Juara 1 Olimpiade Matematika"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Kategori</label>
                  <select 
                    value={form.kategori}
                    onChange={e => setForm({ ...form, kategori: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                  >
                    <option value="akademik">Akademik</option>
                    <option value="non_akademik">Non Akademik</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Foto Prestasi (Opsional)</label>
                <label className="block border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                  <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp" onChange={e => setImage(e.target.files?.[0] || null)} />
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{image ? 'Foto siap diunggah' : 'Klik untuk pilih foto'}</p>
                  <p className="text-xs text-slate-500 mt-1">{image ? image.name : 'JPG, PNG, atau WEBP (Max 2MB)'}</p>
                </label>
                {!image && existingImage && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2">Foto Saat Ini:</p>
                    <img src={getFileUrl(existingImage)} alt="Preview" className="h-32 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Deskripsi Singkat</label>
                <textarea 
                  value={form.deskripsi}
                  onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium transition-all"
                  placeholder="Keterangan tambahan mengenai prestasi ini..."
                ></textarea>
              </div>

            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <Link to="/panel/prestasi" className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                Batal
              </Link>
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-70 disabled:active:scale-100"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
