import AdminLayout from '../../../components/admin/AdminLayout';
import { Trash2, UploadCloud } from 'lucide-react';

export default function AdminGaleriList() {
  const photos = [
    { id: 1, title: 'Gedung Sekolah', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80' },
    { id: 2, title: 'Laboratorium Komputer', url: 'https://images.unsplash.com/photo-1571260899304-4250b5377537?w=500&q=80' },
    { id: 3, title: 'Perpustakaan', url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=500&q=80' },
    { id: 4, title: 'Lapangan Olahraga', url: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=500&q=80' },
  ];

  return (
    <AdminLayout title="Manajemen Galeri">
      
      {/* Upload Area */}
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 mb-8 border border-slate-100 dark:border-slate-800">
        <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 transition-colors">
          <UploadCloud className="w-10 h-10 text-indigo-500 mb-3" />
          <h3 className="font-semibold text-slate-800 dark:text-white text-lg">Klik atau seret foto ke sini</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Mendukung format JPG, PNG. Maksimal ukuran file 2MB.</p>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Pilih File Foto
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-slate-800 dark:text-white text-lg">Foto Terpublikasi</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">{photos.length} Foto</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="group relative rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-700">
              <img src={photo.url} alt={photo.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white text-xs font-medium truncate mb-2">{photo.title}</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-md flex items-center justify-center gap-1 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">HAPUS</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
