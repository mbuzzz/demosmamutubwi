import { useState } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import {
  UserCheck, Clock, AlertTriangle, UserX, Calendar,
  Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AbsensiGuruRecord {
  id: number;
  user_id: number;
  tanggal: string;
  jam_masuk: string | null;
  jam_pulang: string | null;
  status_masuk: string;
  status_pulang: string | null;
  metode: string;
  catatan: string | null;
  user?: {
    id: number;
    name: string;
    nip_nisn: string;
    role: string;
    jabatan?: string;
    foto?: string;
  };
}

interface RekapGuruRow {
  user_id: number;
  name: string;
  nip_nisn: string;
  role: string;
  jabatan: string;
  total_hadir: number;
  total_izin: number;
  total_sakit: number;
  total_alpha: number;
  total_terlambat: number;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  hadir:     { label: 'Hadir',     color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' },
  terlambat: { label: 'Terlambat', color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400' },
  izin:      { label: 'Izin',      color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400' },
  sakit:     { label: 'Sakit',     color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' },
  alpha:     { label: 'Alpha',     color: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400' },
};

const ROLE_LABEL: Record<string, string> = {
  guru: 'Guru',
  walikelas: 'Wali Kelas',
  kurikulum: 'Kurikulum',
  kepala_sekolah: 'Kepala Sekolah',
  bendahara: 'Bendahara',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useAbsensiGuru(tanggal: string) {
  return useQuery({
    queryKey: ['absensi-guru', tanggal],
    queryFn: async () => {
      const res = await api.get('/absensi-guru', { params: { tanggal } });
      return res.data as AbsensiGuruRecord[];
    },
  });
}

function useRekapGuru(bulan: number, tahun: number) {
  return useQuery({
    queryKey: ['absensi-guru-rekap', bulan, tahun],
    queryFn: async () => {
      const res = await api.get('/absensi-guru/rekap', { params: { bulan, tahun } });
      return res.data as RekapGuruRow[];
    },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuruAbsensiGuru() {
  const today = new Date().toISOString().split('T')[0];
  const [tab, setTab] = useState<'harian' | 'rekap'>('harian');
  const [tanggal, setTanggal] = useState(today);
  const [search, setSearch] = useState('');

  const now = new Date();
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());

  const { data: absensiList = [], isLoading: loadingHarian } = useAbsensiGuru(tanggal);
  const { data: rekapList = [], isLoading: loadingRekap } = useRekapGuru(bulan, tahun);

  // ── Stats harian
  const hadir     = absensiList.filter(a => a.status_masuk === 'hadir').length;
  const terlambat = absensiList.filter(a => a.status_masuk === 'terlambat').length;
  const alpha     = absensiList.filter(a => a.status_masuk === 'alpha').length;
  const izin      = absensiList.filter(a => a.status_masuk === 'izin' || a.status_masuk === 'sakit').length;

  // ── Filter harian
  const filtered = absensiList.filter(a =>
    !search ||
    a.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.user?.nip_nisn?.includes(search)
  );

  // ── Filter rekap
  const filteredRekap = rekapList.filter(r =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.nip_nisn.includes(search)
  );

  const prevMonth = () => {
    if (bulan === 1) { setBulan(12); setTahun(t => t - 1); }
    else setBulan(b => b - 1);
  };
  const nextMonth = () => {
    if (bulan === 12) { setBulan(1); setTahun(t => t + 1); }
    else setBulan(b => b + 1);
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  return (
    <AdminLayout title="Absensi Guru & Staf">
      {/* ── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Hadir',     value: hadir,     icon: UserCheck,     grad: 'from-emerald-500 to-emerald-600' },
          { label: 'Terlambat', value: terlambat, icon: Clock,         grad: 'from-orange-500 to-orange-600' },
          { label: 'Izin/Sakit',value: izin,      icon: Calendar,      grad: 'from-blue-500 to-blue-600' },
          { label: 'Alpha',     value: alpha,     icon: AlertTriangle, grad: 'from-red-500 to-red-600' },
        ].map(({ label, value, icon: Icon, grad }) => (
          <div key={label} className={`bg-gradient-to-br ${grad} rounded-2xl p-5 text-white shadow-sm`}>
            <p className="text-xs font-bold opacity-80 uppercase tracking-wider">{label}</p>
            <h3 className="text-3xl font-black mt-1">{value}</h3>
            <div><Icon className="w-10 h-10 opacity-25 float-right -mt-8" /></div>
          </div>
        ))}
      </div>

      {/* ── Tab & Toolbar ───────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {(['harian', 'rekap'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                  tab === t
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {t === 'harian' ? 'Harian' : 'Rekap Bulanan'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Date / Month Picker */}
            {tab === 'harian' ? (
              <input
                type="date"
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            ) : (
              <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-slate-700 dark:text-white w-24 text-center">
                  {MONTHS[bulan - 1]} {tahun}
                </span>
                <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama / NIP..."
                className="pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* ── Harian Tab ───────────────────────────────────────────────────── */}
        {tab === 'harian' && (
          loadingHarian ? (
            <div className="p-10 text-center text-slate-400 text-sm">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 flex flex-col items-center gap-3 text-slate-400">
              <UserX className="w-10 h-10 opacity-30" />
              <p className="text-sm">Belum ada data absensi guru pada tanggal ini.</p>
              <p className="text-xs text-slate-400">Guru perlu melakukan tap RFID atau admin bisa input manual.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Nama</th>
                    <th className="px-6 py-3">Jabatan</th>
                    <th className="px-6 py-3">Masuk</th>
                    <th className="px-6 py-3">Pulang</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Metode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filtered.map(a => {
                    const badge = STATUS_BADGE[a.status_masuk] ?? STATUS_BADGE['hadir'];
                    return (
                      <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-3">
                          <p className="font-semibold text-slate-800 dark:text-white">{a.user?.name ?? '—'}</p>
                          <p className="text-xs text-slate-400">{a.user?.nip_nisn ?? ''}</p>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-xs">{a.user?.jabatan || ROLE_LABEL[a.user?.role ?? ''] || a.user?.role}</span>
                        </td>
                        <td className="px-6 py-3 font-mono">{a.jam_masuk ?? '—'}</td>
                        <td className="px-6 py-3 font-mono">{a.jam_pulang ?? '—'}</td>
                        <td className="px-6 py-3">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded ${a.metode === 'rfid' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400' : 'bg-slate-100 text-slate-500'}`}>
                            {a.metode === 'rfid' ? 'RFID' : 'Manual'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* ── Rekap Bulanan Tab ────────────────────────────────────────────── */}
        {tab === 'rekap' && (
          loadingRekap ? (
            <div className="p-10 text-center text-slate-400 text-sm">Memuat rekap...</div>
          ) : filteredRekap.length === 0 ? (
            <div className="p-10 flex flex-col items-center gap-3 text-slate-400">
              <UserX className="w-10 h-10 opacity-30" />
              <p className="text-sm">Belum ada rekap absensi guru bulan ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3">Nama</th>
                    <th className="px-6 py-3">Jabatan</th>
                    <th className="px-4 py-3 text-center text-emerald-600">H</th>
                    <th className="px-4 py-3 text-center text-orange-500">TL</th>
                    <th className="px-4 py-3 text-center text-blue-500">I</th>
                    <th className="px-4 py-3 text-center text-amber-500">S</th>
                    <th className="px-4 py-3 text-center text-red-500">A</th>
                    <th className="px-6 py-3 text-center">Total Hadir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredRekap.map(r => (
                    <tr key={r.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-semibold text-slate-800 dark:text-white">{r.name}</p>
                        <p className="text-xs text-slate-400">{r.nip_nisn}</p>
                      </td>
                      <td className="px-6 py-3 text-xs">{r.jabatan || ROLE_LABEL[r.role] || r.role}</td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-600">{r.total_hadir}</td>
                      <td className="px-4 py-3 text-center font-bold text-orange-500">{r.total_terlambat}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-500">{r.total_izin}</td>
                      <td className="px-4 py-3 text-center font-bold text-amber-500">{r.total_sakit}</td>
                      <td className="px-4 py-3 text-center font-bold text-red-500">{r.total_alpha}</td>
                      <td className="px-6 py-3 text-center">
                        <span className="font-black text-slate-800 dark:text-white">
                          {r.total_hadir + r.total_terlambat}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">hari</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span><strong className="text-emerald-600">H</strong> = Hadir</span>
        <span><strong className="text-orange-500">TL</strong> = Terlambat</span>
        <span><strong className="text-blue-500">I</strong> = Izin</span>
        <span><strong className="text-amber-500">S</strong> = Sakit</span>
        <span><strong className="text-red-500">A</strong> = Alpha</span>
        <span className="ml-4 text-slate-400">Absensi via RFID tap atau input manual oleh admin.</span>
      </div>
    </AdminLayout>
  );
}
