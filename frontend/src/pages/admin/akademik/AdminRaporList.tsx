import AdminLayout from '../../../components/admin/AdminLayout';
import { Printer, Edit3, Loader2, FilePlus2, RefreshCw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useKelasList } from '../../../hooks/useKelas';
import { useUsers } from '../../../hooks/useUsers';
import { useRaporList, useCreateRapor, type RaporRecord } from '../../../hooks/useRapor';
import { useSistemKonfigurasi } from '../../../hooks/useSistemKonfigurasi';
import { useNilaiList } from '../../../hooks/useNilai';
import { toast } from 'sonner';

export default function AdminRaporList() {
  const location = useLocation();
  const isGuruPath = location.pathname.startsWith('/panel/guru');
  const cetakBase = isGuruPath ? '/panel/guru/rapor/cetak' : '/panel/rapor/cetak';
  const catatanPath = isGuruPath ? '/panel/guru/catatan-wali' : '/panel/rapor/catatan';

  const { data: config } = useSistemKonfigurasi();
  const defaultTahun = config?.tahun_ajaran_aktif || '2025/2026';
  const defaultSemester = (config?.semester_aktif || 'ganjil') as 'ganjil' | 'genap';

  const [tahunAjaran, setTahunAjaran] = useState(defaultTahun);
  const [semester, setSemester] = useState<'ganjil' | 'genap'>(defaultSemester);
  const [kelasNama, setKelasNama] = useState('');
  const [configSynced, setConfigSynced] = useState(false);

  // Sync defaults once config loads
  useEffect(() => {
    if (config && !configSynced) {
      if (config.tahun_ajaran_aktif) setTahunAjaran(config.tahun_ajaran_aktif);
      if (config.semester_aktif) setSemester(config.semester_aktif as 'ganjil' | 'genap');
      setConfigSynced(true);
    }
  }, [config, configSynced]);

  const { data: kelasList = [], isLoading: isKelasLoading } = useKelasList();
  const { data: siswaList = [], isLoading: isSiswaLoading, isError: isSiswaError } = useUsers('siswa');
  const { data: raporsRaw, isLoading: isRaporLoading, isError: isRaporError, refetch: refetchRapors } = useRaporList();
  const { data: nilaiRaw } = useNilaiList();
  const createRapor = useCreateRapor();

  const rapors = useMemo(() => {
    const list = Array.isArray(raporsRaw) ? raporsRaw : [];
    return list.filter(
      (r) => r.tahun_ajaran === tahunAjaran && r.semester === semester
    );
  }, [raporsRaw, tahunAjaran, semester]);

  const raporsBySiswa = useMemo(() => {
    const map = new Map<string, RaporRecord>();
    rapors.forEach((r) => map.set(String(r.siswa_id), r));
    return map;
  }, [rapors]);

  const nilaiCountBySiswa = useMemo(() => {
    const list = Array.isArray(nilaiRaw) ? nilaiRaw : (nilaiRaw as any)?.data || [];
    const map = new Map<string, number>();
    list.forEach((n: any) => {
      if (n.tahun_ajaran && n.tahun_ajaran !== tahunAjaran) return;
      if (n.semester && n.semester !== semester) return;
      const key = String(n.siswa_id);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [nilaiRaw, tahunAjaran, semester]);

  // Auto-pick first class when loaded
  const effectiveKelas = kelasNama || (kelasList[0]?.nama ?? '');

  useEffect(() => {
    if (!kelasNama && kelasList.length > 0) {
      setKelasNama(kelasList[0].nama);
    }
  }, [kelasList, kelasNama]);

  const students = useMemo(() => {
    const list = Array.isArray(siswaList) ? siswaList : [];
    if (!effectiveKelas) return list;
    return list.filter((s) => s.kelas === effectiveKelas);
  }, [siswaList, effectiveKelas]);

  const handleTampilkan = () => {
    if (!effectiveKelas && kelasList.length > 0) {
      setKelasNama(kelasList[0].nama);
    }
    refetchRapors();
  };

  const handleCreateRapor = async (siswaId: string | number, name: string) => {
    try {
      const res = await createRapor.mutateAsync({
        siswa_id: String(siswaId),
        tahun_ajaran: tahunAjaran,
        semester,
        sakit: 0,
        izin: 0,
        alpha: 0,
        terlambat: 0,
        status: 'draft',
      } as any);
      toast.success(`Rapor draft untuk ${name} berhasil dibuat`);
      await refetchRapors();
      const newId = res?.rapor?.id || res?.id;
      if (newId) {
        // stay on list — user can click print
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gagal membuat rapor');
    }
  };

  const isLoading = isKelasLoading || isSiswaLoading || isRaporLoading;
  const tahunOptions = useMemo(() => {
    const set = new Set<string>([tahunAjaran, defaultTahun, '2025/2026', '2024/2025', '2026/2027']);
    return Array.from(set).filter(Boolean);
  }, [tahunAjaran, defaultTahun]);

  return (
    <AdminLayout title="Cetak Rapor Siswa">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        {/* Filter Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Tahun Ajaran
            </label>
            <select
              value={tahunAjaran}
              onChange={(e) => setTahunAjaran(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
            >
              {tahunOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value as 'ganjil' | 'genap')}
              className="w-full sm:w-40 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white"
            >
              <option value="ganjil">Ganjil</option>
              <option value="genap">Genap</option>
            </select>
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-extrabold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
              Kelas
            </label>
            <select
              value={effectiveKelas}
              onChange={(e) => setKelasNama(e.target.value)}
              className="w-full sm:w-40 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700 dark:text-indigo-400"
            >
              {kelasList.length === 0 ? (
                <option value="">— Tidak ada kelas —</option>
              ) : (
                kelasList.map((k) => (
                  <option key={k.id} value={k.nama}>
                    {k.nama}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="w-full sm:w-auto flex items-end gap-2">
            <button
              type="button"
              onClick={handleTampilkan}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              Tampilkan Daftar Siswa
            </button>
            <button
              type="button"
              onClick={() => refetchRapors()}
              className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors"
              title="Muat ulang"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900">
          <Link
            to={catatanPath}
            className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors border border-amber-200 dark:border-amber-500/20"
          >
            <Edit3 className="w-4 h-4" /> Input Catatan Wali Kelas & Ekskul
          </Link>
          <div className="text-xs text-slate-400 font-semibold">
            {tahunAjaran} · {semester === 'ganjil' ? 'Ganjil' : 'Genap'}
            {effectiveKelas ? ` · Kelas ${effectiveKelas}` : ''}
            {students.length > 0 ? ` · ${students.length} siswa` : ''}
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-xs text-slate-400 font-semibold">Memuat data rapor & siswa...</p>
            </div>
          ) : isSiswaError || isRaporError ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-red-500 font-bold text-sm">Gagal memuat data dari server</p>
              <p className="text-xs text-slate-400 font-medium max-w-md mx-auto">
                Bukan karena data kosong — permintaan ke API gagal (akses ditolak, sesi habis, atau error server).
                Coba login ulang atau periksa hak akses role Anda.
              </p>
              <button
                type="button"
                onClick={() => refetchRapors()}
                className="mt-3 text-indigo-600 font-bold text-sm hover:underline"
              >
                Coba lagi
              </button>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <p className="text-slate-500 font-bold text-sm">Belum ada siswa di kelas ini</p>
              <p className="text-xs text-slate-400 font-medium">
                {kelasList.length === 0
                  ? 'Data kelas kosong. Tambah kelas di menu Kelas & Jurusan dulu.'
                  : `Tidak ada siswa terdaftar di kelas ${effectiveKelas || 'terpilih'}. Pastikan field kelas siswa di menu Users sudah diisi.`}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] uppercase font-extrabold tracking-wider border-y border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 w-16 text-center border-r border-slate-200 dark:border-slate-700">No</th>
                  <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">NISN</th>
                  <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-700">Nama Lengkap</th>
                  <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 text-center">Status Rapor</th>
                  <th className="px-6 py-4 border-r border-slate-200 dark:border-slate-700 text-center">Nilai Mapel</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                {students.map((siswa, idx) => {
                  const rapor = raporsBySiswa.get(String(siswa.id));
                  const mapelCount = nilaiCountBySiswa.get(String(siswa.id)) || 0;

                  return (
                    <tr key={siswa.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-center font-bold text-slate-400 border-r border-slate-100 dark:border-slate-800">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm border-r border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        {siswa.nip_nisn || '—'}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-white border-r border-slate-100 dark:border-slate-800">
                        {siswa.name}
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-100 dark:border-slate-800">
                        {rapor ? (
                          <span
                            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold border whitespace-nowrap ${
                              rapor.status === 'published'
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                                : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                            }`}
                          >
                            {rapor.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        ) : (
                          <span className="px-2.5 sm:px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                            Belum ada rapor
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center border-r border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          {mapelCount > 0 ? `${mapelCount} mapel` : 'Belum ada nilai'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {rapor ? (
                            <Link
                              to={`${cetakBase}/${rapor.id}`}
                              className="inline-flex p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-100 dark:border-indigo-500/20"
                              title="Preview & Cetak"
                            >
                              <Printer className="w-4 h-4" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              disabled={createRapor.isPending}
                              onClick={() => handleCreateRapor(siswa.id, siswa.name)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-500/20 text-xs font-bold disabled:opacity-50"
                              title="Buat draft rapor"
                            >
                              <FilePlus2 className="w-3.5 h-3.5" />
                              Buat Rapor
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {!isLoading && !isSiswaError && !isRaporError && students.length > 0 && (
            <p className="mt-4 text-[11px] text-slate-400 font-medium">
              Tip: tombol cetak hanya aktif jika record rapor sudah ada. Siswa tanpa rapor → klik &quot;Buat Rapor&quot; dulu.
              Data nilai mapel diambil dari menu Ledger Nilai / Buku Nilai.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
