import AdminLayout from '../../../../components/admin/AdminLayout';
import { Save, Plus, HelpCircle, AlignLeft, CheckSquare, Type, Search, Edit, Trash2, FileQuestion, ArrowLeft, Clock, FileText, BookOpen, GraduationCap, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from 'react';
import { type PaketSoal, type TipeUjian, type SoalItem, type OpsiJawaban, TIPE_BADGE } from '../../../../types/cbt';
import { useBankSoalList, useCreateBankSoal, useBankSoalDetail, useSaveSoal, useDeleteSoal, useDeleteBankSoal } from '../../../../hooks/useCbt';
import { useMapelList } from '../../../../hooks/useMapel';
import { useAuth } from '../../../../components/auth/AuthContext';

export default function GuruBankSoalEditor() {
  const { data: bankSoalList, isLoading: isListLoading } = useBankSoalList();
  const createBankSoal = useCreateBankSoal();
  const deleteBankSoal = useDeleteBankSoal();
  const saveSoalMutation = useSaveSoal();
  const deleteSoalMutation = useDeleteSoal();
  const { data: mapelList } = useMapelList();
  const { user } = useAuth();

  const [view, setView] = useState<'list' | 'editor'>('list');
  const [selectedPaketId, setSelectedPaketId] = useState<number | null>(null);

  // Fetch full details for editor
  const { data: detailPaket, isLoading: isDetailLoading, refetch: refetchDetail } = useBankSoalDetail(selectedPaketId);

  // Editor states
  const [activeSoalIdx, setActiveSoalIdx] = useState(0);
  const [search, setSearch] = useState('');

  // Local state for soal to allow editing without immediate save
  const [localSoals, setLocalSoals] = useState<Partial<SoalItem>[]>([]);

  // Modals
  const [showPurposeModal, setShowPurposeModal] = useState(false);
  const [createPaketForm, setCreatePaketForm] = useState({ title: '', mapel_id: '', tingkat: '', time: '', tipe: 'ujian' as TipeUjian });

  const pakets = bankSoalList || [];
  const filteredPakets = pakets.filter(p => p.judul?.toLowerCase().includes(search.toLowerCase()) || p.deskripsi?.toLowerCase().includes(search.toLowerCase()));

  // Initialize localSoals when detailPaket is loaded
  useEffect(() => {
    if (detailPaket?.soal) {
      setLocalSoals(JSON.parse(JSON.stringify(detailPaket.soal))); // deep copy
    } else {
      setLocalSoals([]);
    }
  }, [detailPaket]);

  function openEditor(p: PaketSoal) {
    setSelectedPaketId(p.id);
    setActiveSoalIdx(0);
    setView('editor');
  }

  function openCreatePaket() {
    setCreatePaketForm({ title: '', mapel_id: mapelList?.[0]?.id || '', tingkat: '10', time: '', tipe: 'ujian' });
    setShowPurposeModal(true);
  }

  function createPaket() {
    if (!createPaketForm.title || !createPaketForm.time || !createPaketForm.mapel_id) return;
    createBankSoal.mutate({
      judul: createPaketForm.title,
      tipe: createPaketForm.tipe,
      waktu_pengerjaan: parseInt(createPaketForm.time),
      status: 'draft',
      tingkat: parseInt(createPaketForm.tingkat) || 10,
      mapel_id: parseInt(createPaketForm.mapel_id),
      guru_id: user?.id ? user.id : 1, // fallback to 1 if user.id is not available (though it should be)
    }, {
      onSuccess: (newPaket) => {
        setShowPurposeModal(false);
        openEditor(newPaket);
      }
    });
  }

  function deletePaket(id: number) {
    if (window.confirm('Apakah Anda yakin ingin menghapus paket soal ini?')) {
      deleteBankSoal.mutate(id);
    }
  }

  function addNewSoal() {
    const newSoal: Partial<SoalItem> = {
      jenis: 'pg',
      pertanyaan: '',
      bobot_nilai: 2.5,
      opsiJawabans: [
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
        { teks_opsi: '', is_benar: false },
      ]
    };
    setLocalSoals(prev => [...prev, newSoal]);
    setActiveSoalIdx(localSoals.length); // point to new soal
  }

  function saveCurrentSoal() {
    if (!selectedPaketId) return;
    const currentSoal = localSoals[activeSoalIdx];
    if (!currentSoal) return;

    saveSoalMutation.mutate({
      bank_soal_id: selectedPaketId,
      soal_id: currentSoal.id,
      data: {
        jenis: currentSoal.jenis,
        pertanyaan: currentSoal.pertanyaan,
        bobot_nilai: currentSoal.bobot_nilai,
        opsi_jawabans: currentSoal.opsiJawabans, // backend expects opsi_jawabans
      } as any // type override for opsi_jawabans mapping
    }, {
      onSuccess: () => {
        refetchDetail();
      }
    });
  }

  function hapusSoal(idx: number) {
    const soalToDel = localSoals[idx];
    if (soalToDel?.id && selectedPaketId) {
      // It exists in backend, delete via API
      deleteSoalMutation.mutate({ bank_soal_id: selectedPaketId, soal_id: soalToDel.id }, {
        onSuccess: () => {
          refetchDetail();
          setActiveSoalIdx(Math.max(0, idx - 1));
        }
      });
    } else {
      // Just a local new unsaved soal
      const newSoals = [...localSoals];
      newSoals.splice(idx, 1);
      setLocalSoals(newSoals);
      setActiveSoalIdx(Math.max(0, idx - 1));
    }
  }

  function updateLocalSoal(updates: Partial<SoalItem>) {
    setLocalSoals(prev => {
      const newArr = [...prev];
      newArr[activeSoalIdx] = { ...newArr[activeSoalIdx], ...updates };
      
      // If switching jenis to pg, ensure options exist
      if (updates.jenis === 'pg' && (!newArr[activeSoalIdx].opsiJawabans || newArr[activeSoalIdx].opsiJawabans!.length < 2)) {
        newArr[activeSoalIdx].opsiJawabans = [
          { teks_opsi: '', is_benar: false },
          { teks_opsi: '', is_benar: false },
          { teks_opsi: '', is_benar: false },
          { teks_opsi: '', is_benar: false },
          { teks_opsi: '', is_benar: false },
        ];
      } else if (updates.jenis === 'bs' && (!newArr[activeSoalIdx].opsiJawabans || newArr[activeSoalIdx].opsiJawabans!.length < 2)) {
        newArr[activeSoalIdx].opsiJawabans = [
          { teks_opsi: 'Benar', is_benar: false },
          { teks_opsi: 'Salah', is_benar: false }
        ];
      }
      return newArr;
    });
  }

  function updateOpsiJawaban(opsiIdx: number, updates: Partial<OpsiJawaban>) {
    setLocalSoals(prev => {
      const newArr = [...prev];
      const soal = { ...newArr[activeSoalIdx] };
      const opsiList = [...(soal.opsiJawabans || [])];
      
      if (opsiList[opsiIdx]) {
        opsiList[opsiIdx] = { ...opsiList[opsiIdx], ...updates };
        
        // If type is pg or bs, enforce single correct answer
        if (updates.is_benar && (soal.jenis === 'pg' || soal.jenis === 'bs')) {
          for (let i = 0; i < opsiList.length; i++) {
            if (i !== opsiIdx) opsiList[i].is_benar = false;
          }
        }
      }
      
      soal.opsiJawabans = opsiList;
      newArr[activeSoalIdx] = soal;
      return newArr;
    });
  }

  if (view === 'editor' && selectedPaketId) {
    if (isDetailLoading) {
      return (
        <AdminLayout title="Editor Butir Soal (CBT)">
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </AdminLayout>
      );
    }

    const activeSoal = localSoals[activeSoalIdx] || null;
    const isEditing = !!activeSoal;
    const opsiLables = ['A', 'B', 'C', 'D', 'E', 'F'];

    return (
      <AdminLayout title="Editor Butir Soal (CBT)">
        <div className="mb-6">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Bank Soal Saya
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">{detailPaket?.judul}</h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Total Soal: {localSoals.length} Butir</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          
          {/* Kiri: Navigator Soal */}
          <div className="xl:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-indigo-500" /> Navigasi Soal</h3>
            
            {localSoals.length === 0 ? (
               <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">Belum ada soal</p>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {localSoals.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveSoalIdx(i)}
                    className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-colors border
                      ${i === activeSoalIdx ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30' : 
                        'bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
            <button onClick={addNewSoal} className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-4 py-3 rounded-xl text-sm font-bold transition-colors border border-indigo-200 dark:border-indigo-500/30 border-dashed">
              <Plus className="w-4 h-4" /> Tambah Soal Baru
            </button>
          </div>

          {/* Kanan: Editor Soal Aktif */}
          <div className="xl:col-span-3 space-y-6">
            {!isEditing ? (
               <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                  <FileQuestion className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="font-bold text-slate-700 dark:text-slate-300 text-lg mb-2">Pilih atau Tambah Soal</h3>
                  <p className="text-slate-500 dark:text-slate-400">Silakan klik tombol "Tambah Soal Baru" atau pilih soal di panel navigasi.</p>
               </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                
                {/* Header Konfigurasi Soal */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-slate-800/50 flex flex-wrap justify-between items-center gap-4 transition-colors">
                  <h3 className="font-extrabold text-indigo-900 dark:text-indigo-400 text-lg flex items-center gap-3">
                    Soal Nomor {activeSoalIdx + 1}
                    {activeSoal.id && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-bold">Tersimpan</span>}
                  </h3>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jenis Soal:</label>
                      <select 
                        value={activeSoal.jenis || 'pg'}
                        onChange={(e) => updateLocalSoal({ jenis: e.target.value as any })}
                        className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer transition-colors"
                      >
                        <option value="pg">Pilihan Ganda</option>
                        <option value="pg_kompleks">PG Kompleks (Multi Jawaban)</option>
                        <option value="essay">Uraian / Essay</option>
                        <option value="bs">Benar / Salah</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bobot Skor:</label>
                      <input 
                        type="number" 
                        value={activeSoal.bobot_nilai || 2.5}
                        onChange={e => updateLocalSoal({ bobot_nilai: parseFloat(e.target.value) || 0 })} 
                        className="w-20 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6 lg:p-8 space-y-6">
                  
                  {/* Teks Pertanyaan */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2"><AlignLeft className="w-4 h-4 text-indigo-500"/> Teks Pertanyaan</label>
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden quill-custom-dark transition-colors">
                      <ReactQuill 
                        theme="snow" 
                        value={activeSoal.pertanyaan || ''}
                        onChange={val => updateLocalSoal({ pertanyaan: val })} 
                        className="h-40 pb-10" 
                      />
                    </div>
                    {/* Add Image support here later if needed */}
                  </div>

                  {/* Dynamic Answer Area Based on jenisSoal */}
                  {(activeSoal.jenis === 'pg' || activeSoal.jenis === 'pg_kompleks') && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-emerald-500"/> 
                        {activeSoal.jenis === 'pg' ? 'Opsi Jawaban (Pilih 1 Kunci yang Benar)' : 'Opsi Jawaban (Centang semua kunci yang benar)'}
                      </label>
                      <div className="space-y-3">
                        {activeSoal.opsiJawabans?.map((opsi, idx) => (
                          <div key={idx} className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${opsi.is_benar ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm shadow-emerald-500/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                            <div className="mt-2.5 ml-2">
                              <input 
                                type={activeSoal.jenis === 'pg' ? 'radio' : 'checkbox'} 
                                name={`kunci_${activeSoalIdx}`} 
                                checked={opsi.is_benar || false}
                                onChange={e => updateOpsiJawaban(idx, { is_benar: e.target.checked })} 
                                className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 cursor-pointer border-slate-300 dark:border-slate-600 rounded-sm" 
                              />
                            </div>
                            <div className="flex-1 flex gap-3">
                              <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black border transition-colors ${opsi.is_benar ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                {opsiLables[idx] || idx+1}
                              </div>
                              <input 
                                type="text" 
                                value={opsi.teks_opsi || ''}
                                onChange={e => updateOpsiJawaban(idx, { teks_opsi: e.target.value })} 
                                placeholder={`Ketik teks opsi ${opsiLables[idx] || idx+1}...`} 
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium dark:text-white transition-colors" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSoal.jenis === 'bs' && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-emerald-500"/> Tentukan Kunci Jawaban</label>
                      <div className="flex gap-4">
                        {activeSoal.opsiJawabans?.slice(0,2).map((opsi, idx) => (
                           <label key={idx} className={`flex-1 p-4 rounded-2xl border-2 shadow-sm cursor-pointer flex items-center gap-3 transition-colors ${opsi.is_benar ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-300'}`}>
                              <input 
                                type="radio" 
                                name={`kunci_bs_${activeSoalIdx}`} 
                                checked={opsi.is_benar || false}
                                onChange={() => updateOpsiJawaban(idx, { is_benar: true })}
                                className="w-5 h-5 text-emerald-500" 
                              />
                              <span className={`font-bold text-lg ${opsi.is_benar ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                {opsi.teks_opsi || (idx === 0 ? 'BENAR' : 'SALAH')}
                              </span>
                           </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSoal.jenis === 'essay' && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><Type className="w-4 h-4 text-amber-500"/> Rubrik / Kunci Jawaban Essay (Panduan Korektor)</label>
                      <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
                        {/* We use first option of opsiJawabans for essay rubric or add a special field in db. Assuming opsiJawabans[0].teks_opsi for now. */}
                        <textarea 
                          rows={4} 
                          value={activeSoal.opsiJawabans?.[0]?.teks_opsi || ''}
                          onChange={(e) => {
                             if (!activeSoal.opsiJawabans?.length) {
                                updateLocalSoal({ opsiJawabans: [{ teks_opsi: e.target.value, is_benar: true }] });
                             } else {
                                updateOpsiJawaban(0, { teks_opsi: e.target.value });
                             }
                          }}
                          placeholder="Ketik kata kunci atau langkah-langkah yang harus ada untuk mendapat nilai penuh..." 
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white transition-colors"
                        ></textarea>
                        <p className="text-xs text-amber-600 dark:text-amber-500/80 font-medium mt-2">Siswa akan diberikan kotak teks kosong untuk mengetik jawaban mereka. Kunci ini hanya panduan untuk Anda saat menilai manual.</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Actions for current Soal */}
                  <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
                     <button onClick={() => hapusSoal(activeSoalIdx)} className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4" /> Hapus Soal
                     </button>
                     <button 
                       onClick={saveCurrentSoal}
                       disabled={saveSoalMutation.isPending}
                       className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2">
                        {saveSoalMutation.isPending ? (
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                           <Save className="w-4 h-4" />
                        )}
                        Simpan Soal Ini
                     </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Bank Soal Saya (Guru)">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-end justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Bank Soal CBT</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Kelola paket soal ujian & kuis untuk kelas Anda.</p>
          </div>
          <button onClick={openCreatePaket} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <Plus className="w-4 h-4" /> Buat Paket Soal Baru
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

          {isListLoading ? (
            <div className="text-center py-12">
              <FileQuestion className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
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
                <div key={paket.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[15px] p-5 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all group cursor-pointer" onClick={() => openEditor(paket)}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-indigo-50 dark:bg-indigo-500/20 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400">
                      <FileQuestion className="w-5 h-5" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button onClick={() => openEditor(paket)} className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => deletePaket(paket.id)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1 leading-tight">{paket.judul}</h4>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">{mapelList?.find(m => m.id === paket.mapel_id?.toString())?.nama || 'Mapel'} • Tingkat {paket.tingkat}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-md whitespace-nowrap ${TIPE_BADGE[paket.tipe]?.color || 'bg-gray-100 text-gray-800'}`}>
                      {TIPE_BADGE[paket.tipe]?.label || paket.tipe}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {paket.soal?.length || 0} Soal
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Lengkapi data paket soal di bawah ini.</p>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Nama Paket Soal</label>
                <input type="text" value={createPaketForm.title} onChange={e => setCreatePaketForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Contoh: Kuis Fungsi Kuadrat" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Mata Pelajaran</label>
                  <select value={createPaketForm.mapel_id} onChange={e => setCreatePaketForm(prev => ({ ...prev, mapel_id: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="">Pilih Mata Pelajaran...</option>
                    {mapelList?.map(m => (
                      <option key={m.id} value={m.id}>{m.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Tingkat</label>
                  <select value={createPaketForm.tingkat} onChange={e => setCreatePaketForm(prev => ({ ...prev, tingkat: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
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
                  <option value="15 Menit">15 Menit</option>
                  <option value="30 Menit">30 Menit</option>
                  <option value="45 Menit">45 Menit</option>
                  <option value="60 Menit">60 Menit</option>
                  <option value="90 Menit">90 Menit</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Tipe Penggunaan</label>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => setCreatePaketForm(prev => ({ ...prev, tipe: 'ujian' }))}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-bold border transition-all ${
                      createPaketForm.tipe === 'ujian'
                        ? 'bg-red-50 dark:bg-red-500/20 border-red-400 dark:border-red-500 text-red-700 dark:text-red-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-200'
                    }`}>
                    <GraduationCap className={`w-5 h-5 ${createPaketForm.tipe === 'ujian' ? 'text-red-500' : ''}`} />
                    Ujian
                  </button>
                  <button onClick={() => setCreatePaketForm(prev => ({ ...prev, tipe: 'ulangan_harian' }))}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-bold border transition-all ${
                      createPaketForm.tipe === 'ulangan_harian'
                        ? 'bg-amber-50 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-200'
                    }`}>
                    <BookOpen className={`w-5 h-5 ${createPaketForm.tipe === 'ulangan_harian' ? 'text-amber-500' : ''}`} />
                    Ulangan
                  </button>
                  <button onClick={() => setCreatePaketForm(prev => ({ ...prev, tipe: 'kuis' }))}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-bold border transition-all ${
                      createPaketForm.tipe === 'kuis'
                        ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-200'
                    }`}>
                    <FileText className={`w-5 h-5 ${createPaketForm.tipe === 'kuis' ? 'text-emerald-500' : ''}`} />
                    Kuis
                  </button>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button onClick={() => setShowPurposeModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Batal
                </button>
                <button onClick={createPaket} disabled={!createPaketForm.title || !createPaketForm.time} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                  <Save className="w-4 h-4 inline mr-1.5" /> Buat Paket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
