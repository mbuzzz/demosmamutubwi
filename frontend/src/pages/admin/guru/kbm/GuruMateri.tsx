import AdminLayout from '../../../../components/admin/AdminLayout';
import { Search, Trash2, BookOpen, UploadCloud, Eye, Plus, ArrowLeft, Save, AlignLeft, FileText } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useMateriList, useCreateMateri, useDeleteMateri } from '../../../../hooks/useLms';
import { useGuruClasses } from '../../../../hooks/usePenugasan';
import { useMapelList } from '../../../../hooks/useMapel';

export default function GuruMateri() {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [search, setSearch] = useState('');
  
  const { data: classes = [] } = useGuruClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  
  const { data: mapels = [] } = useMapelList();
  const [selectedMapelId, setSelectedMapelId] = useState<string>('');

  const { data: materiList = [], isLoading } = useMateriList(selectedClassId);
  const createMateri = useCreateMateri();
  const deleteMateri = useDeleteMateri();

  const filtered = materiList.filter(m => 
    m.judul.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!judul || !selectedClassId || !selectedMapelId) return;
    
    const formData = new FormData();
    formData.append('judul', judul);
    formData.append('deskripsi', deskripsi);
    formData.append('kelas_id', selectedClassId);
    formData.append('mapel_id', selectedMapelId);
    if (fileInput) {
      formData.append('file_url', fileInput);
    }

    createMateri.mutate(formData, {
      onSuccess: () => {
        setView('list');
        setJudul('');
        setDeskripsi('');
        setFileInput(null);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus materi ini?')) return;
    deleteMateri.mutate(id);
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Target Kelas</label>
                    <select 
                      value={selectedClassId}
                      onChange={e => setSelectedClassId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
                    >
                      <option value="">Pilih Kelas</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Mata Pelajaran</label>
                    <select 
                      value={selectedMapelId}
                      onChange={e => setSelectedMapelId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
                      disabled={!selectedClassId}
                    >
                      <option value="">Pilih Mapel</option>
                      {mapels.map((m: any) => (
                        <option key={m.id} value={m.id}>{m.nama_mapel}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Penjelasan / Isi Materi</label>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden quill-custom-dark transition-colors">
                    <ReactQuill theme="snow" value={deskripsi} onChange={setDeskripsi} className="h-64 pb-10" placeholder="Ketikkan penjelasan teori atau rumus di sini..." />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Unggah Lampiran Berkas
                  </label>
                  <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl p-8 text-center hover:bg-indigo-100/50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer group relative">
                    <input 
                      type="file" 
                      onChange={e => setFileInput(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-5 h-5 text-indigo-500" />
                    </div>
                    <p className="text-sm font-bold text-indigo-900 dark:text-indigo-400">
                      {fileInput ? fileInput.name : `Pilih atau Seret File`}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">Maks. 5MB per file</p>
                  </div>
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
            <select 
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white shadow-sm"
            >
              <option value="">Semua Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.nama}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={() => setView('form')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
          <Plus className="w-4 h-4" /> Buat Materi Baru
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500" /> Daftar Materi</h3>
          <div className="relative max-w-sm w-64 hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Cari judul materi..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white" 
            />
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <p className="text-center py-8 text-slate-400">Loading...</p>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.length > 0 ? (
              filtered.map((m) => {
                return (
                  <div key={m.id} className="flex items-start gap-4 p-5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group bg-white dark:bg-slate-900">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-[10px] uppercase tracking-wider bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 dark:text-white leading-tight mb-1">{m.judul}</h4>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{m.kelas?.nama} • {new Date(m.created_at).toLocaleDateString('id-ID')}</div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/panel/guru/materi/detail/${m.id}`} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 rounded-lg"><Eye className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(m.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-100 dark:bg-slate-800 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="col-span-2 text-center py-8 text-slate-400 dark:text-slate-500 font-medium">Tidak ada materi belajar ditemukan</p>
            )}
          </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
