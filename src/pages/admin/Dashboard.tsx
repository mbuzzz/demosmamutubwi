import AdminLayout from '../../components/admin/AdminLayout';
import { Users, Newspaper, ClipboardList, LineChart } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Pengguna', value: '1,240', icon: Users, color: 'bg-blue-500 shadow-blue-500/20' },
    { label: 'Berita Aktif', value: '45', icon: Newspaper, color: 'bg-indigo-500 shadow-indigo-500/20' },
    { label: 'Pendaftar SPMB', value: '128', icon: ClipboardList, color: 'bg-emerald-500 shadow-emerald-500/20' },
    { label: 'Rata-rata Nilai', value: '82.5', icon: LineChart, color: 'bg-amber-500 shadow-amber-500/20' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-card dark:shadow-none border border-transparent dark:border-slate-800 flex items-center gap-5 hover:scale-[1.02] transition-transform cursor-pointer">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide">{stat.label}</div>
              <div className="text-3xl font-black text-slate-800 dark:text-white mt-1 tracking-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-card dark:shadow-none border border-transparent dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            Aktivitas Terbaru
          </h2>
          <div className="space-y-4">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/30 text-center flex flex-col items-center justify-center min-h-[200px]">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <ClipboardList className="w-6 h-6 text-slate-400 dark:text-slate-500 dark:text-slate-400" />
              </div>
              Belum ada aktivitas yang direkam hari ini.
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-card dark:shadow-none border border-transparent dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Akses Cepat</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-5 py-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 rounded-2xl text-sm font-bold transition-all border border-slate-100 dark:border-slate-800 active:scale-95 shadow-sm">
              + Tambah Berita Baru
            </button>
            <button className="w-full text-left px-5 py-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 rounded-2xl text-sm font-bold transition-all border border-slate-100 dark:border-slate-800 active:scale-95 shadow-sm">
              + Tambah Pengguna
            </button>
            <button className="w-full text-left px-5 py-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 rounded-2xl text-sm font-bold transition-all border border-slate-100 dark:border-slate-800 active:scale-95 shadow-sm">
              Tinjau Pendaftar SPMB
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
