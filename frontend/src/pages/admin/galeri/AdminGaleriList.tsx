import AdminLayout from '../../../components/admin/AdminLayout';
import { Trash2, UploadCloud, Loader2 } from 'lucide-react';
import { useGaleriList, useCreateGaleri, useDeleteGaleri } from '../../../hooks/useGaleri';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function AdminGaleriList() {
  const { data: photos, isLoading } = useGaleriList();
  const createGaleri = useCreateGaleri();
  const deleteGaleri = useDeleteGaleri();
  const [judul, setJudul] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const jdl = judul || file.name.split('.')[0];
    
    const formData = new FormData();
    formData.append('judul', jdl);
    formData.append('file', file);
    formData.append('tipe', 'image'); // Default for now

    try {
      await createGaleri.mutateAsync(formData);
      setJudul(''); // Reset judul
    } catch {}
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Foto?',
      text: "Foto akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      await deleteGaleri.mutateAsync(id);
    }
  };

  return (
    <AdminLayout title="Manajemen Galeri">
      
      {/* Upload Area */}
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 mb-8 border border-slate-100 dark:border-slate-800">
        <div className="max-w-md mx-auto mb-4">
           <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Judul Foto (Opsional)</label>
           <input type="text" value={judul} onChange={e => setJudul(e.target.value)} placeholder="Masukkan judul sebelum memilih foto..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
        </div>
        <label className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors block">
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={createGaleri.isPending} />
          {createGaleri.isPending ? (
            <Loader2 className="w-10 h-10 text-indigo-500 mb-3 animate-spin" />
          ) : (
            <UploadCloud className="w-10 h-10 text-indigo-500 mb-3" />
          )}
          <h3 className="font-semibold text-slate-800 dark:text-white text-lg">Klik atau seret foto ke sini</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Mendukung format JPG, PNG, WEBP.</p>
        </label>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-slate-800 dark:text-white text-lg">Foto Terpublikasi</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">{photos?.length || 0} Foto</span>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : photos?.length === 0 ? (
          <div className="text-center py-10 text-slate-500">Belum ada foto di galeri</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos?.map(photo => (
              <div key={photo.id} className="group relative rounded-xl overflow-hidden aspect-square border border-slate-200 dark:border-slate-700">
                <img src={photo.file_url} alt={photo.judul} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-white text-xs font-medium truncate mb-2">{photo.judul}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(photo.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-md flex items-center justify-center gap-1 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> <span className="text-[10px] font-bold">HAPUS</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
