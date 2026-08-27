import AdminLayout from '../../../../components/admin/AdminLayout';
import { ArrowLeft, FileText, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuruNilaiDetail() {
  return (
    <AdminLayout title="Detail Nilai Tugas">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/panel/guru/nilai" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Buku Nilai
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="p-10 text-center">
          <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200">Belum ada data nilai untuk ditampilkan</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Input nilai dilakukan lewat menu Buku Nilai. Halaman detail ini akan menampilkan daftar nilai siswa
            setelah komponen penilaian dipilih.
          </p>
          <Link
            to="/panel/guru/nilai"
            className="inline-flex items-center gap-2 mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm active:scale-95"
          >
            <FileText className="w-4 h-4" /> Buka Buku Nilai
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
