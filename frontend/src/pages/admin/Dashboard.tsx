import AdminLayout from '../../components/admin/AdminLayout';
import { Users, Newspaper, ClipboardList, LineChart } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Pengguna', value: '1,240', icon: Users, color: 'bg-blue-500' },
    { label: 'Berita Aktif', value: '45', icon: Newspaper, color: 'bg-indigo-500' },
    { label: 'Pendaftar SPMB', value: '128', icon: ClipboardList, color: 'bg-emerald-500' },
    { label: 'Rata-rata Nilai', value: '82.5', icon: LineChart, color: 'bg-amber-500' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-[15px] p-6 shadow-card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[15px] p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            <div className="text-sm text-slate-500 border border-slate-100 rounded-lg p-4 bg-slate-50">
              Belum ada aktivitas yang direkam.
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-[15px] p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Akses Cepat</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl text-sm font-medium transition-colors border border-slate-100">
              + Tambah Berita Baru
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl text-sm font-medium transition-colors border border-slate-100">
              + Tambah Pengguna
            </button>
            <button className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl text-sm font-medium transition-colors border border-slate-100">
              Data Pendaftar SPMB
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
