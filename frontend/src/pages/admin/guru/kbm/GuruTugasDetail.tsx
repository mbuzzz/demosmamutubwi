import AdminLayout from '../../../../components/admin/AdminLayout';
import { ArrowLeft, FileText, Download, CheckCircle, Clock, XCircle, Search, Edit, Save, Eye, MessageSquare, UserCheck, BarChart3, X, AlertTriangle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { useTugasDetail, useGetSubmissions, useGradeSubmission, useUpdateTugas } from '../../../../hooks/useLms';
import { getFileUrl } from '../../../../lib/api';

type FilterStatus = 'all' | 'submitted' | 'unsubmitted' | 'graded' | 'ungraded';

export default function GuruTugasDetail() {
  const { id } = useParams();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [editInstruksi, setEditInstruksi] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);
  
  // Local state for grading inputs
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [feedbackInput, setFeedbackInput] = useState<Record<string, string>>({});

  const { data: tugas, isLoading: isLoadingTugas } = useTugasDetail(id);
  const { data: submissionsData = [], isLoading: isLoadingSubmissions } = useGetSubmissions(id);
  const gradeSubmission = useGradeSubmission();
  const updateTugas = useUpdateTugas();

  const [editContent, setEditContent] = useState('');
  useEffect(() => {
    if (tugas) setEditContent(tugas.deskripsi || '');
  }, [tugas]);

  // Combine submissions with a static list of students for the class?
  // Our backend /tugas/:id/submissions should probably return all students in the class with their submission status.
  // If it only returns actual submissions, we need to fetch students in the class.
  // Assuming useGetSubmissions returns all students (status 'belum', 'menunggu', 'sudah_dinilai').
  const allSubmissions = submissionsData.map(s => ({
    id: s.id,
    siswa_id: s.siswa_id,
    name: s.siswa?.nama || 'Unknown',
    nisn: '0000', // dummy
    status: s.status,
    time: s.status !== 'belum' ? new Date(s.updated_at).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
    file: s.file_url ? s.file_url.split('/').pop() : null,
    file_url: s.file_url,
    fileType: s.file_url ? s.file_url.split('.').pop()?.toUpperCase() : null,
    grade: s.nilai ?? null,
    komentar_guru: s.komentar_guru
  }));

  const submitted = allSubmissions.filter(s => s.status !== 'belum');
  const unsubmitted = allSubmissions.filter(s => s.status === 'belum');
  const graded = allSubmissions.filter(s => s.status === 'sudah_dinilai' || s.grade !== null);
  const ungraded = allSubmissions.filter(s => (s.status === 'menunggu') || (s.status !== 'belum' && s.grade === null));

  const filteredSubmissions = allSubmissions.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search);
    if (!matchSearch) return false;
    switch (filter) {
      case 'submitted': return s.status !== 'belum';
      case 'unsubmitted': return s.status === 'belum';
      case 'graded': return s.grade !== null;
      case 'ungraded': return s.status !== 'belum' && s.grade === null;
      default: return true;
    }
  });

  const total = allSubmissions.length;
  const avgGrade = graded.length ? Math.round(graded.reduce((a, s) => a + s.grade!, 0) / graded.length) : 0;
  const highestGrade = graded.length ? Math.max(...graded.map(s => s.grade!)) : 0;

  const filterTabs: { key: FilterStatus; label: string; count: number }[] = [
    { key: 'all', label: 'Semua', count: total },
    { key: 'submitted', label: 'Sudah Kumpul', count: submitted.length },
    { key: 'unsubmitted', label: 'Belum Kumpul', count: unsubmitted.length },
    { key: 'graded', label: 'Sudah Dinilai', count: graded.length },
    { key: 'ungraded', label: 'Belum Dinilai', count: ungraded.length },
  ];

  const handleGrade = (submissionId: string, gradeVal: string) => {
    setGrades(prev => ({...prev, [submissionId]: gradeVal}));
  };

  const submitGrades = () => {
    if (!id) return;
    Object.keys(grades).forEach(subId => {
      const val = parseFloat(grades[subId]);
      if (!isNaN(val)) {
        gradeSubmission.mutate({
          tugasId: id,
          siswaId: subId,
          nilai: val,
          feedback_guru: feedbackInput[subId]
        });
      }
    });
    setGrades({});
    setFeedbackInput({});
  };

  const handleUpdateInstruksi = () => {
    if (id) {
      updateTugas.mutate({ id, data: { deskripsi: editContent } }, {
        onSuccess: () => setEditInstruksi(false)
      });
    }
  };

  if (isLoadingTugas) return <AdminLayout title="Memuat..."><div className="p-8 text-center">Memuat...</div></AdminLayout>;
  if (!tugas) return <AdminLayout title="Error"><div className="p-8 text-center">Tugas tidak ditemukan</div></AdminLayout>;

  const isPastDeadline = new Date(tugas.tenggat_waktu) < new Date();

  return (
    <AdminLayout title="Detail Penugasan">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link to="/panel/guru/tugas" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Tugas
        </Link>
        <button onClick={() => editInstruksi ? handleUpdateInstruksi() : setEditInstruksi(true)} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95">
          {editInstruksi ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          {editInstruksi ? 'Simpan Instruksi' : 'Edit Instruksi'}
        </button>
      </div>

      {/* Statistik Nilai */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Rata-Rata Nilai', value: graded.length > 0 ? `${avgGrade}` : '-', sub: graded.length > 0 ? `dari ${graded.length} siswa` : 'Belum ada nilai', icon: BarChart3, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20' },
          { label: 'Nilai Tertinggi', value: highestGrade > 0 ? `${highestGrade}` : '-', sub: graded.length > 0 ? `${graded.length} siswa dinilai` : '-', icon: UserCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' },
          { label: 'Sudah Mengumpulkan', value: `${submitted.length}`, sub: `${total - submitted.length} belum`, icon: CheckCircle, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20' },
          { label: 'Belum Dinilai', value: `${ungraded.length}`, sub: `${graded.length} sudah dinilai`, icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 border ${s.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Sidebar Info Tugas */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
            <div className="flex items-start gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 dark:text-white leading-tight mb-1">{tugas.judul}</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{tugas.kelas?.nama}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status Tenggat Waktu</div>
                <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg w-fit ${
                  !isPastDeadline ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10' : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10'
                }`}>
                  <Clock className="w-4 h-4" /> {!isPastDeadline ? `Masih Dibuka (${new Date(tugas.tenggat_waktu).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })})` : 'Ditutup'}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Progress Pengumpulan</div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mt-2 mb-1.5 overflow-hidden">
                  <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${total ? Math.round((submitted.length / total) * 100) : 0}%` }}></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>{submitted.length} Mengumpulkan</span>
                  <span>{unsubmitted.length} Belum</span>
                </div>
              </div>

              {!editInstruksi ? (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Instruksi Tugas</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tugas.deskripsi || '') }} />
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Edit Instruksi</div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden quill-custom-dark transition-colors">
                    <ReactQuill theme="snow" value={editContent} onChange={setEditContent} className="h-48 pb-10" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabel Koreksi */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  Daftar Pengumpulan Siswa
                </h3>
                <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
                  {filterTabs.map(t => (
                    <button key={t.key} onClick={() => setFilter(t.key)} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filter === t.key
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500'
                    }`}>
                      {t.label} ({t.count})
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative mt-3 w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau NISN..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium dark:text-white transition-colors" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-4">Nama Siswa</th>
                    <th className="px-5 py-4">Status & Waktu</th>
                    <th className="px-5 py-4 text-center">File Jawaban</th>
                    <th className="px-5 py-4 text-center">Nilai</th>
                    <th className="px-5 py-4 text-center">Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {isLoadingSubmissions ? (
                    <tr><td colSpan={5} className="text-center py-8">Memuat data...</td></tr>
                  ) : filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400 font-bold">
                        Tidak ada data yang cocok dengan filter
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map(s => (
                      <tr key={s.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${s.status === 'belum' ? 'opacity-60' : ''}`}>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800 dark:text-white">{s.name}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">NISN: {s.nisn}</div>
                        </td>
                        <td className="px-5 py-4">
                          {s.status === 'sudah_dinilai' || s.status === 'menunggu' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md mb-1">
                              <CheckCircle className="w-3 h-3" /> Mengumpulkan
                            </span>
                          ) : s.status === 'belum' && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-md mb-1">
                              <XCircle className="w-3 h-3" /> Belum
                            </span>
                          )}
                          {s.time && <div className="text-[10px] text-slate-500">{s.time}</div>}
                        </td>
                        <td className="px-5 py-4 text-center">
                          {s.file ? (
                            <button onClick={() => setPreviewFile(s)} className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20">
                              <Eye className="w-3.5 h-3.5" /> {s.fileType}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 font-bold">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <input 
                              type="number" 
                              placeholder="0" 
                              value={grades[s.id] !== undefined ? grades[s.id] : (s.grade ?? '')} 
                              onChange={(e) => handleGrade(s.id, e.target.value)}
                              disabled={s.status === 'belum'}
                              className={`w-16 px-2 py-1.5 rounded-lg text-center text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${
                                s.status === 'belum'
                                  ? 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed'
                                  : (s.grade !== null || grades[s.id] !== undefined)
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400'
                                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                              }`} />
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          {s.status !== 'belum' && (
                            <div className="relative inline-block">
                              <button
                                onClick={() => setFeedbackInput(prev => ({ ...prev, [s.id]: prev[s.id] === undefined ? (s.komentar_guru || '') : undefined }))}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  s.komentar_guru || feedbackInput[s.id] !== undefined ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20' : 'text-slate-400 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-500/20'
                                }`}
                                title="Beri komentar"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                              {feedbackInput[s.id] !== undefined && (
                                <div className="absolute right-0 top-full mt-2 z-10 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-3">
                                  <textarea
                                    value={feedbackInput[s.id] || ''}
                                    onChange={e => setFeedbackInput(prev => ({ ...prev, [s.id]: e.target.value }))}
                                    placeholder="Tulis komentar untuk siswa..."
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none mb-2"
                                    rows={3}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Menampilkan {filteredSubmissions.length} dari {total} siswa
              </span>
              <button onClick={submitGrades} disabled={Object.keys(grades).length === 0} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                Simpan Perubahan Nilai
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Preview File */}
      {previewFile && previewFile.file_url && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewFile(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Preview Jawaban</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{previewFile.file}</p>
              </div>
              <div className="flex items-center gap-2">
                <a href={getFileUrl(previewFile.file_url)} target="_blank" rel="noopener noreferrer" className="p-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 rounded-xl transition-colors">
                  <Download className="w-4 h-4" />
                </a>
                <button onClick={() => setPreviewFile(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 min-h-[200px]">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-sm mb-4 ${
                previewFile.fileType === 'PDF' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
              }`}>
                {previewFile.fileType}
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">{previewFile.file}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Upload oleh {previewFile.name}</p>
              <div className="flex gap-3 w-full max-w-xs">
                <a href={getFileUrl(previewFile.file_url)} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-bold hover:border-indigo-300 transition-all active:scale-95">
                  <Eye className="w-4 h-4 inline mr-1.5" /> Lihat/Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
