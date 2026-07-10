import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, FileText, Download, X, Loader2, Shield } from 'lucide-react';
import { useState, useRef } from 'react';
import { useDownloadsList, useCreateDownload, useUpdateDownload, useDeleteDownload, type DownloadRecord } from '../../../hooks/useDownloads';
import { toast } from 'sonner';

export default function AdminDownloadsList() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('Akademik');
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const { data: downloads = [], isLoading } = useDownloadsList({ search });
  const createMutation = useCreateDownload();
  const updateMutation = useUpdateDownload();
  const deleteMutation = useDeleteDownload();

  const openNew = () => {
    setEditId(null);
    setNama('');
    setKategori('Akademik');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowForm(true);
  };

  const openEdit = (item: DownloadRecord) => {
    setEditId(item.id);
    setNama(item.nama);
    setKategori(item.kategori);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !kategori) {
      toast.error('Lengkapi nama dan kategori dokumen');
      return;
    }

    if (!editId && !file) {
      toast.error('Harap pilih file dokumen untuk diunggah');
      return;
    }

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('kategori', kategori);
    if (file) {
      formData.append('file', file);
    }

    try {
      if (editId) {
        await updateMutation.mutateAsync({ id: editId, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setShowForm(false);
      setNama('');
      setKategori('Akademik');
      setFile(null);
    } catch (err) {
      // Handled by mutation hook
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus file dokumen ini?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      // Handled by mutation hook
    }
  };

  const handleDownload = (id: string) => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    window.open(`${apiURL}/public/downloads/${id}/file`, '_blank');
  };

  return (
    <AdminLayout title="Manajemen Pusat Unduhan">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari file dokumen..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <button 
            onClick={openNew}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Tambah File
          </button>
        </div>

        {/* Form Inline */}
        {showForm && (
          <div className="p-5 bg-indigo-50/50 dark:bg-indigo-500/5 border-b border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSave} className="max-w-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> {editId ? 'Edit' : 'Tambah'} File Unduhan
                </h3>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Dokumen</label>
                  <input 
                    type="text" 
                    value={nama} 
                    onChange={e => setNama(e.target.value)} 
                    placeholder="Contoh: Kalender Akademik 2026/2027" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                  <select 
                    value={kategori} 
                    onChange={e => setKategori(e.target.value)} 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Informasi Umum">Informasi Umum</option>
                    <option value="Kurikulum">Kurikulum</option>
                    <option value="Panduan">Panduan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Berkas Dokumen {editId && <span className="text-[10px] text-slate-400 font-normal">(Kosongkan jika tidak diganti)</span>}
                  </label>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-indigo-400"
                    required={!editId}
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
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-3 h-3 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Loader2 className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400 font-semibold">Memuat berkas unduhan...</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4">Nama Dokumen</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Ukuran & Tipe</th>
                  <th className="px-6 py-4 text-center">Total Unduh</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {downloads.length > 0 ? (
                  downloads.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-lg shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-white leading-snug">{doc.nama}</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-xs">{doc.file_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{doc.kategori}</td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {doc.file_size} ({doc.file_type})
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {doc.downloads_count}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => handleDownload(doc.id)} 
                          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-emerald-600 mr-1" 
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openEdit(doc)} 
                          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 mr-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(doc.id)} 
                          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                      Tidak ada dokumen ditemukan
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
