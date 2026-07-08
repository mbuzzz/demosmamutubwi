import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { useSistemKonfigurasi } from '../hooks/useSistemKonfigurasi';
import { getFileUrl } from '../lib/api';

export default function Login() {
  const { data: config } = useSistemKonfigurasi();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-3xl relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors font-semibold text-sm">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
          <div className="flex items-center justify-center gap-3 mt-4">
            <img src={config?.logo_sekolah ? getFileUrl(config.logo_sekolah) : "/logo.png"} alt="Logo SMAS Muh 1" className="h-14 w-14 object-contain bg-white dark:bg-slate-900 p-2 rounded-[15px] shadow-sm" />
            <div className="text-left">
              <h1 className="font-extrabold text-2xl text-slate-800 dark:text-white leading-tight">SMAS Muhammadiyah 1</h1>
              <p className="text-emerald-650 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs">Banyuwangi</p>
            </div>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white pt-2">Portal Log In Terpadu</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-sm">
            Selamat datang di Sistem Informasi Terpadu (SIT). Silakan pilih rute portal masuk sesuai dengan peran Anda.
          </p>
        </div>

        {/* 3 Portal Cards (Admin & Bendahara Hidden) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          
          {/* Card 1: Siswa */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-850 dark:text-white text-lg mb-2">Portal Siswa</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Akses untuk melihat jadwal pelajaran, materi belajar KBM, tugas & PR harian, ujian online (CBT), dan rapor penilaian akhir.
              </p>
            </div>
            <Link 
              to="/login/siswa" 
              className="mt-auto w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all active:scale-95 shadow-sm"
            >
              Masuk Portal Siswa <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Orang Tua */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-850 dark:text-white text-lg mb-2">Portal Orang Tua</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Akses untuk memantau absensi kehadiran harian anak, tagihan keuangan & SPP sekolah, daftar tugas LMS, serta rapor nilai akhir anak.
              </p>
            </div>
            <Link 
              to="/login/orang-tua" 
              className="mt-auto w-full flex items-center justify-center gap-2 bg-indigo-650 hover:bg-indigo-750 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all active:scale-95 shadow-sm"
            >
              Masuk Portal Wali <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3: Guru & Staf */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-850 dark:text-white text-lg mb-2">Portal Guru & Staf</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Akses untuk pengisian jurnal mengajar, presensi siswa kelas, bank materi, tugas, bank soal CBT, serta catatan rapor kelas binaan.
              </p>
            </div>
            <Link 
              to="/login/guru" 
              className="mt-auto w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-all active:scale-95 shadow-sm"
            >
              Masuk Portal Guru <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        <div className="text-center text-[10px] text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-850">
          SMAS Muhammadiyah 1 Banyuwangi — Sistem Informasi Terpadu © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
