import { useMemo, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Pencil, Trash2, Loader2, CalendarClock, User } from 'lucide-react';
import { HARI_PIKET, HARI_LABEL, type HariPiket, type JadwalPiketItem } from '../../../types/piket';
import { useGuruPiket, useJadwalPiket, useCreateJadwalPiket, useUpdateJadwalPiket, useDeleteJadwalPiket } from '../../../hooks/usePiket';
import { toast } from 'sonner';

interface FormState {
  user_id: string | number;
  keterangan: string;
}

const emptyForm: FormState = { user_id: '', keterangan: '' };

export default function AdminJadwalPiket() {
  const { data: jadwal = {}, isLoading: isLoadingJadwal } = useJadwalPiket();
  const { data: gurus = [], isLoading: isLoadingGurus } = useGuruPiket();
  const createMutation = useCreateJadwalPiket();
  const updateMutation = useUpdateJadwalPiket();
  const deleteMutation = useDeleteJadwalPiket();

  const [activeHari, setActiveHari] = useState<HariPiket>('senin');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const isBusy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const jadwalHari = useMemo(() => (jadwal as Record<HariPiket, JadwalPiketItem[]>)?.[activeHari] ?? [], [jadwal, activeHari]);

  const totalJadwal = useMemo(() => {
    return HARI_PIKET.reduce((acc, hari) => acc + ((jadwal as Record<HariPiket, JadwalPiketItem[]>)?.[hari]?.length ?? 0), 0);
  }, [jadwal]);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: JadwalPiketItem) => {
    setEditId(item.id);
    setForm({ user_id: item.user_id, keterangan: item.keterangan || '' });
    setShowForm(true);
  };

  const handleSave = () => {
    if (isBusy) return;
    if (!form.user_id) {
      toast.error('Pilih guru piket');
      return;
    }

    const payload = { user_id: form.user_id, hari: activeHari, keterangan: form.keterangan || undefined };

    if (editId) {
      updateMutation.mutate({ id: editId, data: payload }, { onSuccess: () => setShowForm(false) });
      return;
    }
    createMutation.mutate(payload, { onSuccess: () => setShowForm(false) });
  };

  const handleDelete = (item: JadwalPiketItem) => {
    if (!window.confirm(`Hapus jadwal piket ${item.user?.name || ''} pada hari ${HARI_LABEL[activeHari]}?`)) return;
    deleteMutation.mutate(item.id);
  };

  return (
    <AdminLayout title="Jadwal Guru Piket">
      {/* Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Total Jadwal</p>
          <h3 className="text-3xl font-black mt-1">
            {isLoadingJadwal ? <Loader2 className="w-7 h-7 animate-spin" /> : totalJadwal}
          </h3>
          <p className="text-xs text-emerald-100/80 mt-1">Guru piket per minggu</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Guru Terdaftar</p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
            {isLoadingGurus ? <Loader2 className="w-7 h-7 animate-spin" /> : gurus.length}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Staf pendidik yang bisa dijadwalkan</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hari Aktif</p>
          <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{HARI_LABEL[activeHari]}</h3>
          <p className="text-xs text-slate-400 mt-1">{jadwalHari.length} guru dijadwalkan</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Tab hari */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {HARI_PIKET.map(hari => (
              <button
                key={hari}
                onClick={() => setActiveHari(hari)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                  activeHari === hari
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {HARI_LABEL[hari]}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                  activeHari === hari ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'
                }`}>
                  {(jadwal as Record<HariPiket, JadwalPiketItem[]>)?.[hari]?.length ?? 0}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={openNew}
            disabled={isBusy}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Guru Piket
          </button>
        </div>

        {/* Form tambah/edit */}
        {showForm && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border-b border-emerald-100 dark:border-emerald-500/20 animate-in fade-in slide-in-from-top-2">
            <div className="max-w-xl space-y-3">
              <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                {editId ? 'Edit' : 'Tambah'} Jadwal Piket — {HARI_LABEL[activeHari]}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Guru</label>
                  <select
                    value={form.user_id}
                    onChange={e => setForm({ ...form, user_id: e.target.value })}
                    disabled={isLoadingGurus}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Pilih guru...</option>
                    {gurus.map((g: any) => (
                      <option key={g.id} value={g.id}>
                        {g.name}{g.jabatan ? ` — ${g.jabatan}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Keterangan</label>
                  <input
                    type="text"
                    value={form.keterangan}
                    onChange={e => setForm({ ...form, keterangan: e.target.value })}
                    placeholder="Contoh: Piket pagi 06.30 - 07.30 (opsional)"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowForm(false)}
                  disabled={isBusy}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 transition-colors disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isBusy}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {isBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editId ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Daftar guru hari ini */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {isLoadingJadwal ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              Memuat jadwal piket...
            </div>
          ) : jadwalHari.length === 0 ? (
            <div className="py-12 text-center">
              <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                <CalendarClock className="w-10 h-10 mb-2 opacity-40" />
                <p className="text-sm font-medium">Belum ada jadwal piket hari {HARI_LABEL[activeHari]}</p>
                <p className="text-xs mt-1">Klik "Tambah Guru Piket" untuk menjadwalkan.</p>
              </div>
            </div>
          ) : (
            jadwalHari.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-black shrink-0">
                  {index + 1}
                </span>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                  {item.user?.foto ? (
                    <img src={item.user.foto} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{item.user?.name || 'Guru tidak ditemukan'}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {item.user?.jabatan || 'Tenaga Pendidik'}{item.keterangan ? ` • ${item.keterangan}` : ''}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    disabled={isBusy}
                    className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Pencil className="w-3.5 h-3.5 inline mr-0.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={isBusy}
                    className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5 inline mr-0.5" /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
