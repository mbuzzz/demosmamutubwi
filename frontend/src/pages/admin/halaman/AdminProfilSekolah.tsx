import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, Image as ImageIcon, Loader2, School, Target, Quote } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useMemo, useState } from 'react';
import { getFileUrl } from '../../../lib/api';
import { useProfilSekolah, useUpdateProfilSekolah } from '../../../hooks/useProfilSekolah';

interface FormState {
  sejarah_teks: string;
  visi_teks: string;
  misi_text: string;
  kepsek_nama: string;
  kepsek_nip: string;
  kepsek_sambutan: string;
}

export default function AdminProfilSekolah() {
  const { data: profil, isLoading } = useProfilSekolah();
  const updateProfil = useUpdateProfilSekolah();

  const [form, setForm] = useState<FormState>({
    sejarah_teks: '',
    visi_teks: '',
    misi_text: '',
    kepsek_nama: '',
    kepsek_nip: '',
    kepsek_sambutan: '',
  });
  const [sejarahFoto, setSejarahFoto] = useState<File | null>(null);
  const [kepsekFoto, setKepsekFoto] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'sejarah' | 'visimisi' | 'sambutan'>('sejarah');

  useEffect(() => {
    if (!profil) return;
    setForm({
      sejarah_teks: profil.sejarah_teks || '',
      visi_teks: profil.visi_teks || '',
      misi_text: (profil.misi_list || []).join('\n'),
      kepsek_nama: profil.kepsek_nama || '',
      kepsek_nip: profil.kepsek_nip || '',
      kepsek_sambutan: profil.kepsek_sambutan || '',
    });
  }, [profil]);

  const misiPreview = useMemo(
    () =>
      form.misi_text
        .split('\n')
        .map((m) => m.trim())
        .filter(Boolean),
    [form.misi_text]
  );

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const payload = new FormData();
    payload.append('sejarah_teks', form.sejarah_teks);
    payload.append('visi_teks', form.visi_teks);
    payload.append('misi_list', JSON.stringify(misiPreview));
    payload.append('kepsek_nama', form.kepsek_nama);
    payload.append('kepsek_nip', form.kepsek_nip);
    payload.append('kepsek_sambutan', form.kepsek_sambutan);

    if (sejarahFoto) payload.append('sejarah_foto', sejarahFoto);
    if (kepsekFoto) payload.append('kepsek_foto', kepsekFoto);

    try {
      await updateProfil.mutateAsync(payload);
      setSejarahFoto(null);
      setKepsekFoto(null);
    } catch {
      // handled in hook
    }
  };

  return (
    <AdminLayout title="Pengaturan Profil Sekolah">
      <div className="space-y-6">
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-[15px] border border-slate-100 dark:border-slate-800 p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-slate-900 rounded-[15px] border border-slate-100 dark:border-slate-800 p-6">

            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-6 pb-2 overflow-x-auto">
              <button onClick={() => setActiveTab('sejarah')} className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors ${activeTab === 'sejarah' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Sejarah Sekolah</button>
              <button onClick={() => setActiveTab('visimisi')} className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors ${activeTab === 'visimisi' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Visi & Misi</button>
              <button onClick={() => setActiveTab('sambutan')} className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors ${activeTab === 'sambutan' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Sambutan Kepsek</button>
            </div>

              {activeTab === 'sejarah' && (<>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-500" />
                Sejarah Sekolah
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <ReactQuill
                    theme="snow"
                    value={form.sejarah_teks}
                    onChange={(value) => setField('sejarah_teks', value)}
                    className="h-72 pb-10 dark:text-white bg-white dark:bg-slate-900 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Foto Sejarah / Gedung</label>
                  <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer bg-white dark:bg-slate-900 block">
                    <input type="file" className="hidden" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => setSejarahFoto(e.target.files?.[0] || null)} />
                    <ImageIcon className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{sejarahFoto ? 'Foto baru dipilih' : 'Pilih Foto Baru'}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{sejarahFoto ? sejarahFoto.name : 'JPG/PNG/WEBP, max 2MB'}</p>
                  </label>
                  {profil?.sejarah_foto && !sejarahFoto && (
                    <img src={getFileUrl(profil.sejarah_foto)} alt="Foto sejarah" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 object-cover max-h-56" />
                  )}
                </div>
              </div>
              </>)}
              {activeTab === 'visimisi' && (<>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                Visi & Misi
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Visi Sekolah</label>
                  <textarea
                    value={form.visi_teks}
                    onChange={(e) => setField('visi_teks', e.target.value)}
                    rows={6}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan visi sekolah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Misi Sekolah (1 baris = 1 misi)</label>
                  <textarea
                    value={form.misi_text}
                    onChange={(e) => setField('misi_text', e.target.value)}
                    rows={6}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={'Misi 1\nMisi 2\nMisi 3'}
                  />
                </div>
              </div>
              </>)}
              {activeTab === 'sambutan' && (<>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Quote className="w-5 h-5 text-purple-500" />
                Sambutan Kepala Sekolah
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nama Kepala Sekolah</label>
                    <input
                      type="text"
                      value={form.kepsek_nama}
                      onChange={(e) => setField('kepsek_nama', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nama kepala sekolah"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">NIP Kepala Sekolah</label>
                    <input
                      type="text"
                      value={form.kepsek_nip}
                      onChange={(e) => setField('kepsek_nip', e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="NIP"
                    />
                  </div>
                  <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer bg-white dark:bg-slate-900 block">
                    <input type="file" className="hidden" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(e) => setKepsekFoto(e.target.files?.[0] || null)} />
                    <ImageIcon className="w-7 h-7 text-indigo-400 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{kepsekFoto ? 'Foto baru dipilih' : 'Pilih Foto Kepala Sekolah'}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{kepsekFoto ? kepsekFoto.name : 'JPG/PNG/WEBP, max 2MB'}</p>
                  </label>
                  {profil?.kepsek_foto && !kepsekFoto && (
                    <img src={getFileUrl(profil.kepsek_foto)} alt="Foto kepala sekolah" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 object-cover max-h-56" />
                  )}
                </div>

                <div className="xl:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Isi Sambutan</label>
                  <ReactQuill
                    theme="snow"
                    value={form.kepsek_sambutan}
                    onChange={(value) => setField('kepsek_sambutan', value)}
                    className="h-72 pb-10 dark:text-white bg-white dark:bg-slate-900 rounded-xl"
                  />
                </div>
              </div>
              </>)}
            </div>
          </>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-[15px] border border-slate-100 dark:border-slate-800 p-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateProfil.isPending || isLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            {updateProfil.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan Profil
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
