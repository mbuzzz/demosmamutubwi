import AdminLayout from '../../../../components/admin/AdminLayout';
import { ArrowLeft, BookOpen, Download, Edit, Save, X, MessageSquare, UploadCloud, FileText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { useMateriDetail, useUpdateMateri, useAddMateriComment } from '../../../../hooks/useLms';
import { getFileUrl } from '../../../../lib/api';

export default function GuruMateriDetail() {
  const { id } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'log' | 'comments'>('comments'); // default to comments since log isn't fully implemented in backend yet
  const [commentText, setCommentText] = useState('');

  const { data: materi, isLoading } = useMateriDetail(id);
  const updateMateri = useUpdateMateri();
  const addComment = useAddMateriComment();

  useEffect(() => {
    if (materi) {
      setTitle(materi.judul);
      setContent(materi.deskripsi || '');
    }
  }, [materi]);

  const handleUpdate = () => {
    if (!id || !title) return;
    const formData = new FormData();
    formData.append('judul', title);
    formData.append('deskripsi', content);
    if (fileInput) {
      formData.append('file_url', fileInput);
    }
    updateMateri.mutate({ id, data: formData }, {
      onSuccess: () => {
        setEditMode(false);
      }
    });
  };

  const handleAddComment = () => {
    if (!id || !commentText.trim()) return;
    addComment.mutate({ id, isi_komentar: commentText }, {
      onSuccess: () => {
        setCommentText('');
      }
    });
  };

  if (isLoading || !materi) return <AdminLayout title="Memuat..."><div className="p-8 text-center">Memuat data...</div></AdminLayout>;

  return (
    <AdminLayout title={editMode ? 'Edit Materi Pembelajaran' : 'Detail Materi Pembelajaran'}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/panel/guru/materi" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Bank Materi
          </Link>
        </div>
        {!editMode ? (
          <button onClick={() => setEditMode(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
            <Edit className="w-4 h-4" /> Edit Materi
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => setEditMode(false)} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:border-red-300 dark:hover:border-red-500 transition-all active:scale-95">
              <X className="w-4 h-4" /> Batal
            </button>
            <button onClick={handleUpdate} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              <Save className="w-4 h-4" /> Simpan Perubahan
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8">
            {!editMode ? (
              <>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-1">{materi.judul}</h2>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{materi.kelas?.nama} • Dipublikasikan: {new Date(materi.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-8" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(materi.deskripsi || '') }} />

                {materi.file_url && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-500" /> Lampiran File Pembelajaran</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px] bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">FILE</div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-white text-sm">Lampiran Materi</div>
                        </div>
                      </div>
                      <a href={getFileUrl(materi.file_url)} target="_blank" rel="noopener noreferrer" className="p-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 rounded-lg transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
                )}
              </>
            ) : (
              <>
                <h3 className="font-bold text-slate-800 dark:text-white mb-6 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-indigo-500" /> Edit Konten Materi
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Judul / Topik Materi</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Penjelasan / Isi Materi</label>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden quill-custom-dark transition-colors">
                      <ReactQuill theme="snow" value={content} onChange={setContent} className="h-72 pb-10" />
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-500" /> Lampiran File Baru (Opsional, mengganti yang lama)</h4>
                    <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl p-5 text-center hover:bg-indigo-100/50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer group relative">
                      <input 
                        type="file" 
                        onChange={e => setFileInput(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      />
                      <UploadCloud className="w-5 h-5 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400">{fileInput ? fileInput.name : 'Tambah File Baru'}</p>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Maks. 5MB per file</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                <button onClick={() => setActiveTab('comments')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'comments' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  <MessageSquare className="w-3 h-3 inline mr-1" />Diskusi
                </button>
              </div>
            </div>

            {activeTab === 'log' ? (
              <>
                <p className="text-xs text-slate-400 text-center py-6">Fitur log sedang dalam pengembangan.</p>
              </>
            ) : (
              <>
                <div className="space-y-4 mb-4 overflow-y-auto max-h-[360px] custom-scrollbar pr-1">
                  {!materi.comments || materi.comments.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">Belum ada diskusi untuk materi ini.</p>
                  ) : (
                    materi.comments.map((c, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-white">{c.user?.nama}</span>
                          <span className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{c.isi_komentar}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Balas diskusi siswa..." className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  <button onClick={handleAddComment} className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors active:scale-95"><MessageSquare className="w-4 h-4" /></button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
