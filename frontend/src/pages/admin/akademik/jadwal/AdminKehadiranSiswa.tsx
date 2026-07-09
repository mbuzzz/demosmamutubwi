import AdminLayout from '../../../../components/admin/AdminLayout';
import {
  Search,
  CalendarDays,
  TrendingUp,
  AlertTriangle,
  Download,
  Loader2,
  RefreshCw,
  UserCheck,
  Link2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAbsensiList } from '../../../../hooks/useAbsensi';
import { useKelasList } from '../../../../hooks/useKelas';
import { useUsers } from '../../../../hooks/useUsers';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function formatIdDate(iso: string) {
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

interface ClassRow {
  kelas: string;
  wali: string;
  total: number;
  h: number;
  s: number;
  i: number;
  a: number;
  t: number;
  belum: number;
  pct: number;
}

export default function AdminKehadiranSiswa() {
  const [tanggal, setTanggal] = useState(todayISO());
  const [filterKelas, setFilterKelas] = useState('');
  const [search, setSearch] = useState('');
  const [appliedTanggal, setAppliedTanggal] = useState(todayISO());
  const [appliedKelas, setAppliedKelas] = useState('');

  const { data: kelasList = [], isLoading: isKelasLoading } = useKelasList();
  const { data: allSiswa = [], isLoading: isSiswaLoading, isError: isSiswaError } = useUsers('siswa');
  const {
    data: absensi = [],
    isLoading: isAbsensiLoading,
    isError: isAbsensiError,
    isFetching,
    refetch,
  } = useAbsensiList({
    tanggal: appliedTanggal,
    role: 'siswa',
    kelas: appliedKelas || undefined,
  });

  const waliByKelas = useMemo(() => {
    const map = new Map<string, string>();
    (Array.isArray(kelasList) ? kelasList : []).forEach((k: any) => {
      map.set(k.nama, k.wali_kelas?.name || k.waliKelas?.name || '—');
    });
    return map;
  }, [kelasList]);

  const siswaList = useMemo(() => {
    const list = Array.isArray(allSiswa) ? allSiswa : [];
    if (appliedKelas) return list.filter((s) => s.kelas === appliedKelas);
    return list;
  }, [allSiswa, appliedKelas]);

  const absensiByUser = useMemo(() => {
    const map = new Map<string, (typeof absensi)[0]>();
    absensi.forEach((a) => {
      const uid = String(a.user_id ?? a.siswa_id ?? a.user?.id ?? '');
      if (uid) map.set(uid, a);
    });
    return map;
  }, [absensi]);

  const classRows: ClassRow[] = useMemo(() => {
    const byClass = new Map<string, ClassRow>();

    // Ensure every known class appears (even 0 students / 0 absen)
    const kelasNames = new Set<string>();
    (Array.isArray(kelasList) ? kelasList : []).forEach((k: any) => kelasNames.add(k.nama));
    siswaList.forEach((s) => {
      if (s.kelas) kelasNames.add(s.kelas);
    });
    if (appliedKelas) kelasNames.add(appliedKelas);

    kelasNames.forEach((nama) => {
      byClass.set(nama, {
        kelas: nama,
        wali: waliByKelas.get(nama) || '—',
        total: 0,
        h: 0,
        s: 0,
        i: 0,
        a: 0,
        t: 0,
        belum: 0,
        pct: 0,
      });
    });

    siswaList.forEach((s) => {
      const namaKelas = s.kelas || 'Tanpa Kelas';
      if (!byClass.has(namaKelas)) {
        byClass.set(namaKelas, {
          kelas: namaKelas,
          wali: waliByKelas.get(namaKelas) || '—',
          total: 0,
          h: 0,
          s: 0,
          i: 0,
          a: 0,
          t: 0,
          belum: 0,
          pct: 0,
        });
      }
      const row = byClass.get(namaKelas)!;
      row.total += 1;

      const rec = absensiByUser.get(String(s.id));
      const status = (rec?.tipe || rec?.status_masuk || '') as string;

      if (!rec) {
        row.belum += 1;
        row.a += 1; // belum absen dihitung alpa untuk monitoring harian
      } else if (status === 'hadir') {
        row.h += 1;
      } else if (status === 'terlambat') {
        row.t += 1;
        row.h += 1; // terlambat tetap hadir di sekolah
      } else if (status === 'sakit') {
        row.s += 1;
      } else if (status === 'izin') {
        row.i += 1;
      } else if (status === 'alpha') {
        row.a += 1;
      } else {
        row.belum += 1;
        row.a += 1;
      }
    });

    // % = (hadir termasuk terlambat) / total * 100
    byClass.forEach((row) => {
      row.pct = row.total > 0 ? Math.round((row.h / row.total) * 1000) / 10 : 0;
    });

    let rows = Array.from(byClass.values()).sort((a, b) => a.kelas.localeCompare(b.kelas));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) => r.kelas.toLowerCase().includes(q) || r.wali.toLowerCase().includes(q)
      );
    }

    // Hide empty "Tanpa Kelas" with 0 students unless searching
    return rows.filter((r) => r.total > 0 || r.kelas !== 'Tanpa Kelas');
  }, [siswaList, absensiByUser, kelasList, waliByKelas, appliedKelas, search]);

  const summary = useMemo(() => {
    const totalSiswa = classRows.reduce((s, r) => s + r.total, 0);
    const totalHadir = classRows.reduce((s, r) => s + r.h, 0);
    const totalAlpa = classRows.reduce((s, r) => s + r.a, 0);
    const totalSakit = classRows.reduce((s, r) => s + r.s, 0);
    const totalIzin = classRows.reduce((s, r) => s + r.i, 0);
    const totalTerlambat = classRows.reduce((s, r) => s + r.t, 0);
    const totalBelum = classRows.reduce((s, r) => s + r.belum, 0);
    const avgPct = totalSiswa > 0 ? Math.round((totalHadir / totalSiswa) * 1000) / 10 : 0;
    return { totalSiswa, totalHadir, totalAlpa, totalSakit, totalIzin, totalTerlambat, totalBelum, avgPct };
  }, [classRows]);

  const handleFilter = () => {
    setAppliedTanggal(tanggal);
    setAppliedKelas(filterKelas);
  };

  const handleExport = () => {
    if (classRows.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }
    const data = classRows.map((r) => ({
      Kelas: r.kelas,
      'Wali Kelas': r.wali,
      'Total Siswa': r.total,
      Hadir: r.h,
      Sakit: r.s,
      Izin: r.i,
      Alpa: r.a,
      Terlambat: r.t,
      'Belum Absen': r.belum,
      'Persentase (%)': r.pct,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Presensi Harian');
    XLSX.writeFile(wb, `Monitoring_Presensi_${appliedTanggal}.xlsx`);
    toast.success('Laporan berhasil diekspor');
  };

  const isLoading = isKelasLoading || isSiswaLoading || isAbsensiLoading;
  const isError = isSiswaError || isAbsensiError;

  return (
    <AdminLayout title="Monitoring Presensi Sekolah">
      {/* Info sync banner */}
      <div className="mb-5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-start gap-2">
          <Link2 className="w-4 h-4 mt-0.5 shrink-0 text-indigo-500" />
          <p>
            Data diambil dari <strong>Presensi Gerbang (RFID / Absensi Harian)</strong> yang sama dengan menu{' '}
            <Link to="/panel/absensi" className="font-bold underline underline-offset-2">
              Absensi Harian
            </Link>{' '}
            &amp;{' '}
            <Link to="/panel/absensi/rekap" className="font-bold underline underline-offset-2">
              Rekap Absensi
            </Link>
            . Siswa tanpa catatan absen pada tanggal terpilih dihitung <strong>Alpa / Belum absen</strong>.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Rata-rata Kehadiran</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
              {isLoading ? '—' : `${summary.avgPct}%`}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              {summary.totalHadir}/{summary.totalSiswa} siswa hadir
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Siswa Alpa / Belum Absen</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
              {isLoading ? '—' : `${summary.totalAlpa} Siswa`}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
              Sakit {summary.totalSakit} · Izin {summary.totalIzin} · Terlambat {summary.totalTerlambat}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Tarik Laporan Harian</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Export rekap per kelas ke Excel</p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl transition-colors"
            title="Export Excel"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Tanggal Laporan
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Filter Kelas
            </label>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full sm:w-40 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 dark:text-indigo-400"
            >
              <option value="">Semua</option>
              {(Array.isArray(kelasList) ? kelasList : []).map((k: any) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleFilter}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            Filter Data
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors"
            title="Muat ulang"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabel Rekapitulasi */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">
                  Rekapitulasi Kehadiran
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {formatIdDate(appliedTanggal)}
                  {appliedKelas ? ` · Kelas ${appliedKelas}` : ' · Semua kelas'}
                </p>
              </div>
            </div>
            <div className="relative max-w-sm w-full sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kelas/wali..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium dark:text-white"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-xs text-slate-400 font-semibold">Memuat data presensi...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-red-500 font-bold text-sm">Gagal memuat data absensi dari server</p>
              <p className="text-xs text-slate-400">Periksa sesi login / hak akses, lalu coba lagi.</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-indigo-600 font-bold text-sm hover:underline"
              >
                Coba lagi
              </button>
            </div>
          ) : classRows.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-bold text-sm">Belum ada data kelas / siswa</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Pastikan master kelas dan data siswa sudah diisi. Presensi gerbang masuk lewat mesin RFID atau input
                manual di Absensi Harian.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Kelas</th>
                    <th className="px-6 py-4">Wali Kelas</th>
                    <th className="px-6 py-4 text-center">Total Siswa</th>
                    <th className="px-6 py-4 text-center">Hadir</th>
                    <th className="px-6 py-4 text-center">Sakit</th>
                    <th className="px-6 py-4 text-center">Izin</th>
                    <th className="px-6 py-4 text-center">Alpa</th>
                    <th className="px-6 py-4 text-center">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                  {classRows.map((item) => (
                    <tr
                      key={item.kelas}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-black text-slate-800 dark:text-white">{item.kelas}</td>
                      <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">{item.wali}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-500 dark:text-slate-400">
                        {item.total}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                        {item.h}
                        {item.t > 0 && (
                          <span className="block text-[10px] font-semibold text-orange-500">
                            ({item.t} terlambat)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-amber-500 dark:text-amber-400">
                        {item.s}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-blue-500 dark:text-blue-400">
                        {item.i}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-red-500 dark:text-red-400">
                        {item.a}
                        {item.belum > 0 && (
                          <span className="block text-[10px] font-semibold text-slate-400">
                            ({item.belum} belum absen)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold border whitespace-nowrap ${
                            item.pct < 95
                              ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20'
                              : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                          }`}
                        >
                          {item.pct}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !isError && classRows.length > 0 && (
            <p className="mt-4 text-[11px] text-slate-400 font-medium">
              Sumber: API <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">/absensi?tanggal=…</code> +
              master siswa/kelas. Update real-time setelah tap RFID atau input manual di Absensi Harian.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
