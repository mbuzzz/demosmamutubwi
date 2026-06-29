import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Edit, Trash2, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useKategoriBerita, useCreateKategoriBerita, useUpdateKategoriBerita, useDeleteKategoriBerita } from '../../../hooks/useKategoriBerita';
import Swal from 'sweetalert2';

export default function AdminKategoriList() {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [namaKategori, setNamaKategori] = useState('');

  const { data: kategoris, isLoading } = useKategoriBerita();
  const createKategori = useCreateKategoriBerita();
  const updateKategori = useUpdateKategoriBerita();
  const deleteKategori = useDeleteKategoriBerita();

  const filteredKategori = kategoris?.filter(k => k.nama.toLowerCase().includes(search.toLowerCase())) || [];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKategori) return;

    try {
      if (editingId) {
        await updateKategori.mutateAsync({ id: editingId, data: { nama: namaKategori } });
      } else {
        await createKategori.mutateAsync({ nama: namaKategori });
      }
      setNamaKategori('');
      setEditingId(null);
    } catch {}
  };

  const handleEdit = (k: any) => {
    setEditingId(k.id);
    setNamaKategori(k.nama);
  };

  const handleCancel = () => {
    setEditingId(null);
    setNamaKategori('');
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Kategori?',
      text: "Data ini tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      await deleteKategori.mutateAsync(id);
    }
  };

  return (
    <AdminLayout title="Manajemen Kategori Berita">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari kategori..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 items-start">
          
          {/* Quick Add Form on the side */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
              {editingId ? 'Edit Kategori' : 'Tambah Kategori Cepat'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Kategori</label>
                <input type="text" value={namaKategori} onChange={e => setNamaKategori(e.target.value)} required placeholder="Contoh: Prestasi Siswa" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={createKategori.isPending || updateKategori.isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  {(createKategori.isPending || updateKategori.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editingId ? 'Update' : 'Simpan'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancel} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Table Area */}
          <div className="md:col-span-2 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Nama Kategori</th>
                    <th className="px-6 py-4">Slug URL</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-10 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto" />
                      </td>
                    </tr>
                  ) : filteredKategori.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500">Tidak ada data kategori</td>
                    </tr>
                  ) : (
                    filteredKategori.map(k => (
                      <tr key={k.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{k.nama}</td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">{k.slug}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleEdit(k)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(k.id)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
