import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Award, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrestasiList, useDeletePrestasi } from '../../../hooks/usePrestasi';
import { getFileUrl } from '../../../lib/api';

export default function AdminPrestasiList() {
  const [search, setSearch] = useState('');
  const { data: prestasiList, isLoading } = usePrestasiList();
  const deletePrestasi = useDeletePrestasi();

  const handleDelete = async (id: number | string) => {
    if (!confirm('Yakin ingin menghapus prestasi ini?')) return;
    await deletePrestasi.mutateAsync(id);
  };

  const filtered = prestasiList?.filter(p => p.judul.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <AdminLayout title="Kelola Prestasi Unggulan">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" /> Daftar Prestasi
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari prestasi..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
              />
            </div>
            <Link to="/panel/prestasi/tambah" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Tambah
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
        ) : (
          <div className="overflow-x-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-400">Belum ada data prestasi</div>
              )}
              {filtered.map(p => (
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
                      <Link to={`/panel/prestasi/edit/${p.id}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md">Edit</Link>
                      <button onClick={() => handleDelete(p.id)} className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
