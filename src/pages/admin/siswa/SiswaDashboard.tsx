import AdminLayout from '../../../components/admin/AdminLayout';
import { CalendarDays, Clock, FileText, Bell, ArrowRight, AlertCircle, CheckSquare, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SiswaDashboard() {
  const stats = [
    { label: 'Rata-rata Nilai', value: '88.4', sub: 'Semester Ganjil', icon: Award, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Kehadiran', value: '98.5%', sub: 'Hadir: 65, Absen: 1', icon: Clock, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Tugas Belum Kumpul', value: '2', sub: 'Deadline terdekat: Besok', icon: AlertCircle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Ujian Aktif (CBT)', value: '1', sub: 'Token diperlukan', icon: CheckSquare, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
  ];

  const todayClasses = [
    { time: '07:00 - 08:30', mapel: 'Matematika Wajib', guru: 'Ahmad Hidayat, S.Pd', status: 'sekarang' },
    { time: '08:30 - 10:00', mapel: 'Bahasa Inggris', guru: 'Siti Aminah, M.Pd', status: 'nanti' },
    { time: '10:00 - 10:15', mapel: 'Istirahat', guru: '', status: 'istirahat' },
    { time: '10:15 - 11:45', mapel: 'Fisika', guru: 'Bambang Wijaya, S.Pd', status: 'nanti' },
  ];

  const pendingTugas = [
    { id: 1, title: 'PR LKS Hal 24-25', mapel: 'Matematika Wajib', deadline: 'Besok, 23:59 WIB', status: 'belum' },
    { id: 2, title: 'Laporan Praktikum Kinematika', mapel: 'Fisika', deadline: 'Kamis, 23:59 WIB', status: 'belum' },
  ];

  const announcements = [
    { tag: 'Akademik', title: 'Penilaian Tengah Semester (PTS) Ganjil dimulai tanggal 12 Oktober 2024.', date: '1 jam lalu' },
    { tag: 'Pengumuman', title: 'Libur Maulid Nabi Muhammad SAW jatuh pada hari Senin depan.', date: 'Kemarin' },
  ];

  return (
    <AdminLayout title="Ruang Belajar Siswa">
      
      {/* Sapaan & Smart Alert */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black mb-1">Selamat Pagi, Agus Setiawan!</h2>
          <p className="text-violet-100 font-medium mb-6">Siswa Kelas X-1 • NISN: 0081234501</p>
          
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-400 text-white p-3 rounded-xl shadow-inner shrink-0">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none mb-1">Pelajaran Sedang Berlangsung</h3>
                <p className="text-sm text-violet-100">Matematika Wajib (07:00 - 08:30) oleh Ahmad Hidayat, S.Pd</p>
              </div>
            </div>
            <Link to="/panel/siswa/materi" className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0">
              Buka Materi Pelajaran <ArrowRight className="w-4 h-4" />
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
        
        {/* Kolom Kiri: Timeline Jadwal Hari Ini */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-indigo-500" /> Jadwal Kelas Hari Ini
            </h3>
            
            <div className="space-y-4">
              {todayClasses.map((c, i) => (
                <div key={i} className={`p-4 rounded-2xl border transition-colors ${
                  c.status === 'sekarang' 
                    ? 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-150 dark:border-indigo-500/20' 
                    : c.status === 'istirahat'
                      ? 'bg-amber-50/30 dark:bg-amber-500/5 border-amber-100/30 dark:border-amber-500/10'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">{c.mapel}</span>
                    {c.status === 'sekarang' && (
                      <span className="text-[11px] sm:text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2.5 sm:px-3 py-1 rounded-md shadow-sm border border-indigo-100 dark:border-indigo-500/20 animate-pulse whitespace-nowrap">Sekarang</span>
                    )}
                    {c.status === 'istirahat' && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Istirahat</span>
                    )}
                  </div>
                  {c.guru && <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{c.guru}</p>}
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium font-mono">{c.time} WIB</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Tugas Menunggu Pengerjaan & Pengumuman */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tugas/PR */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500" /> Tugas & PR Menunggu</h3>
              <Link to="/panel/siswa/tugas" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Lihat Semua</Link>
            </div>
            
            <div className="space-y-4">
              {pendingTugas.map(t => (
                <div key={t.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-tight mb-1">{t.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t.mapel} • Deadline: <span className="text-amber-600 font-semibold">{t.deadline}</span></p>
                      </div>
                    </div>
                    <Link to={`/panel/siswa/tugas/detail/${t.id}`} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 text-center shrink-0">
                      Kerjakan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pengumuman */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2"><Award className="w-5 h-5 text-indigo-500" /> Pengumuman Sekolah</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {announcements.map((a, i) => (
                <div key={i} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 sm:px-3 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-md whitespace-nowrap">{a.tag}</span>
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
