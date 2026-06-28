import { useState, useRef } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Pencil, Trash2, X, Award, Download, Upload } from 'lucide-react';
import { useEkskulList, useCreateEkskul, useUpdateEkskul, useDeleteEkskul, type EkskulRecord } from '../../../hooks/useEkskul';
import { toast } from 'sonner';

export default function AdminEkstrakurikuler() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form states
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const { data: ekskulList = [], isLoading, isError } = useEkskulList(search);
  const createEkskulMutation = useCreateEkskul();
  const updateEkskulMutation = useUpdateEkskul();
  const deleteEkskulMutation = useDeleteEkskul();

  const openNew = () => {
    setEditId(null);
    setNama('');
    setDeskripsi('');
    setShowForm(true);
  };

  const openEdit = (item: EkskulRecord) => {
    setEditId(item.id);
    setNama(item.nama);
    setDeskripsi(item.deskripsi || '');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama) {
      toast.error('Nama ekstrakurikuler wajib diisi');
      return;
    }

    const data = { nama, deskripsi };

    try {
      if (editId) {
        await updateEkskulMutation.mutateAsync({ id: editId, data });
        toast.success('Ekstrakurikuler berhasil diperbarui');
      } else {
        await createEkskulMutation.mutateAsync(data);
        toast.success('Ekstrakurikuler baru ditambahkan');
      }
      setShowForm(false);
      setNama('');
      setDeskripsi('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan data ekstrakurikuler. Periksa kembali.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus ekstrakurikuler ini? Nilai siswa terkait ekskul ini juga akan terhapus.')) return;
    try {
      await deleteEkskulMutation.mutateAsync(id);
      toast.success('Ekstrakurikuler berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus ekstrakurikuler');
    }
  };

  const handleExportPdf = () => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const rootURL = apiURL.replace(/\/api\/?$/, '');
    window.open(`${rootURL}/api/ekskuls/export/pdf`, '_blank');
  };

  const handleExportExcel = () => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const rootURL = apiURL.replace(/\/api\/?$/, '');
    window.open(`${rootURL}/api/ekskuls/export/xlsx`, '_blank');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const uploadToast = toast.loading('Mengimpor ekstrakurikuler...');

    try {
      const { api } = await import('../../../lib/api');
      const res = await api.post('/ekskuls/import/xlsx', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.dismiss(uploadToast);
      toast.success(res.data.message || 'Ekstrakurikuler berhasil diimpor!');
      // invalidate query
      const { queryClient } = await import('../../../lib/queryClient');
      queryClient.invalidateQueries({ queryKey: ['ekskuls'] });
    } catch (err: any) {
      toast.dismiss(uploadToast);
      toast.error(err.response?.data?.message || 'Gagal mengimpor data ekstrakurikuler.');
    }
    e.target.value = '';
  };

  return (
    <AdminLayout title="Manajemen Ekstrakurikuler">
      
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

      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Cari ekstrakurikuler..." 
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-white" 
            />
          </div>
          <button 
            onClick={openNew} 
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ml-auto"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Ekskul
          </button>
        </div>

        {/* Inline Form */}
        {showForm && (
          <div className="p-5 bg-indigo-50/50 dark:bg-indigo-500/5 border-b border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSave} className="max-w-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> {editId ? 'Edit' : 'Tambah'} Ekstrakurikuler
                </h3>
                <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Ekstrakurikuler</label>
                  <input 
                    type="text" 
                    value={nama} 
                    onChange={e => setNama(e.target.value)} 
                    placeholder="Contoh: Hizbul Wathan / Tapak Suci" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Deskripsi / Kegiatan</label>
                  <textarea 
                    value={deskripsi} 
                    onChange={e => setDeskripsi(e.target.value)} 
                    placeholder="Tulis rincian singkat ekstrakurikuler..." 
                    rows={2} 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
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
              <p className="text-xs text-slate-400 font-semibold">Memuat data ekstrakurikuler...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500 font-bold text-sm">
              Gagal memuat data ekstrakurikuler dari server
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-5 py-4">Nama Ekskul</th>
                  <th className="px-5 py-4">Deskripsi / Kegiatan</th>
                  <th className="px-5 py-4 w-32 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {ekskulList.length > 0 ? (
                  ekskulList.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <Award className="w-4.5 h-4.5" />
                        </div>
                        {e.nama}
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300 text-xs">{e.deskripsi || 'Tidak ada deskripsi'}</td>
                      <td className="px-5 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => openEdit(e)} 
                          className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(e.id)} 
                          className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Hapus
                        </button>
                      </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                      Tidak ada ekstrakurikuler ditemukan
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
