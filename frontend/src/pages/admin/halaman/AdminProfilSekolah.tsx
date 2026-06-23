import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, Plus, Trash2, BookOpen, Target, User, Image as ImageIcon } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';

export default function AdminProfilSekolah() {
  const [activeTab, setActiveTab] = useState('sejarah');
  const [sejarahContent, setSejarahContent] = useState('<p>SMAS Muhammadiyah 1 Banyuwangi berdiri sejak...</p>');
  const [sambutanContent, setSambutanContent] = useState('<p>Assalamu’alaikum Warahmatullahi Wabarakatuh...</p>');

  return (
    <AdminLayout title="Pengaturan Profil Sekolah">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 mb-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button onClick={() => setActiveTab('sejarah')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'sejarah' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50'}`}>
            <BookOpen className="w-4 h-4" /> 1. Sejarah Singkat
          </button>
          <button onClick={() => setActiveTab('visimisi')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'visimisi' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50'}`}>
            <Target className="w-4 h-4" /> 2. Visi & Misi
          </button>
          <button onClick={() => setActiveTab('sambutan')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'sambutan' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50'}`}>
            <User className="w-4 h-4" /> 3. Sambutan Kepsek
          </button>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50/30 min-h-[500px]">
          
          {/* SEJARAH */}
          {activeTab === 'sejarah' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200">Teks Sejarah Sekolah</label>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <ReactQuill theme="snow" value={sejarahContent} onChange={setSejarahContent} className="h-80 pb-10" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200">Foto Utama Sejarah</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50 transition-colors cursor-pointer bg-white dark:bg-slate-900">
                  <ImageIcon className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200">Pilih Foto Lama / Gedung</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 dark:text-slate-400 mt-1">Format JPG/PNG (Landscape)</p>
                </div>
              </div>
            </div>
          )}

          {/* VISI MISI */}
          {activeTab === 'visimisi' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <label className="block text-sm font-bold text-slate-800 dark:text-white mb-2">Teks Visi Sekolah</label>
                <textarea rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" defaultValue="Terwujudnya Generasi Muslim yang Beriman, Bertaqwa, Berakhlak Mulia, Cerdas, dan Mandiri."></textarea>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <label className="block text-sm font-bold text-slate-800 dark:text-white">Daftar Misi Sekolah</label>
                  <button className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Tambah Misi
                  </button>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 group">
                      <div className="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 mt-1">{num}</div>
                      <textarea rows={2} className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="Melaksanakan pembelajaran dan bimbingan secara efektif sehingga setiap siswa berkembang secara optimal."></textarea>
                      <button className="p-2 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg mt-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SAMBUTAN */}
          {activeTab === 'sambutan' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1 space-y-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Nama Kepala Sekolah</label>
                    <input type="text" defaultValue="Drs. H. Sugeng, M.Pd" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">NIP / NBM</label>
                    <input type="text" defaultValue="19650412 199001 1 002" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Foto Kepala Sekolah</label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50 transition-colors cursor-pointer">
                      <User className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200">Upload Foto Profil</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 dark:text-slate-400 mt-1">Portrait, Maks 2MB</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="xl:col-span-2 space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200">Teks Isi Sambutan</label>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <ReactQuill theme="snow" value={sambutanContent} onChange={setSambutanContent} className="h-[400px] pb-10" />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex justify-end">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
            <Save className="w-4 h-4" /> Simpan Perubahan Profil
          </button>
        </div>

      </div>
    </AdminLayout>
  );
}
