import AdminLayout from '../../../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Calendar, Clock, KeyRound, X, Save, FileQuestion, Search, GraduationCap, BookOpen, FileText } from 'lucide-react';
import { useState } from 'react';
import { type SesiUjian, type TipeUjian, MOCK_PAKET_SOAL, generateToken, TIPE_BADGE } from '../../../../types/cbt';
import { useExamSessions } from '../../../../components/exam/ExamContext';

export default function GuruUjianList() {
  const { sessions, addSession, updateSession, deleteSession, regenToken } = useExamSessions();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    tipe: 'ujian' as TipeUjian,
    title: '',
    mapel: 'Matematika Wajib',
    kelas: 'Kelas X-1',
    paketSoalId: '',
    tanggal: '',
    jamMulai: '',
    durasi: 90,
    token: '',
  });

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditingId(null);
    setForm({
      tipe: 'ujian',
      title: '',
      mapel: 'Matematika Wajib',
      kelas: 'Kelas X-1',
      paketSoalId: '',
      tanggal: '',
      jamMulai: '',
      durasi: 90,
      token: generateToken(),
    });
    setShowModal(true);
  }

  function openEdit(s: SesiUjian) {
    setEditingId(s.id);
    setForm({
      tipe: s.tipe,
      title: s.title,
      mapel: s.mapel,
      kelas: s.kelas,
      paketSoalId: s.paketSoalId,
      tanggal: s.tanggal,
      jamMulai: s.jamMulai,
      durasi: s.durasi,
      token: s.token,
    });
    setShowModal(true);
  }

  function saveSession() {
    if (!form.title || !form.tanggal || !form.jamMulai) return;
    if (editingId) {
      updateSession(editingId, form);
    } else {
      const newSesi: SesiUjian = {
        id: Math.random().toString(36).substring(2, 9),
        ...form,
        status: 'Akan Datang',
      };
      addSession(newSesi);
    }
    setShowModal(false);
  }

  const statusBadge = (status: string) => {
    if (status === 'Sedang Berlangsung') return <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-bold border border-emerald-100 dark:border-emerald-500/20 inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> {status}</span>;
    if (status === 'Selesai') return <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-700">{status}</span>;
    return <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-xs font-bold border border-amber-100 dark:border-amber-500/20">{status}</span>;
  };

  return (
    <AdminLayout title="Jadwal Ujian Saya (Guru)">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Kelola Sesi Ujian</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Atur jadwal dan token ujian untuk kelas Anda.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-48">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari ujian..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <button onClick={openCreate} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              <Plus className="w-4 h-4" /> Jadwalkan Ujian
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Ujian & Kelas</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4">Token</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Belum ada sesi ujian.</td>
                </tr>
              ) : (
                filteredSessions.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-white mb-1">{s.title}</div>
                      <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{s.mapel} • {s.kelas}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${TIPE_BADGE[s.tipe].color}`}>
                        {TIPE_BADGE[s.tipe].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1"><Calendar className="w-3.5 h-3.5" /> {s.tanggal}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><Clock className="w-3.5 h-3.5" /> {s.jamMulai} • {s.durasi} Menit</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {s.token ? (
                          <>
                            <span className="font-mono text-sm font-bold tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700">{s.token}</span>
                            <button onClick={() => regenToken(s.id)} className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400" title="Generate Token Baru">
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => regenToken(s.id)} className="text-xs flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-400 font-bold transition-colors">
                            <KeyRound className="w-3 h-3" /> Generate Token
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{statusBadge(s.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteSession(s.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-indigo-500" />
                {editingId ? 'Edit Sesi Ujian' : 'Jadwalkan Ujian Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-3 gap-3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Tipe Ujian</label>
                <div className="col-span-3 grid grid-cols-3 gap-3">
                  {([
                    { value: 'ujian' as const, label: 'Ujian', icon: GraduationCap },
                    { value: 'ulangan_harian' as const, label: 'Ulangan Harian', icon: BookOpen },
                    { value: 'kuis' as const, label: 'Kuis', icon: FileText },
                  ]).map(opt => (
                    <button key={opt.value} onClick={() => setForm(prev => ({ ...prev, tipe: opt.value }))}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-bold border transition-all ${
                        form.tipe === opt.value ? TIPE_BADGE[opt.value].color + ' border-current' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                      <opt.icon className="w-5 h-5" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Nama Sesi Ujian</label>
                <input type="text" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Contoh: Kuis Fungsi Kuadrat" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Mata Pelajaran</label>
                  <select value={form.mapel} onChange={e => setForm(prev => ({ ...prev, mapel: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="Matematika Wajib">Matematika Wajib</option>
                    <option value="Fisika">Fisika</option>
                    <option value="Kimia">Kimia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Kelas</label>
                  <select value={form.kelas} onChange={e => setForm(prev => ({ ...prev, kelas: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="Kelas X-1">Kelas X-1</option>
                    <option value="Kelas X-2">Kelas X-2</option>
                    <option value="Kelas XI IPA">Kelas XI IPA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Paket Soal</label>
                <select value={form.paketSoalId} onChange={e => setForm(prev => ({ ...prev, paketSoalId: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                  <option value="">Pilih Paket Soal...</option>
                  {MOCK_PAKET_SOAL.filter(p => p.mapel === form.mapel).map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.kelas})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Tanggal</label>
                  <input type="date" value={form.tanggal} onChange={e => setForm(prev => ({ ...prev, tanggal: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Jam Mulai</label>
                  <input type="time" value={form.jamMulai} onChange={e => setForm(prev => ({ ...prev, jamMulai: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Durasi (Menit)</label>
                  <input type="number" value={form.durasi} onChange={e => setForm(prev => ({ ...prev, durasi: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Token Akses</label>
                <div className="flex items-center gap-3">
                  <input type="text" value={form.token} readOnly className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400" />
                  <button onClick={() => setForm(prev => ({ ...prev, token: generateToken() }))} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-colors border border-indigo-200 dark:border-indigo-500/30">
                    <KeyRound className="w-4 h-4" /> Generate
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-4">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Batal
              </button>
              <button onClick={saveSession} disabled={!form.title || !form.tanggal || !form.jamMulai} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                <Save className="w-4 h-4 inline mr-1.5" /> {editingId ? 'Simpan Perubahan' : 'Buat Sesi Ujian'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
