import AdminLayout from '../../components/admin/AdminLayout';
import { Users, GraduationCap, BookOpen, Wallet, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboard';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';

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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
             <div className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 p-4 rounded-xl flex items-center gap-2 border border-indigo-100 dark:border-indigo-800/50">
              <AlertCircle className="w-5 h-6" />
              {error}
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
      },
    ],
  } : null;

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats?.cards?.map((stat, i) => {
          const Icon = iconMap[stat.icon] || Users;
          const statColor = stat.color || 'bg-indigo-500';
          return (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-lg dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-800/50 flex items-center gap-4 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${statColor} group-hover:brightness-110 transition-all`}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-bold tracking-wide mb-1">{stat.name}</div>
                <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight truncate">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-800/50">
          <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
            Status Kehadiran Hari Ini
          </h2>
          <div className="h-[300px] flex items-center justify-center">
            {chartData && chartData.datasets[0].data.some((v: number) => v > 0) ? (
              <Doughnut 
                data={chartData} 
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        padding: 15,
                        font: { size: 11, weight: 'bold' }
                      }
                    }
                  }
                }} 
              />
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4 opacity-50" />
                <p className="text-slate-400 dark:text-slate-500 font-medium">Belum ada data kehadiran hari ini</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg dark:shadow-slate-900/20 border border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-slate-800 dark:text-white">Statistik</h3>
            <TrendingUp className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Total Siswa</span>
              <span className="font-black text-indigo-600 dark:text-indigo-400">{stats?.total_siswa || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Total Guru</span>
              <span className="font-black text-indigo-600 dark:text-indigo-400">{stats?.total_guru || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Hadir Hari Ini</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">{stats?.hadir_hari_ini || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 shadow-lg text-white">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-white/30 rounded-full"></div>
            Akses Cepat
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left px-5 py-4 bg-white/10 hover:bg-white/20 text-white hover:text-indigo-100 rounded-2xl text-sm font-bold transition-all border border-white/10 active:scale-95 backdrop-blur-sm">
              + Tambah Pengguna
            </button>
            <button className="w-full text-left px-5 py-4 bg-white/10 hover:bg-white/20 text-white hover:text-indigo-100 rounded-2xl text-sm font-bold transition-all border border-white/10 active:scale-95 backdrop-blur-sm">
              Tinjau Kehadiran
            </button>
            <button className="w-full text-left px-5 py-4 bg-white/10 hover:bg-white/20 text-white hover:text-indigo-100 rounded-2xl text-sm font-bold transition-all border border-white/10 active:scale-95 backdrop-blur-sm">
              Kelola Kelas
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
