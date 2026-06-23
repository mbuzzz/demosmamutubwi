import AdminLayout from '../../../../components/admin/AdminLayout';
import { Save, Plus, HelpCircle, ImageIcon, AlignLeft, CheckSquare, Type, Search, Edit, Trash2, FileQuestion, ArrowLeft, Clock, FileText, BookOpen, GraduationCap, X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import { type PaketSoal, type TipeUjian, MOCK_PAKET_SOAL, TIPE_BADGE } from '../../../../types/cbt';

const defaultPaket: PaketSoal[] = JSON.parse(JSON.stringify(MOCK_PAKET_SOAL.map(p => ({
  ...p,
  kelas: p.kelas === 'Kelas X' ? 'Kelas X-1' : p.kelas === 'Kelas XI' ? 'Kelas XI IPA' : p.kelas,
  soal: p.soal.map(s => ({ ...s, bobot: s.bobot || 2.5 })),
}))));

function generateId() {
  return crypto.randomUUID();
}

export default function GuruBankSoalEditor() {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [pakets, setPakets] = useState<PaketSoal[]>(defaultPaket);
  const [selectedPaket, setSelectedPaket] = useState<PaketSoal | null>(null);

  // Editor states
  const [activeSoalIdx, setActiveSoalIdx] = useState(0);
  const [jenisSoal, setJenisSoal] = useState('pg');
  const [search, setSearch] = useState('');

  // Modals
  const [showPurposeModal, setShowPurposeModal] = useState(false);
  const [createPaketForm, setCreatePaketForm] = useState({ title: '', mapel: 'Matematika Wajib', kelas: 'Kelas X-1', time: '', tipe: 'ujian' as TipeUjian });

  const filteredPakets = pakets.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  function openEditor(p: PaketSoal) {
    setSelectedPaket(p);
    setActiveSoalIdx(0);
    setView('editor');
  }

  function openCreatePaket() {
    setCreatePaketForm({ title: '', mapel: 'Matematika Wajib', kelas: 'Kelas X-1', time: '', tipe: 'ujian' });
    setShowPurposeModal(true);
  }

  function createPaket() {
    if (!createPaketForm.title || !createPaketForm.time) return;
    const newPaket: PaketSoal = {
      id: generateId(),
      ...createPaketForm,
      soalCount: 0,
      soal: [],
    };
    setPakets(prev => [...prev, newPaket]);
    setShowPurposeModal(false);
    openEditor(newPaket);
  }

  function deletePaket(id: string) {
    setPakets(prev => prev.filter(p => p.id !== id));
  }

  if (view === 'editor' && selectedPaket) {
    return (
      <AdminLayout title="Editor Butir Soal (CBT)">
        <div className="mb-6">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Bank Soal Saya
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white">{selectedPaket.title}</h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Total Soal: {selectedPaket.soal.length} Butir • Pilihan Ganda & Essay</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setView('list')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              <Save className="w-4 h-4" /> Simpan Bank Soal
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          
          {/* Kiri: Navigator Soal */}
          <div className="xl:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-indigo-500" /> Navigasi Soal</h3>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(Math.max(selectedPaket.soal.length, 1))].map((_, i) => (
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
            <button className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-4 py-3 rounded-xl text-sm font-bold transition-colors border border-indigo-200 dark:border-indigo-500/30 border-dashed">
              <Plus className="w-4 h-4" /> Tambah Soal Baru
            </button>
          </div>

          {/* Kanan: Editor Soal Aktif */}
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
              
              {/* Header Konfigurasi Soal */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-slate-800/50 flex flex-wrap justify-between items-center gap-4 transition-colors">
                <h3 className="font-extrabold text-indigo-900 dark:text-indigo-400 text-lg">
                  Soal Nomor {activeSoalIdx + 1}
                </h3>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jenis Soal:</label>
                    <select 
                      value={jenisSoal}
                      onChange={(e) => setJenisSoal(e.target.value)}
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
                    <input type="number" defaultValue="2.5" className="w-16 px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" />
                  </div>
                </div>
              </div>
              
              <div className="p-6 lg:p-8 space-y-6">
                
                {/* Teks Pertanyaan */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2"><AlignLeft className="w-4 h-4 text-indigo-500"/> Teks Pertanyaan</label>
                  <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden quill-custom-dark transition-colors">
                    <ReactQuill theme="snow" value="<p>Berapakah hasil dari 2log 8 + 3log 9?</p>" className="h-40 pb-10" />
                  </div>
                  <button className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <ImageIcon className="w-4 h-4" /> Sisipkan Gambar ke Pertanyaan
                  </button>
                </div>

                {/* Dynamic Answer Area Based on jenisSoal */}
                {jenisSoal === 'pg' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-emerald-500"/> Opsi Jawaban (Pilih 1 Kunci yang Benar)</label>
                    <div className="space-y-3">
                      {['A', 'B', 'C', 'D', 'E'].map((opsi, idx) => (
                        <div key={opsi} className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${idx === 1 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm shadow-emerald-500/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                          <div className="mt-2.5 ml-2">
                            <input type="radio" name="kunci_pg" defaultChecked={idx === 1} className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
                          </div>
                          <div className="flex-1 flex gap-3">
                            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black border transition-colors ${idx === 1 ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                              {opsi}
                            </div>
                            <input type="text" defaultValue={idx === 1 ? "5" : idx === 0 ? "4" : idx === 2 ? "6" : ""} placeholder={`Ketik teks opsi ${opsi}...`} className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium dark:text-white transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {jenisSoal === 'pg_kompleks' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-emerald-500"/> Opsi Jawaban (Centang semua kunci yang benar)</label>
                    <div className="space-y-3">
                      {['A', 'B', 'C', 'D'].map((opsi, idx) => (
                        <div key={opsi} className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${idx === 0 || idx === 2 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm shadow-emerald-500/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                          <div className="mt-2.5 ml-2">
                            <input type="checkbox" defaultChecked={idx === 0 || idx === 2} className="w-5 h-5 rounded text-emerald-500 focus:ring-emerald-500 cursor-pointer border-slate-300 dark:border-slate-600" />
                          </div>
                          <div className="flex-1 flex gap-3">
                            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black border transition-colors ${idx === 0 || idx === 2 ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white dark:bg-slate-900 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                              {opsi}
                            </div>
                            <input type="text" placeholder={`Ketik pernyataan opsi ${opsi}...`} className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium dark:text-white transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {jenisSoal === 'bs' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><CheckSquare className="w-4 h-4 text-emerald-500"/> Tentukan Kunci Jawaban</label>
                    <div className="flex gap-4">
                      <label className="flex-1 p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm cursor-pointer flex items-center gap-3 transition-colors">
                        <input type="radio" name="kunci_bs" defaultChecked className="w-5 h-5 text-emerald-500" />
                        <span className="font-bold text-lg text-emerald-700 dark:text-emerald-400">BENAR</span>
                      </label>
                      <label className="flex-1 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer flex items-center gap-3 hover:border-red-400 transition-colors">
                        <input type="radio" name="kunci_bs" className="w-5 h-5 text-red-500" />
                        <span className="font-bold text-lg text-slate-600 dark:text-slate-400">SALAH</span>
                      </label>
                    </div>
                  </div>
                )}

                {jenisSoal === 'essay' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><Type className="w-4 h-4 text-amber-500"/> Rubrik / Kunci Jawaban Essay (Panduan Korektor)</label>
                    <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4">
                      <textarea rows={4} placeholder="Ketik kata kunci atau langkah-langkah yang harus ada untuk mendapat nilai penuh..." className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white transition-colors"></textarea>
                      <p className="text-xs text-amber-600 dark:text-amber-500/80 font-medium mt-2">Siswa akan diberikan kotak teks kosong untuk mengetik jawaban mereka. Kunci ini hanya panduan untuk Anda saat menilai manual.</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
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
            <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">Bank Soal Matematika</h3>
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

          {filteredPakets.length === 0 ? (
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
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1 leading-tight">{paket.title}</h4>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">{paket.mapel} • {paket.kelas}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-md whitespace-nowrap ${TIPE_BADGE[paket.tipe].color}`}>
                      {TIPE_BADGE[paket.tipe].label}
                    </span>
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
                  <select value={createPaketForm.mapel} onChange={e => setCreatePaketForm(prev => ({ ...prev, mapel: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="Matematika Wajib">Matematika Wajib</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Kelas</label>
                  <select value={createPaketForm.kelas} onChange={e => setCreatePaketForm(prev => ({ ...prev, kelas: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="Kelas X-1">Kelas X-1</option>
                    <option value="Kelas X-2">Kelas X-2</option>
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
