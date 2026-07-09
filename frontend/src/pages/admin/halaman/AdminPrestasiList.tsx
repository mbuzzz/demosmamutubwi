import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Award, Save, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { usePrestasiList, useCreatePrestasi, useUpdatePrestasi, useDeletePrestasi, type PrestasiRecord } from '../../../hooks/usePrestasi';
import { getFileUrl } from '../../../lib/api';

export default function AdminPrestasiList() {
  const { data: prestasiList, isLoading } = usePrestasiList();
  const createPrestasi = useCreatePrestasi();
  const updatePrestasi = useUpdatePrestasi();
  const deletePrestasi = useDeletePrestasi();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | number | null>(null);
  
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const resetForm = () => {
    setJudul('');
    setDeskripsi('');
    setKategori('');
    setFoto(null);
    setPreviewImg(null);
    setEditId(null);
    setShowForm(false);
  };

  const openEdit = (p: PrestasiRecord) => {
    setJudul(p.judul);
    setDeskripsi(p.deskripsi || '');
    setKategori(p.kategori || '');
    setPreviewImg(p.gambar ? getFileUrl(p.gambar) : null);
    setFoto(null);
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul) return;

    const payload = new FormData();
    payload.append('judul', judul);
    payload.append('deskripsi', deskripsi);
    payload.append('kategori', kategori);
    if (foto) payload.append('gambar', foto);

    if (editId) {
      await updatePrestasi.mutateAsync({ id: editId, data: payload });
    } else {
      await createPrestasi.mutateAsync(payload);
    }
    resetForm();
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Hapus prestasi ini?')) return;
    await deletePrestasi.mutateAsync(id);
  };

  return (
    <AdminLayout title="Kelola Prestasi Unggulan">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        <div className={`bg-white dark:bg-slate-900 rounded-[15px] border border-slate-100 dark:border-slate-800 ${showForm ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" /> Daftar Prestasi
              </h2>
            </div>
            {!showForm && (
              <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Tambah Prestasi
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
          ) : (
          <div className="overflow-x-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prestasiList?.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-400">Belum ada data prestasi</div>
              )}
              {prestasiList?.map(p => (
                <div key={p.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex gap-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-slate-800/30">
                  <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    {p.gambar ? (
                      <img src={getFileUrl(p.gambar)} alt={p.judul} className="w-full h-full object-cover" />
                    ) : (
                      <Award className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">{p.kategori || 'Umum'}</span>
                    <h3 className="font-bold text-slate-800 dark:text-white mt-1.5 leading-tight">{p.judul}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{p.deskripsi}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => openEdit(p)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-xs font-bold text-red-600 hover:text-red-700 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        {showForm && (
          <div className="bg-white dark:bg-slate-900 rounded-[15px] border border-slate-100 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white">{editId ? 'Edit Prestasi' : 'Tambah Prestasi'}</h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Judul Prestasi *</label>
                <input type="text" value={judul} onChange={e => setJudul(e.target.value)} required className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Kategori (Opsional)</label>
                <input type="text" value={kategori} onChange={e => setKategori(e.target.value)} placeholder="Akademik / Non Akademik" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Deskripsi Singkat</label>
                <textarea value={deskripsi} onChange={e => setDeskripsi(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Foto Dokumentasi</label>
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <input type="file" className="hidden" accept="image/*" onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setFoto(e.target.files[0]);
                      setPreviewImg(URL.createObjectURL(e.target.files[0]));
                    }
                  }} />
                  {previewImg ? (
                    <img src={previewImg} className="h-24 w-auto rounded object-cover mb-2" alt="Preview" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-indigo-300 mb-2" />
                  )}
                  <span className="text-xs font-semibold text-slate-500">Klik untuk pilih gambar</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="submit" disabled={createPrestasi.isPending || updatePrestasi.isPending} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  {(createPrestasi.isPending || updatePrestasi.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan Prestasi
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
