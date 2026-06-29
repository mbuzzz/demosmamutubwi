import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, BookOpen, Image as ImageIcon, Loader2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from 'react';
import { useProfilSekolah, useUpdateProfilSekolah } from '../../../hooks/useProfilSekolah';

export default function AdminProfilSekolah() {
  const [activeTab, setActiveTab] = useState('sejarah');
  const [content, setContent] = useState('');
  const [gambar, setGambar] = useState<File | null>(null);

  const { data: profil, isLoading } = useProfilSekolah();
  const updateProfil = useUpdateProfilSekolah();

  useEffect(() => {
    if (profil) {
      setContent(profil.konten || '');
    }
  }, [profil]);

  const handleSave = async () => {
    try {
      if (gambar) {
        const formData = new FormData();
        formData.append('konten', content);
        formData.append('gambar_utama', gambar);
        await updateProfil.mutateAsync(formData);
      } else {
        await updateProfil.mutateAsync({ konten: content });
      }
    } catch {
      // Error handled by hook
    }
  };

  return (
    <AdminLayout title="Pengaturan Profil Sekolah">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 mb-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button onClick={() => setActiveTab('sejarah')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'sejarah' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <BookOpen className="w-4 h-4" /> Profil & Sejarah
          </button>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 min-h-[500px]">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Konten Profil (Bisa berisi Sejarah, Visi Misi, dll)</label>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <ReactQuill theme="snow" value={content} onChange={setContent} className="h-80 pb-10 dark:text-white" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Foto Utama Gedung / Profil</label>
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer bg-white dark:bg-slate-900 block">
                  <input type="file" className="hidden" accept="image/*" onChange={e => setGambar(e.target.files?.[0] || null)} />
                  <ImageIcon className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Pilih Foto Baru</p>
                  <p className="text-[11px] text-slate-500 mt-1">Format JPG/PNG</p>
                </label>
                {profil?.gambar_utama && !gambar && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2">Foto Saat Ini:</p>
                    <img src={profil.gambar_utama} alt="Profil" className="w-full rounded-lg border border-slate-200 dark:border-slate-700" />
                  </div>
                )}
                {gambar && (
                  <div className="mt-4">
                    <p className="text-xs text-emerald-500 font-medium mb-2">Foto Terpilih:</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{gambar.name}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex justify-end">
          <button onClick={handleSave} disabled={updateProfil.isPending || isLoading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50">
            {updateProfil.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Perubahan Profil
          </button>
        </div>

      </div>
    </AdminLayout>
  );
}
