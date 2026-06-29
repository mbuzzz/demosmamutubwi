import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, Upload, Download, X, Shield } from 'lucide-react';
import { useState, useRef } from 'react';
import { useKelasList, useCreateKelas, useUpdateKelas, useDeleteKelas, type KelasRecord } from '../../../hooks/useKelas';
import { useUsers } from '../../../hooks/useUsers';
import { toast } from 'sonner';

export default function AdminKelasList() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form states
  const [nama, setNama] = useState('');
  const [tingkat, setTingkat] = useState('10');
  const [waliKelasId, setWaliKelasId] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const { data: kelasList = [], isLoading, isError } = useKelasList(search);
  const { data: teachers = [] } = useUsers('guru'); // fetch teachers for wali kelas selector

  const createKelasMutation = useCreateKelas();
  const updateKelasMutation = useUpdateKelas();
  const deleteKelasMutation = useDeleteKelas();

  const openNew = () => {
    setEditId(null);
    setNama('');
    setTingkat('10');
    setWaliKelasId('');
    setShowForm(true);
  };

  const openEdit = (item: KelasRecord) => {
    setEditId(item.id);
    setNama(item.nama);
    setTingkat(item.tingkat);
    setWaliKelasId(item.wali_kelas_id ? String(item.wali_kelas_id) : '');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !tingkat) {
      toast.error('Lengkapi semua data kelas');
      return;
    }

    try {
      // Determine defaults based on tingkat (these might need to be state variables if users can change them, but using standard defaults for creation)
      const jurusan = 'Umum';
      const tahun_ajaran = '2023/2024';

      if (editId) {
        await updateKelasMutation.mutateAsync({ id: editId, data: { nama, tingkat, wali_kelas_id: waliKelasId || null, jurusan, tahun_ajaran } });
        toast.success('Kelas berhasil diperbarui');
      } else {
        await createKelasMutation.mutateAsync({ nama, tingkat, wali_kelas_id: waliKelasId || null, jurusan, tahun_ajaran });
        toast.success('Kelas berhasil ditambahkan');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan data kelas. Periksa kembali.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus kelas ini? Siswa di kelas ini tidak akan terhapus, namun relasi kelas mereka akan diset kosong.')) return;
    try {
      await deleteKelasMutation.mutateAsync(id);
      toast.success('Kelas berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus kelas');
    }
  };

  const handleExportPdf = () => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const rootURL = apiURL.replace(/\/api\/?$/, '');
    window.open(`${rootURL}/api/kelas/export/pdf`, '_blank');
  };

  const handleExportExcel = () => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const rootURL = apiURL.replace(/\/api\/?$/, '');
    window.open(`${rootURL}/api/kelas/export/xlsx`, '_blank');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const uploadToast = toast.loading('Mengimpor berkas kelas...');

    try {
      const { api } = await import('../../../lib/api');
      const res = await api.post('/kelas/import/xlsx', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.dismiss(uploadToast);
      toast.success(res.data.message || 'Data kelas berhasil diimpor!');
      // invalidate query
      const { queryClient } = await import('../../../lib/queryClient');
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    } catch (err: any) {
      toast.dismiss(uploadToast);
      toast.error(err.response?.data?.message || 'Gagal mengimpor data kelas.');
    }
    e.target.value = '';
  };

  return (
    <AdminLayout title="Manajemen Kelas & Jurusan">
      
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
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari kelas..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <button onClick={openNew} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0">
            <Plus className="w-4 h-4" /> Tambah Kelas
          </button>
        </div>

        {/* Inline Form */}
        {showForm && (
          <div className="p-5 bg-indigo-50/50 dark:bg-indigo-500/5 border-b border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSave} className="max-w-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> {editId ? 'Edit' : 'Tambah'} Kelas & Jurusan
                </h3>
                <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Kelas</label>
                  <input 
                    type="text" 
                    value={nama} 
                    onChange={e => setNama(e.target.value)} 
                    placeholder="Contoh: X-1 / XI-1" 
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
                    <option value="10">Kelas 10 (Fase E)</option>
                    <option value="11">Kelas 11 (Fase F)</option>
                    <option value="12">Kelas 12 (Fase F)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Wali Kelas</label>
                  <select 
                    value={waliKelasId} 
                    onChange={e => setWaliKelasId(e.target.value)} 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="">-- Pilih Wali Kelas --</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
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
              <p className="text-xs text-slate-400 font-semibold">Memuat data kelas...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500 font-bold text-sm">
              Gagal memuat data kelas dari server
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Nama Kelas</th>
                  <th className="px-6 py-4">Tingkat</th>
                  <th className="px-6 py-4">Wali Kelas</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {kelasList.length > 0 ? (
                  kelasList.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{k.nama}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Kelas {k.tingkat}</td>
                      <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-medium">
                        {k.wali_kelas ? k.wali_kelas.name : 'Belum Ditentukan'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openEdit(k)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(k.id)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                      Tidak ada kelas ditemukan
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
