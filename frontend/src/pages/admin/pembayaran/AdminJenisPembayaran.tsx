import { useState, useMemo } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Pencil, Trash2, Globe, Loader2, Receipt } from 'lucide-react';
import { rupiah, type JenisPembayaran, type JenisPembayaranTipe, type JenisPembayaranInput } from '../../../types/pembayaran';
import { useJenisPembayaranList, useCreateJenisPembayaran, useUpdateJenisPembayaran, useDeleteJenisPembayaran, useCreateTagihan } from '../../../hooks/usePembayaran';
import { useUsers } from '../../../hooks/useUsers';
import { toast } from 'sonner';

const PERIODE_BERULANG = ['Bulanan', 'Mingguan', 'Tahunan'];
const PERIODE_OPTIONS = ['Bulanan', 'Tahunan', 'Semester', 'Sekali', 'Mingguan'];

function isPeriodeBerulang(periode: string): boolean {
  if (!periode) return false;
  return PERIODE_BERULANG.some(p => periode.toLowerCase().includes(p.toLowerCase()));
}

function formatJatuhTempoDisplay(item: JenisPembayaran): string {
  if (!item.jatuhTempo) return '-';
  const berulang = isPeriodeBerulang(item.periode);
  return berulang ? `Tgl ${item.jatuhTempo}` : item.jatuhTempo;
}

interface FormState {
  nama: string;
  nominal: number;
  tipe: JenisPembayaranTipe;
  periode: string;
  deskripsi: string;
  jatuhTempo: string;
}

const emptyForm: FormState = {
  nama: '',
  nominal: 0,
  tipe: 'wajib',
  periode: '',
  deskripsi: '',
  jatuhTempo: '',
};

export default function AdminJenisPembayaran() {
  const { data: list = [], isLoading: isLoadingList } = useJenisPembayaranList();
  const createMutation = useCreateJenisPembayaran();
  const updateMutation = useUpdateJenisPembayaran();
  const deleteMutation = useDeleteJenisPembayaran();
  const createTagihanMutation = useCreateTagihan();
  const { data: studentUsers = [], isLoading: isLoadingStudents } = useUsers('siswa');

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [assignMode, setAssignMode] = useState<'none' | 'semua' | 'kelas'>('none');
  const [assignKelas, setAssignKelas] = useState('');
  const [search, setSearch] = useState('');

  const isBusy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || createTagihanMutation.isPending;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((j: JenisPembayaran) => j.nama.toLowerCase().includes(term));
  }, [list, search]);

  const kelasList = useMemo(() => {
    return [...new Set(studentUsers.map((s: any) => s.kelas).filter(Boolean))];
  }, [studentUsers]);

  const totalWajib = useMemo(
    () => list.filter((j: JenisPembayaran) => j.tipe === 'wajib').reduce((a: number, j: JenisPembayaran) => a + j.nominal, 0),
    [list]
  );
  const totalSukarela = useMemo(
    () => list.filter((j: JenisPembayaran) => j.tipe === 'sukarela').reduce((a: number, j: JenisPembayaran) => a + j.nominal, 0),
    [list]
  );

  const periodeBerulang = useMemo(() => isPeriodeBerulang(form.periode), [form.periode]);

  const openNew = () => {
    setEditId(null);
    setForm(emptyForm);
    setAssignMode('none');
    setAssignKelas('');
    setShowForm(true);
  };

  const openEdit = (item: JenisPembayaran) => {
    setEditId(item.id);
    setForm({
      nama: item.nama,
      nominal: item.nominal,
      tipe: item.tipe,
      periode: item.periode || '',
      deskripsi: item.deskripsi || '',
      jatuhTempo: item.jatuhTempo || '',
    });
    setAssignMode('none');
    setAssignKelas('');
    setShowForm(true);
  };

  const validateForm = (): boolean => {
    if (!form.nama.trim()) {
      toast.error('Nama jenis pembayaran wajib diisi');
      return false;
    }
    if (!form.nominal || form.nominal <= 0) {
      toast.error('Nominal harus lebih dari 0');
      return false;
    }
    if (!form.periode.trim()) {
      toast.error('Periode pembayaran wajib diisi');
      return false;
    }
    if (periodeBerulang && form.jatuhTempo) {
      const day = Number(form.jatuhTempo);
      if (Number.isNaN(day) || day < 1 || day > 31) {
        toast.error('Tanggal jatuh tempo untuk periode berulang harus antara 1-31');
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (isBusy || !validateForm()) return;

    const { jatuhTempo, ...base } = form;
    const payload: JenisPembayaranInput = {
      ...base,
      jatuh_tempo: jatuhTempo,
    };

    if (editId) {
      updateMutation.mutate(
        { id: editId, data: payload },
        {
          onSuccess: () => {
            toast.success('Perubahan berhasil disimpan');
            setShowForm(false);
          },
        }
      );
      return;
    }

    createMutation.mutate(payload, {
      onSuccess: (newJenis: any) => {
        setShowForm(false);

        if (assignMode === 'semua' && studentUsers.length > 0) {
          createTagihanMutation.mutate({
            jenis_pembayaran_id: newJenis.data?.id ?? newJenis.id,
            siswa_ids: studentUsers.map((s: any) => s.id),
            nama_tagihan: newJenis.data?.nama ?? newJenis.nama,
            nominal_tagihan: newJenis.data?.nominal ?? newJenis.nominal,
            tenggat_waktu: periodeBerulang ? undefined : form.jatuhTempo || undefined,
          });
        } else if (assignMode === 'kelas' && assignKelas && studentUsers.length > 0) {
          const classStudents = studentUsers.filter((s: any) => s.kelas === assignKelas);
          if (classStudents.length > 0) {
            createTagihanMutation.mutate({
              jenis_pembayaran_id: newJenis.data?.id ?? newJenis.id,
              siswa_ids: classStudents.map((s: any) => s.id),
              nama_tagihan: newJenis.data?.nama ?? newJenis.nama,
              nominal_tagihan: newJenis.data?.nominal ?? newJenis.nominal,
              tenggat_waktu: periodeBerulang ? undefined : form.jatuhTempo || undefined,
            });
          }
        }
      },
    });
  };

  const handleDelete = (id: string | number) => {
    if (!window.confirm('Hapus jenis pembayaran ini? Data tagihan terkait juga akan ikut terhapus.')) return;
    deleteMutation.mutate(id);
  };

  return (
    <AdminLayout title="Jenis Pembayaran">
      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Total Jenis</p>
          <h3 className="text-3xl font-black mt-1">
            {isLoadingList ? <Loader2 className="w-7 h-7 animate-spin" /> : list.length}
          </h3>
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

      {/* Tabel */}
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari jenis..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={openNew}
            disabled={isBusy}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Jenis
          </button>
        </div>

        {showForm && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 border-b border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
            <div className="max-w-xl space-y-3">
              <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">
                {editId ? 'Edit' : 'Tambah'} Jenis Pembayaran
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Nama</label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={e => setForm({ ...form, nama: e.target.value })}
                    placeholder="Contoh: SPP Bulanan"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Nominal</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">Rp</span>
                    <input
                      type="number"
                      min={0}
                      value={form.nominal || ''}
                      onChange={e => setForm({ ...form, nominal: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Tipe</label>
                  <select
                    value={form.tipe}
                    onChange={e => setForm({ ...form, tipe: e.target.value as JenisPembayaranTipe })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="wajib">Wajib</option>
                    <option value="sukarela">Sukarela</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Periode</label>
                  <input
                    list="periode-options"
                    type="text"
                    value={form.periode}
                    onChange={e => setForm({ ...form, periode: e.target.value })}
                    placeholder="Pilih atau ketik periode"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <datalist id="periode-options">
                    {PERIODE_OPTIONS.map(p => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>
                </div>
                <div>
                  {periodeBerulang ? (
                    <>
                      <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Tanggal (setiap bulan)</label>
                      <input
                        type="number"
                        min={1}
                        max={31}
                        value={form.jatuhTempo}
                        onChange={e => setForm({ ...form, jatuhTempo: e.target.value })}
                        placeholder="10"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </>
                  ) : (
                    <>
                      <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Jatuh Tempo</label>
                      <input
                        type="date"
                        value={form.jatuhTempo}
                        onChange={e => setForm({ ...form, jatuhTempo: e.target.value })}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </>
                  )}
                  <p className="text-[10px] text-indigo-400 mt-0.5">
                    {periodeBerulang ? 'Hari tagihan jatuh tempo setiap periode' : 'Tanggal spesifik jatuh tempo'}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Deskripsi</label>
                  <textarea
                    value={form.deskripsi}
                    onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                    rows={2}
                    placeholder="Keterangan tambahan (opsional)"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {!editId && (
                <div className="border-t border-indigo-200 dark:border-indigo-600/30 pt-3 mt-2">
                  <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" /> Terapkan Tagihan ke Siswa
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['none', 'semua', 'kelas'] as const).map(mode => (
                      <label
                        key={mode}
                        onClick={() => setAssignMode(mode)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          assignMode === mode
                            ? 'border-indigo-500 bg-white dark:bg-slate-900'
                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-200'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            assignMode === mode ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                          }`}
                        >
                          {assignMode === mode && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {mode === 'none' && 'Tidak'}
                          {mode === 'semua' && `Semua (${studentUsers.length})`}
                          {mode === 'kelas' && 'Per Kelas'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {assignMode === 'kelas' && (
                    <select
                      value={assignKelas}
                      onChange={e => setAssignKelas(e.target.value)}
                      disabled={isLoadingStudents}
                      className="w-full mt-2 px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Pilih kelas...</option>
                      {kelasList.map((k: any) => (
                        <option key={k} value={k}>
                          {k} ({studentUsers.filter((s: any) => s.kelas === k).length} siswa)
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {isBusy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editId ? 'Simpan' : assignMode !== 'none' ? 'Simpan & Terapkan' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b">
              <tr>
                <th className="px-5 py-4">Nama</th>
                <th className="px-5 py-4">Nominal</th>
                <th className="px-5 py-4">Tipe</th>
                <th className="px-5 py-4">Periode</th>
                <th className="px-5 py-4">Jatuh Tempo</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {isLoadingList ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Memuat data jenis pembayaran...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                      <Receipt className="w-10 h-10 mb-2 opacity-40" />
                      <p className="text-sm font-medium">Belum ada jenis pembayaran</p>
                      <p className="text-xs mt-1">Klik "Tambah Jenis" untuk membuat yang pertama.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(j => (
                  <tr key={j.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{j.nama}</td>
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{rupiah(j.nominal)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          j.tipe === 'wajib'
                            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400'
                            : 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400'
                        }`}
                      >
                        {j.tipe === 'wajib' ? 'Wajib' : 'Sukarela'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{j.periode || '-'}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{formatJatuhTempoDisplay(j)}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(j)}
                          disabled={isBusy}
                          className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Pencil className="w-3.5 h-3.5 inline mr-0.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(j.id)}
                          disabled={isBusy}
                          className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline mr-0.5" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
