import AdminLayout from '../../../../components/admin/AdminLayout';
import { Search, GraduationCap } from 'lucide-react';
import { useState } from 'react';

const MOCK_WALI_KELAS = {
  kelas: 'Kelas X-1',
  waliKelas: 'Ahmad Fauzi, S.Pd',
  periode: '2024/2025',
};

const MOCK_SISWA = [
  { nisn: '0081234501', nama: 'Agus Setiawan', email: 'agus@student.sch.id', hp: '081234567890', status: 'Aktif' },
  { nisn: '0081234502', nama: 'Budi Raharjo', email: 'budi@student.sch.id', hp: '081234567891', status: 'Aktif' },
  { nisn: '0081234503', nama: 'Citra Kirana', email: 'citra@student.sch.id', hp: '081234567892', status: 'Aktif' },
  { nisn: '0081234504', nama: 'Dewi Lestari', email: 'dewi@student.sch.id', hp: '081234567893', status: 'Aktif' },
  { nisn: '0081234505', nama: 'Eko Prasetyo', email: 'eko@student.sch.id', hp: '081234567894', status: 'Aktif' },
  { nisn: '0081234506', nama: 'Fitri Ayu', email: 'fitri@student.sch.id', hp: '081234567895', status: 'Aktif' },
  { nisn: '0081234507', nama: 'Galih Pratama', email: 'galih@student.sch.id', hp: '081234567896', status: 'Tidak Aktif' },
];

export default function GuruWaliSiswa() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_SISWA.filter(s =>
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.nisn.includes(search)
  );

  return (
    <AdminLayout title="Data Siswa Kelas Binaan">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">{MOCK_WALI_KELAS.kelas}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Wali Kelas: {MOCK_WALI_KELAS.waliKelas} • {MOCK_WALI_KELAS.periode}</p>
              </div>
            </div>
            <div className="relative max-w-xs w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari siswa..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider">
              <tr>
                <th className="px-6 py-4">NISN</th>
                <th className="px-6 py-4">Nama Siswa</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">No. HP</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-white">{s.nisn}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{s.nama}</td>
                  <td className="px-6 py-4">{s.email}</td>
                  <td className="px-6 py-4">{s.hp}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      s.status === 'Aktif'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
