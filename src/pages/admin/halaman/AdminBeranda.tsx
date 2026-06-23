import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import { useState } from 'react';

export default function AdminBeranda() {
  const [stats] = useState([
    { id: 1, label: 'Siswa Aktif', value: '850+', icon: 'Users' },
    { id: 2, label: 'Guru & Staf', value: '45+', icon: 'GraduationCap' },
    { id: 3, label: 'Ekstrakurikuler', value: '30+', icon: 'Activity' },
    { id: 4, label: 'Akreditasi', value: 'A', icon: 'Award' },
  ]);

  return (
    <AdminLayout title="Pengaturan Halaman Beranda">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Kolom Kiri: Hero & Highlight */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-indigo-500" /> Hero Section (Banner Atas)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Headline Utama</label>
                <input type="text" defaultValue="Pendidikan Modern & Berkarakter" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Sub-headline (Deskripsi Pendek)</label>
                <textarea rows={2} defaultValue="Membentuk generasi unggul berkarakter Islami, cerdas secara akademis, dan terampil menyongsong masa depan." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Teks Tombol Utama (CTA)</label>
                  <input type="text" defaultValue="Daftar Sekarang" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Link Tautan Tombol</label>
                  <input type="text" defaultValue="/spmb" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-500" /> Highlight Prestasi (Pin Berita)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Pilih maksimal 3 berita prestasi untuk ditampilkan khusus di halaman depan.</p>
            
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-400 dark:text-slate-500 dark:text-slate-400 w-6">{item}.</div>
                  <select className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 dark:text-slate-300 dark:text-slate-200">
                    <option>Prestasi Gemilang Siswa di OSN 2024</option>
                    <option>Juara 1 Lomba Robotik Nasional</option>
                    <option>Tim Basket Lolos ke Final DBL</option>
                    <option value="">-- Pilih Berita --</option>
                  </select>
                  <button className="p-2 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Statistik & Aksi */}
        <div className="xl:col-span-1 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-white">Widget Statistik</h3>
              <button className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {stats.map((s) => (
                <div key={s.id} className="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl hover:border-indigo-400 transition-colors">
                  <GripVertical className="w-4 h-4 text-slate-400 dark:text-slate-500 dark:text-slate-400 cursor-grab active:cursor-grabbing shrink-0" />
                  <div className="flex-1 space-y-2">
                    <input type="text" defaultValue={s.value} className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded text-sm font-bold focus:outline-none" placeholder="Angka" />
                    <input type="text" defaultValue={s.label} className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:border-slate-700 focus:border-indigo-500 rounded text-xs text-slate-600 dark:text-slate-400 focus:outline-none" placeholder="Label" />
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-red-500 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 text-center">Angka statistik ini muncul di bawah Hero section.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800 sticky top-24">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Aksi Publikasi</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Pastikan semua data sudah benar sebelum menyimpan. Perubahan akan langsung terlihat di website publik.</p>
            <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm">
              <Save className="w-4 h-4" /> Simpan Perubahan Beranda
            </button>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
