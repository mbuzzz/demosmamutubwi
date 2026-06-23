import AdminLayout from '../../../../components/admin/AdminLayout';
import { Save, Search, User } from 'lucide-react';

export default function AdminCatatanWali() {
  return (
    <AdminLayout title="Input Catatan Wali Kelas & Ekstrakurikuler">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50/50 flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Tahun & Semester</label>
            <select className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold">
              <option>2024/2025 - Ganjil</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Pilih Kelas Binaan</label>
            <select className="w-full sm:w-32 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700">
              <option>X-1</option>
            </select>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
            Tampilkan Daftar Siswa
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* List Siswa */}
          <div className="xl:col-span-1 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col h-[600px]">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 relative">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 absolute left-6 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Cari siswa..." className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
              <button className="w-full text-left p-4 bg-indigo-50/50 border-l-4 border-indigo-600 hover:bg-indigo-50 transition-colors">
                <div className="font-bold text-indigo-900 text-sm">Agus Setiawan</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">NISN: 0081234501</div>
              </button>
              <button className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50 transition-colors border-l-4 border-transparent">
                <div className="font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 text-sm">Budi Raharjo</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">NISN: 0081234502</div>
              </button>
              <button className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50 transition-colors border-l-4 border-transparent">
                <div className="font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 text-sm">Citra Kirana</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">NISN: 0081234503</div>
              </button>
            </div>
          </div>

          {/* Form Input Wali Kelas */}
          <div className="xl:col-span-3 space-y-6">
            <div className="flex justify-between items-center bg-indigo-600 text-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-slate-900/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">Agus Setiawan</h3>
                  <p className="text-indigo-200 text-xs mt-1">Kelas X-1 • Wali Kelas: Anda</p>
                </div>
              </div>
              <button className="bg-white dark:bg-slate-900 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2">
                <Save className="w-4 h-4" /> Simpan Rapor Anak Ini
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Catatan Perkembangan Karakter</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Sikap Spiritual</label>
                  <textarea rows={2} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue="Sangat baik dalam melaksanakan ibadah sholat berjamaah dan tadarus Al-Quran."></textarea>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Sikap Sosial</label>
                  <textarea rows={2} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue="Memiliki kepedulian tinggi terhadap teman sebaya dan sopan santun yang baik kepada guru."></textarea>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Catatan Umum Wali Kelas</label>
                  <textarea rows={3} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-indigo-900" defaultValue="Pertahankan prestasimu dan tingkatkan lagi kedisiplinan dalam mengumpulkan tugas tepat waktu."></textarea>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Nilai Ekstrakurikuler</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <input type="text" defaultValue="Pramuka (Wajib)" className="w-1/2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-500 dark:text-slate-400" readOnly />
                      <select className="w-1/2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>A (Sangat Baik)</option>
                        <option selected>B (Baik)</option>
                        <option>C (Cukup)</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <input type="text" defaultValue="Tapak Suci" className="w-1/2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm text-slate-500 dark:text-slate-400" readOnly />
                      <select className="w-1/2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500">
                        <option selected>A (Sangat Baik)</option>
                        <option>B (Baik)</option>
                        <option>C (Cukup)</option>
                      </select>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800">+ Tambah Ekstrakurikuler Pilihan</button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Rekap Ketidakhadiran (Sistem)</h4>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mb-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Sakit</span>
                    <input type="number" defaultValue="2" className="w-16 px-2 py-1 text-center border border-slate-200 dark:border-slate-700 rounded text-sm font-bold text-amber-600" />
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mb-2">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Izin</span>
                    <input type="number" defaultValue="0" className="w-16 px-2 py-1 text-center border border-slate-200 dark:border-slate-700 rounded text-sm font-bold text-blue-600" />
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Tanpa Keterangan (Alpa)</span>
                    <input type="number" defaultValue="0" className="w-16 px-2 py-1 text-center border border-slate-200 dark:border-slate-700 rounded text-sm font-bold text-red-600" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
