import AdminLayout from '../../../../components/admin/AdminLayout';
import { Save, Search, Inbox } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../../components/auth/AuthContext';
import { useUsers } from '../../../../hooks/useUsers';
import { useRaporList, useUpdateRapor } from '../../../../hooks/useRapor';

export default function GuruCatatanWali() {
  const { user } = useAuth();
  const kelasBinaan = user?.kelas || '';

  const { data: siswaList = [], isLoading: siswaLoading } = useUsers(
    'siswa',
    undefined,
    kelasBinaan || undefined
  );
  const { data: raporList = [] } = useRaporList();
  const updateRapor = useUpdateRapor();

  const [catatanMap, setCatatanMap] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Map siswa_id -> rapor (untuk ambil catatan_wali_kelas yang sudah tersimpan)
  const raporBySiswa = useMemo(() => {
    const map: Record<string, { id: string; catatan_wali_kelas?: string | null }> = {};
    (Array.isArray(raporList) ? raporList : []).forEach((r: any) => {
      map[String(r.siswa_id)] = r;
    });
    return map;
  }, [raporList]);

  const siswa = (Array.isArray(siswaList) ? siswaList : []).filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  function getCatatan(siswaId: string) {
    const key = String(siswaId);
    if (catatanMap[key] !== undefined) return catatanMap[key];
    return raporBySiswa[key]?.catatan_wali_kelas || '';
  }

  function updateCatatan(siswaId: string, text: string) {
    setCatatanMap(prev => ({ ...prev, [String(siswaId)]: text }));
  }

  function saveCatatan(siswa: any) {
    const rapor = raporBySiswa[String(siswa.id)];
    if (!rapor) {
      toast.error('Rapor belum dibuat untuk siswa ini. Buat rapor dulu dari menu Cetak Rapor.');
      return;
    }
    setSavingId(String(siswa.id));
    updateRapor.mutate(
      {
        id: rapor.id,
        data: { catatan_wali_kelas: catatanMap[String(siswa.id)] ?? rapor.catatan_wali_kelas ?? '' },
      },
      {
        onSuccess: () => {
          setSavingId(null);
          toast.success(`Catatan ${siswa.name} tersimpan`);
        },
        onError: () => {
          setSavingId(null);
        },
      }
    );
  }

  return (
    <AdminLayout title="Catatan Wali Kelas (Rapor)">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Input Catatan Rapor Siswa</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Tulis catatan untuk masing-masing siswa{kelasBinaan ? ` kelas ${kelasBinaan}` : ''}.
            </p>
          </div>
          <div className="relative max-w-xs w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari siswa..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
        </div>

        <div className="p-6">
          {!kelasBinaan ? (
            <div className="text-center py-12">
              <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Halaman ini khusus wali kelas. Akun Anda belum memiliki kelas binaan.
              </p>
            </div>
          ) : siswaLoading ? (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Memuat siswa...</p>
            </div>
          ) : siswa.length === 0 ? (
            <div className="text-center py-12">
              <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Belum ada siswa di kelas {kelasBinaan}.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {siswa.map((s: any) => (
                <div key={s.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{s.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {s.nip_nisn || '—'} • Kelas {s.kelas}
                      </p>
                    </div>
                    <button
                      onClick={() => saveCatatan(s)}
                      disabled={!raporBySiswa[String(s.id)] || savingId === String(s.id)}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-500 dark:disabled:text-slate-400 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
                    >
                      <Save className="w-4 h-4" />
                      {savingId === String(s.id) ? 'Menyimpan...' : 'Simpan Catatan'}
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={getCatatan(s.id)}
                    onChange={e => updateCatatan(s.id, e.target.value)}
                    placeholder="Tulis catatan wali kelas untuk siswa ini..."
                    className="mt-3 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                  />
                  {!raporBySiswa[String(s.id)] && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                      Rapor belum dibuat — buat dulu dari menu Cetak Rapor agar catatan bisa disimpan.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
