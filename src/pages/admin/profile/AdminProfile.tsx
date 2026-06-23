import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, User, Lock, Mail } from 'lucide-react';

export default function AdminProfile() {
  return (
    <AdminLayout title="Profil Saya">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden h-fit border border-slate-100 dark:border-slate-800">
          <div className="bg-indigo-600 h-24"></div>
          <div className="px-6 pb-6 relative">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full p-1 absolute -top-10 left-6">
              <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl border border-indigo-200">
                SA
              </div>
            </div>
            <div className="pt-12">
              <h2 className="font-bold text-slate-800 dark:text-white text-lg">Superadmin SIT</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">admin@smasmuh1bwi.sch.id</p>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium border border-purple-100">Superadmin</span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-medium border border-emerald-100">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Informasi Dasar</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" defaultValue="Superadmin SIT" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="email" defaultValue="admin@smasmuh1bwi.sch.id" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="pt-2">
                <button type="button" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Save className="w-4 h-4" /> Simpan Profil
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Ubah Password</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Password Saat Ini</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="password" placeholder="Masukkan password lama" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Password Baru</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="password" placeholder="Masukkan password baru" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="pt-2">
                <button type="button" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <Save className="w-4 h-4" /> Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
