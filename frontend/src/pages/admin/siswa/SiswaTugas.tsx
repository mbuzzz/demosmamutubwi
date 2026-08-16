import AdminLayout from '../../../components/admin/AdminLayout';
import { FileText, Search, ArrowLeft, UploadCloud, Download, CheckCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import DOMPurify from 'dompurify';
import { useTugasList, useSubmitTugas, useMySubmission } from '../../../hooks/useLms';
import type { Tugas } from '../../../hooks/useLms';
import { getFileUrl } from '../../../lib/api';
import { useAuth } from '../../../components/auth/AuthContext';

export default function SiswaTugas() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedTugas, setSelectedTugas] = useState<Tugas | null>(null);
  const [search, setSearch] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);

  const { data: tugases = [], isLoading } = useTugasList();
  const submitTugas = useSubmitTugas();
  const { user } = useAuth();
  
  const { data: mySubmission } = useMySubmission(selectedTugas?.id);

  const filteredTugases = tugases.filter(t => t.judul.toLowerCase().includes(search.toLowerCase()));

  function openDetail(t: Tugas) {
    setSelectedTugas(t);
    setFileInput(null);
    setView('detail');
  }

  function handleUpload() {
    if (!selectedTugas || !fileInput) return;
    const formData = new FormData();
    formData.append('file_jawaban_url', fileInput);
    
    submitTugas.mutate({ tugasId: selectedTugas.id, data: formData }, {
      onSuccess: () => {
        setFileInput(null);
      }
    });
  }

  function statusBadge(status: string) {
    const maps: Record<string, {label: string, style: string}> = {
      belum: { label: 'Belum Kumpul', style: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
      menunggu: { label: 'Menunggu Penilaian', style: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
      telat: { label: 'Terlambat', style: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' },
      sudah_dinilai: { label: 'Selesai Dinilai', style: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    };
    const c = maps[status] || { label: 'Status Tidak Diketahui', style: 'bg-slate-50 text-slate-500' };
    return <span className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap ${c.style}`}>{c.label}</span>;
  }

  if (view === 'detail' && selectedTugas) {
    const status = mySubmission ? mySubmission.status : 'belum';
    const nilai = mySubmission ? mySubmission.nilai : null;
    const feedback = mySubmission ? (mySubmission.feedback_guru || mySubmission.komentar_guru) : null;
    const fileJawaban = (mySubmission?.file_jawaban_url || mySubmission?.file_url) ? (mySubmission.file_jawaban_url || mySubmission.file_url).split('/').pop() : null;
    
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
                  <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-1">{selectedTugas.judul}</h2>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{selectedTugas.mapel?.nama} • Deadline: <span className="text-amber-600">{new Date(selectedTugas.tenggat_waktu).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></p>
                </div>
              </div>

              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-8">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-2">Instruksi Tugas:</h4>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedTugas.deskripsi || '') }} />
              </div>

              {/* Form Pengumpulan */}
              {status === 'belum' ? (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Pengumpulan Jawaban:</h4>
                  {user?.role === 'orang_tua' ? (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 font-semibold">
                      Mode Wali Murid: Pengumpulan tugas hanya dapat dilakukan dari akun siswa.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl p-6 text-center transition-colors cursor-pointer group relative">
                        <UploadCloud className="w-10 h-10 text-slate-400 group-hover:scale-110 transition-transform mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-800 dark:text-white">Pilih atau Seret File Jawaban</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Maks. 5MB (PDF atau JPG)</p>
                        <input type="file" onChange={e => setFileInput(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        {fileInput && <div className="mt-3 text-xs font-bold text-emerald-600">{fileInput.name}</div>}
                      </div>

                      <button onClick={handleUpload} disabled={!fileInput || submitTugas.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all">
                        {submitTugas.isPending ? 'Mengunggah...' : 'Kumpulkan Tugas'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Jawaban Terkirim:</h4>
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-250 dark:border-emerald-500/20 mb-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white">{fileJawaban}</div>
                        <p className="text-[10px] text-slate-400">Tepat Waktu • Diupload pada {new Date(mySubmission!.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    {(mySubmission?.file_jawaban_url || mySubmission?.file_url) && (
                      <a href={getFileUrl(mySubmission.file_jawaban_url || mySubmission.file_url)} target="_blank" rel="noopener noreferrer" className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                        <Download className="w-4 h-4" />
                      </a>
                    )}
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
                  {statusBadge(status)}
                </div>

                {status === 'sudah_dinilai' && nilai !== null && (
                  <>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nilai Tugas</div>
                      <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{nilai} <span className="text-xs font-normal text-slate-400">/ 100</span></div>
                    </div>
                    {feedback && (
                      <div className="bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                        <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Catatan Guru</div>
                        <p className="text-xs text-indigo-850 dark:text-indigo-300 leading-relaxed font-medium">{feedback}</p>
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
          {isLoading ? (
            <p className="text-center py-8 text-slate-400">Loading...</p>
          ) : filteredTugases.length === 0 ? (
            <p className="text-center py-8 text-slate-400">Belum ada tugas</p>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTugases.map(t => (
              <div key={t.id} onClick={() => openDetail(t)} className="flex items-start gap-4 p-5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group bg-white dark:bg-slate-900">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 dark:text-white leading-tight mb-1 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t.judul}</h4>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{t.mapel?.nama} • Deadline: {new Date(t.tenggat_waktu).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-lg whitespace-nowrap bg-slate-100 text-slate-500`}>Lihat Detail</span>
                  </div>
                </div>
                <div className="p-2 text-slate-400 hover:text-indigo-600 dark:bg-slate-800 rounded-lg group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
