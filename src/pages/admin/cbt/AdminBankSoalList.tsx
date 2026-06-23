import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, FileQuestion, ArrowLeft, Save, X, HelpCircle, FileText, Clock, GraduationCap, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { type PaketSoal, type SoalItem, type TipeUjian, MOCK_PAKET_SOAL, TIPE_BADGE } from '../../../types/cbt';

function generateId() {
  return crypto.randomUUID();
}

const defaultPaket: PaketSoal[] = JSON.parse(JSON.stringify(MOCK_PAKET_SOAL));

export default function AdminBankSoalList() {
  const [pakets, setPakets] = useState<PaketSoal[]>(defaultPaket);
  const [view, setView] = useState<'list' | 'detail' | 'addQuestion'>('list');
  const [selectedPaket, setSelectedPaket] = useState<PaketSoal | null>(null);
  const [search, setSearch] = useState('');
  const [filterMapel, setFilterMapel] = useState('');
  const [filterKelas, setFilterKelas] = useState('');

  const [soalForm, setSoalForm] = useState({ tipe: 'pg' as SoalItem['tipe'], pertanyaan: '', kunciJawaban: '', jawabanPG: '', jawabanPGK: [] as string[] });
  const [editingSoalId, setEditingSoalId] = useState<string | null>(null);

  const [showPurposeModal, setShowPurposeModal] = useState(false);
  const [purposeFor, setPurposeFor] = useState<'paket' | 'soal'>('paket');
  const [createPaketForm, setCreatePaketForm] = useState({ title: '', mapel: '', kelas: '', time: '', tipe: 'ujian' as TipeUjian });

  const filteredPakets = pakets.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterMapel && p.mapel !== filterMapel) return false;
    if (filterKelas && p.kelas !== filterKelas) return false;
    return true;
  });

  function openDetail(p: PaketSoal) {
    setSelectedPaket(p);
    setView('detail');
  }

  function openAddQuestion() {
    setPurposeFor('soal');
    setShowPurposeModal(true);
  }

  function proceedToAddSoal() {
    setSoalForm({ tipe: 'pg', pertanyaan: '', kunciJawaban: '', jawabanPG: '', jawabanPGK: [] });
    setEditingSoalId(null);
    setShowPurposeModal(false);
    setView('addQuestion');
  }

  function openCreatePaket() {
    setPurposeFor('paket');
    setCreatePaketForm({ title: '', mapel: '', kelas: '', time: '', tipe: 'ujian' });
    setShowPurposeModal(true);
  }

  function createPaket() {
    if (!createPaketForm.title || !createPaketForm.mapel || !createPaketForm.kelas || !createPaketForm.time) return;
    const newPaket: PaketSoal = {
      id: generateId(),
      ...createPaketForm,
      soalCount: 0,
      soal: [],
    };
    setPakets(prev => [...prev, newPaket]);
    setShowPurposeModal(false);
  }

  function openEditQuestion(soal: SoalItem) {
    setSoalForm({ tipe: soal.tipe, pertanyaan: soal.pertanyaan, kunciJawaban: soal.kunciJawaban, jawabanPG: soal.kunciJawaban, jawabanPGK: soal.kunciJawaban.split(', ') });
    setEditingSoalId(soal.id);
    setView('addQuestion');
  }

  function saveQuestion() {
    if (!selectedPaket || !soalForm.pertanyaan || !soalForm.kunciJawaban) return;
    const newSoal: SoalItem = {
      id: editingSoalId || generateId(),
      nomor: editingSoalId
        ? (selectedPaket.soal.find(s => s.id === editingSoalId)?.nomor || selectedPaket.soal.length + 1)
        : selectedPaket.soal.length + 1,
      tipe: soalForm.tipe,
      pertanyaan: soalForm.pertanyaan,
      kunciJawaban: soalForm.kunciJawaban,
      bobot: 0,
    };
    setPakets(prev => prev.map(p => {
      if (p.id !== selectedPaket.id) return p;
      const updatedSoal = editingSoalId
        ? p.soal.map(s => s.id === editingSoalId ? newSoal : s)
        : [...p.soal, newSoal];
      return { ...p, soal: updatedSoal, soalCount: updatedSoal.length };
    }));
    if (editingSoalId) {
      setSelectedPaket(prev => prev ? { ...prev, soal: prev.soal.map(s => s.id === editingSoalId ? newSoal : s), soalCount: prev.soal.length } : null);
    } else {
      setSelectedPaket(prev => prev ? { ...prev, soal: [...prev.soal, newSoal], soalCount: prev.soal.length + 1 } : null);
    }
    setView('detail');
  }

  function deleteQuestion(soalId: string) {
    if (!selectedPaket) return;
    setPakets(prev => prev.map(p => {
      if (p.id !== selectedPaket.id) return p;
      const updatedSoal = p.soal.filter(s => s.id !== soalId).map((s, i) => ({ ...s, nomor: i + 1 }));
      return { ...p, soal: updatedSoal, soalCount: updatedSoal.length };
    }));
    setSelectedPaket(prev => prev ? { ...prev, soal: prev.soal.filter(s => s.id !== soalId).map((s, i) => ({ ...s, nomor: i + 1 })), soalCount: prev.soal.length - 1 } : null);
  }

  function deletePaket(id: string) {
    setPakets(prev => prev.filter(p => p.id !== id));
  }

  const tipeBadge = (tipe: SoalItem['tipe']) => {
    const map = { pg: 'PG', pgk: 'PGK', pg_kompleks: 'PGK', bs: 'BS', essay: 'Essay' } as const;
    const colors: Record<string, string> = { pg: 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400', pgk: 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400', pg_kompleks: 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400', bs: 'bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400', essay: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' };
    return <span className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-md whitespace-nowrap ${colors[tipe] || colors.pg}`}>{map[tipe] || 'PG'}</span>;
  };

  const badgePaket = (tipe: TipeUjian) => (
    <span className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-md whitespace-nowrap ${TIPE_BADGE[tipe].color}`}>
      {TIPE_BADGE[tipe].label}
    </span>
  );

  if (view === 'detail' && selectedPaket) {
    return (
      <AdminLayout title={`Bank Soal - ${selectedPaket.title}`}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Bank Soal
          </button>
          <button onClick={openAddQuestion} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <Plus className="w-4 h-4" /> Tambah Soal
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
                <FileQuestion className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-slate-800 dark:text-white">{selectedPaket.title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{selectedPaket.mapel} • {selectedPaket.kelas} • {selectedPaket.soal.length} Soal • {selectedPaket.time}</p>
                {badgePaket(selectedPaket.tipe)}
              </div>
            </div>
          </div>

          {selectedPaket.soal.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="font-bold text-slate-500 dark:text-slate-400 mb-2">Belum Ada Soal</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Paket soal ini masih kosong. Klik "Tambah Soal" untuk mengisi.</p>
              <button onClick={openAddQuestion} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                <Plus className="w-4 h-4" /> Tambah Soal Pertama
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {selectedPaket.soal.map((soal) => (
                <div key={soal.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {soal.nomor}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          {tipeBadge(soal.tipe)}
                        </div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">{soal.pertanyaan}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                          <span className="font-semibold">Kunci:</span> <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{soal.kunciJawaban}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditQuestion(soal)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteQuestion(soal.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  if (view === 'addQuestion' && selectedPaket) {
    const pgOptions = ['A', 'B', 'C', 'D', 'E'];
    const pgkOptions = ['A', 'B', 'C', 'D', 'E'];
    return (
      <AdminLayout title={editingSoalId ? 'Edit Soal' : 'Tambah Soal Baru'}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button onClick={() => setView('detail')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Detail Paket
          </button>
        </div>

        <div className="max-w-3xl bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-6 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" /> {editingSoalId ? 'Edit Soal' : 'Form Soal Baru'}
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pertanyaan</label>
              <textarea value={soalForm.pertanyaan} onChange={e => setSoalForm(prev => ({ ...prev, pertanyaan: e.target.value }))}
                rows={3} placeholder="Tulis pertanyaan di sini..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none" />
            </div>

            {soalForm.tipe === 'pg' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kunci Jawaban</label>
                <div className="grid grid-cols-5 gap-3">
                  {pgOptions.map(opt => (
                    <button key={opt} onClick={() => setSoalForm(prev => ({ ...prev, kunciJawaban: opt }))}
                      className={`py-3 rounded-xl text-sm font-bold border text-center transition-all ${
                        soalForm.kunciJawaban === opt
                          ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-200 hover:text-emerald-600'
                      }`}>{opt}</button>
                  ))}
                </div>
              </div>
            )}

            {soalForm.tipe === 'pgk' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kunci Jawaban (centang semua yang benar)</label>
                <div className="grid grid-cols-5 gap-3">
                  {pgkOptions.map(opt => {
                    const selected = soalForm.kunciJawaban.split(', ').includes(opt);
                    return (
                      <button key={opt} onClick={() => {
                        const current = soalForm.kunciJawaban ? soalForm.kunciJawaban.split(', ') : [];
                        const updated = selected ? current.filter(v => v !== opt) : [...current, opt];
                        setSoalForm(prev => ({ ...prev, kunciJawaban: updated.join(', ') }));
                      }}
                        className={`py-3 rounded-xl text-sm font-bold border text-center transition-all ${
                          selected
                            ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500/50 text-amber-700 dark:text-amber-300'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-amber-200 hover:text-amber-600'
                        }`}>{opt}</button>
                    );
                  })}
                </div>
              </div>
            )}

            {soalForm.tipe === 'essay' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kunci Jawaban / Rubrik Penilaian</label>
                <textarea value={soalForm.kunciJawaban} onChange={e => setSoalForm(prev => ({ ...prev, kunciJawaban: e.target.value }))}
                  rows={3} placeholder="Tulis kunci jawaban atau rubrik penilaian..." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none" />
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setView('detail')} className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Batal
              </button>
              <button onClick={saveQuestion} disabled={!soalForm.pertanyaan || !soalForm.kunciJawaban} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                <Save className="w-4 h-4 inline mr-1.5" /> {editingSoalId ? 'Simpan Perubahan' : 'Tambah Soal'}
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Bank Soal (CBT)">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-end justify-between">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="w-full sm:w-auto">
              <label className="block text-[11px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Mata Pelajaran</label>
              <select value={filterMapel} onChange={e => setFilterMapel(e.target.value)} className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                <option value="">Semua Mapel</option>
                <option value="Matematika Wajib">Matematika Wajib</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-[11px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Tingkat Kelas</label>
              <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="w-full sm:w-32 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 dark:text-indigo-400">
                <option value="">Semua</option>
                <option value="Kelas X">Kelas X</option>
                <option value="Kelas XI">Kelas XI</option>
              </select>
            </div>
          </div>
          <button onClick={openCreatePaket} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <Plus className="w-4 h-4" /> Buat Paket Soal
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{filteredPakets.length} paket soal ditemukan</p>
            <div className="relative max-w-sm w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul paket soal..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
          </div>

          {filteredPakets.length === 0 ? (
            <div className="text-center py-12">
              <FileQuestion className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Tidak ada paket soal yang cocok</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPakets.map(paket => (
                <div key={paket.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[15px] p-5 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all group cursor-pointer" onClick={() => openDetail(paket)}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-indigo-50 dark:bg-indigo-500/20 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400">
                      <FileQuestion className="w-5 h-5" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => deletePaket(paket.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1 leading-tight">{paket.title}</h4>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">{paket.mapel} • {paket.kelas}</p>
                  <div className="flex items-center gap-2 mb-4">
                    {badgePaket(paket.tipe)}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {paket.soalCount} Soal
                    </span>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Estimasi</div>
                      <div className="font-black text-slate-700 dark:text-slate-300 flex items-center gap-1"><Clock className="w-3 h-3" /> {paket.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Pilih Tipe Penggunaan */}
      {showPurposeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPurposeModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                {purposeFor === 'paket' ? <FileQuestion className="w-5 h-5 text-indigo-500" /> : <HelpCircle className="w-5 h-5 text-indigo-500" />}
                {purposeFor === 'paket' ? 'Buat Paket Soal Baru' : 'Tujuan Penggunaan Soal'}
              </h3>
              <button onClick={() => setShowPurposeModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {purposeFor === 'soal' ? (
              <div className="p-6">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Soal ini nantinya akan digunakan untuk apa?</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <button onClick={proceedToAddSoal}
                    className="p-5 rounded-2xl border-2 border-red-200 dark:border-red-500/30 hover:border-red-400 dark:hover:border-red-500 text-left hover:shadow-md transition-all group">
                    <GraduationCap className="w-8 h-8 text-red-500 mb-3" />
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">Ujian</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Penilaian Tengah/ Akhir Semester</p>
                  </button>
                  <button onClick={proceedToAddSoal}
                    className="p-5 rounded-2xl border-2 border-amber-200 dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-500 text-left hover:shadow-md transition-all group">
                    <BookOpen className="w-8 h-8 text-amber-500 mb-3" />
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">Ulangan Harian</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Ulangan harian atau tes tengah bab</p>
                  </button>
                  <button onClick={proceedToAddSoal}
                    className="p-5 rounded-2xl border-2 border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-500 text-left hover:shadow-md transition-all group">
                    <FileText className="w-8 h-8 text-emerald-500 mb-3" />
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">Kuis</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Kuis harian singkat atau latihan</p>
                  </button>
                </div>
                <button onClick={() => setShowPurposeModal(false)} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Batal
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Lengkapi data paket soal di bawah ini.</p>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Nama Paket Soal</label>
                  <input type="text" value={createPaketForm.title} onChange={e => setCreatePaketForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Contoh: PTS Ganjil 2024/2025" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Mata Pelajaran</label>
                    <select value={createPaketForm.mapel} onChange={e => setCreatePaketForm(prev => ({ ...prev, mapel: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                      <option value="">Pilih Mapel...</option>
                      <option value="Matematika Wajib">Matematika Wajib</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                      <option value="Bahasa Inggris">Bahasa Inggris</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Kelas</label>
                    <select value={createPaketForm.kelas} onChange={e => setCreatePaketForm(prev => ({ ...prev, kelas: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                      <option value="">Pilih Kelas...</option>
                      <option value="Kelas X">Kelas X</option>
                      <option value="Kelas XI">Kelas XI</option>
                      <option value="Kelas XII">Kelas XII</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Estimasi Waktu Pengerjaan</label>
                  <select value={createPaketForm.time} onChange={e => setCreatePaketForm(prev => ({ ...prev, time: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="">Pilih Durasi...</option>
                    <option value="15 Menit">15 Menit</option>
                    <option value="30 Menit">30 Menit</option>
                    <option value="45 Menit">45 Menit</option>
                    <option value="60 Menit">60 Menit</option>
                    <option value="90 Menit">90 Menit</option>
                    <option value="120 Menit">120 Menit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Tipe Penggunaan</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { value: 'ujian' as const, label: 'Ujian', icon: GraduationCap, bg: 'bg-red-50 dark:bg-red-500/20 border-red-400 dark:border-red-500 text-red-700 dark:text-red-300', bgInactive: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400' },
                      { value: 'ulangan_harian' as const, label: 'Ulangan', icon: BookOpen, bg: 'bg-amber-50 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300', bgInactive: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400' },
                      { value: 'kuis' as const, label: 'Kuis', icon: FileText, bg: 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300', bgInactive: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400' },
                    ]).map(opt => (
                      <button key={opt.value} onClick={() => setCreatePaketForm(prev => ({ ...prev, tipe: opt.value }))}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-bold border transition-all ${
                          createPaketForm.tipe === opt.value ? opt.bg : opt.bgInactive
                        }`}>
                        <opt.icon className="w-5 h-5" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button onClick={() => setShowPurposeModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    Batal
                  </button>
                  <button onClick={createPaket} disabled={!createPaketForm.title || !createPaketForm.mapel || !createPaketForm.kelas || !createPaketForm.time} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                    <Save className="w-4 h-4 inline mr-1.5" /> Buat Paket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
