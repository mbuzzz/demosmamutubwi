import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Wallet, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  UserPlus, 
  Clock, 
  Settings, 
  ArrowRight,
  School
} from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboard';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const iconMap: { [key: string]: React.ElementType } = {
  Users: Users,
  GraduationCap: GraduationCap,
  BookOpen: BookOpen,
  Wallet: Wallet,
  TrendingUp: TrendingUp,
  Calendar: Calendar,
};

export default function AdminDashboard() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Memuat statistik dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 p-5 rounded-2xl flex items-center gap-3 border border-red-100 dark:border-red-900/30 max-w-2xl mx-auto mt-8">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div>
            <h4 className="font-black text-sm">Gagal memuat data</h4>
            <p className="text-xs text-red-500 dark:text-red-400/80 mt-0.5">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const chartData = stats?.kehadiran ? {
    labels: stats.kehadiran.map((item: any) => item.name),
    datasets: [
      {
        data: stats.kehadiran.map((item: any) => item.value),
        backgroundColor: stats.kehadiran.map((item: any) => item.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  } : null;

  const totalKehadiran = stats?.kehadiran_hari_ini 
    ? (stats.kehadiran_hari_ini.hadir + stats.kehadiran_hari_ini.alpha) 
    : 0;

  const persentaseHadir = totalKehadiran > 0 
    ? Math.round((stats.kehadiran_hari_ini.hadir / totalKehadiran) * 100) 
    : 100;

  const todayStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <AdminLayout title="Dashboard Utama">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-sm relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">Selamat Datang di Portal Admin!</h2>
            <p className="text-slate-300 text-sm mt-1.5 font-medium">Sistem Informasi Terpadu SMAM1 BANYUWANGI</p>
          </div>
          <div className="bg-white/10 border border-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-inner">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-100 tracking-wide font-sans">{todayStr}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats?.cards?.map((stat, i) => {
          const Icon = iconMap[stat.icon] || Users;
          const statColor = stat.color || 'bg-indigo-500';
          
          return (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800/80 flex items-center gap-5 hover:shadow-md hover:scale-[1.01] transition-all duration-300 cursor-pointer group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-white ${statColor} shadow-md group-hover:scale-105 transition-all duration-300`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-slate-400 dark:text-slate-400 text-xs font-extrabold uppercase tracking-widest">{stat.name}</div>
                <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-1 tracking-tight truncate">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts & Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Kehadiran Doughnut Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                Status Kehadiran Hari Ini
              </h2>
              {stats?.kehadiran_hari_ini && (
                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 rounded-xl uppercase tracking-wider">
                  {persentaseHadir}% Hadir
                </span>
              )}
            </div>

            <div className="h-[280px] flex items-center justify-center relative">
              {chartData && chartData.datasets[0].data.some((v: number) => v > 0) ? (
                <div className="w-full h-full max-w-[260px] max-h-[260px]">
                  <Doughnut 
                    data={chartData} 
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                      cutout: '75%',
                      plugins: {
                        legend: {
                          display: false // We will render custom legend below or use default chartjs legend
                        }
                      }
                    }} 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">{stats.kehadiran_hari_ini.hadir}</span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Siswa Hadir</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-slate-200 dark:text-slate-700 mx-auto mb-4 opacity-75" />
                  <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">Belum ada data kehadiran terekam hari ini</p>
                </div>
              )}
            </div>
          </div>

          {/* Custom Modern Legend Grid */}
          {stats?.kehadiran && (
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6">
              {stats.kehadiran.map((item: any, idx: number) => (
                <div key={idx} className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">{item.name}</span>
                  </div>
                  <span className="text-lg font-black text-slate-800 dark:text-white">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right Column: Statistik & Akses Cepat */}
        <div className="space-y-8">
          
          {/* Quick Statistics Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-slate-800 dark:text-white text-lg flex items-center gap-2">
                <div className="w-1.5 h-5 bg-emerald-500 rounded-full"></div>
                Ringkasan Statistik
              </h3>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">Total Siswa Terdaftar</span>
                </div>
                <span className="font-black text-slate-800 dark:text-white">{stats?.total_siswa || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">Total Guru Pengampu</span>
                </div>
                <span className="font-black text-slate-800 dark:text-white">{stats?.total_guru || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/20">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <School className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">Total Kelas / Rombel</span>
                </div>
                <span className="font-black text-slate-800 dark:text-white">{stats?.total_kelas || 0}</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800/80">
            <h3 className="font-black text-slate-800 dark:text-white text-lg mb-5 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-indigo-500 rounded-full"></div>
              Akses Cepat Admin
            </h3>
            
            <div className="space-y-3">
              <Link 
                to="/panel/users" 
                className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-indigo-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800/50 transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">Tambah / Edit Pengguna</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1.5 transition-transform duration-350" />
              </Link>

              <Link 
                to="/panel/absensi" 
                className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-indigo-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800/50 transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">Monitoring Absensi</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1.5 transition-transform duration-350" />
              </Link>

              <Link 
                to="/panel/kelas" 
                className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-indigo-50/50 dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800/50 transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">Kelola Ruang Kelas</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1.5 transition-transform duration-350" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
