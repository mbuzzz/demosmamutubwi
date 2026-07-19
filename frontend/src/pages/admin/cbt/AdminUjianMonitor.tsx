import AdminLayout from '../../../components/admin/AdminLayout';
import { ArrowLeft, Clock, Users, CheckCircle, RefreshCcw, AlertOctagon, StopCircle, RefreshCw } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCbtMonitor, useForceSelesaiUjian, useEndSesiUjian } from '../../../hooks/useCbt';
import { toast } from 'sonner';

function formatSisa(detik: number | null | undefined) {
  if (detik == null) return '—';
  const m = Math.floor(detik / 60);
  const s = Math.floor(detik % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function AdminUjianMonitor() {
  const [params] = useSearchParams();
  const sesiId = params.get('sesi_id') || params.get('id');

  const { data, isLoading, isError, refetch, isFetching } = useCbtMonitor(sesiId);
  const forceMut = useForceSelesaiUjian();
  const endMut = useEndSesiUjian();

  const sesi = data?.sesi;
  const peserta = data?.peserta ?? [];
  const stats = data?.stats ?? { total: 0, selesai: 0, mengerjakan: 0, belum: 0 };

  const handleForce = (siswaId: number, nama: string) => {
    if (!sesiId) return;
    if (!window.confirm(`Paksa selesaikan ujian ${nama}?`)) return;
    forceMut.mutate({ sesiId, siswaId });
  };

  const handleEndAll = () => {
    if (!sesiId) return;
    if (!window.confirm('Akhiri sesi ujian untuk semua peserta? Yang masih mengerjakan akan dipaksa selesai.')) return;
    endMut.mutate(sesiId);
  };

  if (!sesiId) {
    return (
      <AdminLayout title="Live Monitoring Ujian">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-10 text-center">
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2">Pilih sesi ujian dulu</p>
          <p className="text-xs text-slate-400 mb-4">Buka dari daftar jadwal ujian → tombol Monitor.</p>
          <Link to="/panel/cbt/jadwal" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <ArrowLeft className="w-4 h-4" /> Ke Jadwal Ujian
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Live Monitoring Ujian">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <Link to="/panel/cbt/jadwal" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Jadwal
        </Link>
        <button
          type="button"
          onClick={handleEndAll}
          disabled={endMut.isPending || !sesi?.is_aktif}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
        >
          <StopCircle className="w-4 h-4 text-red-500" /> Akhiri Ujian Secara Paksa
        </button>
      </div>

      {isError && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 text-sm font-bold">
          Gagal memuat monitor. Pastikan Anda pemilik sesi / pengawas.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-indigo-600 rounded-[20px] shadow-sm p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <h3 className="font-black text-xl mb-1 leading-tight relative z-10">
              {isLoading ? 'Memuat…' : (sesi?.nama_sesi || 'Sesi Ujian')}
            </h3>
            <p className="text-indigo-200 text-sm font-semibold mb-6 relative z-10">
              {sesi?.mapel || '—'} • Kelas {sesi?.kelas || '—'} • {sesi?.total_soal ?? 0} Soal
            </p>

            <div className="space-y-4 relative z-10">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Sisa Waktu Sesi
                </div>
                <div className="text-2xl font-black tabular-nums">{formatSisa(sesi?.sisa_detik)}</div>
                <div className="text-[10px] text-indigo-200 mt-1">
                  Status: {sesi?.is_aktif ? 'Aktif' : 'Nonaktif'}
                  {sesi?.token ? ` • Token: ${sesi.token}` : ''}
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Status Peserta
                </div>
                <div className="flex justify-between items-end mt-2">
                  <div>
                    <div className="text-2xl font-black leading-none">{stats.total}</div>
                    <div className="text-[10px] font-bold text-indigo-200 mt-1">Total Siswa</div>
                  </div>
                  <div className="text-right text-sm font-bold space-y-0.5">
                    <div className="text-emerald-300">{stats.selesai} Selesai</div>
                    <div className="text-amber-300">{stats.mengerjakan} Mengerjakan</div>
                    <div className="text-slate-200">{stats.belum} Belum mulai</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-bold text-slate-800 dark:text-white">Status Live Peserta</h3>
                {isFetching && <span className="text-[10px] text-slate-400 font-bold">refresh…</span>}
              </div>
              <button
                type="button"
                onClick={() => { refetch(); toast.message('Memuat ulang…'); }}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-10 text-center text-sm text-slate-400 font-bold">Memuat data monitor…</div>
              ) : peserta.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-400 font-bold">Tidak ada siswa di kelas sesi ini.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Nama Siswa</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Soal Dijawab</th>
                      <th className="px-6 py-4 text-center">Nilai</th>
                      <th className="px-6 py-4 text-right">Aksi Darurat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {peserta.map((p) => {
                      const pct = p.total_soal > 0 ? Math.round((p.dijawab / p.total_soal) * 100) : 0;
                      return (
                        <tr key={p.siswa_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 dark:text-white">{p.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">NISN: {p.nip_nisn || '—'}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {p.status === 'selesai' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
                                <CheckCircle className="w-3 h-3" /> Selesai
                              </span>
                            ) : p.status === 'mengerjakan' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md text-xs font-bold border border-amber-100 dark:border-amber-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Mengerjakan
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-md text-xs font-bold">
                                Belum mulai
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="font-bold text-slate-800 dark:text-slate-200">{p.dijawab} / {p.total_soal}</div>
                            {p.status === 'mengerjakan' && (
                              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 max-w-[80px] mx-auto overflow-hidden">
                                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center text-xs font-bold text-slate-600 dark:text-slate-300">
                            {p.status === 'selesai' && p.nilai_pg != null ? Number(p.nilai_pg).toFixed(1) : '—'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {p.status === 'mengerjakan' ? (
                              <button
                                type="button"
                                onClick={() => handleForce(p.siswa_id, p.name)}
                                disabled={forceMut.isPending}
                                className="text-[10px] font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors border border-red-100 dark:border-red-500/20 inline-flex items-center gap-1"
                              >
                                <AlertOctagon className="w-3.5 h-3.5" /> Force Submit
                              </button>
                            ) : p.status === 'selesai' ? (
                              <span className="text-[10px] font-bold text-slate-400 inline-flex items-center gap-1">
                                <RefreshCcw className="w-3.5 h-3.5" /> Selesai
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-medium">
            Auto-refresh setiap 8 detik. Force submit hanya menandai selesai (tanpa skor ulang essay).
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
