import AdminLayout from '../../../components/admin/AdminLayout';
import { CalendarDays, Clock, FileText, Bell, ArrowRight, Users, BookOpen, AlertCircle, TrendingUp, CheckSquare, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuruDashboard() {
  const stats = [
    { label: 'Siswa Diampu', value: '64', sub: 'Kelas X-1 & X-2', icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Jam Mengajar', value: '18 Jam', sub: '/minggu', icon: BookOpen, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Tugas Belum Dinilai', value: '3', sub: '25 pengumpulan baru', icon: AlertCircle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Kehadiran Kelas Wali', value: '98.2%', sub: 'Hari ini di X-1', icon: TrendingUp, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  ];

  const upcomingClasses = [
    { time: '07:00 - 08:30', kelas: 'Kelas X-1', mapel: 'Matematika Wajib', status: 'sekarang' },
    { time: '08:30 - 10:00', kelas: 'Kelas X-2', mapel: 'Matematika Wajib', status: 'nanti' },
    { time: '10:15 - 11:45', kelas: 'Kelas XI-IPA-1', mapel: 'Matematika Peminatan', status: 'nanti' },
  ];

  const pendingTasks = [
    { id: 1, title: 'Tugas Eksponen', kelas: 'Kelas X-2', submitted: 28, total: 30, date: 'Kemarin' },
    { id: 2, title: 'Kuis Logaritma Dasar', kelas: 'Kelas X-1', submitted: 32, total: 32, date: '2 hari lalu' },
    { id: 3, title: 'PR Sifat Logaritma', kelas: 'Kelas X-1', submitted: 15, total: 32, date: 'Hari ini' },
  ];

  const announcements = [
    { tag: 'Akademik', title: 'Penginputan nilai Rapor PTS dibuka s.d 30 Oktober 2024.', date: '1 jam lalu' },
    { tag: 'Rapat', title: 'Rapat Evaluasi Pembelajaran Semester Ganjil hari Jumat pukul 13:00 WIB.', date: 'Kemarin' },
  ];

  return (
    <AdminLayout title="Dashboard Ruang Guru">
      
      {/* Sapaan & Smart Alert */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black mb-1">Selamat Pagi, Bapak Ahmad Hidayat!</h2>
          <p className="text-indigo-100 font-medium mb-6">Guru Matematika • Wali Kelas X-1</p>
          
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-400 text-white p-3 rounded-xl shadow-inner shrink-0">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none mb-1">Sesi Mengajar Saat Ini</h3>
                <p className="text-sm text-indigo-100">Matematika Wajib di Kelas X-1 (07:00 - 08:30)</p>
              </div>
            </div>
            <Link to="/panel/guru/jurnal" className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0">
              Isi Jurnal Kelas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.label}</span>
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{s.value}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Timeline Jadwal & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Jadwal Hari Ini */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-500" /> Jadwal Mengajar Hari Ini
            </h3>
            
            <div className="space-y-4">
              {upcomingClasses.map((c, i) => (
                <div key={i} className={`p-4 rounded-2xl border transition-colors ${
                  c.status === 'sekarang' 
                    ? 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-150 dark:border-indigo-500/20' 
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">{c.kelas}</span>
                    {c.status === 'sekarang' ? (
                      <span className="text-[11px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2.5 sm:px-3 py-1 rounded-md shadow-sm border border-indigo-100 dark:border-indigo-500/20 animate-pulse whitespace-nowrap">Sedang Berlangsung</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Nanti</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mb-1">{c.mapel}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium font-mono">{c.time} WIB</p>
                </div>
              ))}
            </div>
          </div>

          {/* Akses Cepat */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Akses Menu Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Input Jurnal', path: '/panel/guru/jurnal', bg: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' },
                { label: 'Buku Nilai', path: '/panel/guru/nilai', bg: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
                { label: 'Bank Soal', path: '/panel/guru/soal', bg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' },
                { label: 'Bank Materi', path: '/panel/guru/materi', bg: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400' },
              ].map(opt => (
                <Link key={opt.label} to={opt.path} className={`p-4 rounded-xl font-bold text-center text-xs shadow-sm transition-all hover:-translate-y-0.5 ${opt.bg}`}>
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Tugas Menunggu Penilaian & Pengumuman */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tugas Belum Dinilai */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><CheckSquare className="w-5 h-5 text-indigo-500" /> Tugas Menunggu Penilaian</h3>
              <Link to="/panel/guru/tugas" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Lihat Semua</Link>
            </div>
            
            <div className="space-y-4">
              {pendingTasks.map(t => {
                const progress = Math.round((t.submitted / t.total) * 100);
                return (
                  <div key={t.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-tight mb-1">{t.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t.kelas} • Dikumpul {t.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="flex-1 sm:text-right">
                          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.submitted} / {t.total} Siswa</div>
                          <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                        <Link to={`/panel/guru/nilai/detail/${t.id}`} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 text-center shrink-0">
                          Nilai
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pengumuman Internal */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2"><Award className="w-5 h-5 text-indigo-500" /> Pengumuman Sekolah</h3>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {announcements.map((a, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 sm:px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-md whitespace-nowrap">{a.tag}</span>
                    <span className="text-[10px] text-slate-400">{a.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-relaxed">{a.title}</h4>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
}
