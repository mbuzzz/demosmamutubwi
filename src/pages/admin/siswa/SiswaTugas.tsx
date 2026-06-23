import AdminLayout from '../../../components/admin/AdminLayout';
import { FileText, Search, ArrowLeft, UploadCloud, Download, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface Tugas {
  id: string;
  title: string;
  mapel: string;
  deadline: string;
  instruksi: string;
  status: 'belum' | 'menunggu' | 'dinilai';
  nilai: number | null;
  feedback: string | null;
  fileJawaban: string | null;
  lampiranSoal: string | null;
}

const defaultTugases: Tugas[] = [
  {
    id: '1', title: 'PR LKS Hal 24-25', mapel: 'Matematika Wajib', deadline: 'Besok, 23:59 WIB',
    instruksi: '<p>Kerjakan LKS halaman 24 sampai 25 bagian Uji Kompetensi A dan B.</p><p>Foto hasil pengerjaan di buku tulis, pastikan tulisan terbaca jelas, lalu upload ke sini dalam format PDF atau JPG.</p>',
    status: 'belum', nilai: null, feedback: null, fileJawaban: null, lampiranSoal: 'Lembar_Kerja_Logaritma.pdf'
  },
  {
    id: '2', title: 'Laporan Praktikum Kinematika', mapel: 'Fisika', deadline: 'Kamis, 23:59 WIB',
    instruksi: '<p>Buatlah laporan praktikum sesuai format yang telah dibagikan di kelas. Lengkapi tabel pengamatan dan buat kesimpulannya.</p>',
    status: 'menunggu', nilai: null, feedback: null, fileJawaban: 'Laporan_Kinematika_Agus.pdf', lampiranSoal: null
  },
  {
    id: '3', title: 'Tugas Rumus Eksponen', mapel: 'Matematika Wajib', deadline: 'Lalu (15 Jul 2024)',
    instruksi: '<p>Kerjakan 5 soal eksponen yang ada di buku paket halaman 12.</p>',
    status: 'dinilai', nilai: 90, feedback: 'Kerja bagus Agus, langkah pengerjaan teratur dan benar.', fileJawaban: 'Tugas_Eksponen_Agus.pdf', lampiranSoal: null
  }
];

export default function SiswaTugas() {
  const [tugases, setTugases] = useState<Tugas[]>(defaultTugases);
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedTugas, setSelectedTugas] = useState<Tugas | null>(null);
  const [search, setSearch] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [catatanSiswa, setCatatanSiswa] = useState('');

  const filteredTugases = tugases.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  function openDetail(t: Tugas) {
    setSelectedTugas(t);
    setFileInput(null);
    setCatatanSiswa('');
    setView('detail');
  }

  function handleUpload() {
    if (!selectedTugas) return;
    const updatedTugas: Tugas = {
      ...selectedTugas,
      status: 'menunggu',
      fileJawaban: fileInput ? fileInput.name : 'Jawaban_Agus.pdf'
    };
    setTugases(prev => prev.map(t => t.id === selectedTugas.id ? updatedTugas : t));
    setSelectedTugas(updatedTugas);
  }

  function statusBadge(status: Tugas['status']) {
    const maps = {
      belum: { label: 'Belum Kumpul', style: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
      menunggu: { label: 'Menunggu Penilaian', style: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
      dinilai: { label: 'Selesai Dinilai', style: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    };
    const c = maps[status];
    return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${c.style}`}>{c.label}</span>;
  }

  if (view === 'detail' && selectedTugas) {
    return (
      <AdminLayout title="Detail Penugasan Siswa">
        <div className="mb-6">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Tugas
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8">
              <div className="flex items-start gap-4 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-1">{selectedTugas.title}</h2>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{selectedTugas.mapel} • Deadline: <span className="text-amber-600">{selectedTugas.deadline}</span></p>
                </div>
              </div>

              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-8">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2">Instruksi Tugas:</h4>
                <div dangerouslySetInnerHTML={{ __html: selectedTugas.instruksi }} />
              </div>

              {selectedTugas.lampiranSoal && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center rounded font-black text-[10px]">PDF</div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-white text-xs">{selectedTugas.lampiranSoal}</div>
                        <p className="text-[10px] text-slate-400">Lampiran Soal</p>
                      </div>
                    </div>
                    <button className="p-1.5 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Form Pengumpulan */}
              {selectedTugas.status === 'belum' ? (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Pengumpulan Jawaban:</h4>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl p-6 text-center transition-colors cursor-pointer group">
                      <UploadCloud className="w-10 h-10 text-slate-400 group-hover:scale-110 transition-transform mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Pilih atau Seret File Jawaban</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Maks. 5MB (PDF atau JPG)</p>
                      <input type="file" onChange={e => setFileInput(e.target.files?.[0] || null)} className="hidden" id="tugas-file-input" />
                      <label htmlFor="tugas-file-input" className="mt-3 inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors">Pilih File</label>
                      {fileInput && <div className="mt-3 text-xs font-bold text-emerald-600">{fileInput.name}</div>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Catatan untuk Guru (Opsional)</label>
                      <textarea value={catatanSiswa} onChange={e => setCatatanSiswa(e.target.value)} placeholder="Tulis catatan jika ada..." rows={3} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none" />
                    </div>

                    <button onClick={handleUpload} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all">
                      Kumpulkan Tugas
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Jawaban Terkirim:</h4>
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-250 dark:border-emerald-500/20 mb-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white">{selectedTugas.fileJawaban}</div>
                        <p className="text-[10px] text-slate-400">Tepat Waktu • Diupload kemarin</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Status & Nilai */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                Status Tugas
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status Pengumpulan</div>
                  {statusBadge(selectedTugas.status)}
                </div>

                {selectedTugas.status === 'dinilai' && selectedTugas.nilai !== null && (
                  <>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nilai Tugas</div>
                      <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{selectedTugas.nilai} <span className="text-xs font-normal text-slate-400">/ 100</span></div>
                    </div>
                    {selectedTugas.feedback && (
                      <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                        <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Catatan Guru</div>
                        <p className="text-xs text-indigo-850 dark:text-indigo-300 leading-relaxed font-medium">{selectedTugas.feedback}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Tugas & PR Siswa">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-center justify-between">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500" /> Daftar Tugas Belajar</h3>
          <div className="relative max-w-sm w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul tugas..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTugases.map(t => (
              <div key={t.id} onClick={() => openDetail(t)} className="flex items-start gap-4 p-5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group bg-white dark:bg-slate-900">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 dark:text-white leading-tight mb-1 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t.title}</h4>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{t.mapel} • Deadline: {t.deadline}</div>
                  <div className="flex items-center gap-2">
                    {statusBadge(t.status)}
                    {t.nilai !== null && (
                      <span className="text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded-lg">Nilai: {t.nilai}</span>
                    )}
                  </div>
                </div>
                <div className="p-2 text-slate-400 hover:text-indigo-600 dark:bg-slate-800 rounded-lg group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
