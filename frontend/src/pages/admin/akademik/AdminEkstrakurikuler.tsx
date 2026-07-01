import { useState, useRef } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Pencil, Trash2, X, Award, Download, Upload, Calendar, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useEkskulList, useCreateEkskul, useUpdateEkskul, useDeleteEkskul, useJadwalEkskul, useCreateJadwalEkskul, useDeleteJadwalEkskul, type EkskulRecord, type JadwalEkskulRecord } from '../../../hooks/useEkskul';
import { toast } from 'sonner';

const HARI_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;
const POLA_OPTIONS = [
  { value: 'setiap_minggu', label: 'Setiap Minggu' },
  { value: 'minggu_ganjil', label: 'Minggu Ganjil' },
  { value: 'minggu_genap', label: 'Minggu Genap' },
  { value: 'minggu_ke_1', label: 'Minggu ke-1' },
  { value: 'minggu_ke_2', label: 'Minggu ke-2' },
  { value: 'minggu_ke_3', label: 'Minggu ke-3' },
  { value: 'minggu_ke_4', label: 'Minggu ke-4' },
] as const;

function getPolaLabel(pola: string): string {
  return POLA_OPTIONS.find(p => p.value === pola)?.label || pola;
}

function getPolaBadgeColor(pola: string): string {
  switch (pola) {
    case 'setiap_minggu': return 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400';
    case 'minggu_ganjil': return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    case 'minggu_genap': return 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
    default: return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
  }
}

export default function AdminEkstrakurikuler() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedEkskulId, setSelectedEkskulId] = useState<string | null>(null);
  
  // Form states
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  // Jadwal form states
  const [jadwalHari, setJadwalHari] = useState('Senin');
  const [jadwalJamMulai, setJadwalJamMulai] = useState('');
  const [jadwalJamSelesai, setJadwalJamSelesai] = useState('');
  const [jadwalPola, setJadwalPola] = useState('setiap_minggu');
  const [jadwalRuang, setJadwalRuang] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const { data: ekskulList = [], isLoading, isError } = useEkskulList(search);
  const createEkskulMutation = useCreateEkskul();
  const updateEkskulMutation = useUpdateEkskul();
  const deleteEkskulMutation = useDeleteEkskul();

  // Jadwal queries & mutations
  const { data: jadwalList = [], isLoading: isLoadingJadwal } = useJadwalEkskul(selectedEkskulId ?? undefined);
  const createJadwalMutation = useCreateJadwalEkskul();
  const deleteJadwalMutation = useDeleteJadwalEkskul();

  const selectedEkskul = ekskulList.find(e => e.id === selectedEkskulId);

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
      if (selectedEkskulId === id) setSelectedEkskulId(null);
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

  const resetJadwalForm = () => {
    setJadwalHari('Senin');
    setJadwalJamMulai('');
    setJadwalJamSelesai('');
    setJadwalPola('setiap_minggu');
    setJadwalRuang('');
  };

  const handleAddJadwal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEkskulId || !jadwalJamMulai || !jadwalJamSelesai) {
      toast.error('Hari, jam mulai, dan jam selesai wajib diisi');
      return;
    }
    try {
      await createJadwalMutation.mutateAsync({
        ekskulId: selectedEkskulId,
        data: {
          hari: jadwalHari,
          jam_mulai: jadwalJamMulai,
          jam_selesai: jadwalJamSelesai,
          pola: jadwalPola,
          ruang: jadwalRuang || undefined,
        },
      });
      resetJadwalForm();
    } catch (_err) {
      // error handled by hook
    }
  };

  const handleDeleteJadwal = async (jadwal: JadwalEkskulRecord) => {
    if (!selectedEkskulId) return;
    if (!window.confirm(`Hapus jadwal ${jadwal.hari} (${jadwal.jam_mulai}-${jadwal.jam_selesai})?`)) return;
    try {
      await deleteJadwalMutation.mutateAsync({ ekskulId: selectedEkskulId, jadwalId: jadwal.id });
    } catch (_err) {
      // error handled by hook
    }
  };

  const toggleEkskulSelection = (id: string) => {
    setSelectedEkskulId(prev => prev === id ? null : id);
    resetJadwalForm();
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
                    <tr 
                      key={e.id} 
                      className={`transition-colors cursor-pointer ${
                        selectedEkskulId === e.id 
                          ? 'bg-indigo-50/70 dark:bg-indigo-500/10' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                      }`}
                      onClick={() => toggleEkskulSelection(e.id)}
                    >
                      <td className="px-5 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          selectedEkskulId === e.id 
                            ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' 
                            : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          <Award className="w-4.5 h-4.5" />
                        </div>
                        <span className="flex-1">{e.nama}</span>
                        {selectedEkskulId === e.id 
                          ? <ChevronUp className="w-4 h-4 text-indigo-400" /> 
                          : <ChevronDown className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        }
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300 text-xs">{e.deskripsi || 'Tidak ada deskripsi'}</td>
                      <td className="px-5 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={(ev) => { ev.stopPropagation(); openEdit(e); }} 
                          className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button 
                          onClick={(ev) => { ev.stopPropagation(); handleDelete(e.id); }} 
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

      {/* Jadwal Ekskul Panel */}
      {selectedEkskulId && selectedEkskul && (
        <div className="mt-6 bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Jadwal Ekskul: {selectedEkskul.nama}</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Atur hari, jam, dan pola rotasi jadwal</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedEkskulId(null)} 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Jadwal Table */}
          <div className="overflow-x-auto">
            {isLoadingJadwal ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <div className="w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-semibold">Memuat jadwal...</p>
              </div>
            ) : jadwalList.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-3">Hari</th>
                    <th className="px-5 py-3">Jam</th>
                    <th className="px-5 py-3">Pola</th>
                    <th className="px-5 py-3">Ruang</th>
                    <th className="px-5 py-3">Pembina</th>
                    <th className="px-5 py-3 w-20 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {jadwalList.map(j => (
                    <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-700 dark:text-white text-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          {j.hari}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300 text-xs">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {j.jam_mulai} - {j.jam_selesai}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${getPolaBadgeColor(j.pola)}`}>
                          {getPolaLabel(j.pola)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300 text-xs">
                        {j.ruang ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {j.ruang}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300 text-xs">
                        {j.pembina?.name || <span className="text-slate-400">-</span>}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button 
                          onClick={() => handleDeleteJadwal(j)} 
                          className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">
                Belum ada jadwal untuk ekskul ini
              </div>
            )}
          </div>

          {/* Add Jadwal Form */}
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Tambah Jadwal Baru
            </h4>
            <form onSubmit={handleAddJadwal} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Hari</label>
                <select 
                  value={jadwalHari} 
                  onChange={e => setJadwalHari(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                  {HARI_OPTIONS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Jam Mulai</label>
                <input 
                  type="time" 
                  value={jadwalJamMulai} 
                  onChange={e => setJadwalJamMulai(e.target.value)} 
                  required
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Jam Selesai</label>
                <input 
                  type="time" 
                  value={jadwalJamSelesai} 
                  onChange={e => setJadwalJamSelesai(e.target.value)} 
                  required
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Pola</label>
                <select 
                  value={jadwalPola} 
                  onChange={e => setJadwalPola(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                  {POLA_OPTIONS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">Ruang</label>
                <input 
                  type="text" 
                  value={jadwalRuang} 
                  onChange={e => setJadwalRuang(e.target.value)} 
                  placeholder="Opsional"
                  className="w-28 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <button 
                type="submit" 
                disabled={createJadwalMutation.isPending}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> 
                {createJadwalMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
