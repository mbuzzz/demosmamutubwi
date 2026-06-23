import AdminLayout from '../../../components/admin/AdminLayout';
import { FileQuestion, Clock, Search, Play, X, Key, HelpCircle, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { type SesiUjian, MOCK_SESI_UJIAN, MOCK_PAKET_SOAL, CBT_CONFIG, TIPE_BADGE } from '../../../types/cbt';

interface Question {
  id: string;
  nomor: number;
  tipe: string;
  pertanyaan: string;
  options?: string[];
  kunci: string;
}

interface Exam {
  id: string;
  tipe: 'ujian' | 'ulangan_harian' | 'kuis';
  title: string;
  mapel: string;
  kelas: string;
  soalCount: number;
  timeLimit: number;
  token: string;
  needToken: boolean;
  status: 'tersedia' | 'selesai';
  score?: number;
  questions: Question[];
}

function buildExamFromSession(sesi: SesiUjian): Exam {
  const paket = MOCK_PAKET_SOAL.find(p => p.id === sesi.paketSoalId);
  const config = CBT_CONFIG[sesi.tipe];
  return {
    id: sesi.id,
    tipe: sesi.tipe,
    title: sesi.title,
    mapel: sesi.mapel,
    kelas: sesi.kelas,
    soalCount: paket?.soal.length || 0,
    timeLimit: sesi.durasi,
    token: sesi.token,
    needToken: config.needToken,
    status: sesi.status === 'Selesai' ? 'selesai' : 'tersedia',
    score: sesi.status === 'Selesai' ? Math.floor(Math.random() * 30) + 70 : undefined,
    questions: paket?.soal.map(s => ({
      id: s.id,
      nomor: s.nomor,
      tipe: s.tipe,
      pertanyaan: s.pertanyaan,
      options: s.options,
      kunci: s.kunciJawaban,
    })) || [],
  };
}

const availableExams: Exam[] = MOCK_SESI_UJIAN
  .filter(s => s.status !== 'Selesai')
  .map(buildExamFromSession);

const completedExams: Exam[] = MOCK_SESI_UJIAN
  .filter(s => s.status === 'Selesai')
  .map(buildExamFromSession);

export default function SiswaCbt() {
  const [exams, setExams] = useState<Exam[]>(availableExams);
  const [completed, setCompleted] = useState<Exam[]>(completedExams);
  const [view, setView] = useState<'list' | 'exam' | 'result'>('list');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const [filterTipe, setFilterTipe] = useState('');

  // Token modal
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState('');

  // Exam pengerjaan
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Anti-cheat warning
  const [showWarning, setShowWarning] = useState(false);
  const [warningCountdown, setWarningCountdown] = useState(3);
  const warningTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const examEndedRef = useRef(false);

  // Timer effect
  useEffect(() => {
    if (view !== 'exam' || timeLeft <= 0 || examSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [view, timeLeft, examSubmitted]);

  // Anti-cheat: visibility & blur detection
  useEffect(() => {
    if (view !== 'exam') return;

    function handleVisibility() {
      if (document.hidden && !examEndedRef.current) {
        triggerWarning();
      }
    }

    function handleBlur() {
      if (!examEndedRef.current) {
        triggerWarning();
      }
    }

    function handleFullscreenChange() {
      if (!document.fullscreenElement && !examEndedRef.current && !showWarning) {
        triggerWarning();
      }
    }

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    };
  }, [view, showWarning]);

  function triggerWarning() {
    if (!selectedExam) return;
    const config = CBT_CONFIG[selectedExam.tipe];
    if (config.antiCheat === 'none') return;

    setShowWarning(true);
    setWarningCountdown(3);

    if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    warningTimerRef.current = setInterval(() => {
      setWarningCountdown(prev => {
        if (prev <= 1) {
          if (warningTimerRef.current) clearInterval(warningTimerRef.current);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function dismissWarning() {
    if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    setShowWarning(false);
    setWarningCountdown(3);
  }

  function startExamRequest(exam: Exam) {
    setSelectedExam(exam);
    if (exam.needToken) {
      setTokenInput('');
      setTokenError('');
      setShowTokenModal(true);
    } else {
      beginExam(exam);
    }
  }

  function beginExam(exam: Exam) {
    setAnswers({});
    setActiveQuestionIdx(0);
    setTimeLeft(exam.timeLimit * 60);
    setExamSubmitted(false);
    examEndedRef.current = false;
    setView('exam');

    // Auto fullscreen if configured
    const config = CBT_CONFIG[exam.tipe];
    if (config.fullscreen && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  function verifyToken() {
    if (!selectedExam) return;
    if (tokenInput.trim() === selectedExam.token) {
      setShowTokenModal(false);
      beginExam(selectedExam);
    } else {
      setTokenError('Token ujian salah! Silakan coba lagi.');
    }
  }

  function handleSelectAnswer(ans: string) {
    if (!selectedExam) return;
    const q = selectedExam.questions[activeQuestionIdx];
    setAnswers(prev => ({ ...prev, [q.id]: ans }));
  }

  function handleSelectMultiAnswer(ans: string) {
    if (!selectedExam) return;
    const q = selectedExam.questions[activeQuestionIdx];
    const current = answers[q.id] ? answers[q.id].split(', ') : [];
    const updated = current.includes(ans) ? current.filter(v => v !== ans) : [...current, ans];
    setAnswers(prev => ({ ...prev, [q.id]: updated.join(', ') }));
  }

  function finishExam() {
    if (!selectedExam || examEndedRef.current) return;
    examEndedRef.current = true;

    if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    setShowWarning(false);

    // Exit fullscreen
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    // Mock grading
    let correct = 0;
    const totalQ = selectedExam.questions.length;
    selectedExam.questions.forEach(q => {
      const studentAns = answers[q.id] || '';
      if (q.tipe === 'essay') {
        correct += 1;
      } else if (studentAns.toLowerCase().replace(/\s+/g, '') === q.kunci.toLowerCase().replace(/\s+/g, '')) {
        correct += 1;
      }
    });
    const score = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;
    setFinalScore(score);

    // Move to completed
    setExams(prev => prev.filter(e => e.id !== selectedExam.id));
    setCompleted(prev => [{ ...selectedExam, status: 'selesai', score }, ...prev]);
    setView('result');
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (view === 'exam' && selectedExam) {
    const activeQ = selectedExam.questions[activeQuestionIdx];
    const config = CBT_CONFIG[selectedExam.tipe];

    return (
      <AdminLayout title="Sistem Ujian Online (CBT)">
        {/* Anti-cheat Warning Overlay */}
        {showWarning && (
          <div className="fixed inset-0 z-[100] bg-red-600/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center border border-red-200 dark:border-red-500/30">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">Anda Meninggalkan Halaman Ujian!</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Ujian akan dikumpulkan secara otomatis jika tidak kembali.</p>
              <div className="text-6xl font-black text-red-600 dark:text-red-400 mb-6 font-mono">{warningCountdown}</div>
              <button onClick={dismissWarning}
                disabled={warningCountdown === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95">
                Kembali ke Ujian
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white leading-none">{selectedExam.title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedExam.mapel} • {selectedExam.kelas}</p>
          </div>
          <div className="flex items-center gap-3">
            {config.fullscreen && (
              <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                Mode Fullscreen
              </span>
            )}
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 px-4 py-2.5 rounded-xl font-bold font-mono">
              <Clock className="w-4 h-4 animate-spin" /> {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Navigator Soal */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-indigo-500" /> Daftar Soal</h3>
            <div className="grid grid-cols-5 gap-2">
              {selectedExam.questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setActiveQuestionIdx(i)}
                  className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-colors border
                    ${i === activeQuestionIdx ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30' :
                      answers[q.id] ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/25' :
                      'bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}>
                  {q.nomor}
                </button>
              ))}
            </div>
            <button onClick={finishExam} className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              Selesai & Kumpul
            </button>
          </div>

          {/* Editor/Tampilan Soal Aktif */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-slate-800/50 flex justify-between items-center transition-colors">
                <h3 className="font-extrabold text-indigo-900 dark:text-indigo-400 text-sm">
                  SOAL NOMOR {activeQ.nomor}
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-150 dark:border-slate-750 uppercase">
                  {activeQ.tipe === 'pg' ? 'Pilihan Ganda' : activeQ.tipe === 'pgk' || activeQ.tipe === 'pg_kompleks' ? 'PG Kompleks' : activeQ.tipe === 'bs' ? 'Benar/Salah' : 'Uraian / Essay'}
                </span>
              </div>

              <div className="p-6 lg:p-8 space-y-6">
                <div className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">{activeQ.pertanyaan}</div>

                {/* PG Options */}
                {activeQ.tipe === 'pg' && activeQ.options && (
                  <div className="space-y-3 pt-2">
                    {activeQ.options.map((opt, oIdx) => {
                      const label = ['A', 'B', 'C', 'D', 'E'][oIdx];
                      const selected = answers[activeQ.id] === label;
                      return (
                        <div key={label} onClick={() => handleSelectAnswer(label)}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            selected
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/20'
                          }`}>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black border transition-colors ${
                            selected
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}>
                            {label}
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* PGK / PG Kompleks Options */}
                {(activeQ.tipe === 'pgk' || activeQ.tipe === 'pg_kompleks') && activeQ.options && (
                  <div className="space-y-3 pt-2">
                    {activeQ.options.map((opt, oIdx) => {
                      const label = ['A', 'B', 'C', 'D', 'E'][oIdx];
                      const selected = answers[activeQ.id]?.split(', ').includes(label);
                      return (
                        <div key={label} onClick={() => handleSelectMultiAnswer(label)}
                          className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            selected
                              ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-500/10 shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-amber-200'
                          }`}>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black border transition-colors ${
                            selected
                              ? 'bg-amber-500 text-white border-amber-600'
                              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                          }`}>
                            {label}
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* BS (Benar/Salah) Options */}
                {activeQ.tipe === 'bs' && (
                  <div className="flex gap-4 pt-2">
                    {['BENAR', 'SALAH'].map(val => {
                      const selected = answers[activeQ.id] === val;
                      return (
                        <div key={val} onClick={() => handleSelectAnswer(val)}
                          className={`flex-1 p-4 rounded-2xl border-2 text-center font-bold text-lg cursor-pointer transition-all ${
                            selected
                              ? val === 'BENAR'
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'
                          }`}>
                          {val}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Essay Area */}
                {activeQ.tipe === 'essay' && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">Ketikkan Jawaban Anda:</label>
                    <textarea
                      value={answers[activeQ.id] || ''}
                      onChange={e => setAnswers(prev => ({ ...prev, [activeQ.id]: e.target.value }))}
                      rows={5}
                      placeholder="Jawab pertanyaan secara jelas dan teratur di sini..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                    />
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button
                    disabled={activeQuestionIdx === 0}
                    onClick={() => setActiveQuestionIdx(prev => prev - 1)}
                    className="px-5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>
                  <button
                    disabled={activeQuestionIdx === selectedExam.questions.length - 1}
                    onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Simpan & Lanjut
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (view === 'result' && selectedExam) {
    return (
      <AdminLayout title="Hasil Ujian CBT">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-lg text-center mt-12">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Ujian Berhasil Dikirim</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">{selectedExam.title}</p>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nilai Anda</div>
            <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mt-2">{finalScore}</div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">Nilai ini telah dikirim ke sistem guru pengajar.</p>
          </div>

          <button onClick={() => setView('list')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-sm active:scale-95 transition-all">
            Kembali ke Beranda CBT
          </button>
        </div>
      </AdminLayout>
    );
  }

  const allExams = [...exams, ...completed];

  return (
    <AdminLayout title="Ujian Online (CBT) Siswa">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-center justify-between">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center gap-2"><FileQuestion className="w-5 h-5 text-indigo-500" /> Daftar Ujian Online</h3>
          <div className="flex items-center gap-3">
            <select value={filterTipe} onChange={e => setFilterTipe(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
              <option value="">Semua Tipe</option>
              <option value="ujian">Ujian</option>
              <option value="ulangan_harian">Ulangan Harian</option>
              <option value="kuis">Kuis</option>
            </select>
            <div className="relative max-w-xs w-48">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Cari ujian..." className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allExams
              .filter(e => !filterTipe || e.tipe === filterTipe)
              .map(exam => (
              <div key={exam.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:shadow-md transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${TIPE_BADGE[exam.tipe].color}`}>
                      {TIPE_BADGE[exam.tipe].label}
                    </span>
                    {exam.status === 'selesai' ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg">SELESAI</span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg animate-pulse">AKTIF</span>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white leading-tight mb-1">{exam.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">{exam.mapel} • {exam.kelas}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-4">{exam.soalCount} Soal • {exam.timeLimit} Menit</p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  {exam.status === 'selesai' ? (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Nilai CBT</div>
                      <div className="font-black text-emerald-600 text-lg">{exam.score !== undefined ? exam.score : '-'}</div>
                    </div>
                  ) : (
                    <button onClick={() => startExamRequest(exam)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5 active:scale-95 transition-all">
                      <Play className="w-3.5 h-3.5 fill-white" /> Mulai Ujian
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {allExams.length === 0 && (
            <div className="text-center py-12">
              <FileQuestion className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Belum ada ujian yang tersedia</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Masukkan Token */}
      {showTokenModal && selectedExam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTokenModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" /> Masukkan Token Ujian
              </h3>
              <button onClick={() => setShowTokenModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ujian <strong>{selectedExam.title}</strong> membutuhkan token persetujuan untuk dapat dimulai.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">Token Ujian</label>
                <input
                  type="text"
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && verifyToken()}
                  placeholder="Ketik token..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm font-black focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white uppercase tracking-widest"
                />
                {tokenError && <p className="text-xs font-bold text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {tokenError}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowTokenModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Batal
                </button>
                <button onClick={verifyToken} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm active:scale-95">
                  Mulai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
