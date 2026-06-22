import AdminLayout from '../../../components/admin/AdminLayout';
import { CalendarDays, Clock, FileText, CheckCircle, Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuruDashboard() {
  return (
    <AdminLayout title="Dashboard Ruang Guru">
      
      {/* Sapaan & Smart Alert */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-3xl p-8 text-white mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">Selamat Pagi, Bapak Ahmad Hidayat!</h2>
          <p className="text-indigo-100 font-medium mb-6">Guru Matematika • Wali Kelas X-1</p>
          
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-amber-400 text-white p-3 rounded-xl shadow-inner">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-none mb-1">Jadwal Mengajar Sekarang</h3>
                <p className="text-sm text-indigo-100">Matematika Wajib di Kelas X-1 (07:00 - 08:30)</p>
              </div>
            </div>
            <Link to="/panel/guru/jurnal" className="bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm flex items-center gap-2 transition-transform active:scale-95">
              Isi Jurnal Kelas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline Jadwal Hari Ini */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-500" /> Jadwal Hari Ini
          </h3>
          
          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Clock className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-indigo-700 dark:text-indigo-400">Kelas X-1</span>
                  <span className="text-xs font-bold text-indigo-500 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg shadow-sm">Sekarang</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">07:00 - 08:30 • MTK Wajib</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Clock className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">Kelas X-2</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">08:30 - 10:00 • MTK Wajib</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4">
                <div className="font-bold text-slate-400 dark:text-slate-500 text-center">Selesai Kelas Hari Ini</div>
              </div>
            </div>

          </div>
        </div>

        {/* Info & Tugas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Tugas Menunggu Penilaian</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Tugas Eksponen (Kelas X-2)</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Dikumpulkan: Kemarin • 28/30 Siswa</p>
                  </div>
                </div>
                <Link to="/panel/guru/nilai" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors">
                  Nilai Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
