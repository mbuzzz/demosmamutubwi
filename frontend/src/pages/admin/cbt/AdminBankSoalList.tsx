import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, FileQuestion, ArrowLeft, Save, X, HelpCircle, FileText, Clock, GraduationCap, BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { type PaketSoal, type SoalItem, type TipeUjian, type OpsiJawaban, TIPE_BADGE } from '../../../types/cbt';
import {
  useBankSoalList,
  useCreateBankSoal,
  useDeleteBankSoal,
  useBankSoalDetail,
  useSaveSoal,
  useDeleteSoal,
} from '../../../hooks/useCbt';
import { useMapelList } from '../../../hooks/useMapel';
import { useAuth } from '../../../components/auth/AuthContext';
import { toast } from 'sonner';

export default function AdminBankSoalList() {
  const { data: bankSoalList, isLoading } = useBankSoalList();
  const { data: mapelList } = useMapelList();
  const { user } = useAuth();
  const createBankSoal = useCreateBankSoal();
  const deleteBankSoal = useDeleteBankSoal();
  const saveSoalMutation = useSaveSoal();
  const deleteSoalMutation = useDeleteSoal();

  const pakets = bankSoalList || [];
  const [view, setView] = useState<'list' | 'detail' | 'addQuestion'>('list');
  const [selectedPaketId, setSelectedPaketId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterMapel, setFilterMapel] = useState('');

  // Fetch full detail (with soals) from API when in detail or addQuestion view
  const { data: detailPaket, isLoading: isDetailLoading, refetch: refetchDetail } = useBankSoalDetail(
    (view === 'detail' || view === 'addQuestion') ? selectedPaketId : null
  );

  // The selected paket from list (for display when detail not yet loaded)
  const selectedPaketFromList = pakets.find(p => p.id === selectedPaketId) ?? null;

  const [soalForm, setSoalForm] = useState({
    jenis: 'pg' as SoalItem['jenis'],
    pertanyaan: '',
    kunciJawaban: '',
    bobot_nilai: 2,
    opsiJawabans: [
      { teks_opsi: '', is_benar: false },
      { teks_opsi: '', is_benar: false },
      { teks_opsi: '', is_benar: false },
      { teks_opsi: '', is_benar: false },
      { teks_opsi: '', is_benar: false },
    ] as OpsiJawaban[],
  });
  const [editingSoalId, setEditingSoalId] = useState<number | null>(null);

  const [showPurposeModal, setShowPurposeModal] = useState(false);
  const [createPaketForm, setCreatePaketForm] = useState({
    title: '',
    mapel_id: '',
    kelas: '10',
    time: '',
    tipe: 'ujian' as TipeUjian,
  });

  const filteredPakets = pakets.filter(p => {
    if (search && !p.judul?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterMapel && String(p.mapel_id) !== filterMapel) return false;
    return true;
  });

  // The soals to display in detail view — from API
  const currentSoals: SoalItem[] = ((detailPaket as any)?.soals ?? detailPaket?.soal ?? []) as SoalItem[];

  function openDetail(p: PaketSoal) {
    setSelectedPaketId(p.id);
    setView('detail');
  }

  function openAddQuestion() {
    setSoalForm({
      jenis: 'pg',
      pertanyaan: '',
      kunciJawaban: '',
      bobot_nilai: 2,
      opsiJawabans: [
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
      ],
    });
    setEditingSoalId(null);
    setView('addQuestion');
  }

  function openCreatePaket() {
    setCreatePaketForm({
      title: '',
      mapel_id: mapelList?.[0]?.id ?? '',
      kelas: '10',
      time: '',
      tipe: 'ujian',
    });
    setShowPurposeModal(true);
  }

  function createPaket() {
    if (!createPaketForm.title || !createPaketForm.mapel_id || !createPaketForm.time) return;
    createBankSoal.mutate({
      judul: createPaketForm.title,
      tipe: createPaketForm.tipe,
      waktu_pengerjaan: parseInt(createPaketForm.time),
      status: 'draft',
      tingkat: parseInt(createPaketForm.kelas) || 10,
      mapel_id: parseInt(createPaketForm.mapel_id) as any,
      guru_id: user?.id ?? 1,
    }, {
      onSuccess: () => {
        setShowPurposeModal(false);
        toast.success('Paket Soal berhasil dibuat');
      },
    });
  }

  function openEditQuestion(soal: SoalItem) {
    // Restore opsiJawabans from the existing soal data
    const existingOpsi = (soal as any).opsi_jawabans ?? soal.opsiJawabans ?? [];
    setSoalForm({
      jenis: soal.jenis,
      pertanyaan: soal.pertanyaan,
      kunciJawaban: existingOpsi.filter((o: OpsiJawaban) => o.is_benar).map((o: OpsiJawaban) => o.teks_opsi).join(', '),
      bobot_nilai: soal.bobot_nilai ?? 2,
      opsiJawabans: existingOpsi.length > 0 ? existingOpsi : [
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
      ],
    });
    setEditingSoalId(soal.id as number);
    setView('addQuestion');
  }

  function saveQuestion() {
    if (!selectedPaketId || !soalForm.pertanyaan) return;

    const payload: any = {
      jenis: soalForm.jenis,
      pertanyaan: soalForm.pertanyaan,
      bobot_nilai: Math.max(1, Math.floor(Number(soalForm.bobot_nilai) || 1)),
    };

    if (soalForm.jenis === 'pg') {
      payload.opsi_jawabans = soalForm.opsiJawabans.map(o => ({
        id: o.id,
        teks_opsi: o.teks_opsi,
        is_benar: !!o.is_benar,
      }));
    } else if (soalForm.jenis === 'essay') {
      // Essay uses first opsi as rubric/kunci
      payload.opsi_jawabans = [{ teks_opsi: soalForm.kunciJawaban, is_benar: true }];
    }

    saveSoalMutation.mutate({
      bank_soal_id: selectedPaketId,
      soal_id: editingSoalId ?? undefined,
      data: payload,
    }, {
      onSuccess: () => {
        refetchDetail();
        setView('detail');
      },
    });
  }

  function deleteQuestion(soalId: number) {
    if (!selectedPaketId) return;
    if (!window.confirm('Hapus soal ini?')) return;
    deleteSoalMutation.mutate({ bank_soal_id: selectedPaketId, soal_id: soalId }, {
      onSuccess: () => refetchDetail(),
    });
  }

  function deletePaket(id: number) {
    if (!window.confirm('Hapus paket soal ini beserta semua soalnya?')) return;
    deleteBankSoal.mutate(id, {
      onSuccess: () => {
        if (selectedPaketId === id) {
          setSelectedPaketId(null);
          setView('list');
        }
      },
    });
  }

  function updateSoalOpsi(idx: number, updates: Partial<OpsiJawaban>) {
    setSoalForm(prev => {
      const newOpsi = [...prev.opsiJawabans];
      newOpsi[idx] = { ...newOpsi[idx], ...updates };
      // PG: enforce single correct answer
      if (updates.is_benar && prev.jenis === 'pg') {
        for (let i = 0; i < newOpsi.length; i++) {
          if (i !== idx) newOpsi[i] = { ...newOpsi[i], is_benar: false };
        }
      }
      return { ...prev, opsiJawabans: newOpsi };
    });
  }

  const tipeBadge = (tipe: SoalItem['jenis']) => {
    const map: Record<string, string> = { pg: 'PG', pgk: 'PGK', pg_kompleks: 'PGK', bs: 'B/S', essay: 'Essay' };
    const colors: Record<string, string> = {
      pg: 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
      pgk: 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
      pg_kompleks: 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
      bs: 'bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
      essay: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    };
    return (
      <span className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-md whitespace-nowrap ${colors[tipe] || colors.pg}`}>
        {map[tipe] || tipe.toUpperCase()}
      </span>
    );
  };

  const badgePaket = (tipe: TipeUjian) => (
    <span className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-md whitespace-nowrap ${TIPE_BADGE[tipe]?.color ?? 'bg-slate-100 text-slate-600'}`}>
      {TIPE_BADGE[tipe]?.label ?? tipe}
    </span>
  );

  const opsiLabels = ['A', 'B', 'C', 'D', 'E'];

  // ── DETAIL VIEW ──────────────────────────────────────────────────────────────
  if (view === 'detail' && selectedPaketId) {
    const displayPaket = detailPaket ?? selectedPaketFromList;
    return (
      <AdminLayout title={`Bank Soal - ${displayPaket?.judul ?? '...'}`}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button onClick={() => { setSelectedPaketId(null); setView('list'); }} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
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
                <h2 className="text-xl font-black text-slate-800 dark:text-white">{displayPaket?.judul}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {displayPaket?.mapel?.nama_mapel ?? (mapelList?.find(m => m.id === String(displayPaket?.mapel_id))?.nama ?? 'Mapel')} • Tingkat {displayPaket?.tingkat} • {isDetailLoading ? '...' : currentSoals.length} Soal • {displayPaket?.waktu_pengerjaan} Menit
                </p>
                {displayPaket?.tipe && badgePaket(displayPaket.tipe)}
              </div>
            </div>
          </div>

          {isDetailLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-indigo-400 mx-auto mb-3 animate-spin" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Memuat soal...</p>
            </div>
          ) : currentSoals.length === 0 ? (
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
              {currentSoals.map((soal, index) => {
                const opsiList: OpsiJawaban[] = (soal as any).opsi_jawabans ?? soal.opsiJawabans ?? [];
                return (
                  <div key={soal.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            {tipeBadge(soal.jenis)}
                          </div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: soal.pertanyaan }} />
                          {opsiList.length > 0 && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                              <span className="font-semibold">Kunci:</span>{' '}
                              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                {opsiList.filter(o => o.is_benar).map(o => o.teks_opsi).join(', ') || '—'}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditQuestion(soal)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteQuestion(soal.id as number)}
                          disabled={deleteSoalMutation.isPending}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  // ── ADD / EDIT SOAL VIEW ─────────────────────────────────────────────────────
  if (view === 'addQuestion' && selectedPaketId) {
    const isSaving = saveSoalMutation.isPending;
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
            {/* Jenis & Bobot */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Jenis Soal</label>
                <select
                  value={soalForm.jenis}
                  onChange={e => setSoalForm(prev => ({ ...prev, jenis: e.target.value as SoalItem['jenis'] }))}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pg">Pilihan Ganda (PG)</option>
                  <option value="essay">Uraian / Essay</option>
                </select>
              </div>
              <div className="w-32">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Bobot Skor</label>
                <input
                  type="number" min="1" step="1"
                  value={soalForm.bobot_nilai}
                  onChange={e => setSoalForm(prev => ({ ...prev, bobot_nilai: Math.max(1, Math.floor(parseInt(e.target.value) || 1)) }))}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Pertanyaan */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pertanyaan</label>
              <textarea
                value={soalForm.pertanyaan}
                onChange={e => setSoalForm(prev => ({ ...prev, pertanyaan: e.target.value }))}
                rows={3}
                placeholder="Tulis pertanyaan di sini..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
              />
            </div>

            {/* PG Options */}
            {soalForm.jenis === 'pg' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                  Opsi Jawaban <span className="text-xs font-normal text-slate-400">(centang opsi yang benar)</span>
                </label>
                <div className="space-y-2">
                  {soalForm.opsiJawabans.map((opsi, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${opsi.is_benar ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}
                    >
                      <input
                        type="radio"
                        name="kunci_pg"
                        checked={opsi.is_benar}
                        onChange={() => updateSoalOpsi(idx, { is_benar: true })}
                        className="w-4 h-4 text-emerald-500 cursor-pointer"
                      />
                      <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs border ${opsi.is_benar ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700'}`}>
                        {opsiLabels[idx] || idx + 1}
                      </div>
                      <input
                        type="text"
                        value={opsi.teks_opsi}
                        onChange={e => updateSoalOpsi(idx, { teks_opsi: e.target.value })}
                        placeholder={`Teks opsi ${opsiLabels[idx]}...`}
                        className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Essay kunci */}
            {soalForm.jenis === 'essay' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kunci Jawaban / Rubrik Penilaian</label>
                <textarea
                  value={soalForm.kunciJawaban}
                  onChange={e => setSoalForm(prev => ({ ...prev, kunciJawaban: e.target.value }))}
                  rows={3}
                  placeholder="Tulis kunci jawaban atau rubrik penilaian..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setView('detail')} className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Batal
              </button>
              <button
                onClick={saveQuestion}
                disabled={isSaving || !soalForm.pertanyaan}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingSoalId ? 'Simpan Perubahan' : 'Tambah Soal'}
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Bank Soal (CBT)">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-end justify-between">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="w-full sm:w-auto">
              <label className="block text-[11px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Mata Pelajaran</label>
              <select value={filterMapel} onChange={e => setFilterMapel(e.target.value)} className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                <option value="">Semua Mapel</option>
                {mapelList?.map(m => (
                  <option key={m.id} value={m.id}>{m.nama}</option>
                ))}
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

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-indigo-300 mx-auto mb-4 animate-spin" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading bank soal...</p>
            </div>
          ) : filteredPakets.length === 0 ? (
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
                      <button onClick={() => openDetail(paket)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => deletePaket(paket.id)} disabled={deleteBankSoal.isPending} className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1 leading-tight">{paket.judul}</h4>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                    {paket.mapel?.nama_mapel ?? (mapelList?.find(m => m.id === String(paket.mapel_id))?.nama ?? 'Mapel')} • Tingkat {paket.tingkat}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    {badgePaket(paket.tipe)}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {(paket as any).soals_count ?? paket.soal?.length ?? 0} Soal
                    </span>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Estimasi</div>
                      <div className="font-black text-slate-700 dark:text-slate-300 flex items-center gap-1"><Clock className="w-3 h-3" /> {paket.waktu_pengerjaan} Menit</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Buat Paket Soal */}
      {showPurposeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPurposeModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileQuestion className="w-5 h-5 text-indigo-500" />
                Buat Paket Soal Baru
              </h3>
              <button onClick={() => setShowPurposeModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Nama Paket Soal</label>
                <input type="text" value={createPaketForm.title} onChange={e => setCreatePaketForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Contoh: PTS Ganjil 2024/2025" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Mata Pelajaran</label>
                  <select value={createPaketForm.mapel_id} onChange={e => setCreatePaketForm(prev => ({ ...prev, mapel_id: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="">Pilih Mapel...</option>
                    {mapelList?.map(m => (
                      <option key={m.id} value={m.id}>{m.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Tingkat Kelas</label>
                  <select value={createPaketForm.kelas} onChange={e => setCreatePaketForm(prev => ({ ...prev, kelas: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="10">Kelas 10</option>
                    <option value="11">Kelas 11</option>
                    <option value="12">Kelas 12</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Estimasi Waktu Pengerjaan</label>
                <select value={createPaketForm.time} onChange={e => setCreatePaketForm(prev => ({ ...prev, time: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                  <option value="">Pilih Durasi...</option>
                  <option value="15">15 Menit</option>
                  <option value="30">30 Menit</option>
                  <option value="45">45 Menit</option>
                  <option value="60">60 Menit</option>
                  <option value="90">90 Menit</option>
                  <option value="120">120 Menit</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Tipe Penggunaan</label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { value: 'ujian' as const, label: 'Ujian', icon: GraduationCap },
                    { value: 'ulangan_harian' as const, label: 'Ulangan', icon: BookOpen },
                    { value: 'kuis' as const, label: 'Kuis', icon: FileText },
                  ]).map(opt => (
                    <button key={opt.value} onClick={() => setCreatePaketForm(prev => ({ ...prev, tipe: opt.value }))}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-bold border transition-all ${
                        createPaketForm.tipe === opt.value
                          ? 'bg-indigo-50 dark:bg-indigo-500/20 border-indigo-400 dark:border-indigo-500 text-indigo-700 dark:text-indigo-300'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-200'
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
                <button
                  onClick={createPaket}
                  disabled={!createPaketForm.title || !createPaketForm.mapel_id || !createPaketForm.time || createBankSoal.isPending}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                  {createBankSoal.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Buat Paket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
