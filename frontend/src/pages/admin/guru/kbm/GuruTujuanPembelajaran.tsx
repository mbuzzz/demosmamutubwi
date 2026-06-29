import { useState } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { Plus, Pencil, Trash2, X, BookOpen, Award } from 'lucide-react';
import { useTujuanPembelajaranList, useCreateTujuanPembelajaran, useUpdateTujuanPembelajaran, useDeleteTujuanPembelajaran } from '../../../../hooks/useTujuanPembelajaran';
import { useMapelList } from '../../../../hooks/useMapel';
import { useGuruClasses } from '../../../../hooks/usePenugasan';
import { toast } from 'sonner';

export default function GuruTujuanPembelajaran() {
  const [selectedMapelId, setSelectedMapelId] = useState('');
  const [selectedTingkat, setSelectedTingkat] = useState<'X' | 'XI' | 'XII'>('X');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form states
  const [kode, setKode] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  const { data: guruClasses = [] } = useGuruClasses();
  // Queries
  const { data: mapelList = [] } = useMapelList();

  // Filter mapelList based on what the teacher teaches
  const taughtMapelIds = new Set(guruClasses.flatMap(k => k.mapels.map(m => m.id)));
  const guruMapelList = mapelList.filter(m => taughtMapelIds.has(m.id));

  const { data: tpList = [], isLoading } = useTujuanPembelajaranList(selectedMapelId, selectedTingkat);

  const createMutation = useCreateTujuanPembelajaran();
  const updateMutation = useUpdateTujuanPembelajaran();
  const deleteMutation = useDeleteTujuanPembelajaran();

  // Set first mapel as default when loaded
  if (!selectedMapelId && guruMapelList.length > 0) {
    setSelectedMapelId(guruMapelList[0].id);
  }

  const openNew = () => {
    setEditId(null);
    setKode('');
    setDeskripsi('');
    setShowForm(true);
  };

  const openEdit = (item: any) => {
    setEditId(item.id);
    setKode(item.kode);
    setDeskripsi(item.deskripsi);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMapelId || !kode || !deskripsi) {
      toast.error('Lengkapi semua field Tujuan Pembelajaran');
      return;
    }

    const data = {
      mapel_id: selectedMapelId,
      tingkat: selectedTingkat,
      kode,
      deskripsi,
    };

    try {
      if (editId) {
        await updateMutation.mutateAsync({ id: editId, data });
        toast.success('Tujuan Pembelajaran berhasil diperbarui');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Tujuan Pembelajaran baru berhasil disimpan');
      }
      setShowForm(false);
    } catch (err) {
      toast.error('Gagal menyimpan Tujuan Pembelajaran');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus Tujuan Pembelajaran ini? Nilai siswa terkait TP ini juga akan terhapus.')) return;
    try {
      await deleteMutation.mutateAsync({ id, mapelId: selectedMapelId, tingkat: selectedTingkat });
      toast.success('Tujuan Pembelajaran berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus Tujuan Pembelajaran');
    }
  };

  return (
    <AdminLayout title="Tujuan Pembelajaran (TP)">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mata Pelajaran</label>
            <select 
              value={selectedMapelId} 
              onChange={e => setSelectedMapelId(e.target.value)} 
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
            >
              {guruMapelList.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
            </select>
          </div>

          <div className="w-full sm:w-40">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tingkat Kelas</label>
            <select 
              value={selectedTingkat} 
              onChange={e => setSelectedTingkat(e.target.value as any)} 
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
            >
              <option value="X">Kelas X</option>
              <option value="XI">Kelas XI</option>
              <option value="XII">Kelas XII</option>
            </select>
          </div>
        </div>

        <button 
          onClick={openNew} 
          disabled={!selectedMapelId}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed mt-auto"
        >
          <Plus className="w-4 h-4" /> Tambah TP Baru
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/30 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> 
            Daftar Tujuan Pembelajaran
          </h3>
        </div>

        {/* Inline Form */}
        {showForm && (
          <div className="p-5 bg-indigo-50/50 dark:bg-indigo-500/5 border-b border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSave} className="max-w-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> {editId ? 'Edit' : 'Tambah'} Tujuan Pembelajaran
                </h3>
                <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kode TP</label>
                  <input 
                    type="text" 
                    value={kode} 
                    onChange={e => setKode(e.target.value)} 
                    placeholder="Contoh: TP-1.1" 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-mono" 
                    required 
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Deskripsi Tujuan Pembelajaran</label>
                  <input 
                    type="text" 
                    value={deskripsi} 
                    onChange={e => setDeskripsi(e.target.value)} 
                    placeholder="Contoh: Menjelaskan sifat eksponen dan logaritma..." 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                    required 
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

        {/* List Table */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-semibold">Memuat data Tujuan Pembelajaran...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tpList.length > 0 ? (
                tpList.map(item => (
                  <div key={item.id} className="flex items-start gap-4 p-5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group bg-white dark:bg-slate-900">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 flex items-center justify-center font-mono font-black text-xs shrink-0 uppercase tracking-wider">
                      {item.kode.slice(0, 4)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-white leading-tight mb-1">{item.kode}</h4>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{item.deskripsi}</p>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 rounded-lg" title="Edit TP"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 dark:bg-slate-800 rounded-lg" title="Hapus TP"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-center py-8 text-slate-400 dark:text-slate-500 font-medium">Belum ada Tujuan Pembelajaran yang ditambahkan.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
