import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Calendar, Save, X, Loader2, Users, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useGelombangList, useCreateGelombang, useUpdateGelombang, useDeleteGelombang, type GelombangRecord } from '../../../hooks/useSPMB';
import { toast } from 'sonner';

function fmtDate(str: string) {
  if (!str) return '-';
  return new Date(str).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function gelombangStatus(g: GelombangRecord) {
  const now = new Date().toISOString().split('T')[0];
  if (now < g.tanggal_mulai) return { label: 'Akan Datang', cls: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' };
  if (now > g.tanggal_selesai) return { label: 'Berakhir', cls: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' };
  return { label: 'Berlangsung', cls: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' };
}

export default function AdminGelombangList() {
  const { data: gelombangList, isLoading } = useGelombangList();
  const createGelombang = useCreateGelombang();
  const updateGelombang = useUpdateGelombang();
  const deleteGelombang = useDeleteGelombang();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nama: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    kuota: '',
    biaya_pendaftaran: '',
    is_active: true,
    redirect_url: '',
  });

  const resetForm = () => {
    setForm({ nama: '', tanggal_mulai: '', tanggal_selesai: '', kuota: '', biaya_pendaftaran: '', is_active: true, redirect_url: '' });
    setEditId(null);
    setShowForm(false);
  };

  const openEdit = (g: GelombangRecord) => {
    setForm({
      nama: g.nama,
      tanggal_mulai: g.tanggal_mulai,
      tanggal_selesai: g.tanggal_selesai,
      kuota: g.kuota?.toString() || '',
      biaya_pendaftaran: g.biaya_pendaftaran.toString(),
      is_active: g.is_active,
      redirect_url: g.redirect_url || '',
    });
    setEditId(g.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.tanggal_mulai || !form.tanggal_selesai) {
      toast.error('Lengkapi semua field');
      return;
    }
    const payload = {
      nama: form.nama,
      tanggal_mulai: form.tanggal_mulai,
      tanggal_selesai: form.tanggal_selesai,
      kuota: form.kuota ? Number(form.kuota) : null,
      biaya_pendaftaran: Number(form.biaya_pendaftaran) || 0,
      is_active: form.is_active,
      redirect_url: form.redirect_url || null,
    };
    try {
      if (editId) {
        await updateGelombang.mutateAsync({ id: editId, data: payload });
        toast.success('Gelombang berhasil diperbarui');
      } else {
        await createGelombang.mutateAsync(payload as any);
        toast.success('Gelombang berhasil dibuat');
      }
      resetForm();
    } catch { toast.error('Gagal menyimpan'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus gelombang ini?')) return;
    try {
      await deleteGelombang.mutateAsync(id);
      toast.success('Gelombang berhasil dihapus');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal menghapus');
    }
  };

  return (
    <AdminLayout title="Pengaturan Gelombang SPMB">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        <div className={`bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 ${showForm ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white">Daftar Gelombang Pendaftaran</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Atur jadwal, kuota, dan biaya per gelombang.</p>
            </div>
            {!showForm && (
              <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Tambah Gelombang Baru
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Nama Gelombang</th>
                  <th className="px-6 py-4">Periode Tanggal</th>
                  <th className="px-6 py-4">Kuota & Pendaftar</th>
                  <th className="px-6 py-4">Biaya</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gelombangList?.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">Belum ada gelombang</td></tr>
                )}
                  {gelombangList?.map(g => {
                    const filled = g.pendaftars_count || 0;
                    const ratio = g.kuota && g.kuota > 0 ? (filled / g.kuota) * 100 : 0;
                    const status = gelombangStatus(g);
                    return (
                  <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{g.nama}</td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                      <div>{fmtDate(g.tanggal_mulai)}</div>
                      <div className="text-slate-400">s/d {fmtDate(g.tanggal_selesai)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {g.kuota && (
                      <>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-1 max-w-[120px]">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.min(ratio, 100)}%` }}></div>
                        </div>
                        <div className="text-[11px] font-medium mt-1.5 text-slate-500">{filled} / {g.kuota} Terisi</div>
                      </>
                      )}
                      {!g.kuota && <span className="text-slate-400">Tanpa kuota</span>}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">Rp {g.biaya_pendaftaran.toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${status.cls}`}>{status.label}</span>
                      {g.is_active && (
                        <span className="ml-1.5 px-2 py-1 rounded-md text-xs font-semibold border bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">Aktif</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEdit(g)} className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(g.id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}
        </div>

        {showForm && (
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white">{editId ? 'Edit Gelombang' : 'Tambah Gelombang Baru'}</h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nama Gelombang</label>
                <input type="text" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Gelombang 1 Reguler" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Tgl Buka</label>
                  <input type="date" value={form.tanggal_mulai} onChange={e => setForm({ ...form, tanggal_mulai: e.target.value })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Tgl Tutup</label>
                  <input type="date" value={form.tanggal_selesai} onChange={e => setForm({ ...form, tanggal_selesai: e.target.value })} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Kuota (Kursi)</label>
                  <input type="number" value={form.kuota} onChange={e => setForm({ ...form, kuota: e.target.value })} placeholder="Kosongi jika tanpa kuota" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2"><DollarSign className="w-3.5 h-3.5" /> Biaya (Rp)</label>
                  <input type="number" value={form.biaya_pendaftaran} onChange={e => setForm({ ...form, biaya_pendaftaran: e.target.value })} placeholder="0" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Redirect URL setelah submit form</label>
                <input type="text" value={form.redirect_url} onChange={e => setForm({ ...form, redirect_url: e.target.value })} placeholder="Contoh: /success atau url WA grup" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Status Aktif?</label>
                <select value={form.is_active ? 'aktif' : 'draft'} onChange={e => setForm({ ...form, is_active: e.target.value === 'aktif' })} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="aktif">Aktif (Tampil di Publik)</option>
                  <option value="draft">Draft (Tidak Tampil)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button type="submit" disabled={createGelombang.isPending || updateGelombang.isPending} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  {(createGelombang.isPending || updateGelombang.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editId ? 'Update Gelombang' : 'Simpan Gelombang'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
