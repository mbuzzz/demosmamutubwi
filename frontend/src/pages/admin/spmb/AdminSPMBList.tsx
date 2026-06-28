import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Eye, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usePendaftarList, useDeletePendaftar, useGelombangList } from '../../../hooks/useSPMB';
import { toast } from 'sonner';

export default function AdminSPMBList() {
  const [search, setSearch] = useState('');
  const [filterGelombang, setFilterGelombang] = useState('');
  const { data: pendaftars, isLoading } = usePendaftarList(filterGelombang || undefined, search || undefined);
  const { data: gelombangList } = useGelombangList();
  const deletePendaftar = useDeletePendaftar();

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pendaftar ini?')) return;
    try {
      await deletePendaftar.mutateAsync(id);
      toast.success('Pendaftar berhasil dihapus');
    } catch { toast.error('Gagal menghapus'); }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      baru: 'bg-amber-50 text-amber-600 border-amber-200',
      diverifikasi: 'bg-blue-50 text-blue-600 border-blue-200',
      diterima: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      ditolak: 'bg-red-50 text-red-600 border-red-200',
    };
    return map[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <AdminLayout title="Data Pendaftar SPMB">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card dark:shadow-none border border-transparent dark:border-slate-800 overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, NISN..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <select 
              value={filterGelombang}
              onChange={e => setFilterGelombang(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            >
              <option value="">Semua Gelombang</option>
              {gelombangList?.map(g => (
                <option key={g.id} value={g.id}>{g.nama}</option>
              ))}
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-5">NISN</th>
                <th className="px-6 py-5">Nama Calon Siswa</th>
                <th className="px-6 py-5">Asal Sekolah</th>
                <th className="px-6 py-5">Gelombang</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendaftars?.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">Belum ada pendaftar</td></tr>
              )}
              {pendaftars?.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">{p.nisn}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-white text-sm mb-1">{p.nama_lengkap}</div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{p.email} • {p.no_hp}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold">{p.asal_sekolah}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-700 dark:text-slate-300 text-xs">{p.gelombang?.nama || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border inline-block whitespace-nowrap ${statusBadge(p.status)}`}>
                      {p.status === 'baru' && 'Baru'}
                      {p.status === 'diverifikasi' && <><CheckCircle className="w-3 h-3 inline mr-1" />Terverifikasi</>}
                      {p.status === 'diterima' && <><CheckCircle className="w-3 h-3 inline mr-1" />Diterima</>}
                      {p.status === 'ditolak' && 'Ditolak'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/panel/spmb/detail/${p.id}`} className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
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
