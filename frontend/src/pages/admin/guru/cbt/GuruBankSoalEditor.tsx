import AdminLayout from '../../../../components/admin/AdminLayout';
import { Save, Plus, HelpCircle, Image as ImageIcon, AlignLeft, CheckSquare, Type } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';

export default function GuruBankSoalEditor() {
  const [jenisSoal, setJenisSoal] = useState('pg');

  return (
    <AdminLayout title="Editor Butir Soal (CBT)">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">PTS Matematika Ganjil</h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Total Soal: 40 Butir • Pilihan Ganda & Essay</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <Save className="w-4 h-4" /> Simpan Bank Soal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Kiri: Navigator Soal */}
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24 transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-indigo-500" /> Navigasi Soal</h3>
          <div className="grid grid-cols-5 gap-2">
            {[...Array(20)].map((_, i) => (
              <button 
                key={i} 
                className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-colors border
                  ${i === 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30' : 
                    i < 5 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' : 
                    'bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
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
                Soal Nomor 1
              </h3>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jenis Soal:</label>
                  <select 
                    value={jenisSoal}
                    onChange={(e) => setJenisSoal(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer transition-colors"
                  >
                    <option value="pg">Pilihan Ganda</option>
                    <option value="pg_kompleks">PG Kompleks (Multi Jawaban)</option>
                    <option value="essay">Uraian / Essay</option>
                    <option value="bs">Benar / Salah</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bobot Skor:</label>
                  <input type="number" defaultValue="2.5" className="w-16 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center text-sm font-bold dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors" />
                </div>
              </div>
            </div>
            
            <div className="p-6 lg:p-8 space-y-6">
              
              {/* Teks Pertanyaan */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2"><AlignLeft className="w-4 h-4 text-indigo-500"/> Teks Pertanyaan</label>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden quill-custom-dark transition-colors">
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
                          <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black border transition-colors ${idx === 1 ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
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
                          <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black border transition-colors ${idx === 0 || idx === 2 ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
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

