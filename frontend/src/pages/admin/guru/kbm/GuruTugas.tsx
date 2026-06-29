import AdminLayout from '../../../../components/admin/AdminLayout';
import { Search, FileText, Plus, ArrowLeft, Save, AlignLeft, Calendar, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTugasList, useCreateTugas, useDeleteTugas } from '../../../../hooks/useLms';
import { useGuruClasses } from '../../../../hooks/usePenugasan';
import { useMapelList } from '../../../../hooks/useMapel';

export default function GuruTugas() {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tenggatWaktu, setTenggatWaktu] = useState('');
  const [search, setSearch] = useState('');

  const { data: classes = [] } = useGuruClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  
  const { data: mapels = [] } = useMapelList();
  const [selectedMapelId, setSelectedMapelId] = useState<string>('');

  const { data: tugasList = [], isLoading } = useTugasList(selectedClassId);
  const createTugas = useCreateTugas();
  const deleteTugas = useDeleteTugas();

  const filtered = tugasList.filter(t => 
    t.judul.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!judul || !selectedClassId || !selectedMapelId || !tenggatWaktu) return;
    
    createTugas.mutate({
      judul,
      deskripsi,
      kelas_id: selectedClassId,
      tenggat_waktu: tenggatWaktu,
      mapel_id: selectedMapelId, 
      guru_id: 'will-be-overridden-by-backend' // Usually overridden by auth token
    }, {
      onSuccess: () => {
        setView('list');
        setJudul('');
        setDeskripsi('');
        setTenggatWaktu('');
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Hapus tugas ini?')) return;
    deleteTugas.mutate(id);
  };

  if (view === 'form') {
    return (
      <AdminLayout title="Buat Penugasan Baru">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Tugas
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <Save className="w-4 h-4" /> Publikasikan Tugas
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-amber-500" /> Instruksi & Deskripsi Tugas
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Judul Tugas</label>
                  <input type="text" value={judul} onChange={e => setJudul(e.target.value)} placeholder="Contoh: PR LKS Halaman 24" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium dark:text-white transition-colors" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Instruksi Detail (Opsional)</label>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden quill-custom-dark transition-colors">
                    <ReactQuill theme="snow" value={deskripsi} onChange={setDeskripsi} className="h-64 pb-10" placeholder="Ketik instruksi langkah pengerjaan atau format jawaban di sini..." />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Pengaturan Waktu & Target</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Target Kelas</label>
                  <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium dark:text-white">
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
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium dark:text-white"
                    disabled={!selectedClassId}
                  >
                    <option value="">Pilih Mapel</option>
                    {mapels.map((m: any) => (
                      <option key={m.id} value={m.id}>{m.nama_mapel}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4"/> Batas Pengumpulan (Deadline)</label>
                  <input type="datetime-local" value={tenggatWaktu} onChange={e => setTenggatWaktu(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700 dark:text-slate-300 dark:text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manajemen Penugasan Siswa">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="w-full sm:w-64">
                  <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white shadow-sm">
              <option value="">Semua Kelas</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.nama}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={() => setView('form')} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
          <Plus className="w-4 h-4" /> Buat Tugas Baru
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-amber-500" /> Daftar Tugas</h3>
          <div className="relative max-w-sm w-64 hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul tugas..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium dark:text-white" />
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <p className="text-center py-8 text-slate-400">Loading...</p>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.length > 0 ? (
              filtered.map(t => {
                const isPastDeadline = new Date(t.tenggat_waktu) < new Date();
                return (
                  <div key={t.id} className={`flex items-start gap-4 p-5 border-2 ${!isPastDeadline ? 'border-amber-200 dark:border-amber-500/30 bg-amber-50/30 dark:bg-amber-500/5' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'} rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group`}>
                    <div className={`w-12 h-12 ${!isPastDeadline ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'} rounded-xl flex items-center justify-center shrink-0`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-800 dark:text-white leading-tight">{t.judul}</h4>
                        <span className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full font-bold whitespace-nowrap ${!isPastDeadline ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                          {!isPastDeadline ? 'Aktif' : 'Ditutup'}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Tenggat: {new Date(t.tenggat_waktu).toLocaleString('id-ID')}</div>
                      <div className="text-[10px] text-slate-500">{t.kelas?.nama}</div>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/panel/guru/tugas/detail/${t.id}`} className="p-2 text-slate-400 hover:text-indigo-600 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" title="Review Jawaban"><Search className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-red-600 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" title="Hapus Tugas"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="col-span-2 text-center py-8 text-slate-400">Tidak ada tugas ditemukan.</p>
            )}
          </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
