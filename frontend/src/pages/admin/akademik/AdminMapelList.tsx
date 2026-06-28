import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, Upload, Download, X, Shield } from 'lucide-react';
import { useState, useRef } from 'react';
import { useMapelList, useCreateMapel, useUpdateMapel, useDeleteMapel, type MapelRecord } from '../../../hooks/useMapel';
import { toast } from 'sonner';

export default function AdminMapelList() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [nama, setNama] = useState('');
  const [kode, setKode] = useState('');
  const [kkm, setKkm] = useState(75);
  const [tingkat, setTingkat] = useState('X');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const { data: mapels = [], isLoading, isError } = useMapelList(search);

  const createMapelMutation = useCreateMapel();
  const updateMapelMutation = useUpdateMapel();
  const deleteMapelMutation = useDeleteMapel();

  const openNew = () => {
    setEditId(null);
    setNama('');
    setKode('');
    setKkm(75);
    setTingkat('X');
    setShowForm(true);
  };

  const openEdit = (item: MapelRecord) => {
    setEditId(item.id);
    setNama(item.nama);
    setKode(item.kode);
    setKkm(item.kkm);
    setTingkat(item.tingkat);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !kode || !kkm || !tingkat) {
      toast.error('Lengkapi semua data mata pelajaran');
      return;
    }

    const data = {
      nama,
      kode,
      kkm: Number(kkm),
      tingkat,
    };

    try {
      if (editId) {
        await updateMapelMutation.mutateAsync({ id: editId, data });
        toast.success('Mata pelajaran berhasil diperbarui');
      } else {
        await createMapelMutation.mutateAsync(data);
        toast.success('Mata pelajaran baru berhasil ditambahkan');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan mata pelajaran. Periksa kembali.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus mata pelajaran ini? Nilai siswa terkait mapel ini juga akan terhapus.')) return;
    try {
      await deleteMapelMutation.mutateAsync(id);
      toast.success('Mata pelajaran berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus mata pelajaran');
    }
  };

  const handleExportPdf = () => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const rootURL = apiURL.replace(/\/api\/?$/, '');
    window.open(`${rootURL}/api/mapels/export/pdf`, '_blank');
  };

  const handleExportExcel = () => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const rootURL = apiURL.replace(/\/api\/?$/, '');
    window.open(`${rootURL}/api/mapels/export/xlsx`, '_blank');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const uploadToast = toast.loading('Mengimpor mata pelajaran...');

    try {
      const { api } = await import('../../../lib/api');
      const res = await api.post('/mapels/import/xlsx', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.dismiss(uploadToast);
      toast.success(res.data.message || 'Mata pelajaran berhasil diimpor!');
      // invalidate query
      const { queryClient } = await import('../../../lib/queryClient');
      queryClient.invalidateQueries({ queryKey: ['mapels'] });
    } catch (err: any) {
      toast.dismiss(uploadToast);
      toast.error(err.response?.data?.message || 'Gagal mengimpor data mata pelajaran.');
    }
    e.target.value = '';
  };

  return (
    <AdminLayout title="Manajemen Mata Pelajaran">
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportExcel} 
        accept=".xlsx, .xls" 
        className="hidden" 
      />

      <div className="flex justify-end gap-2 mb-4">
        <button onClick={handleExportPdf} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Download className="w-3.5 h-3.5" /> PDF
        </button>
        <button onClick={handleExportExcel} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <Download className="w-3.5 h-3.5" /> Excel
        </button>
        <button onClick={handleImportClick} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-500/20 shadow-sm rounded-lg transition-colors">
          <Upload className="w-3.5 h-3.5" /> Import Excel
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-505 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari mata pelajaran..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <button onClick={openNew} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Tambah Mapel
          </button>
        </div>

        {/* Inline Form */}
        {showForm && (
          <div className="p-5 bg-indigo-50/50 dark:bg-indigo-500/5 border-b border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSave} className="max-w-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> {editId ? 'Edit' : 'Tambah'} Mata Pelajaran
                </h3>
                <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Mata Pelajaran</label>
                  <input 
                    type="text" 
                    value={nama} 
                    onChange={e => setNama(e.target.value)} 
                    placeholder="Contoh: Matematika Wajib / Fisika" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kode Mapel</label>
                  <input 
                    type="text" 
                    value={kode} 
                    onChange={e => setKode(e.target.value)} 
                    placeholder="Contoh: MTK-WJB / FIS-P" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-mono uppercase" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">KKM Kelulusan</label>
                  <input 
                    type="number" 
                    min={0} 
                    max={100}
                    value={kkm} 
                    onChange={e => setKkm(Number(e.target.value))} 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tingkat Kelas</label>
                  <select 
                    value={tingkat} 
                    onChange={e => setTingkat(e.target.value)} 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Table List */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-semibold">Memuat data mata pelajaran...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500 font-bold text-sm">
              Gagal memuat data mapel dari server
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Kode Mapel</th>
                  <th className="px-6 py-4">Nama Mata Pelajaran</th>
                  <th className="px-6 py-4 text-center">KKM</th>
                  <th className="px-6 py-4 text-center">Tingkat Kelas</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {mapels.length > 0 ? (
                  mapels.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-850 dark:text-white uppercase">{m.kode}</td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{m.nama}</td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-600">{m.kkm}</td>
                      <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300">Kelas {m.tingkat}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEdit(m)} className="p-1.5 text-slate-400 dark:text-slate-505 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(m.id)} className="p-1.5 text-slate-400 dark:text-slate-505 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                      Tidak ada mata pelajaran ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
