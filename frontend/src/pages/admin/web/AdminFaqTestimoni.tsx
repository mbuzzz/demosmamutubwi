import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, HelpCircle, MessageSquareQuote } from 'lucide-react';
import { useState } from 'react';

export default function AdminFaqTestimoni() {
  const [activeTab, setActiveTab] = useState('testimoni');

  return (
    <AdminLayout title="Manajemen Testimoni & FAQ">
      <div className="bg-white rounded-[15px] shadow-card overflow-hidden border border-slate-100">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto">
          <button onClick={() => setActiveTab('testimoni')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'testimoni' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
            <MessageSquareQuote className="w-4 h-4" /> 1. Testimoni Alumni & Wali
          </button>
          <button onClick={() => setActiveTab('faq')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'faq' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
            <HelpCircle className="w-4 h-4" /> 2. Pertanyaan Umum (FAQ)
          </button>
        </div>

        <div className="p-6 bg-slate-50/30 min-h-[500px]">
          
          {/* TESTIMONI */}
          {activeTab === 'testimoni' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800">Daftar Testimoni</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Testimoni ini akan ditampilkan secara acak di halaman Beranda dan SPMB.</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah Testimoni
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2].map((item) => (
                  <div key={item} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button className="p-1.5 bg-slate-100 text-slate-500 hover:text-indigo-600 rounded"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 bg-slate-100 text-slate-500 hover:text-red-600 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-slate-800">Ahmad Budi Santoso</h4>
                        <p className="text-xs font-bold text-indigo-600 mb-2">Alumni 2021 • Mahasiswa UI</p>
                        <p className="text-sm text-slate-600 italic leading-relaxed">"Sekolah di SMAS Muh 1 sangat menyenangkan. Guru-gurunya sangat mendukung potensi siswa, tidak hanya akademik tapi juga karakter Islami."</p>
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
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800">Tanya Jawab (FAQ)</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Pertanyaan yang sering diajukan untuk halaman Pendaftaran (SPMB).</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah FAQ
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { q: "Kapan pendaftaran siswa baru mulai dibuka?", a: "Pendaftaran gelombang Inden biasanya dimulai pada bulan Januari." },
                  { q: "Apakah ada asrama/boarding school?", a: "Saat ini kami fokus pada sekolah reguler *full day school* dan belum memiliki fasilitas asrama." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex gap-4 group">
                    <div className="flex-1 space-y-2">
                      <input type="text" defaultValue={item.q} className="w-full px-3 py-2 bg-slate-50 border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded-lg text-sm font-bold text-slate-800 focus:outline-none" />
                      <textarea rows={2} defaultValue={item.a} className="w-full px-3 py-2 bg-slate-50 border border-transparent hover:border-slate-200 focus:border-indigo-500 rounded-lg text-sm text-slate-600 focus:outline-none"></textarea>
                    </div>
                    <div className="pt-2">
                      <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
