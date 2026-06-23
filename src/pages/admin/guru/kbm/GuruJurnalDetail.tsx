import AdminLayout from '../../../../components/admin/AdminLayout';
import { CalendarDays, ArrowLeft, Save, Printer } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function GuruJurnalDetail() {
  const { id } = useParams();

  return (
    <AdminLayout title="Detail Jurnal Mengajar">
      <div className="mb-6">
        <Link to="/panel/guru/jurnal" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Jurnal
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                <CalendarDays className="w-4 h-4" />
                <span>Senin, 15 Jul 2024</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Sifat-Sifat Logaritma Lanjutan</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Matematika X-1 • 07:00 - 08:30 WIB</p>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                <Save className="w-4 h-4" /> Simpan Perubahan
              </button>
              <button className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:border-indigo-300 transition-all active:scale-95">
                <Printer className="w-4 h-4" /> Cetak
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Ringkasan Kehadiran</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Siswa', value: '32', color: 'text-slate-800 dark:text-slate-100' },
              { label: 'Hadir', value: '30', color: 'text-emerald-600' },
              { label: 'Sakit', value: '1', color: 'text-amber-600' },
              { label: 'Alpa', value: '1', color: 'text-red-600' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-4">Daftar Kehadiran Siswa</h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 w-16 text-center">No</th>
                  <th className="px-6 py-4">Nama Siswa</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                {[
                  { no: 1, nama: 'Agus Setiawan', status: 'Hadir' },
                  { no: 2, nama: 'Budi Raharjo', status: 'Hadir' },
                  { no: 3, nama: 'Citra Kirana', status: 'Sakit' },
                  { no: 4, nama: 'Dewi Lestari', status: 'Alpa' },
                  { no: 5, nama: 'Eko Prasetyo', status: 'Hadir' },
                ].map(s => (
                  <tr key={s.no} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-center text-slate-400 font-bold">{s.no}</td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">{s.nama}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                        s.status === 'Hadir' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                        s.status === 'Sakit' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                        'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
