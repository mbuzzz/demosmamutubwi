import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, HelpCircle, MessageSquareQuote } from 'lucide-react';
import { useState } from 'react';

export default function AdminFaqTestimoni() {
  const [activeTab, setActiveTab] = useState('testimoni');

  return (
    <AdminLayout title="Manajemen Testimoni & FAQ">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto bg-slate-50/50 dark:bg-slate-900/50">
          <button onClick={() => setActiveTab('testimoni')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-[3px] transition-colors ${activeTab === 'testimoni' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <MessageSquareQuote className="w-4 h-4" /> 1. Testimoni Alumni & Wali
          </button>
          <button onClick={() => setActiveTab('faq')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-[3px] transition-colors ${activeTab === 'faq' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <HelpCircle className="w-4 h-4" /> 2. Pertanyaan Umum (FAQ)
          </button>
        </div>

        <div className="p-6 bg-slate-50/50 dark:bg-slate-900 min-h-[500px]">
          
          {/* TESTIMONI */}
          {activeTab === 'testimoni' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Daftar Testimoni</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Testimoni ini akan ditampilkan secara acak di halaman Beranda dan SPMB.</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah Testimoni
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map((item) => (
                  <div key={item} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative group hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-indigo-600 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-1">Ahmad Budi Santoso</h4>
                        <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">Alumni 2021 • Mahasiswa UI</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">"Sekolah di SMAS Muh 1 sangat menyenangkan. Guru-gurunya sangat mendukung potensi siswa, tidak hanya akademik tapi juga karakter Islami."</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Tanya Jawab (FAQ)</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pertanyaan yang sering diajukan untuk halaman Pendaftaran (SPMB).</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah FAQ
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { q: "Kapan pendaftaran siswa baru mulai dibuka?", a: "Pendaftaran gelombang Inden biasanya dimulai pada bulan Januari." },
                  { q: "Apakah ada asrama/boarding school?", a: "Saat ini kami fokus pada sekolah reguler *full day school* dan belum memiliki fasilitas asrama." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 flex gap-4 group hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                    <div className="flex-1 space-y-3">
                      <input type="text" defaultValue={item.q} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-indigo-500 rounded-xl text-sm font-bold text-slate-800 dark:text-white focus:outline-none transition-colors" />
                      <textarea rows={2} defaultValue={item.a} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-indigo-500 rounded-xl text-sm text-slate-600 dark:text-slate-300 focus:outline-none transition-colors"></textarea>
                    </div>
                    <div className="pt-2">
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}
