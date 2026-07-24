import AdminLayout from '../../../components/admin/AdminLayout';
import { Search, Edit, Trash2, Plus, X, BookOpen, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { 
  usePenugasanList, 
  useCreatePenugasan, 
  useUpdatePenugasan, 
  useDeletePenugasan, 
  useStrukturalList, 
  useCreateStruktural,
  useUpdateStruktural,
  useDeleteStruktural,
  type PenugasanRecord,
  type PenugasanStrukturalRecord
} from '../../../hooks/usePenugasan';
import { useUsers } from '../../../hooks/useUsers';
import { useKelasList } from '../../../hooks/useKelas';
import { useMapelList } from '../../../hooks/useMapel';
import { toast } from 'sonner';

const ROLE_LABELS: Record<string, string> = {
  superadmin: 'Superadmin (All Access)',
  guru: 'Guru',
  walikelas: 'Wali Kelas',
  kepala_sekolah: 'Kepala Sekolah',
  kurikulum: 'Kurikulum',
  bendahara: 'Bendahara',
  admin: 'Staf Admin / TU',
  waka_kesiswaan: 'Waka Kesiswaan',
  waka_humas: 'Waka Humas',
};

export default function AdminPenugasanList() {
  const [activeTab, setActiveTab] = useState<'mengajar' | 'struktural'>('mengajar');
  const [search, setSearch] = useState('');

  // Inline Form States
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Teaching Assignment Form States
  const [guruId, setGuruId] = useState('');
  const [mapelId, setMapelId] = useState('');
  const [kelasId, setKelasId] = useState('');
  const [totalJam, setTotalJam] = useState(2);

  // Structural Assignment Form States
  const [editStrukturalId, setEditStrukturalId] = useState<string | null>(null);
  const [strukturalRole, setStrukturalRole] = useState('guru');
  const [strukturalJabatan, setStrukturalJabatan] = useState('');
  const [strukturalKelasId, setStrukturalKelasId] = useState('');
  const [selectedStrukturalUserId, setSelectedStrukturalUserId] = useState('');

  // Queries & Mutations
  const { data: penugasanList = [], isLoading: isPenugasanLoading } = usePenugasanList(search);
  const { data: strukturalList = [], isLoading: isStrukturalLoading } = useStrukturalList();
  
  // Selectors Data
  const { data: teachers = [] } = useUsers('guru'); // Gets all guru, walikelas, kepsek, kurikulum
  const { data: kelasList = [] } = useKelasList();
  const { data: mapelList = [] } = useMapelList();

  const createPenugasanMutation = useCreatePenugasan();
  const updatePenugasanMutation = useUpdatePenugasan();
  const deletePenugasanMutation = useDeletePenugasan();
  const createStrukturalMutation = useCreateStruktural();
  const updateStrukturalMutation = useUpdateStruktural();
  const deleteStrukturalMutation = useDeleteStruktural();

  const openNew = () => {
    setEditId(null);
    setGuruId('');
    setMapelId('');
    setKelasId('');
    setTotalJam(2);
    setEditStrukturalId(null);
    setShowForm(true);
  };

  const openEdit = (item: PenugasanRecord) => {
    setEditId(item.id);
    setGuruId(String(item.guru_id));
    setMapelId(String(item.mapel_id));
    setKelasId(String(item.kelas_id));
    setTotalJam(item.total_jam);
    setEditStrukturalId(null);
    setShowForm(true);
  };

  const openNewStruktural = () => {
    setEditId(null);
    setEditStrukturalId('new');
    setStrukturalRole('guru');
    setStrukturalJabatan('');
    setStrukturalKelasId('');
    setSelectedStrukturalUserId('');
    setShowForm(false);
  };

  const openEditStruktural = (u: PenugasanStrukturalRecord) => {
    setEditStrukturalId(u.id);
    setStrukturalRole(u.role_akses);
    setStrukturalJabatan(u.jabatan || '');
    setSelectedStrukturalUserId(u.user_id);
    setStrukturalKelasId(u.kelas_id || '');
    
    setShowForm(false);
  };

  const handleSavePenugasan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guruId || !mapelId || !kelasId || !totalJam) {
      toast.error('Lengkapi semua field penugasan');
      return;
    }

    const data = {
      guru_id: guruId,
      mapel_id: mapelId,
      kelas_id: kelasId,
      total_jam: Number(totalJam),
    };

    try {
      if (editId) {
        await updatePenugasanMutation.mutateAsync({ id: editId, data });
        toast.success('Penugasan mengajar berhasil diperbarui');
      } else {
        await createPenugasanMutation.mutateAsync(data);
        toast.success('Penugasan mengajar baru berhasil ditambahkan');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan penugasan.');
    }
  };

  const handleSaveStruktural = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStrukturalId) return;

    if (editStrukturalId === 'new' && !selectedStrukturalUserId) {
      toast.error('Pilih pegawai / staf terlebih dahulu');
      return;
    }

    if (strukturalRole === 'walikelas' && !strukturalKelasId) {
      toast.error('Pilih kelas binaan');
      return;
    }
    if (strukturalRole !== 'walikelas' && !strukturalJabatan) {
      toast.error('Lengkapi jabatan struktural');
      return;
    }

    try {
      const payload = {
        user_id: selectedStrukturalUserId,
        role_akses: strukturalRole,
        jabatan: strukturalRole === 'walikelas' ? null : strukturalJabatan,
        kelas_id: strukturalRole === 'walikelas' ? strukturalKelasId : null,
      };

      if (editStrukturalId === 'new') {
        await createStrukturalMutation.mutateAsync(payload);
      } else {
        await updateStrukturalMutation.mutateAsync({
          id: editStrukturalId,
          data: payload,
        });
      }
      toast.success('Tugas struktural berhasil disimpan');
      setEditStrukturalId(null);
      setStrukturalJabatan('');
      setStrukturalKelasId('');
      setSelectedStrukturalUserId('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan tugas struktural.');
    }
  };

  const handleDeleteStruktural = async (id: string) => {
    if (!window.confirm('Hapus tugas struktural ini?')) return;
    try {
      await deleteStrukturalMutation.mutateAsync(id);
      toast.success('Tugas struktural berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus tugas struktural');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus penugasan mengajar ini?')) return;
    try {
      await deletePenugasanMutation.mutateAsync(id);
      toast.success('Penugasan mengajar berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus penugasan');
    }
  };

  const filteredStruktural = strukturalList.filter(u => 
    u.user?.name?.toLowerCase().includes(search.toLowerCase()) || 
    (u.jabatan && u.jabatan.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout title="Manajemen Penugasan Pegawai">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        
        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => { setActiveTab('mengajar'); setShowForm(false); setEditStrukturalId(null); }}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-[3px] transition-colors ${
              activeTab === 'mengajar' 
                ? 'border-indigo-650 text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-500/10' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Penugasan Mengajar (Multi-Mapel)
          </button>
          <button
            onClick={() => { setActiveTab('struktural'); setShowForm(false); setEditStrukturalId(null); }}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-[3px] transition-colors ${
              activeTab === 'struktural' 
                ? 'border-indigo-650 text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-500/10' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Tugas Struktural + Jabatan
          </button>
        </div>

        {/* Penjelasan singkat per tab */}
        <div className="px-6 pt-4">
          {activeTab === 'mengajar' ? (
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-3 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
              <strong>Multi-mapel:</strong> satu guru bisa punya banyak baris (Guru × Mapel × Kelas).
              Ini yang dipakai jadwal, jurnal, nilai, dan CBT — <em>bukan</em> field jabatan di form user.
            </div>
          ) : (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-4 py-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
              <p>
                <strong>Jabatan struktural</strong> = label resmi di bagan organisasi (contoh: “Waka Kurikulum”, “Bendahara”).
                Saat disimpan, sistem menambahkan <strong>role akses</strong> ke multi-role (tanpa mengubah primary role / menghapus guru).
              </p>
              <p>
                Satu orang boleh punya <strong>beberapa jabatan struktural</strong> (mis. Wali Kelas + Bendahara), selama role-nya berbeda.
                Multi-role murni tanpa bagan org juga bisa di <strong>Users → Multi-Role</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative max-w-sm w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama guru / jabatan..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
          </div>
          {activeTab === 'mengajar' && (
            <button onClick={openNew} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 shrink-0 shadow-sm">
              <Plus className="w-4 h-4" /> Tambah Penugasan
            </button>
          )}
          {activeTab === 'struktural' && (
            <button onClick={openNewStruktural} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 shrink-0 shadow-sm">
              <Plus className="w-4 h-4" /> Tambah Tugas Struktural
            </button>
          )}
        </div>

        {/* Inline Form Teaching Assignment */}
        {showForm && activeTab === 'mengajar' && (
          <div className="p-5 bg-indigo-50/50 dark:bg-indigo-500/5 border-b border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSavePenugasan} className="max-w-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> {editId ? 'Edit' : 'Tambah'} Penugasan Mengajar
                </h3>
                <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Guru / Pendidik</label>
                  <select 
                    value={guruId} 
                    onChange={e => setGuruId(e.target.value)} 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="">-- Pilih Guru --</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mata Pelajaran</label>
                  <select 
                    value={mapelId} 
                    onChange={e => setMapelId(e.target.value)} 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="">-- Pilih Mapel --</option>
                    {mapelList.map(m => <option key={m.id} value={m.id}>{m.nama} (Kelas {m.tingkat})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kelas Binaan</label>
                  <select 
                    value={kelasId} 
                    onChange={e => setKelasId(e.target.value)} 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Jam Mengajar</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      min={1} 
                      max={40}
                      value={totalJam} 
                      onChange={e => setTotalJam(Number(e.target.value))} 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                      required 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">Jam / Minggu</span>
                  </div>
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

        {/* Inline Form Structural Assignment */}
        {editStrukturalId && activeTab === 'struktural' && (
          <div className="p-5 bg-indigo-50/50 dark:bg-indigo-500/5 border-b border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSaveStruktural} className="max-w-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" /> 
                  {editStrukturalId === 'new' ? 'Tambah Tugas Struktural' : `Edit Tugas Struktural: ${strukturalList.find(u => u.id === editStrukturalId)?.user?.name}`}
                </h3>
                <button type="button" onClick={() => setEditStrukturalId(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><X className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {editStrukturalId === 'new' && (
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilih Pegawai / Staf</label>
                      <select 
                        value={selectedStrukturalUserId} 
                        onChange={e => setSelectedStrukturalUserId(e.target.value)} 
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        required
                        disabled={editStrukturalId !== 'new'}
                      >
                        <option value="">-- Pilih Pegawai --</option>
                        {teachers.map(u => <option key={u.id} value={u.id}>{u.name} ({ROLE_LABELS[u.role] || u.role})</option>)}
                      </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hak Akses Panel (Role) <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={strukturalRole} 
                    onChange={e => setStrukturalRole(e.target.value)} 
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="superadmin">Superadmin</option>
                    <option value="guru">Guru Biasa</option>
                    <option value="walikelas">Wali Kelas</option>
                    <option value="kepala_sekolah">Kepala Sekolah</option>
                    <option value="kurikulum">Waka Kurikulum</option>
                    <option value="waka_kesiswaan">Waka Kesiswaan</option>
                    <option value="waka_humas">Waka Humas</option>
                    <option value="bendahara">Bendahara</option>
                    <option value="admin">Staf Admin / TU</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">Ditambahkan ke multi-role user (role lama seperti guru tidak dihapus).</p>
                </div>

                {strukturalRole === 'walikelas' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kelas Binaan <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={strukturalKelasId} 
                      onChange={e => setStrukturalKelasId(e.target.value)} 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      required
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                    </select>
                    <p className="text-[10px] text-slate-500 mt-1">Jabatan otomatis: “Wali Kelas [nama kelas]”.</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Jabatan (Label) <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={strukturalJabatan} 
                      onChange={e => setStrukturalJabatan(e.target.value)} 
                      placeholder="Contoh: Kepala Sekolah / Waka Kurikulum / Bendahara" 
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" 
                      required 
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Tampil di bagan organisasi &amp; field jabatan user. Bukan pengganti multi-mapel.</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setEditStrukturalId(null)} 
                  className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  Simpan Tugas Struktural
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 1: Penugasan Mengajar Table */}
        {activeTab === 'mengajar' ? (
          <div className="overflow-x-auto">
            {isPenugasanLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-semibold">Memuat data penugasan...</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Nama Guru</th>
                    <th className="px-6 py-4">Mata Pelajaran</th>
                    <th className="px-6 py-4 text-center">Kelas</th>
                    <th className="px-6 py-4 text-center font-bold">Total Jam</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {penugasanList.length > 0 ? (
                    penugasanList.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{p.guru ? p.guru.name : '—'}</td>
                        <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">{p.mapel ? p.mapel.nama : '—'}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-bold border border-slate-200 dark:border-slate-700">
                            {p.kelas ? p.kelas.nama : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-white">{p.total_jam} Jam / minggu</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => openEdit(p)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                        Belum ada penugasan mengajar terdaftar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          /* Tab 2: Tugas Struktural Table */
          <div className="overflow-x-auto">
            {isStrukturalLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-semibold">Memuat data pegawai...</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Nama Pegawai</th>
                    <th className="px-6 py-4">Tugas Struktural / Jabatan</th>
                    <th className="px-6 py-4">Hak Akses Panel (Role)</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredStruktural.length > 0 ? (
                    filteredStruktural.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{u.user?.name}</td>
                        <td className="px-6 py-4 font-semibold text-indigo-650 dark:text-indigo-400">
                          {u.jabatan || 'Belum Ada Tugas Struktural'}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded-md text-xs font-bold border border-purple-100 dark:border-purple-800/30">
                            {ROLE_LABELS[u.role_akses] || u.role_akses}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => openEditStruktural(u)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 transition-colors" title="Edit Jabatan"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteStruktural(u.id)} className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 transition-colors" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                        Tidak ada pegawai ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
