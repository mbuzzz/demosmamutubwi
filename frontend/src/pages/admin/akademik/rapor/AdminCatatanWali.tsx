import AdminLayout from '../../../../components/admin/AdminLayout';
import { Save, Search, User, Inbox } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useKelasList } from '../../../../hooks/useKelas';
import { useUsers } from '../../../../hooks/useUsers';
import { useRaporList, useUpdateRapor } from '../../../../hooks/useRapor';

export default function AdminCatatanWali() {
  const { data: kelasList = [] } = useKelasList();
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedSiswaId, setSelectedSiswaId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data: siswaList = [], isLoading: siswaLoading } = useUsers(
    'siswa',
    undefined,
    (Array.isArray(kelasList) ? kelasList : []).find((k: any) => String(k.id) === selectedKelas)?.nama || undefined
  );
  const { data: raporList = [] } = useRaporList();
  const updateRapor = useUpdateRapor();

  const raporBySiswa = useMemo(() => {
    const map: Record<string, any> = {};
    (Array.isArray(raporList) ? raporList : []).forEach((r: any) => {
      map[String(r.siswa_id)] = r;
    });
    return map;
  }, [raporList]);

  const siswa = (Array.isArray(siswaList) ? siswaList : []).filter((s: any) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const selectedSiswa = siswa.find((s: any) => String(s.id) === selectedSiswaId) || null;
  const selectedRapor = selectedSiswa ? raporBySiswa[String(selectedSiswa.id)] : null;

  const [form, setForm] = useState<{
    catatan: string;
    sakit: string;
    izin: string;
    alpha: string;
    terlambat: string;
  }>({ catatan: '', sakit: '0', izin: '0', alpha: '0', terlambat: '0' });
  const [saving, setSaving] = useState(false);

  function selectSiswa(s: any) {
    setSelectedSiswaId(String(s.id));
    const r = raporBySiswa[String(s.id)];
    setForm({
      catatan: r?.catatan_wali_kelas || '',
      sakit: String(r?.sakit ?? 0),
      izin: String(r?.izin ?? 0),
      alpha: String(r?.alpha ?? 0),
      terlambat: String(r?.terlambat ?? 0),
    });
  }

  function saveCatatan() {
    if (!selectedSiswa || !selectedRapor) {
      toast.error('Rapor belum dibuat untuk siswa ini. Buat rapor dulu dari menu Cetak Rapor.');
      return;
    }
    setSaving(true);
    updateRapor.mutate(
      {
        id: selectedRapor.id,
        data: {
          catatan_wali_kelas: form.catatan,
          sakit: Number(form.sakit) || 0,
          izin: Number(form.izin) || 0,
          alpha: Number(form.alpha) || 0,
          terlambat: Number(form.terlambat) || 0,
        },
      },
      {
        onSuccess: () => {
          setSaving(false);
          toast.success(`Catatan ${selectedSiswa.name} tersimpan`);
        },
        onError: () => setSaving(false),
      }
    );
  }

  return (
    <AdminLayout title="Input Catatan Wali Kelas & Ekstrakurikuler">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Pilih Kelas Binaan</label>
            <select
              value={selectedKelas}
              onChange={e => setSelectedKelas(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
            >
              <option value="">Pilih kelas...</option>
              {(Array.isArray(kelasList) ? kelasList : []).map((k: any) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* List Siswa */}
          <div className="xl:col-span-1 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col h-[600px]">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 relative">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-6 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari siswa..."
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
              {!selectedKelas ? (
                <div className="p-6 text-center">
                  <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pilih kelas dulu.</p>
                </div>
              ) : siswaLoading ? (
                <div className="p-6 text-center">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Memuat siswa...</p>
                </div>
              ) : siswa.length === 0 ? (
                <div className="p-6 text-center">
                  <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tidak ada siswa.</p>
                </div>
              ) : siswa.map((s: any) => (
                <button
                  key={s.id}
                  onClick={() => selectSiswa(s)}
                  className={`w-full text-left p-4 transition-colors border-l-4 ${
                    selectedSiswaId === String(s.id)
                      ? 'bg-indigo-50/50 border-indigo-600 hover:bg-indigo-50'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`text-sm ${selectedSiswaId === String(s.id) ? 'font-bold text-indigo-900 dark:text-indigo-300' : 'font-semibold text-slate-700 dark:text-slate-200'}`}>{s.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.nip_nisn || '—'}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Input Wali Kelas */}
          <div className="xl:col-span-3 space-y-6">
            {!selectedSiswa ? (
              <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <User className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Pilih siswa untuk mengisi catatan wali kelas.
                </p>
              </div>
            ) : (
            <>
            <div className="flex justify-between items-center bg-indigo-600 text-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">{selectedSiswa.name}</h3>
                  <p className="text-indigo-200 text-xs mt-1">Kelas {selectedSiswa.kelas} • NISN {selectedSiswa.nip_nisn || '—'}</p>
                </div>
              </div>
              <button
                onClick={saveCatatan}
                disabled={!selectedRapor || saving}
                className="bg-white text-indigo-600 hover:bg-indigo-50 disabled:bg-slate-200 disabled:text-slate-400 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Simpan Rapor Anak Ini'}
              </button>
            </div>

            {!selectedRapor && (
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold p-3 rounded-xl">
                Rapor belum dibuat untuk siswa ini — buat dulu dari menu Cetak Rapor agar catatan & kehadiran bisa disimpan.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Catatan Wali Kelas</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Catatan Umum Wali Kelas</label>
                  <textarea
                    rows={4}
                    value={form.catatan}
                    onChange={e => setForm(prev => ({ ...prev, catatan: e.target.value }))}
                    placeholder="Tulis catatan wali kelas..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-5 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">Rekap Ketidakhadiran (Sistem)</h4>
                <div className="space-y-2">
                  {([
                    { key: 'sakit', label: 'Sakit', color: 'text-amber-600' },
                    { key: 'izin', label: 'Izin', color: 'text-blue-600' },
                    { key: 'alpha', label: 'Tanpa Keterangan (Alpa)', color: 'text-red-600' },
                    { key: 'terlambat', label: 'Terlambat', color: 'text-orange-600' },
                  ] as const).map(item => (
                    <div key={item.key} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{item.label}</span>
                      <input
                        type="number"
                        min={0}
                        value={form[item.key]}
                        onChange={e => setForm(prev => ({ ...prev, [item.key]: e.target.value }))}
                        className={`w-16 px-2 py-1 text-center border border-slate-200 dark:border-slate-700 rounded text-sm font-bold ${item.color}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
