import AdminLayout from '../../../../components/admin/AdminLayout';
import { Save, Plus, HelpCircle, Image as ImageIcon } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function GuruBankSoalEditor() {
  return (
    <AdminLayout title="Editor Butir Soal (CBT)">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white">PTS Matematika Ganjil</h2>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">Total Soal: 40 Butir • Pilihan Ganda</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <Save className="w-4 h-4" /> Simpan Bank Soal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Kiri: Navigator Soal */}
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Navigasi Soal</h3>
          <div className="grid grid-cols-5 gap-2">
            {[...Array(20)].map((_, i) => (
              <button 
                key={i} 
                className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-colors border
                  ${i === 0 ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30' : 
                    i < 5 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' : 
                    'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-slate-800/50 flex justify-between items-center">
              <h3 className="font-extrabold text-indigo-900 dark:text-indigo-400 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" /> Soal Nomor 1
              </h3>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                Bobot Nilai: <input type="number" defaultValue="2.5" className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center" />
              </div>
            </div>
            
            <div className="p-6 lg:p-8 space-y-6">
              
              {/* Pertanyaan */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Teks Pertanyaan</label>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <ReactQuill theme="snow" value="<p>Berapakah hasil dari 2log 8 + 3log 9?</p>" className="h-40 pb-10" />
                </div>
                <button className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <ImageIcon className="w-4 h-4" /> Sisipkan Gambar ke Soal
                </button>
              </div>

              {/* Pilihan Ganda */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Opsi Jawaban (Pilih Kunci yang Benar)</label>
                <div className="space-y-3">
                  {['A', 'B', 'C', 'D', 'E'].map((opsi, idx) => (
                    <div key={opsi} className={`flex items-start gap-3 p-3 rounded-2xl border transition-all ${idx === 1 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-sm shadow-emerald-500/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                      <div className="mt-2.5 ml-2">
                        <input type="radio" name="kunci" defaultChecked={idx === 1} className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
                      </div>
                      <div className="flex-1 flex gap-3">
                        <div className="w-10 h-10 shrink-0 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          {opsi}
                        </div>
                        <input type="text" defaultValue={idx === 1 ? "5" : idx === 0 ? "4" : idx === 2 ? "6" : ""} placeholder={`Ketik teks opsi ${opsi}...`} className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
