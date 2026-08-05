import { useMemo, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Loader2, ChevronDown, ChevronUp, CalendarRange, User, FileBarChart } from 'lucide-react';
import { STATUS_PIKET_LABEL, type LaporanPiketItem, type StatusPiket } from '../../../types/piket';
import { useLaporanPiket } from '../../../hooks/usePiket';

function currentBulan(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const STATUS_STYLE: Record<string, string> = {
  hadir: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400',
  izin: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400',
  sakit: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400',
  terlambat: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400',
  alpha: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400',
};

export default function AdminLaporanPiket() {
  const [bulan, setBulan] = useState(currentBulan());
  const [expanded, setExpanded] = useState<string | number | null>(null);
  const { data, isLoading } = useLaporanPiket(bulan);

  const ringkasan = data?.ringkasan;
  const rows: LaporanPiketItem[] = useMemo(() => data?.data ?? [], [data]);

  const statCards = useMemo(() => {
    if (!ringkasan) return [];
    return [
      { label: 'Total Guru', value: ringkasan.total_guru, color: 'text-indigo-600 dark:text-indigo-400' },
      { label: 'Hadir', value: ringkasan.total_hadir, color: 'text-emerald-600 dark:text-emerald-400' },
      { label: 'Izin', value: ringkasan.total_izin, color: 'text-sky-600 dark:text-sky-400' },
      { label: 'Sakit', value: ringkasan.total_sakit, color: 'text-amber-600 dark:text-amber-400' },
      { label: 'Terlambat', value: ringkasan.total_terlambat, color: 'text-orange-600 dark:text-orange-400' },
      { label: 'Alpha', value: ringkasan.total_alpha, color: 'text-red-600 dark:text-red-400' },
    ];
  }, [ringkasan]);

  const toggleExpand = (id: string | number) => {
    setExpanded(prev => (prev === id ? null : id));
  };

  return (
    <AdminLayout title="Laporan Piket">
      {/* Pilih bulan */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm mb-6 flex flex-wrap items-center gap-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <CalendarRange className="w-3.5 h-3.5" /> Periode Bulan
        </label>
        <input
          type="month"
          value={bulan}
          onChange={e => setBulan(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statCards.map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
            <h3 className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Tabel rekap */}
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b">
              <tr>
                <th className="px-5 py-4">Guru</th>
                <th className="px-5 py-4 text-center">Jadwal</th>
                <th className="px-5 py-4 text-center">Hadir</th>
                <th className="px-5 py-4 text-center">Izin</th>
                <th className="px-5 py-4 text-center">Sakit</th>
                <th className="px-5 py-4 text-center">Terlambat</th>
                <th className="px-5 py-4 text-center">Alpha</th>
                <th className="px-5 py-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-slate-400 dark:text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                    Memuat laporan piket...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                      <FileBarChart className="w-10 h-10 mb-2 opacity-40" />
                      <p className="text-sm font-medium">Belum ada data absensi pada bulan ini</p>
                      <p className="text-xs mt-1">Data laporan akan muncul setelah absensi piket diisi.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map(row => (
                  <FragmentRow key={row.user_id} row={row} expanded={expanded === row.user_id} onToggle={() => toggleExpand(row.user_id)} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

function FragmentRow({ row, expanded, onToggle }: { row: LaporanPiketItem; expanded: boolean; onToggle: () => void }) {
  const totalTerisi = row.hadir + row.izin + row.sakit + row.terlambat + row.alpha;

  return (
    <>
      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
              {row.user?.foto ? (
                <img src={row.user.foto} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white text-sm">{row.user?.name || 'Guru'}</p>
              <p className="text-xs text-slate-400">{row.user?.jabatan || 'Tenaga Pendidik'}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-4 text-center text-slate-600 dark:text-slate-300">{row.total_jadwal}</td>
        <td className="px-5 py-4 text-center">
          <Badge status="hadir" count={row.hadir} />
        </td>
        <td className="px-5 py-4 text-center">
          <Badge status="izin" count={row.izin} />
        </td>
        <td className="px-5 py-4 text-center">
          <Badge status="sakit" count={row.sakit} />
        </td>
        <td className="px-5 py-4 text-center">
          <Badge status="terlambat" count={row.terlambat} />
        </td>
        <td className="px-5 py-4 text-center">
          <Badge status="alpha" count={row.alpha} />
        </td>
        <td className="px-5 py-4 text-center">
          <button
            onClick={onToggle}
            disabled={totalTerisi === 0}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-2 py-1 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {totalTerisi > 0 ? `${totalTerisi} catatan` : 'Kosong'}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={8} className="px-6 pb-4 bg-slate-50/60 dark:bg-slate-800/20">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold">
                  <tr>
                    <th className="px-4 py-2 text-left">Tanggal</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                  {row.detail.map(d => (
                    <tr key={d.id}>
                      <td className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300">{d.tanggal}</td>
                      <td className="px-4 py-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[d.status]}`}>
                          {STATUS_PIKET_LABEL[d.status as StatusPiket]}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{d.catatan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Badge({ status, count }: { status: StatusPiket; count: number }) {
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[status]}`}>
      {count}
    </span>
  );
}
