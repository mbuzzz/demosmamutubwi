import AdminLayout from '../../../../components/admin/AdminLayout';
import { Search, Trash2, BookOpen, UploadCloud, Eye, Edit, Plus, ArrowLeft, Save, AlignLeft, Video, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface MateriItem {
  id: string;
  judul: string;
  tipe: 'teks' | 'pdf' | 'ppt' | 'video' | 'link';
  tanggal: string;
  dibaca: string;
  keterangan: string;
}

const initialMateri: MateriItem[] = [
  { id: 'm1', judul: 'Bab 1 - Sifat Logaritma', tipe: 'pdf', tanggal: '12 Jul 2024', dibaca: '30/32 Siswa', keterangan: 'Format PDF • Berisi kumpulan latihan soal eksponen' },
  { id: 'm2', judul: 'Catatan Rumus Cepat Logaritma', tipe: 'teks', tanggal: '15 Jul 2024', dibaca: '18/32 Siswa', keterangan: 'Format TEKS • Trik pemecahan soal ujian' },
  { id: 'm3', judul: 'Video Pembelajaran Vektor 2D', tipe: 'video', tanggal: '18 Jul 2024', dibaca: '24/32 Siswa', keterangan: 'Format VIDEO • Penjelasan visual arah gaya' },
  { id: 'm4', judul: 'Tautan Bahan Ajar Kemdikbud', tipe: 'link', tanggal: '20 Jul 2024', dibaca: '15/32 Siswa', keterangan: 'Format LINK • Referensi luar kurikulum' },
];

export default function GuruMateri() {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [materiList, setMateriList] = useState<MateriItem[]>(initialMateri);
  const [judul, setJudul] = useState('');
  const [tipe, setTipe] = useState<'teks' | 'pdf' | 'ppt' | 'video' | 'link'>('teks');
  const [content, setContent] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [search, setSearch] = useState('');

  const filtered = materiList.filter(m => 
    m.judul.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!judul) return;
    const newMateri: MateriItem = {
      id: `m-${Date.now()}`,
      judul,
      tipe,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      dibaca: '0/32 Siswa',
      keterangan: tipe === 'pdf' ? 'Format PDF • File terunggah' : tipe === 'ppt' ? 'Format PPT • File presentasi' : tipe === 'video' ? 'Format VIDEO • Tautan tersemat' : tipe === 'link' ? 'Format LINK • Link eksternal' : 'Format TEKS'
    };
    setMateriList([newMateri, ...materiList]);
    setView('list');
    setJudul('');
    setTipe('teks');
    setContent('');
    setFileInput(null);
    setEmbedUrl('');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus materi ini?')) return;
    setMateriList(materiList.filter(m => m.id !== id));
  };

  if (view === 'form') {
    return (
      <AdminLayout title="Buat Materi Baru">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <Save className="w-4 h-4" /> Publikasikan Materi
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-indigo-500" /> Konten Materi Pembelajaran
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Judul / Topik Materi</label>
                  <input 
                    type="text" 
                    value={judul} 
                    onChange={e => setJudul(e.target.value)} 
                    placeholder="Contoh: Sifat-Sifat Logaritma Dasar" 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Format / Jenis Materi</label>
                  <select 
                    value={tipe} 
                    onChange={e => setTipe(e.target.value as any)} 
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
                  >
                    <option value="teks">Teks / Artikel (Editor Quill)</option>
                    <option value="pdf">Berkas Dokumen (PDF)</option>
                    <option value="ppt">Slide Presentasi (PPT)</option>
                    <option value="video">Sematkan Video (Video Embed / YouTube)</option>
                    <option value="link">Tautan Eksternal (Link Website)</option>
                  </select>
                </div>
                
                {tipe === 'teks' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Penjelasan / Isi Materi</label>
                    <div className="bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden quill-custom-dark transition-colors">
                      <ReactQuill theme="snow" value={content} onChange={setContent} className="h-64 pb-10" placeholder="Ketikkan penjelasan teori atau rumus di sini..." />
                    </div>
                  </div>
                )}

                {/* Conditional Inputs based on format */}
                {(tipe === 'pdf' || tipe === 'ppt') && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Unggah Lampiran Berkas ({tipe.toUpperCase()})
                    </label>
                    <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl p-8 text-center hover:bg-indigo-100/50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer group relative">
                      <input 
                        type="file" 
                        accept={tipe === 'pdf' ? '.pdf' : '.ppt,.pptx'} 
                        onChange={e => setFileInput(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <div className="w-10 h-10 bg-white dark:bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5 text-indigo-500" />
                      </div>
                      <p className="text-sm font-bold text-indigo-900 dark:text-indigo-400">
                        {fileInput ? fileInput.name : `Pilih atau Seret File ${tipe.toUpperCase()}`}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">Maks. 5MB per file</p>
                    </div>
                  </div>
                )}

                {tipe === 'video' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tautan Video Embed (YouTube / Google Drive)</label>
                    <div className="relative">
                      <Video className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="url" 
                        value={embedUrl} 
                        onChange={e => setEmbedUrl(e.target.value)} 
                        placeholder="Contoh: https://www.youtube.com/embed/..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white" 
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Masukkan URL sematan video agar siswa dapat memutar langsung di materi belajar.</p>
                  </div>
                )}

                {tipe === 'link' && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tautan Referensi Eksternal</label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="url" 
                        value={embedUrl} 
                        onChange={e => setEmbedUrl(e.target.value)} 
                        placeholder="Contoh: https://rumuscepat.com/materi-logaritma" 
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Target & Lampiran</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Kelas</label>
                  <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white">
                    <option>Matematika Wajib - X-1</option>
                    <option>Matematika Wajib - X-2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Status Publikasi</label>
                  <select className="w-full px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="publish">Publikasikan Sekarang</option>
                    <option value="draft">Simpan Sebagai Draft</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Bank Materi Pembelajaran">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="w-full sm:w-64">
            <select className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white shadow-sm">
              <option>Matematika Wajib - X-1</option>
              <option>Matematika Wajib - X-2</option>
            </select>
          </div>
        </div>
        <button onClick={() => setView('form')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
          <Plus className="w-4 h-4" /> Buat Materi Baru
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/30 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500" /> Daftar Materi (Kelas X-1)</h3>
          <div className="relative max-w-sm w-64 hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Cari judul materi..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white" 
            />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.length > 0 ? (
              filtered.map((m) => {
                const badgeColor = m.tipe === 'pdf' ? 'bg-red-150 text-red-600 dark:bg-red-500/20 dark:text-red-400' : m.tipe === 'ppt' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : m.tipe === 'video' ? 'bg-purple-100 text-purple-650 dark:bg-purple-500/20 dark:text-purple-400' : m.tipe === 'link' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400';
                return (
                  <div key={m.id} className="flex items-start gap-4 p-5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group bg-white dark:bg-slate-900">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-[10px] uppercase tracking-wider ${badgeColor}`}>
                      {m.tipe === 'video' ? <Video className="w-5 h-5" /> : m.tipe === 'link' ? <LinkIcon className="w-5 h-5" /> : m.tipe}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-white leading-tight mb-1">{m.judul}</h4>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{m.keterangan} • {m.tanggal}</div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg w-fit">
                        <Eye className="w-3 h-3" /> Dibaca {m.dibaca}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to="/panel/guru/materi/detail/1" className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 rounded-lg"><Eye className="w-4 h-4" /></Link>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(m.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 dark:bg-slate-800 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-2 text-center py-8 text-slate-400 dark:text-slate-500 font-medium">Tidak ada materi belajar ditemukan</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
