import AdminLayout from '../../../../components/admin/AdminLayout';
import { ArrowLeft, BookOpen, Download, CheckCircle, Clock, Eye, Edit, Save, X, Search, MessageSquare, UploadCloud, ChevronLeft, ChevronRight, Trash2, Users, FileText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function GuruMateriDetail() {
  const { id } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState(
    '<p>Assalamualaikum wr wb. Anak-anakku kelas X-1,</p><p>Hari ini kita akan mempelajari materi lanjutan tentang Sifat-sifat Logaritma. Silakan baca rangkuman di bawah ini, lalu pelajari modul PDF yang telah Bapak lampirkan.</p><br/><h3>Sifat Dasar yang Harus Diingat:</h3><ol><li><sup>a</sup>log(b × c) = <sup>a</sup>log b + <sup>a</sup>log c</li><li><sup>a</sup>log(b / c) = <sup>a</sup>log b - <sup>a</sup>log c</li><li><sup>a</sup>log b<sup>n</sup> = n × <sup>a</sup>log b</li></ol>'
  );
  const [title, setTitle] = useState('Bab 1 - Sifat Logaritma');
  const [activeTab, setActiveTab] = useState<'log' | 'comments'>('log');
  const [commentText, setCommentText] = useState('');

  const files = [
    { name: 'Modul_Logaritma_X.pdf', size: '2.4 MB', type: 'PDF' },
    { name: 'Rangkuman_Logaritma.pptx', size: '1.1 MB', type: 'PPT' },
  ];

  const students = [
    { initials: 'AS', name: 'Agus Setiawan', time: 'Hari ini, 08:15', read: true },
    { initials: 'BR', name: 'Budi Raharjo', time: 'Hari ini, 09:20', read: true },
    { initials: 'CK', name: 'Citra Kirana', time: '', read: false },
    { initials: 'DL', name: 'Dewi Lestari', time: 'Kemarin, 14:30', read: true },
    { initials: 'EP', name: 'Eko Prasetyo', time: 'Hari ini, 07:45', read: true },
    { initials: 'FA', name: 'Fitri Ayu', time: '', read: false },
  ];

  const comments = [
    { name: 'Agus Setiawan', time: '2 jam lalu', text: 'Pak, untuk rumus nomor 3, apakah ada contoh soalnya? Saya masih bingung penerapannya.' },
    { name: 'Budi Raharjo', time: '1 jam lalu', text: 'Sudah paham pak, terima kasih materinya. Untuk file PDF apakah bisa didownload?' },
  ];

  const readCount = students.filter(s => s.read).length;
  const totalCount = students.length;
  const progress = Math.round((readCount / totalCount) * 100);

  return (
    <AdminLayout title={editMode ? 'Edit Materi Pembelajaran' : 'Detail Materi Pembelajaran'}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/panel/guru/materi" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Bank Materi
          </Link>
          {id && (
            <div className="hidden sm:flex items-center gap-1 text-slate-300 dark:text-slate-600">
              <button className="p-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
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
            <button onClick={() => setEditMode(false)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
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
                    <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-1">{title}</h2>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Matematika Wajib • Dipublikasikan: 12 Jul 2024</p>
                  </div>
                </div>

                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-8" dangerouslySetInnerHTML={{ __html: content }} />

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-500" /> Lampiran File Pembelajaran</h4>
                  <div className="space-y-3">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-[10px] ${
                            file.type === 'PDF' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                          }`}>{file.type}</div>
                          <div>
                            <div className="font-bold text-slate-800 dark:text-white text-sm">{file.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{file.size}</div>
                          </div>
                        </div>
                        <button className="p-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 rounded-lg transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
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
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-500" /> Lampiran File</h4>
                    <div className="space-y-3 mb-4">
                      {files.map((file, i) => (
                        <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${
                              file.type === 'PDF' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                            }`}>{file.type}</div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white">{file.name}</div>
                          </div>
                          <button className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl p-5 text-center hover:bg-indigo-100/50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer group">
                      <UploadCloud className="w-5 h-5 text-indigo-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400">Tambah File Baru</p>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Maks. 5MB per file (PDF, PPT, DOC)</p>
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
                <button onClick={() => setActiveTab('log')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'log' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  <Eye className="w-3 h-3 inline mr-1" />Log
                </button>
                <button onClick={() => setActiveTab('comments')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'comments' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                  <MessageSquare className="w-3 h-3 inline mr-1" />Diskusi
                </button>
              </div>
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{readCount}/{totalCount}</div>
            </div>

            {activeTab === 'log' ? (
              <>
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" /> Progress Membaca</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="relative mb-4">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Cari siswa..." className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>

                <div className="space-y-2 overflow-y-auto max-h-[360px] custom-scrollbar pr-1">
                  {students.map((s, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                      s.read
                        ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'
                        : 'bg-red-50/50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20'
                    }`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          s.read
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>{s.initials}</div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 dark:text-white truncate">{s.name}</div>
                          {s.read ? (
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3 shrink-0" /> {s.time}</div>
                          ) : (
                            <div className="text-[10px] text-red-500 font-bold mt-0.5">Belum Membaca</div>
                          )}
                        </div>
                      </div>
                      {s.read && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4 mb-4 overflow-y-auto max-h-[360px] custom-scrollbar pr-1">
                  {comments.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">Belum ada diskusi untuk materi ini.</p>
                  ) : (
                    comments.map((c, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-white">{c.name}</span>
                          <span className="text-[10px] text-slate-400">{c.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Balas diskusi siswa..." className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  <button className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors active:scale-95"><MessageSquare className="w-4 h-4" /></button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
