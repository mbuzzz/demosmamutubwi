import { useState } from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import {
  UserCheck, Clock, AlertTriangle, UserX, Calendar,
  Search, ChevronLeft, ChevronRight, Download, Plus, X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { useAuth, userHasRole } from '../../../../components/auth/AuthContext';
import { useUsers } from '../../../../hooks/useUsers';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

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
  roles?: string[];
  jabatan: string;
  total_hadir: number;
  total_izin: number;
  total_sakit: number;
  total_alpha: number;
  total_terlambat: number;
  hari_kerja?: number;
  persen_hadir?: number;
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
  admin: 'Admin',
  superadmin: 'Superadmin',
};

/**
 * RBAC Absensi Guru (ringkas):
 * | Role              | Lihat harian/rekap     | Input manual |
 * |-------------------|------------------------|--------------|
 * | guru/walikelas    | Hanya diri sendiri     | ❌           |
 * | bendahara         | Hanya diri sendiri     | ❌           |
 * | kurikulum         | Semua staf             | ❌           |
 * | kepala_sekolah    | Semua staf             | ✅           |
 * | admin/superadmin  | Semua staf             | ✅           |
 *
 * Backend: isAttendanceOversight() / POST absensi-guru
 */

// ─── Hooks ────────────────────────────────────────────────────────────────────

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

function useStoreAbsensiGuru() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      user_id: number;
      tanggal: string;
      status_masuk: string;
      jam_masuk?: string;
      catatan?: string;
    }) => {
      const res = await api.post('/absensi-guru', payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['absensi-guru'] });
      qc.invalidateQueries({ queryKey: ['absensi-guru-rekap'] });
      toast.success('Absensi staf disimpan');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan absensi staf');
    },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuruAbsensiGuru() {
  const { user } = useAuth();
  // Oversight: lihat semua staf; selain itu hanya absensi sendiri (API juga membatasi)
  const canSeeAll = userHasRole(user, ['superadmin', 'admin', 'kepala_sekolah', 'kurikulum']);
  const canInputManual = userHasRole(user, ['superadmin', 'admin', 'kepala_sekolah']);

  const today = new Date().toISOString().split('T')[0];
  const [tab, setTab] = useState<'harian' | 'rekap'>('harian');
  const [tanggal, setTanggal] = useState(today);
  const [search, setSearch] = useState('');

  const now = new Date();
  const [bulan, setBulan] = useState(now.getMonth() + 1);
  const [tahun, setTahun] = useState(now.getFullYear());

  const [showForm, setShowForm] = useState(false);
  const [formUserId, setFormUserId] = useState('');
  const [formStatus, setFormStatus] = useState('hadir');
  const [formJam, setFormJam] = useState('07:00');
  const [formCatatan, setFormCatatan] = useState('');

  const { data: absensiList = [], isLoading: loadingHarian } = useAbsensiGuru(tanggal);
  const { data: rekapList = [], isLoading: loadingRekap } = useRekapGuru(bulan, tahun);
  const { data: staffList = [] } = useUsers('guru');
  const storeMutation = useStoreAbsensiGuru();

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

  const handleExportRekap = () => {
    if (filteredRekap.length === 0) {
      toast.error('Tidak ada data rekap untuk diekspor');
      return;
    }
    const rows = filteredRekap.map(r => ({
      'Nama': r.name,
      'NIP/NBM': r.nip_nisn || '—',
      'Jabatan': r.jabatan || ROLE_LABEL[r.role] || r.role,
      'Role': r.role,
      'Hadir': r.total_hadir,
      'Terlambat': r.total_terlambat,
      'Izin': r.total_izin,
      'Sakit': r.total_sakit,
      'Alpha': r.total_alpha,
      'Hadir Efektif (H+TL)': r.total_hadir + r.total_terlambat,
      'Hari Kerja (Sen-Jum)': r.hari_kerja ?? '—',
      'Persen Hadir': `${r.persen_hadir ?? 0}%`,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap Absensi Guru');
    ws['!cols'] = Object.keys(rows[0]).map(k => ({
      wch: Math.max(k.length, ...rows.map(r => String((r as any)[k]).length)) + 2,
    }));
    XLSX.writeFile(wb, `Rekap_Absensi_Guru_${MONTHS[bulan - 1]}_${tahun}.xlsx`);
    toast.success('Rekap absensi guru diekspor ke Excel');
  };

  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUserId) {
      toast.error('Pilih staf');
      return;
    }
    storeMutation.mutate({
      user_id: Number(formUserId),
      tanggal,
      status_masuk: formStatus,
      jam_masuk: ['hadir', 'terlambat'].includes(formStatus) ? formJam : undefined,
      catatan: formCatatan || undefined,
    }, {
      onSuccess: () => {
        setShowForm(false);
        setFormUserId('');
        setFormCatatan('');
      },
    });
  };

  return (
    <AdminLayout title={canSeeAll ? 'Laporan Absensi Guru & Staf' : 'Absensi Saya (Staf)'}>
      {/* RBAC info */}
      <div className={`mb-4 rounded-xl border px-4 py-3 text-xs leading-relaxed ${
        canSeeAll
          ? 'border-emerald-100 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
          : 'border-indigo-100 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-200'
      }`}>
        {canSeeAll ? (
          <p>
            <strong>Mode laporan (oversight):</strong> Anda melihat absensi <strong>seluruh staf</strong>.
            {canInputManual ? ' Input manual diizinkan (Kepsek/Admin).' : ' Input manual hanya Kepsek/Admin.'}
          </p>
        ) : (
          <p>
            <strong>Mode pribadi:</strong> Anda hanya melihat <strong>absensi sendiri</strong>.
            Rekap seluruh staf untuk Kepala Sekolah / Kurikulum / Admin.
          </p>
        )}
      </div>

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
            {canSeeAll && (
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
            )}

            {tab === 'rekap' && (
              <button
                type="button"
                onClick={handleExportRekap}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                <Download className="w-3.5 h-3.5" /> Export Excel
              </button>
            )}

            {canInputManual && tab === 'harian' && (
              <button
                type="button"
                onClick={() => setShowForm(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showForm ? 'Tutup' : 'Input Manual'}
              </button>
            )}
          </div>
        </div>

        {/* Manual form (Kepsek/Admin) */}
        {showForm && canInputManual && tab === 'harian' && (
          <form onSubmit={handleSaveManual} className="p-4 bg-indigo-50/50 dark:bg-indigo-500/5 border-b border-indigo-100 dark:border-indigo-500/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Staf</label>
              <select
                value={formUserId}
                onChange={e => setFormUserId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs dark:text-white"
              >
                <option value="">— Pilih —</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Status</label>
              <select
                value={formStatus}
                onChange={e => setFormStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs dark:text-white"
              >
                <option value="hadir">Hadir</option>
                <option value="terlambat">Terlambat</option>
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="alpha">Alpha</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Jam Masuk</label>
              <input
                type="time"
                value={formJam}
                onChange={e => setFormJam(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Catatan</label>
              <input
                type="text"
                value={formCatatan}
                onChange={e => setFormCatatan(e.target.value)}
                placeholder="Opsional"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={storeMutation.isPending}
                className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
              >
                Simpan
              </button>
            </div>
          </form>
        )}

        {/* ── Harian Tab ───────────────────────────────────────────────────── */}
        {tab === 'harian' && (
          loadingHarian ? (
            <div className="p-10 text-center text-slate-400 text-sm">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 flex flex-col items-center gap-3 text-slate-400">
              <UserX className="w-10 h-10 opacity-30" />
              <p className="text-sm">Belum ada data absensi staf pada tanggal ini.</p>
              <p className="text-xs text-slate-400">Tap RFID di mesin absensi, atau input manual (Kepsek/Admin).</p>
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
              <p className="text-sm">Belum ada rekap absensi staf bulan ini.</p>
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
                    <th className="px-6 py-3 text-center">Hadir Efektif</th>
                    <th className="px-6 py-3 text-center">% Hadir</th>
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
                        <span className="text-xs text-slate-400 ml-1">/ {r.hari_kerja ?? '—'} hk</span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                          (r.persen_hadir ?? 0) >= 90
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                            : (r.persen_hadir ?? 0) >= 75
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                              : 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                        }`}>
                          {r.persen_hadir ?? 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* ── Legend + RBAC ───────────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span><strong className="text-emerald-600">H</strong> = Hadir</span>
        <span><strong className="text-orange-500">TL</strong> = Terlambat</span>
        <span><strong className="text-blue-500">I</strong> = Izin</span>
        <span><strong className="text-amber-500">S</strong> = Sakit</span>
        <span><strong className="text-red-500">A</strong> = Alpha</span>
        <span className="ml-2">% = (H+TL) / hari kerja Senin–Jumat</span>
      </div>
    </AdminLayout>
  );
}
