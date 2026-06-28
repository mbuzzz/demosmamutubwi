import AdminLayout from '../../components/admin/AdminLayout';
import { Users, GraduationCap, BookOpen, Wallet, AlertCircle } from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboard';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const iconMap: { [key: string]: React.ElementType } = {
  Users: Users,
  GraduationCap: GraduationCap,
  BookOpen: BookOpen,
  Wallet: Wallet,
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
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
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
          return (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-card dark:shadow-none border border-transparent dark:border-slate-800 flex items-center gap-5 hover:scale-[1.02] transition-transform cursor-pointer">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold tracking-wide">{stat.name}</div>
                <div className="text-3xl font-black text-slate-800 dark:text-white mt-1 tracking-tight">{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-card dark:shadow-none border border-transparent dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            Status Kehadiran Hari Ini
          </h2>
          <div className="h-[300px] flex items-center justify-center">
            {chartData && chartData.datasets[0].data.some((v: number) => v > 0) ? (
              <Doughnut 
                data={chartData} 
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }} 
              />
            ) : (
              <div className="text-slate-400">Belum ada data kehadiran hari ini</div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-card dark:shadow-none border border-transparent dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Akses Cepat</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-5 py-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 rounded-2xl text-sm font-bold transition-all border border-slate-100 dark:border-slate-800 active:scale-95 shadow-sm">
              + Tambah Pengguna
            </button>
            <button className="w-full text-left px-5 py-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 rounded-2xl text-sm font-bold transition-all border border-slate-100 dark:border-slate-800 active:scale-95 shadow-sm">
              Tinjau Kehadiran
            </button>
            <button className="w-full text-left px-5 py-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 rounded-2xl text-sm font-bold transition-all border border-slate-100 dark:border-slate-800 active:scale-95 shadow-sm">
              Kelola Kelas
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
