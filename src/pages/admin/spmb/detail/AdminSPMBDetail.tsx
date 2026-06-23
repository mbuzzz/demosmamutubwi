import AdminLayout from '../../../../components/admin/AdminLayout';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Eye, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminSPMBDetail() {
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
                <span className="bg-white dark:bg-slate-900/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">REG-2024-001</span>
                <h2 className="text-2xl font-bold leading-none mb-1">Muhammad Rizki</h2>
                <p className="text-indigo-200 text-sm">Pendaftar Gelombang Inden</p>
              </div>
              <div className="w-20 h-24 bg-white dark:bg-slate-900/10 border-2 border-white/30 rounded flex items-center justify-center text-xs text-center p-2">
                <FileText className="w-6 h-6 mb-1 opacity-50" />
                <span className="opacity-80 leading-tight">Foto 3x4</span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 uppercase">Data Pribadi</h3>
              <div className="space-y-3 mb-8">
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">NISN</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">0081234567</span></div>
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">NIK (KTP)</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">3510012345678901</span></div>
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Tempat, Tgl Lahir</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">Banyuwangi, 15 Agustus 2008</span></div>
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Jenis Kelamin</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">Laki-laki</span></div>
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Asal Sekolah (SMP)</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">SMP Negeri 1 Banyuwangi</span></div>
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Alamat Rumah</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">Jl. Brawijaya No.12, Kebalenan</span></div>
              </div>

              <h3 className="font-bold text-slate-800 dark:text-white text-sm border-b border-slate-100 dark:border-slate-800 pb-2 mb-4 uppercase">Data Orang Tua / Wali</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Nama Ayah</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">Ahmad Sugandi</span></div>
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Pekerjaan Ayah</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">Wiraswasta</span></div>
                <div className="grid grid-cols-3 text-sm"><span className="text-slate-500 dark:text-slate-400">No. WhatsApp</span><span className="col-span-2 font-semibold text-slate-800 dark:text-white">0812-3456-7890</span></div>
              </div>
            </div>
          </div>

          {/* Kotak Aksi Final */}
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border-2 border-indigo-100">
            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Aksi Verifikasi Final</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Pilih status penerimaan siswa ini. Pendaftar akan menerima notifikasi via Email/Dashboard mereka.</p>
            
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 p-4 rounded-xl transition-all group">
                <CheckCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">Terima Siswa</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 bg-amber-50 hover:bg-amber-500 hover:text-white text-amber-700 border border-amber-200 p-4 rounded-xl transition-all group">
                <AlertCircle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">Revisi Berkas</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 border border-red-200 p-4 rounded-xl transition-all group">
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
            <div className="flex gap-2">
              <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm">Kartu Keluarga</button>
              <button className="text-xs bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50 px-3 py-1.5 rounded-lg font-bold">Rapor SMP</button>
              <button className="text-xs bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50 px-3 py-1.5 rounded-lg font-bold">Ijazah/SKL</button>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-800 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Mock PDF Viewer */}
            <div className="w-full max-w-[400px] aspect-[1/1.4] bg-slate-200 dark:bg-slate-700 rounded-lg shadow-2xl relative border-4 border-white overflow-hidden">
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" alt="Dokumen Preview" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button className="bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg">
                  <Eye className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="absolute bottom-6 right-6">
              <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg border border-slate-600">
                <Download className="w-4 h-4" /> Unduh Asli
              </button>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 text-center rounded-b-[15px]">
            Preview Document Viewer: JPG/PNG/PDF.
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
