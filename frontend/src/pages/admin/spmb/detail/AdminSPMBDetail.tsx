import AdminLayout from '../../../../components/admin/AdminLayout';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Eye, FileText, Download, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { usePendaftar, useUpdatePendaftar } from '../../../../hooks/useSPMB';
import { getFileUrl } from '../../../../lib/api';
import { toast } from 'sonner';

export default function AdminSPMBDetail() {
  const { id } = useParams();
  const { data: pendaftar, isLoading } = usePendaftar(id);
  const updateStatus = useUpdatePendaftar();
  const [activeFile, setActiveFile] = useState<{ label: string, url: string } | null>(null);

  if (isLoading) {
    return (
      <AdminLayout title="Verifikasi Berkas Pendaftar">
        <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      </AdminLayout>
    );
  }

  if (!pendaftar) {
    return (
      <AdminLayout title="Verifikasi Berkas Pendaftar">
        <div className="text-center p-10 text-slate-500">Pendaftar tidak ditemukan.</div>
      </AdminLayout>
    );
  }

  const handleUpdateStatus = async (status: 'diterima' | 'ditolak' | 'diverifikasi') => {
    try {
      await updateStatus.mutateAsync({ id: pendaftar.id, data: { status } });
      toast.success(`Status pendaftar diubah menjadi ${status}`);
    } catch {
      toast.error('Gagal mengubah status');
    }
  };

  const formData = pendaftar.data_form || {};
  const fileFields = Object.entries(formData).filter(([_, val]) => typeof val === 'string' && val.startsWith('/storage/'));
  const textFields = Object.entries(formData).filter(([_, val]) => typeof val === 'string' && !val.startsWith('/storage/'));

  return (
    <AdminLayout title="Verifikasi Berkas Pendaftar">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/panel/spmb" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar SPMB
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* Kolom Kiri: Biodata Lengkap */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-start">
              <div>
                <span className="bg-white dark:bg-slate-900/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">REG-{pendaftar.id.padStart(5, '0')}</span>
                <h2 className="text-2xl font-bold leading-none mb-1">{pendaftar.nama_lengkap}</h2>
                <p className="text-indigo-200 text-sm">Gelombang: {pendaftar.gelombang?.nama || 'Unknown'}</p>
                <div className="mt-2 inline-flex">
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                    pendaftar.status === 'baru' ? 'bg-amber-400 text-amber-900' :
                    pendaftar.status === 'diverifikasi' ? 'bg-blue-400 text-blue-900' :
                    pendaftar.status === 'diterima' ? 'bg-emerald-400 text-emerald-900' :
                    'bg-red-400 text-red-900'
                  }`}>Status: {pendaftar.status}</span>
                </div>
              </div>
              <div className="w-20 h-24 bg-white dark:bg-slate-900/10 border-2 border-white/30 rounded flex items-center justify-center text-xs text-center p-2">
                <FileText className="w-6 h-6 mb-1 opacity-50" />
                <span className="opacity-80 leading-tight">SPMB File</span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 uppercase">Data Pribadi Dasar</h3>
              <div className="space-y-3 mb-8">
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">NISN</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">{pendaftar.nisn}</span></div>
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Asal Sekolah</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">{pendaftar.asal_sekolah}</span></div>
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Email</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">{pendaftar.email}</span></div>
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">No. WhatsApp</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">{pendaftar.no_hp}</span></div>
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Alamat</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">{pendaftar.alamat}</span></div>
              </div>

              {textFields.length > 0 && (
                <>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 uppercase">Data Kustom Formulir</h3>
                  <div className="space-y-3">
                    {textFields.map(([key, val]) => (
                      <div key={key} className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">{key}</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">{String(val)}</span></div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Kotak Aksi Final */}
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border-2 border-indigo-100">
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Aksi Verifikasi Final</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Pilih status penerimaan siswa ini. Pendaftar akan menerima notifikasi via Email/Dashboard mereka.</p>
            
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => handleUpdateStatus('diterima')} className="flex flex-col items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 p-4 rounded-xl transition-all group">
                <CheckCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">Terima Siswa</span>
              </button>
              <button onClick={() => handleUpdateStatus('diverifikasi')} className="flex flex-col items-center justify-center gap-2 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 border border-blue-200 p-4 rounded-xl transition-all group">
                <AlertCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">Set Terverifikasi</span>
              </button>
              <button onClick={() => handleUpdateStatus('ditolak')} className="flex flex-col items-center justify-center gap-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border border-red-200 p-4 rounded-xl transition-all group">
                <XCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">Tolak Pendaftar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Document Previewer */}
        <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 h-full flex flex-col min-h-[600px]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-t-[15px] flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white">Lampiran Dokumen</h3>
            <div className="flex gap-2 overflow-x-auto max-w-sm">
              {fileFields.length > 0 ? (
                fileFields.map(([key, val], idx) => {
                  const url = getFileUrl(String(val));
                  const isActive = activeFile?.url === url || (idx === 0 && !activeFile);
                  
                  if (idx === 0 && !activeFile) {
                     // Set first file as active on load if none selected
                     setTimeout(() => setActiveFile({ label: key, url }), 0);
                  }

                  return (
                    <button 
                      key={key} 
                      onClick={() => setActiveFile({ label: key, url })}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold shadow-sm whitespace-nowrap transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                    >
                      {key}
                    </button>
                  );
                })
              ) : (
                <span className="text-xs text-slate-400">Tidak ada lampiran</span>
              )}
            </div>
          </div>
          
          <div className="flex-1 bg-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {activeFile ? (
              <>
                <div className="w-full max-w-[400px] aspect-[1/1.4] bg-slate-200 dark:bg-slate-700 rounded-lg shadow-2xl relative border-4 border-white overflow-hidden flex items-center justify-center">
                  {activeFile.url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                    <img src={activeFile.url} alt={activeFile.label} className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm font-semibold">{activeFile.label}</p>
                      <p className="text-slate-500 text-xs mt-1">Preview tidak didukung untuk tipe file ini</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <a href={activeFile.url} target="_blank" rel="noreferrer" className="bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg">
                      <Eye className="w-6 h-6" />
                    </a>
                  </div>
                </div>
                
                <div className="absolute bottom-6 right-6">
                  <a href={activeFile.url} download target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg border border-slate-600">
                    <Download className="w-4 h-4" /> Unduh {activeFile.label}
                  </a>
                </div>
              </>
            ) : (
               <div className="text-slate-500 flex flex-col items-center">
                 <FileText className="w-12 h-12 mb-3 opacity-30" />
                 <p>Pilih dokumen untuk melihat preview</p>
               </div>
            )}
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 text-center rounded-b-[15px]">
            Preview Document Viewer: JPG/PNG/PDF.
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
