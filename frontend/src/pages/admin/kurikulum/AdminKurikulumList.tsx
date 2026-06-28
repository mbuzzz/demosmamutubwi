import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useKurikulumList, useDeleteKurikulum } from '../../../hooks/useKurikulum';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminKurikulumList() {
  const { data: kurikulums, isLoading } = useKurikulumList();
  const deleteKurikulum = useDeleteKurikulum();
  const [search, setSearch] = useState('');

  const filtered = kurikulums?.filter(k =>
    k.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kurikulum ini?')) return;
    try {
      await deleteKurikulum.mutateAsync(id);
      toast.success('Kurikulum berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus kurikulum');
    }
  };

  return (
    <AdminLayout title="Manajemen Kurikulum">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari kurikulum..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Link to="/panel/kurikulum/tambah" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Tambah Kurikulum
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Nama Kurikulum</th>
                  <th className="px-6 py-4">Tahun Ajaran</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">KKM</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered?.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">Belum ada kurikulum</td></tr>
                )}
                {filtered?.map(k => (
                  <tr key={k.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{k.nama}</td>
                    <td className="px-6 py-4">{k.tahun_ajaran}</td>
                    <td className="px-6 py-4">
                      {k.status === 'aktif' ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-medium border border-emerald-100 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> Aktif
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium border border-slate-200 dark:border-slate-700 w-fit block">Draft</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{k.kkm_default}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/panel/kurikulum/edit/${k.id}`} className="p-1.5 text-slate-400 hover:text-indigo-600 inline-block"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(k.id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
