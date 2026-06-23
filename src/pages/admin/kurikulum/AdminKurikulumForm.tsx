import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { 
  Save, ArrowLeft, Calculator, Settings, Plus, Trash2, 
  CheckCircle, Percent, BookOpen, Layers, GripVertical, 
  Layout, Eye, AlignLeft, Image, LayoutTemplate, FileText, PenTool, X
} from 'lucide-react';

export default function AdminKurikulumForm() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('umum');
  
  // Tab 1: Penilaian
  const [komponen, setKomponen] = useState([
    { id: 1, nama: 'Nilai Tugas / Harian', bobot: 30 },
    { id: 2, nama: 'Ujian Tengah Semester (UTS)', bobot: 30 },
    { id: 3, nama: 'Ujian Akhir Semester (UAS)', bobot: 40 },
  ]);

  const [gradeRules] = useState([
    { id: 1, huruf: 'A', min: 90, max: 100, predikat: 'Sangat Baik' },
    { id: 2, huruf: 'B', min: 80, max: 89, predikat: 'Baik' },
    { id: 3, huruf: 'C', min: 70, max: 79, predikat: 'Cukup' },
    { id: 4, huruf: 'D', min: 0, max: 69, predikat: 'Kurang' },
  ]);

  // Tab 2: Mapel
  const [kelompokMapel] = useState([
    {
      id: 1, 
      nama: 'Kelompok A (Muatan Nasional)', 
      mapels: [
        { id: 101, kode: 'PAI', nama: 'Pendidikan Agama Islam', kkm: 75 },
        { id: 102, kode: 'PPKN', nama: 'Pendidikan Pancasila', kkm: 75 },
        { id: 103, kode: 'B-IND', nama: 'Bahasa Indonesia', kkm: 75 },
      ]
    },
    {
      id: 2, 
      nama: 'Kelompok B (Muatan Kewilayahan)', 
      mapels: [
        { id: 201, kode: 'S-BDP', nama: 'Seni Budaya', kkm: 70 },
        { id: 202, kode: 'PJOK', nama: 'Pendidikan Jasmani', kkm: 75 },
      ]
    }
  ]);

  // Tab 3: Rapor Builder
  // const [raporBlocks] = useState([ ... ]); // Removing old unused state

  const addKomponen = () => setKomponen([...komponen, { id: Date.now(), nama: 'Ujian Baru', bobot: 0 }]);
  const removeKomponen = (id: number) => setKomponen(komponen.filter(k => k.id !== id));
  const totalBobot = komponen.reduce((sum, item) => sum + Number(item.bobot), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalBobot !== 100) {
      alert('Total Bobot Penilaian harus persis 100%!');
      return;
    }
    alert('Konfigurasi Kurikulum Lengkap berhasil disimpan!');
    navigate('/panel/kurikulum');
  };

  return (
    <AdminLayout title="Detail & Builder Kurikulum">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/panel/kurikulum" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
        </Link>
        <button onClick={handleSubmit} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
          <Save className="w-4 h-4" /> Simpan Kurikulum
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button onClick={() => setActiveTab('umum')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'umum' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50'}`}>
            <Settings className="w-4 h-4" /> 1. Identitas & Penilaian
          </button>
          <button onClick={() => setActiveTab('mapel')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'mapel' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50'}`}>
            <BookOpen className="w-4 h-4" /> 2. Struktur Mata Pelajaran
          </button>
          <button onClick={() => setActiveTab('rapor')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'rapor' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50'}`}>
            <Layout className="w-4 h-4" /> 3. Builder Template Rapor
          </button>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50/30">
          
          {/* TAB 1: IDENTITAS & PENILAIAN */}
          {activeTab === 'umum' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Identitas Kurikulum</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Nama Kurikulum</label>
                      <input type="text" defaultValue="Kurikulum Merdeka 2024" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Fase / Kelas Target</label>
                      <input type="text" defaultValue="Fase E (Kelas X)" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Status Aktif</label>
                      <select className="w-full px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="aktif">Aktif Digunakan</option>
                        <option value="draft">Draft / Nonaktif</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Calculator className="w-4 h-4 text-indigo-500" /> Rumus Komponen Ujian</h3>
                    <button type="button" onClick={addKomponen} className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Tambah Ujian
                    </button>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {komponen.map((k, index) => (
                      <div key={k.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">{index + 1}</div>
                        <div className="flex-1">
                          <input type="text" value={k.nama} onChange={(e) => { const n = [...komponen]; n[index].nama = e.target.value; setKomponen(n); }} className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm focus:ring-2 focus:ring-indigo-500 font-medium" />
                        </div>
                        <div className="w-32 relative">
                          <input type="number" value={k.bobot} onChange={(e) => { const n = [...komponen]; n[index].bobot = Number(e.target.value); setKomponen(n); }} className="w-full pl-3 pr-8 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm focus:ring-2 focus:ring-indigo-500 text-right font-bold text-indigo-600" />
                          <Percent className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <button type="button" onClick={() => removeKomponen(k.id)} className="p-2 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>

                  <div className={`p-4 rounded-xl flex items-center justify-between border ${totalBobot === 100 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <div>
                      <div className="font-bold text-sm text-slate-800 dark:text-white">Total Bobot Penilaian</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Harus tepat 100%</div>
                    </div>
                    <div className={`text-2xl font-black flex items-center gap-2 ${totalBobot === 100 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {totalBobot === 100 && <CheckCircle className="w-6 h-6" />}
                      {totalBobot}%
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-500" /> Logika Kelulusan & Predikat (Otomatis Rapor)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Nilai KKM Default</label>
                      <input type="number" defaultValue="75" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Metode Remedial</label>
                      <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                        <option>Maksimal setara KKM</option>
                        <option>Nilai murni ujian remedial</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                        <tr>
                          <th className="px-4 py-3 w-16 text-center">Huruf</th>
                          <th className="px-4 py-3">Rentang Nilai</th>
                          <th className="px-4 py-3">Capaian / Predikat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {gradeRules.map(rule => (
                          <tr key={rule.id}>
                            <td className="px-4 py-3 text-center font-bold text-indigo-600 bg-indigo-50/30">{rule.huruf}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <input type="number" value={rule.min} className="w-16 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs text-center" readOnly/>
                                <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400">-</span>
                                <input type="number" value={rule.max} className="w-16 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs text-center" readOnly/>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <input type="text" value={rule.predikat} className="w-full px-2 py-1 border border-slate-200 dark:border-slate-700 rounded text-xs" readOnly/>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STRUKTUR MAPEL */}
          {activeTab === 'mapel' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">Pemetaan Mata Pelajaran Kurikulum</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Atur pengelompokan Mapel beserta KKM spesifik masing-masing jika berbeda dengan KKM Default.</p>
                </div>
                <button className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Tambah Kelompok
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {kelompokMapel.map((kel) => (
                  <div key={kel.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center">
                      <h4 className="font-bold text-indigo-800 flex items-center gap-2"><Layers className="w-4 h-4" /> {kel.nama}</h4>
                      <div className="flex gap-1">
                        <button className="p-1 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-600"><Plus className="w-4 h-4" /></button>
                        <button className="p-1 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="p-4">
                      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                        <thead className="text-xs uppercase font-semibold text-slate-400 dark:text-slate-500 dark:text-slate-400">
                          <tr>
                            <th className="pb-2">Kode</th>
                            <th className="pb-2">Nama Mapel</th>
                            <th className="pb-2 text-center">KKM Khusus</th>
                            <th className="pb-2 text-right"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {kel.mapels.map(m => (
                            <tr key={m.id} className="group">
                              <td className="py-2 font-mono text-xs text-slate-500 dark:text-slate-400">{m.kode}</td>
                              <td className="py-2 font-medium text-slate-800 dark:text-white">{m.nama}</td>
                              <td className="py-2 text-center">
                                <input type="number" defaultValue={m.kkm} className="w-14 px-1 py-0.5 text-center bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-indigo-500 outline-none" />
                              </td>
                              <td className="py-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-red-500 hover:text-red-700"><Trash2 className="w-3.5 h-3.5" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button className="w-full mt-4 py-2 border border-dashed border-indigo-200 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
                        + Masukkan Mapel Baru ke Kelompok Ini
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RAPOR BUILDER (CANVA STYLE) */}
          {activeTab === 'rapor' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Kiri: Widget Palette */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-24">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 text-white">
                    <h3 className="font-bold flex items-center gap-2"><Layout className="w-4 h-4" /> Elemen Rapor</h3>
                    <p className="text-[10px] text-indigo-100 mt-1 opacity-90">Seret elemen ini ke kanvas kertas di sebelah kanan.</p>
                  </div>
                  <div className="p-4 space-y-3 bg-slate-50 dark:bg-slate-800/50/50">
                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-3 cursor-grab hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md transition-all active:cursor-grabbing">
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg"><Image className="w-4 h-4 text-slate-500 dark:text-slate-400" /></div> Kop Surat Sekolah
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-3 cursor-grab hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md transition-all active:cursor-grabbing">
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg"><AlignLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" /></div> Biodata Peserta Didik
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-3 cursor-grab hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md transition-all active:cursor-grabbing">
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg"><LayoutTemplate className="w-4 h-4 text-slate-500 dark:text-slate-400" /></div> Tabel Nilai Utama (100)
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-3 cursor-grab hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md transition-all active:cursor-grabbing">
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg"><FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /></div> Teks Paragraf Bebas
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-3 cursor-grab hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md transition-all active:cursor-grabbing">
                      <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg"><PenTool className="w-4 h-4 text-slate-500 dark:text-slate-400" /></div> Area Tanda Tangan
                    </div>
                  </div>
                </div>
              </div>

              {/* Kanan: Canvas A4 */}
              <div className="lg:col-span-3 flex justify-center bg-slate-200 dark:bg-slate-700/50 p-6 rounded-[20px] border border-slate-200 dark:border-slate-700 shadow-inner overflow-x-auto">
                <div className="w-full max-w-[800px] bg-white dark:bg-slate-900 shadow-2xl relative aspect-[1/1.414] scale-95 origin-top text-slate-900 dark:text-white font-serif border border-slate-300 dark:border-slate-600 group">
                  
                  {/* Action Bar overlay */}
                  <div className="absolute -top-12 left-0 w-full flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Ukuran: A4 (210 x 297 mm)</div>
                    <div className="flex gap-2">
                      <button className="bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-1"><Trash2 className="w-3 h-3 text-red-500"/> Bersihkan Kanvas</button>
                      <button className="bg-indigo-600 text-white px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1"><Eye className="w-3 h-3"/> Preview PDF Real</button>
                    </div>
                  </div>

                  {/* MOCKUP CONTENT ON CANVAS */}
                  <div className="p-12 h-full flex flex-col gap-6">
                    
                    {/* Element 1: Kop Surat (Hoverable) */}
                    <div className="relative border-2 border-transparent hover:border-indigo-400 p-2 cursor-move transition-colors rounded">
                      <div className="absolute -left-3 -top-3 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 shadow-sm hidden hover:flex"><GripVertical className="w-3 h-3" /></div>
                      <div className="absolute -right-3 -top-3 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 shadow-sm hidden hover:flex cursor-pointer"><X className="w-3 h-3" /></div>
                      
                      <div className="text-center border-b-[3px] border-slate-800 pb-4">
                        <h1 className="text-xl font-bold uppercase tracking-widest mb-1">Laporan Hasil Belajar Siswa</h1>
                        <h2 className="text-lg font-bold">SMAS MUHAMMADIYAH 1 BANYUWANGI</h2>
                      </div>
                    </div>

                    {/* Element 2: Biodata */}
                    <div className="relative border-2 border-transparent hover:border-indigo-400 p-2 cursor-move transition-colors rounded">
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-semibold">
                        <div className="flex"><span className="w-32">Nama Sekolah</span> <span>: [NAMA_SEKOLAH]</span></div>
                        <div className="flex"><span className="w-32">Kelas</span> <span>: [NAMA_KELAS]</span></div>
                        <div className="flex"><span className="w-32">Nama Peserta Didik</span> <span>: [NAMA_SISWA]</span></div>
                        <div className="flex"><span className="w-32">Semester</span> <span>: [SEMESTER_AKTIF]</span></div>
                      </div>
                    </div>

                    {/* Element 3: Tabel Nilai Utama */}
                    <div className="relative border-2 border-transparent hover:border-indigo-400 p-2 cursor-move transition-colors rounded">
                      <h3 className="font-bold text-sm mb-2 uppercase">A. Nilai Akademik</h3>
                      <table className="w-full border-collapse border border-slate-400 text-xs text-center">
                        <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                          <td className="border border-slate-400 p-2 w-10">No</td>
                          <td className="border border-slate-400 p-2 text-left">Mata Pelajaran</td>
                          <td className="border border-slate-400 p-2">KKM</td>
                          <td className="border border-slate-400 p-2">Nilai Akhir</td>
                          <td className="border border-slate-400 p-2">Predikat</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-400 p-2 text-slate-400 dark:text-slate-500 dark:text-slate-400" colSpan={5}>[TABEL DI-GENERATE OTOMATIS OLEH SISTEM BERDASARKAN KELOMPOK MAPEL]</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-400 p-4" colSpan={5}></td>
                        </tr>
                      </table>
                    </div>

                    {/* Dropzone Hint */}
                    <div className="flex-1 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-lg flex items-center justify-center m-2 min-h-[100px]">
                      <span className="text-indigo-400 font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4"/> Tarik elemen ke area ini</span>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}
