import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Edit, Trash2, Loader2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useBeritaList, useDeleteBerita } from '../../../hooks/useBerita';
import Swal from 'sweetalert2';
import { getFileUrl } from '../../../lib/api';

export default function AdminBeritaList() {
  const [search, setSearch] = useState('');
  const { data: berita, isLoading } = useBeritaList();
  const deleteBerita = useDeleteBerita();
  const navigate = useNavigate();

  const filteredBerita = berita?.filter(b => b.judul.toLowerCase().includes(search.toLowerCase())) || [];

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Berita?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      await deleteBerita.mutateAsync(id);
    }
  };

  return (
    <AdminLayout title="Manajemen Berita">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari berita..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white"
            />
          </div>
          <Link to="/panel/berita/tambah" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Tambah Berita
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Judul Berita</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Tanggal Publish</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto" />
                  </td>
                </tr>
              ) : filteredBerita.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Tidak ada data berita</td>
                </tr>
              ) : (
                filteredBerita.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">
                      <div className="flex items-center gap-3">
                        {b.cover_image ? (
                          <img src={getFileUrl(b.cover_image)} alt={b.judul} className="w-12 h-12 rounded object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs">No Img</div>
                        )}
                        <span className="line-clamp-2">{b.judul}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {b.kategori ? (
                        <span className="px-2.5 sm:px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md text-xs font-medium whitespace-nowrap">{b.kategori.nama}</span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{new Date(b.published_at || b.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${b.status === 'published' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                        {b.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/panel/berita/edit/${b.id}`)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(b.id)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <div>Menampilkan {filteredBerita.length} data</div>
        </div>
      </div>
    </AdminLayout>
  );
}
