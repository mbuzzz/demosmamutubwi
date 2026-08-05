import { useMemo, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Printer, Search, User as UserIcon, Loader2, BadgeCheck, MapPin, Layers } from 'lucide-react';
import { useIdCardUsers, type IdCardUser } from '../../../hooks/useUsers';
import { useSistemKonfigurasi } from '../../../hooks/useSistemKonfigurasi';
import { getFileUrl } from '../../../lib/api';

type KartuRole = 'siswa' | 'guru';

const ROLE_STYLE: Record<KartuRole, { label: string; badge: string; gradient: string }> = {
  siswa: {
    label: 'KARTU IDENTITAS MURID',
    badge: 'MURID',
    gradient: 'from-blue-500 to-green-500',
  },
  guru: {
    label: 'KARTU IDENTITAS GURU & TENAGA KEPENDIDIKAN',
    badge: 'GURU & TENDIK',
    gradient: 'from-blue-500 to-green-500',
  },
};

function Avatar({ user, size, logoUrl }: { user: IdCardUser; size: number; logoUrl: string }) {
  const foto = user.foto ? getFileUrl(user.foto) : '';
  if (foto) {
    return (
      <img
        src={foto}
        alt={user.name}
        className="object-cover border-4 border-white dark:border-slate-800 rounded-lg shadow-md bg-slate-100"
        style={{ width: size, height: Math.round((size * 4) / 3) }}
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
      />
    );
  }
  return (
    <div
      className="rounded-lg border-4 border-white dark:border-slate-800 shadow-md bg-white flex items-center justify-center overflow-hidden"
      style={{ width: size, height: Math.round((size * 4) / 3) }}
    >
      <img src={logoUrl} alt="" className="w-full h-full object-contain p-1.5" />
    </div>
  );
}

function DataRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-[11px] font-bold text-slate-800 truncate">{value || '-'}</p>
    </div>
  );
}

function IdCardView({ user, role }: { user: IdCardUser; role: KartuRole }) {
  const { data: cfg } = useSistemKonfigurasi();
  const style = ROLE_STYLE[role];
  const logo = cfg?.logo_sekolah ? getFileUrl(cfg.logo_sekolah) : '/logo.png';
  const namaSekolah = cfg?.nama_sekolah || 'SMAS Muhammadiyah 1 Banyuwangi';
  const isSiswa = role === 'siswa';

  return (
    <div className="w-[340px] h-[215px] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg flex flex-col shrink-0 idcard">
      {/* Header */}
      <div className={`bg-gradient-to-r ${style.gradient} px-4 pt-3 pb-2.5 flex items-center gap-3 relative`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 0%, transparent 60%)' }} />
        <div className="relative">
          <img src={logo} alt="" className="w-10 h-10 object-contain" />
        </div>
        <div className="relative flex-1 min-w-0">
          <p className="text-[10px] font-black text-white leading-tight uppercase">{namaSekolah}</p>
          <p className="text-[9px] text-white/90 font-semibold uppercase">{style.label}</p>
        </div>
        <span className="relative text-[8px] font-black px-2 py-1 rounded-md bg-white/20 text-white tracking-widest">
          {style.badge}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-2.5 flex gap-3 min-h-0">
        <Avatar user={user} size={54} logoUrl={logo} />
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div className="min-w-0">
            <p className="text-[12px] font-black text-slate-900 leading-tight truncate">{user.name}</p>
            <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">
              {isSiswa ? `Kelas ${user.kelas || '-'}` : (user.jabatan || 'Tenaga Pendidik')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <DataRow label={isSiswa ? 'NISN' : 'NIP / NBM'} value={user.nip_nisn} />
            <DataRow label="Telepon" value={user.phone} />
          </div>
          {isSiswa ? (
            <div className="min-w-0 flex items-start gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[9px] font-semibold text-slate-500 leading-snug line-clamp-2">{user.alamat || '-'}</p>
            </div>
          ) : (
            <div className="min-w-0 flex items-start gap-1">
              <BadgeCheck className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[9px] font-semibold text-slate-500 leading-snug line-clamp-2">Tenaga Pendidik Aktif</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={`${style.gradient} px-4 py-1.5 flex items-center justify-between gap-2`}>
        <p className="text-[8px] font-semibold text-white/90 leading-tight">
          Masa Berlaku: Selama masih aktif di sekolah
        </p>
        <p className="text-[8px] font-black text-white/80 tracking-widest shrink-0">TA 2026/2027</p>
      </div>
    </div>
  );
}

export default function AdminCetakIdCard() {
  const [role, setRole] = useState<KartuRole>('siswa');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const { data: users = [], isLoading } = useIdCardUsers(role, search || undefined);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(u => u.name.toLowerCase().includes(term) || (u.nip_nisn || '').includes(term));
  }, [users, search]);

  const selectedUsers = useMemo(() => filtered.filter(u => selected.has(u.id)), [filtered, selected]);

  const toggle = (id: string | number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedUsers.length === filtered.length && filtered.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(u => u.id)));
    }
  };

  const switchRole = (r: KartuRole) => {
    setRole(r);
    setSelected(new Set());
    setSearch('');
  };

  return (
    <AdminLayout title="Cetak ID Card">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {(['siswa', 'guru'] as const).map(r => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition-colors ${
                  role === r
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {r === 'siswa' ? 'Murid' : 'Guru & Tendik'}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Cari ${role === 'siswa' ? 'nama / NISN' : 'nama / NIP'}...`}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={toggleAll}
            disabled={filtered.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            {selectedUsers.length === filtered.length && filtered.length > 0 ? 'Batal Pilih Semua' : 'Pilih Semua'}
          </button>

          <button
            onClick={() => window.print()}
            disabled={selectedUsers.length === 0}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
          <UserIcon className="w-3.5 h-3.5" />
          Pilih pengguna untuk membuat kartu, lalu tekan <b>Cetak</b>. Data guru/tendik ditampilkan otomatis sesuai peran (NIP/NBM & jabatan; murid: NISN & alamat).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daftar pengguna */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800 dark:text-white">
              {role === 'siswa' ? 'Daftar Murid' : 'Daftar Guru & Tendik'}
            </h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
            {isLoading ? (
              <div className="py-10 text-center text-slate-400 dark:text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                Memuat data...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center text-slate-400 dark:text-slate-500">
                <UserIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">Tidak ada data</p>
              </div>
            ) : (
              filtered.map(u => {
                const isChecked = selected.has(u.id);
                return (
                  <label
                    key={u.id}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                      isChecked ? 'bg-indigo-50 dark:bg-indigo-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(u.id)}
                      className="w-4 h-4 accent-indigo-600"
                    />
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                      {u.foto ? (
                        <img src={getFileUrl(u.foto)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{u.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {role === 'siswa'
                          ? `${u.kelas || 'Tanpa kelas'} • NISN: ${u.nip_nisn || '-'}`
                          : `${u.jabatan || 'Tenaga Pendidik'} • ${u.nip_nisn || 'NIP: -'}`}
                      </p>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Preview kartu */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 print:hidden">
          <h3 className="text-sm font-black text-slate-800 dark:text-white mb-1">Preview ID Card</h3>
          <p className="text-xs text-slate-400 mb-4">Desain modern, siap cetak pada kertas A4.</p>
          {selectedUsers.length === 0 ? (
            <div className="py-16 text-center text-slate-400 dark:text-slate-500">
              <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">Belum ada kartu dipilih</p>
              <p className="text-xs mt-1">Centang pengguna di panel kiri untuk melihat preview kartu.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-5">
              {selectedUsers.map(u => (
                <IdCardView key={u.id} user={u} role={role} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Area cetak */}
      <div className="print-area hidden print:block">
        <div className="flex flex-wrap gap-[10mm] p-[10mm]">
          {selectedUsers.map(u => (
            <IdCardView key={u.id} user={u} role={role} />
          ))}
        </div>
      </div>

      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area {
            position: absolute !important;
            left: 0;
            top: 0;
            width: 100%;
            display: block !important;
          }
          .idcard {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          @page { size: A4 portrait; margin: 8mm; }
        }
      `}</style>
    </AdminLayout>
  );
}
