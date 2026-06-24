import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { JENIS_PEMBAYARAN_MOCK, rupiah, type JenisPembayaran, type JenisPembayaranTipe } from '../../../types/pembayaran';
import { toast } from 'sonner';

export default function AdminJenisPembayaran() {
  const [list, setList] = useState<JenisPembayaran[]>(JENIS_PEMBAYARAN_MOCK);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nama: '', nominal: 0, tipe: 'wajib' as JenisPembayaranTipe, periode: '', deskripsi: '', jatuhTempo: '' });
  const [search, setSearch] = useState('');

  const filtered = list.filter(j => !search || j.nama.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => {
    setEditId(null);
    setForm({ nama: '', nominal: 0, tipe: 'wajib', periode: '', deskripsi: '', jatuhTempo: '' });
    setShowForm(true);
  };

  const openEdit = (item: JenisPembayaran) => {
    setEditId(item.id);
    setForm({ nama: item.nama, nominal: item.nominal, tipe: item.tipe, periode: item.periode, deskripsi: item.deskripsi || '', jatuhTempo: item.jatuhTempo || '' });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.nama || !form.nominal) { toast.error('Lengkapi data'); return; }
    if (editId) {
      setList(prev => prev.map(p => p.id === editId ? { ...p, ...form } : p));
      toast.success('Jenis pembayaran diupdate');
    } else {
      setList(prev => [...prev, { ...form, id: `jp-${Date.now()}` }]);
      toast.success('Jenis pembayaran ditambahkan');
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(p => p.id !== id));
    toast.success('Jenis pembayaran dihapus');
  };

  const totalWajib = list.filter(j => j.tipe === 'wajib').reduce((a, j) => a + j.nominal, 0);
  const totalSukarela = list.filter(j => j.tipe === 'sukarela').reduce((a, j) => a + j.nominal, 0);

  return (
    <AdminLayout title="Jenis Pembayaran">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Total Jenis</p>
          <h3 className="text-3xl font-black mt-1">{list.length}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Wajib</p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{rupiah(totalWajib)}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sukarela</p>
          <h3 className="text-3xl font-black text-amber-600 mt-1">{rupiah(totalSukarela)}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari jenis..." className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button onClick={openNew} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
            <Plus className="w-3.5 h-3.5" /> Tambah Jenis
          </button>
        </div>

        {showForm && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 border-b border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
            <div className="max-w-lg space-y-3">
              <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">{editId ? 'Edit' : 'Tambah'} Jenis Pembayaran</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Nama</label>
                  <input type="text" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Nominal</label>
                  <input type="number" value={form.nominal || ''} onChange={e => setForm({ ...form, nominal: Number(e.target.value) })} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Tipe</label>
                  <select value={form.tipe} onChange={e => setForm({ ...form, tipe: e.target.value as JenisPembayaranTipe })} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="wajib">Wajib</option>
                    <option value="sukarela">Sukarela</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Periode</label>
                  <input type="text" value={form.periode} onChange={e => setForm({ ...form, periode: e.target.value })} placeholder="Bulanan/Semester/Sekali" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Jatuh Tempo</label>
                  <input type="text" value={form.jatuhTempo} onChange={e => setForm({ ...form, jatuhTempo: e.target.value })} placeholder="Contoh: Tanggal 10" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Deskripsi</label>
                  <textarea value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 transition-colors">Batal</button>
                <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors">Simpan</button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b">
              <tr><th className="px-5 py-4">Nama</th><th className="px-5 py-4">Nominal</th><th className="px-5 py-4">Tipe</th><th className="px-5 py-4">Periode</th><th className="px-5 py-4">Jatuh Tempo</th><th className="px-5 py-4">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filtered.map(j => (
                <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{j.nama}</td>
                  <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{rupiah(j.nominal)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${j.tipe === 'wajib' ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                      {j.tipe === 'wajib' ? 'Wajib' : 'Sukarela'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{j.periode}</td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{j.jatuhTempo || '-'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(j)} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-2 py-1 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5 inline mr-0.5" />Edit</button>
                      <button onClick={() => handleDelete(j.id)} className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 inline mr-0.5" />Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
