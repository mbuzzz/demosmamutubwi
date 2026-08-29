import { useEffect, useState } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { api } from '../../../../lib/api';

interface CbtRow { guru?: { name: string }; mapel: { mapel_nama: string; draft: number; published: number; total: number }[]; total_bank_soal: number }
interface CbtSession { sesi_id: number; nama_sesi: string; mapel?: string; kelas?: string; is_aktif: boolean; total_siswa: number; selesai: number; sedang_mengerjakan: number; belum_mengerjakan: number; avg_nilai_pg?: number }
interface LmsRow { tugas_id: number; judul: string; guru_id: number; kelas: string[]; total_siswa: number; sudah_kumpul: number; belum_kumpul: number; sudah_dinilai: number; menunggu_nilai: number; terlambat: number }

export default function KurikulumMonitoring() {
  const [tab, setTab] = useState<'cbt' | 'lms'>('cbt');
  const [semester, setSemester] = useState<'ganjil' | 'genap'>('ganjil');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true); setError('');
    api.get(`/monitoring/${tab}`, { params: { semester } }).then(r => setData(r.data)).catch(e => setError(e?.response?.data?.message || 'Gagal memuat monitoring')).finally(() => setLoading(false));
  }, [tab, semester]);

  return <AdminLayout title="Monitoring Akademik">
    <div className="flex gap-2 mb-5">
      <button onClick={() => setTab('cbt')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'cbt' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>CBT / Ujian</button>
      <button onClick={() => setTab('lms')} className={`px-4 py-2 rounded-xl text-sm font-bold ${tab === 'lms' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>LMS / Tugas</button>
      <select value={semester} onChange={e => setSemester(e.target.value as 'ganjil' | 'genap')} className="ml-auto px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold"><option value="ganjil">Semester Ganjil</option><option value="genap">Semester Genap</option></select>
    </div>
    {loading && <div className="p-6 text-slate-500">Memuat monitoring...</div>}
    {error && <div className="p-4 rounded-xl bg-red-50 text-red-700">{error}</div>}
    {!loading && !error && data && <>
      <p className="text-sm text-slate-500 mb-4">Tahun ajaran: <b>{data.tahun_ajaran}</b></p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {Object.entries(data.ringkasan || {}).map(([key, value]) => <div key={key} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4"><div className="text-xs text-slate-500">{key.replaceAll('_', ' ')}</div><div className="text-2xl font-extrabold mt-1">{String(value)}</div></div>)}
      </div>
      {tab === 'cbt' ? <>
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 mb-5"><h2 className="font-bold mb-3">Guru pembuat bank soal</h2><div className="space-y-3">{(data.bank_per_guru as CbtRow[]).map((row, i) => <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-3"><div className="flex justify-between font-bold"><span>{row.guru?.name || 'Guru tidak ditemukan'}</span><span>{row.total_bank_soal} bank soal</span></div><div className="text-sm text-slate-500 mt-1">{row.mapel.map(m => `${m.mapel_nama}: ${m.total} total (${m.published} published, ${m.draft} draft)`).join(' · ')}</div></div>)}{!data.bank_per_guru?.length && <p className="text-sm text-slate-500">Belum ada bank soal.</p>}</div></section>
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"><h2 className="font-bold mb-3">Partisipasi ujian</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-slate-500"><th className="p-2">Ujian</th><th className="p-2">Kelas</th><th className="p-2">Total</th><th className="p-2">Selesai</th><th className="p-2">Mengerjakan</th><th className="p-2">Belum</th></tr></thead><tbody>{(data.sesi as CbtSession[]).map(s => <tr key={s.sesi_id} className="border-t border-slate-100 dark:border-slate-800"><td className="p-2 font-medium">{s.nama_sesi}<div className="text-xs text-slate-500">{s.mapel}</div></td><td className="p-2">{s.kelas || '-'}</td><td className="p-2">{s.total_siswa}</td><td className="p-2 text-emerald-600">{s.selesai}</td><td className="p-2 text-amber-600">{s.sedang_mengerjakan}</td><td className="p-2 text-red-600 font-bold">{s.belum_mengerjakan}</td></tr>)}</tbody></table>{!data.sesi?.length && <p className="text-sm text-slate-500 mt-3">Belum ada sesi ujian.</p>}</div></section>
      </> : <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5"><h2 className="font-bold mb-3">Siswa belum mengumpulkan tugas</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-slate-500"><th className="p-2">Tugas</th><th className="p-2">Kelas</th><th className="p-2">Total</th><th className="p-2">Sudah kumpul</th><th className="p-2">Belum</th><th className="p-2">Menunggu nilai</th></tr></thead><tbody>{(data.tugas_partisipasi as LmsRow[]).map(t => <tr key={t.tugas_id} className="border-t border-slate-100 dark:border-slate-800"><td className="p-2 font-medium">{t.judul}</td><td className="p-2">{t.kelas.join(', ') || '-'}</td><td className="p-2">{t.total_siswa}</td><td className="p-2 text-emerald-600">{t.sudah_kumpul}</td><td className="p-2 text-red-600 font-bold">{t.belum_kumpul}</td><td className="p-2 text-amber-600">{t.menunggu_nilai}</td></tr>)}</tbody></table>{!data.tugas_partisipasi?.length && <p className="text-sm text-slate-500 mt-3">Belum ada tugas pada tahun ajaran aktif.</p>}</div></section>}
    </>}
  </AdminLayout>;
}
