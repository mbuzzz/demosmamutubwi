import { useMemo, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Loader2, CalendarDays, User, CheckCircle2, Trash2, Save } from 'lucide-react';
import { STATUS_PIKET_LABEL, type AbsensiPiketItem, type StatusPiket } from '../../../types/piket';
import { useAbsensiPiketTanggal, useStoreAbsensiPiket, useUpdateAbsensiPiket, useDeleteAbsensiPiket } from '../../../hooks/usePiket';

const STATUS_OPTIONS: StatusPiket[] = ['hadir', 'izin', 'sakit', 'terlambat', 'alpha'];

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const STATUS_STYLE: Record<string, string> = {
  hadir: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400',
  izin: 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400',
  sakit: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400',
  terlambat: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400',
  alpha: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400',
  belum: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
};

export default function AdminAbsensiPiket() {
  const [tanggal, setTanggal] = useState(todayStr());
  const { data, isLoading } = useAbsensiPiketTanggal(tanggal);
  const storeMutation = useStoreAbsensiPiket();
  const updateMutation = useUpdateAbsensiPiket();
  const deleteMutation = useDeleteAbsensiPiket();

  const isBusy = storeMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const items: AbsensiPiketItem[] = useMemo(() => (data?.data ?? []), [data]);
  const terisi = useMemo(() => items.filter(i => i.status !== 'belum').length, [items]);

  const simpan = (item: AbsensiPiketItem, status: StatusPiket, catatan?: string) => {
    if (item.id) {
      updateMutation.mutate({ id: item.id, data: { status, catatan } });
    } else {
      storeMutation.mutate({
        user_id: item.user_id,
        tanggal: item.tanggal,
        status,
        catatan,
        jadwal_piket_id: item.jadwal_piket_id ?? undefined,
      });
    }
  };

  const handleStatusChange = (item: AbsensiPiketItem, status: StatusPiket) => {
    simpan(item, status, item.catatan || undefined);
  };

  const handleCatatan = (item: AbsensiPiketItem, catatan: string) => {
    if (item.status === 'belum') {
      simpan(item, 'hadir', catatan || undefined);
    } else {
      simpan(item, item.status as StatusPiket, catatan || undefined);
    }
  };

  const handleDelete = (item: AbsensiPiketItem) => {
    if (!item.id) return;
    if (!window.confirm('Hapus catatan absensi ini?')) return;
    deleteMutation.mutate(item.id);
  };

  return (
    <AdminLayout title="Absensi Guru Piket">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-sky-100 uppercase tracking-wider">Jumlah Piket Hari Ini</p>
          <h3 className="text-3xl font-black mt-1">{isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : items.length}</h3>
          <p className="text-xs text-sky-100/80 mt-1">Guru terjadwal</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sudah Diisi</p>
          <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
            {isLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : terisi}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Dari {items.length} guru terjadwal</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" /> Tanggal Absensi
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={e => setTanggal(e.target.value)}
            className="mt-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Daftar absensi */}
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white">Daftar Piket</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {items.length > 0 ? `Pilih status untuk tiap guru — tersimpan otomatis` : 'Tidak ada jadwal piket pada tanggal ini'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
            Memuat data absensi...
          </div>
        ) : items.length === 0 ? (
          <div className="py-14 text-center">
            <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
              <CalendarDays className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm font-medium">Belum ada jadwal piket hari ini</p>
              <p className="text-xs mt-1">Buat jadwal piket terlebih dahulu di menu "Jadwal Guru Piket".</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {items.map(item => {
              const catatan = item.catatan || '';
              const isSaved = item.status !== 'belum';
              return (
                <div key={item.user_id} className="flex flex-col md:flex-row md:items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                      {item.user?.foto ? (
                        <img src={item.user.foto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{item.user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {item.user?.jabatan || 'Tenaga Pendidik'}
                        {item.keterangan ? ` • ${item.keterangan}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {isSaved && (
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_STYLE[item.status]}`}>
                        <CheckCircle2 className="w-3 h-3" /> Tersimpan
                      </span>
                    )}
                    <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      {STATUS_OPTIONS.map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(item, status)}
                          disabled={isBusy}
                          className={`px-2.5 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-60 ${
                            item.status === status
                              ? 'bg-sky-600 text-white'
                              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {STATUS_PIKET_LABEL[status as StatusPiket]}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      defaultValue={catatan}
                      onBlur={e => {
                        if (e.target.value !== catatan) handleCatatan(item, e.target.value);
                      }}
                      placeholder="Catatan..."
                      className="w-32 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    {item.id && (
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={isBusy}
                        className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <Save className="w-3.5 h-3.5" />
        Perubahan status & catatan disimpan otomatis saat diklik / keluar dari input.
      </div>
    </AdminLayout>
  );
}
