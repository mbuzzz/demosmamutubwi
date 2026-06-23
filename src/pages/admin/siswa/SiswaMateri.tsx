import AdminLayout from '../../../components/admin/AdminLayout';
import { BookOpen, Search, ArrowLeft, Download, FileText, Send, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface Comment {
  name: string;
  role: string;
  time: string;
  text: string;
}

interface Materi {
  id: string;
  title: string;
  mapel: string;
  tanggal: string;
  read: boolean;
  content: string;
  file: { name: string; size: string; type: string } | null;
  comments: Comment[];
}

const defaultMateris: Materi[] = [
  {
    id: '1', title: 'Bab 1 - Sifat Logaritma', mapel: 'Matematika Wajib', tanggal: '12 Jul 2024', read: true,
    content: '<p>Assalamualaikum wr wb. Anak-anakku kelas X-1,</p><p>Hari ini kita akan mempelajari materi lanjutan tentang Sifat-sifat Logaritma. Silakan baca rangkuman di bawah ini, lalu pelajari modul PDF yang telah Bapak lampirkan.</p><br/><h3>Sifat Dasar yang Harus Diingat:</h3><ol><li><sup>a</sup>log(b * c) = <sup>a</sup>log b + <sup>a</sup>log c</li><li><sup>a</sup>log(b / c) = <sup>a</sup>log b - <sup>a</sup>log c</li></ol>',
    file: { name: 'Modul_Logaritma_X.pdf', size: '2.4 MB', type: 'PDF' },
    comments: [
      { name: 'Ahmad Hidayat, S.Pd', role: 'Guru', time: '3 jam lalu', text: 'Silakan tanyakan di kolom komentar jika ada sifat logaritma yang belum dipahami.' },
      { name: 'Agus Setiawan', role: 'Siswa (Anda)', time: '2 jam lalu', text: 'Pak, untuk sifat pembagian logaritma apakah syarat basis a harus positif?' },
    ],
  },
  {
    id: '2', title: 'Catatan Rumus Cepat Logaritma', mapel: 'Matematika Wajib', tanggal: '15 Jul 2024', read: false,
    content: '<p>Berikut rumus cepat untuk menyelesaikan soal logaritma kuadrat yang sering keluar di ujian.</p>',
    file: null,
    comments: [],
  },
];

export default function SiswaMateri() {
  const [materis, setMateris] = useState<Materi[]>(defaultMateris);
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedMateri, setSelectedMateri] = useState<Materi | null>(null);
  const [search, setSearch] = useState('');
  const [commentInput, setCommentInput] = useState('');

  const filteredMateris = materis.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  function openMateri(materi: Materi) {
    // Mark as read when student opens it
    setMateris(prev => prev.map(m => m.id === materi.id ? { ...m, read: true } : m));
    setSelectedMateri({ ...materi, read: true });
    setView('detail');
  }

  function addComment() {
    if (!commentInput.trim() || !selectedMateri) return;
    const newComment: Comment = {
      name: 'Agus Setiawan',
      role: 'Siswa (Anda)',
      time: 'Baru saja',
      text: commentInput.trim(),
    };
    const updatedMateri = {
      ...selectedMateri,
      comments: [...selectedMateri.comments, newComment],
    };
    setMateris(prev => prev.map(m => m.id === selectedMateri.id ? updatedMateri : m));
    setSelectedMateri(updatedMateri);
    setCommentInput('');
  }

  if (view === 'detail' && selectedMateri) {
    return (
      <AdminLayout title="Detail Materi Belajar">
        <div className="mb-6">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Materi
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight mb-1">{selectedMateri.title}</h2>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{selectedMateri.mapel} • Dipublikasikan: {selectedMateri.tanggal}</p>
                </div>
              </div>

              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 mb-8" dangerouslySetInnerHTML={{ __html: selectedMateri.content }} />

              {selectedMateri.file && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-500" /> Lampiran File Pembelajaran</h4>
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center rounded-lg font-black text-[10px]">{selectedMateri.file.type}</div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-white text-sm">{selectedMateri.file.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{selectedMateri.file.size}</div>
                      </div>
                    </div>
                    <button className="p-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 rounded-lg transition-colors" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Diskusi */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" /> Tanya Jawab & Diskusi
              </h3>

              <div className="space-y-4 mb-4 overflow-y-auto max-h-[360px] custom-scrollbar pr-1">
                {selectedMateri.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">Belum ada diskusi. Tanyakan sesuatu di bawah!</p>
                ) : (
                  selectedMateri.comments.map((c, i) => (
                    <div key={i} className={`rounded-xl p-3 border transition-colors ${
                      c.role === 'Guru'
                        ? 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          {c.name} 
                          {c.role === 'Guru' && <span className="text-[9px] bg-indigo-600 text-white px-1 rounded font-normal">Guru</span>}
                        </span>
                        <span className="text-[10px] text-slate-400"><Clock className="w-2.5 h-2.5 inline mr-1" />{c.time}</span>
                      </div>
                      <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <input type="text" value={commentInput} onChange={e => setCommentInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addComment()} placeholder="Tulis komentar/pertanyaan..." className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                <button onClick={addComment} className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors active:scale-95"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Materi Belajar">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-center justify-between">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500" /> Rangkuman Materi Pembelajaran</h3>
          <div className="relative max-w-sm w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari materi..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMateris.map(m => (
              <div key={m.id} onClick={() => openMateri(m)} className="flex items-start gap-4 p-5 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group bg-white dark:bg-slate-900">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 dark:text-white leading-tight mb-1 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{m.title}</h4>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">{m.mapel} • {m.tanggal}</div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                      m.read 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse'
                    }`}>
                      {m.read ? 'SELESAI DIBACA' : 'BELUM DIBACA'}
                    </span>
                    {m.file && (
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg flex items-center gap-1"><FileText className="w-3 h-3" /> Ada Modul</span>
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
