import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, Calendar, Clock, MonitorPlay, KeyRound, X, Save, FileQuestion, Search, GraduationCap, BookOpen, FileText, BookMarked } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type SesiUjian, type TipeUjian, generateToken, TIPE_BADGE } from '../../../types/cbt';
import { useSesiUjianList, useCreateSesiUjian } from '../../../hooks/useCbt';
import { useCbtTemplateList } from '../../../hooks/useCbtTemplate';
import { useUsers } from '../../../hooks/useUsers';

// Removed MOCK_PAKET_SOAL reference since we no longer have it locally
// and we need to fetch bank soal properly

export default function AdminUjianList() {
  const { data: sesiList, isLoading } = useSesiUjianList();
  const createSesi = useCreateSesiUjian();
  const { data: templates = [] } = useCbtTemplateList();
  const { data: allUsers = [] } = useUsers();
  const guruList = allUsers.filter((u: any) => u.role === 'guru' || u.role === 'walikelas');
  
  const sessions = sesiList || [];
  
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    tipe: 'ujian' as TipeUjian,
    title: '',
    mapel: '',
    kelas: '',
    paketSoalId: '',
    tanggal: '',
    jamMulai: '',
    durasi: 90,
    token: '',
    pengawasIds: [] as number[],
    templateId: '',
  });

  const filteredSessions = sessions.filter(s =>
    s.nama_sesi?.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditingId(null);
    setForm({
      tipe: 'ujian',
      title: '',
      mapel: '',
      kelas: '',
      paketSoalId: '',
      tanggal: '',
      jamMulai: '',
      durasi: 90,
      token: generateToken(),
      pengawasIds: [],
      templateId: '',
    });
    setShowModal(true);
  }

  function openEdit(s: SesiUjian) {
    setEditingId(s.id);
    setForm({
      tipe: s.bank_soal?.tipe || 'ujian', // Assuming bank_soal has tipe
      title: s.nama_sesi,
      mapel: s.bank_soal?.mapel?.nama_mapel || '',
      kelas: s.bank_soal?.tingkat ? `Kelas ${s.bank_soal.tingkat}` : '',
      paketSoalId: s.bank_soal_id?.toString() || '',
      tanggal: s.waktu_mulai?.split(' ')[0] || '',
      jamMulai: s.waktu_mulai?.split(' ')[1]?.substring(0, 5) || '',
      durasi: s.durasi,
      token: s.token || '',
      pengawasIds: s.pengawas?.map((p: any) => p.id) || [],
      templateId: s.template_id?.toString() || '',
    });
    setShowModal(true);
  }

  function saveSession() {
    if (!form.title || !form.tanggal || !form.jamMulai) return;
    if (editingId) {
      // updateSession(editingId, form);
    } else {
      createSesi.mutate({
        nama_sesi: form.title,
        bank_soal_id: parseInt(form.paketSoalId) || 1, // hardcoded if missing
        waktu_mulai: `${form.tanggal} ${form.jamMulai}:00`,
        waktu_selesai: `${form.tanggal} ${form.jamMulai}:00`, // Need proper calc
        durasi: form.durasi,
        token: form.token,
        status: 'published',
        pengawas_ids: form.pengawasIds,
        template_id: form.templateId ? parseInt(form.templateId) : null,
      } as any, {
        onSuccess: () => setShowModal(false)
      })
    }
  }

  function deleteSession(_id: number) {
      // delete
  }
  
  function regenToken(_id: number) {
      // regen
  }

  const statusBadge = (status: string) => {
    if (status === 'published') return <span className="px-2.5 sm:px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-bold border border-emerald-100 dark:border-emerald-500/20 inline-flex items-center gap-1.5 whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sedang Berlangsung</span>;
    if (status === 'completed') return <span className="px-2.5 sm:px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-xs font-bold border border-slate-200 dark:border-slate-700 whitespace-nowrap">Selesai</span>;
    return <span className="px-2.5 sm:px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-xs font-bold border border-amber-100 dark:border-amber-500/20 whitespace-nowrap">Akan Datang</span>;
  };

  return (
    <AdminLayout title="Jadwal & Sesi Ujian (CBT)">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Daftar Sesi Ujian Aktif</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Jadwalkan ujian dan bagikan token kepada siswa.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-48">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari ujian..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <button onClick={openCreate} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              <Plus className="w-4 h-4" /> Jadwalkan Ujian Baru
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider">
              <tr>
                <th className="px-6 py-4">Nama Ujian & Kelas</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Waktu Pelaksanaan</th>
                <th className="px-6 py-4">Token Akses</th>
                <th className="px-6 py-4">Pengawas</th>
                <th className="px-6 py-4">Status Ujian</th>
                <th className="px-6 py-4 text-right">Aksi & Monitor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                  <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">Loading jadwal...</td>
                  </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">Belum ada sesi ujian. Klik "Jadwalkan Ujian Baru" untuk memulai.</td>
                </tr>
              ) : (
                filteredSessions.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 dark:text-white mb-1">{s.nama_sesi}</div>
                      <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{s.bank_soal?.mapel?.nama_mapel} • Tingkat {s.bank_soal?.tingkat}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-md whitespace-nowrap ${TIPE_BADGE[s.bank_soal?.tipe || 'ujian']?.color || 'bg-gray-100 text-gray-800'}`}>
                        {TIPE_BADGE[s.bank_soal?.tipe || 'ujian']?.label || 'UJIAN'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1"><Calendar className="w-3.5 h-3.5" /> {s.waktu_mulai?.split(' ')[0]}</div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"><Clock className="w-3.5 h-3.5" /> {s.waktu_mulai?.split(' ')[1]} • {s.durasi} Menit</div>
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
                    <td className="px-6 py-4">
                      {s.pengawas && s.pengawas.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {s.pengawas.map((p: any) => (
                            <span key={p.id} className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                              {p.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {statusBadge(s.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {s.status === 'published' && (
                          <Link to={`/panel/cbt/monitor?sesi_id=${s.id}`} className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/30 transition-colors border border-indigo-100 dark:border-indigo-500/30">
                            <MonitorPlay className="w-3.5 h-3.5" /> Monitor
                          </Link>
                        )}
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
                <div className="col-span-3 grid grid-cols-4 gap-3">
                  {([
                    { value: 'ujian' as const, label: 'Ujian', icon: GraduationCap },
                    { value: 'ulangan_harian' as const, label: 'Ulangan Harian', icon: BookOpen },
                    { value: 'kuis' as const, label: 'Kuis', icon: FileText },
                    { value: 'matrikulasi' as const, label: 'Matrikulasi', icon: BookMarked },
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
                <input type="text" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Contoh: PTS Ganjil Matematika X-1" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Mata Pelajaran</label>
                  <select value={form.mapel} onChange={e => setForm(prev => ({ ...prev, mapel: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="">Pilih Mapel...</option>
                    <option value="Matematika Wajib">Matematika Wajib</option>
                    <option value="Fisika">Fisika</option>
                    <option value="Kimia">Kimia</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Bahasa Inggris">Bahasa Inggris</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Kelas</label>
                  <select value={form.kelas} onChange={e => setForm(prev => ({ ...prev, kelas: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="">Pilih Kelas...</option>
                    <option value="Kelas X">Kelas X</option>
                    <option value="Kelas XI">Kelas XI</option>
                    <option value="Kelas XII">Kelas XII</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Paket Soal</label>
                <select value={form.paketSoalId} onChange={e => setForm(prev => ({ ...prev, paketSoalId: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                  <option value="">Pilih Paket Soal...</option>
                  {/* Requires actual API fetch for Bank Soal options here */}
                  <option value="1">Paket Soal Default</option>
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
                {form.tipe !== 'ujian' && (
                  <p className="text-[11px] text-amber-500 mt-1.5 font-medium">Token tidak wajib untuk {form.tipe === 'ulangan_harian' ? 'Ulangan Harian' : 'Kuis'}.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Template Tampilan</label>
                <select value={form.templateId} onChange={e => setForm(prev => ({ ...prev, templateId: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                  <option value="">Default (Tanpa Template)</option>
                  {templates.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.nama} ({t.layout})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Pengawas Ujian</label>
                <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-2 bg-slate-50 dark:bg-slate-800">
                  {guruList.length === 0 ? (
                    <p className="text-xs text-slate-400">Tidak ada guru tersedia</p>
                  ) : guruList.map((guru: any) => (
                    <label key={guru.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white dark:hover:bg-slate-700 p-1.5 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={form.pengawasIds.includes(guru.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm(prev => ({ ...prev, pengawasIds: [...prev.pengawasIds, guru.id] }));
                          } else {
                            setForm(prev => ({ ...prev, pengawasIds: prev.pengawasIds.filter((id: number) => id !== guru.id) }));
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{guru.name}</span>
                      <span className="text-xs text-slate-400 ml-auto">{guru.nip_nisn || ''}</span>
                    </label>
                  ))}
                </div>
                {form.pengawasIds.length > 0 && (
                  <p className="text-xs text-indigo-500 mt-1.5 font-medium">{form.pengawasIds.length} pengawas dipilih</p>
                )}
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
