import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { BarChart3, Download, Search, AlertCircle } from 'lucide-react';
import { MOCK_REKAP_ABSENSI } from '../../../types/absensi';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

// Mock data for Subject/Class Attendance Rekap (Jurnal Kelas)
const MOCK_REKAP_JURNAL = [
  { id: 'rj1', nama: 'Agus Setiawan', kelas: 'X-1', totalJam: 80, hadirJam: 78, izinJam: 2, sakitJam: 0, alphaJam: 0 },
  { id: 'rj2', nama: 'Budi Santoso', kelas: 'X-1', totalJam: 80, hadirJam: 72, izinJam: 0, sakitJam: 4, alphaJam: 4 },
  { id: 'rj3', nama: 'Citra Dewi', kelas: 'X-1', totalJam: 80, hadirJam: 80, izinJam: 0, sakitJam: 0, alphaJam: 0 },
  { id: 'rj4', nama: 'Dian Permata', kelas: 'X-1', totalJam: 80, hadirJam: 75, izinJam: 2, sakitJam: 3, alphaJam: 0 },
  { id: 'rj5', nama: 'Eko Prasetyo', kelas: 'X-1', totalJam: 80, hadirJam: 68, izinJam: 0, sakitJam: 2, alphaJam: 10 },
  { id: 'rj6', nama: 'Fitri Handayani', kelas: 'XI-IPA-1', totalJam: 84, hadirJam: 82, izinJam: 1, sakitJam: 1, alphaJam: 0 },
  { id: 'rj7', nama: 'Galih Putra', kelas: 'XI-IPA-1', totalJam: 84, hadirJam: 70, izinJam: 2, sakitJam: 2, alphaJam: 10 },
  { id: 'rj8', nama: 'Hesti Wulandari', kelas: 'XI-IPA-1', totalJam: 84, hadirJam: 83, izinJam: 0, sakitJam: 0, alphaJam: 1 },
];

export default function AdminRekapAbsensi() {
  const [activeTab, setActiveTab] = useState<'rfid' | 'kelas'>('rfid');
  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');

  const rawRekapRfid = MOCK_REKAP_ABSENSI;
  const rawRekapJurnal = MOCK_REKAP_JURNAL;

  const kelasList = [...new Set(rawRekapRfid.map(r => r.kelas))];

  const filteredRfid = rawRekapRfid.filter(r => {
    if (filterKelas && r.kelas !== filterKelas) return false;
    if (search && !r.nama.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredJurnal = rawRekapJurnal.filter(r => {
    if (filterKelas && r.kelas !== filterKelas) return false;
    if (search && !r.nama.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleExportExcel = () => {
    const activeData = activeTab === 'rfid' ? filteredRfid : filteredJurnal;
    if (activeData.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    let reportData = [];
    if (activeTab === 'rfid') {
      reportData = activeData.map(r => {
        const total = r.hadir + r.alpha + r.terlambat + r.izin + r.sakit;
        const persen = total > 0 ? Math.round(r.hadir / total * 100) : 0;
        return {
          'Nama Siswa': r.nama,
          'Kelas': r.kelas,
          'Hadir (Hari)': r.hadir,
          'Izin (Hari)': r.izin,
          'Sakit (Hari)': r.sakit,
          'Alpha (Hari)': r.alpha,
          'Terlambat (Hari)': r.terlambat,
          'Persentase Kehadiran': `${persen}%`
        };
      });
    } else {
      reportData = activeData.map(r => {
        const persen = r.totalJam > 0 ? Math.round(r.hadirJam / r.totalJam * 100) : 0;
        return {
          'Nama Siswa': r.nama,
          'Kelas': r.kelas,
          'Total Jam KBM': r.totalJam,
          'Jam Hadir': r.hadirJam,
          'Jam Izin': r.izinJam,
          'Jam Sakit': r.sakitJam,
          'Jam Alpha': r.alphaJam,
          'Persentase Kehadiran Mapel': `${persen}%`
        };
      });
    }

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    const sheetName = activeTab === 'rfid' ? 'Presensi RFID Gerbang' : 'Presensi Jurnal KBM';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Auto-fit columns
    const colWidths = Object.keys(reportData[0]).map(key => ({
      wch: Math.max(key.length, ...reportData.map(r => String(r[key as keyof typeof r]).length)) + 2
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `Rekap_Kehadiran_${activeTab.toUpperCase()}_SIT.xlsx`);
    toast.success(`Rekap absensi ${activeTab === 'rfid' ? 'Gerbang (RFID)' : 'Kelas (KBM)'} berhasil diekspor ke Excel`);
  };

  const totalHadir = filteredRfid.reduce((a, r) => a + r.hadir, 0);
  const totalAlpha = filteredRfid.reduce((a, r) => a + r.alpha, 0);
  const totalTerlambat = filteredRfid.reduce((a, r) => a + r.terlambat, 0);
  const rataKehadiran = filteredRfid.length > 0 ? Math.round(totalHadir / (totalHadir + totalAlpha + totalTerlambat) * 100) : 0;

  return (
    <AdminLayout title="Rekap Kehadiran Siswa">
      {/* Explanation Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-500/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 text-xs text-indigo-850 dark:text-indigo-300 leading-relaxed mb-6 space-y-1.5 shadow-sm">
        <h4 className="font-extrabold flex items-center gap-1.5 text-indigo-900 dark:text-indigo-200">
          <AlertCircle className="w-4 h-4 text-indigo-500" /> Perbedaan Tipe Presensi
        </h4>
        <p>
          1. <strong>Presensi Gerbang (RFID):</strong> Kehadiran harian siswa di sekolah secara umum yang dicatat melalui mesin tap RFID di gerbang utama pada saat masuk dan pulang.
        </p>
        <p>
          2. <strong>Presensi Kelas (Jurnal Mengajar):</strong> Kehadiran siswa di ruang kelas yang dicatat secara manual per jam pelajaran oleh guru mata pelajaran masing-masing.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 max-w-md mb-6">
        <button 
          onClick={() => setActiveTab('rfid')} 
          className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'rfid' ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Presensi Gerbang (RFID)
        </button>
        <button 
          onClick={() => setActiveTab('kelas')} 
          className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'kelas' ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Presensi Kelas (Jurnal KBM)
        </button>
      </div>

      {/* Stats Cards (RFID only) */}
      {activeTab === 'rfid' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-sm">
            <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Rata-rata Kehadiran</p>
            <h3 className="text-3xl font-black mt-1">{rataKehadiran}%</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Hadir</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{totalHadir}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Terlambat</p>
            <h3 className="text-3xl font-black text-orange-500 mt-1">{totalTerlambat}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Alpha</p>
            <h3 className="text-3xl font-black text-red-500 mt-1">{totalAlpha}</h3>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            Semester Ganjil 2025/2026 ({activeTab === 'rfid' ? 'RFID Gerbang' : 'Jurnal Kelas'})
          </div>
          <div className="flex-1" />
          <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 dark:text-slate-300">
            <option value="">Semua Kelas</option>
            {kelasList.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari siswa..." className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40 dark:text-white" />
          </div>
          <button onClick={handleExportExcel} className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
            <Download className="w-3.5 h-3.5" /> Ekspor XLSX
          </button>
        </div>

        {/* Tab 1: RFID TABLE */}
        {activeTab === 'rfid' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-5 py-4">Nama</th>
                  <th className="px-5 py-4">Kelas</th>
                  <th className="px-5 py-4 text-center">Hadir</th>
                  <th className="px-5 py-4 text-center">Izin</th>
                  <th className="px-5 py-4 text-center">Sakit</th>
                  <th className="px-5 py-4 text-center">Alpha</th>
                  <th className="px-5 py-4 text-center">Terlambat</th>
                  <th className="px-5 py-4 text-center">% Kehadiran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredRfid.map(r => {
                  const total = r.hadir + r.alpha + r.terlambat + r.izin + r.sakit;
                  const persen = total > 0 ? Math.round(r.hadir / total * 100) : 0;
                  const warna = persen >= 95 ? 'text-emerald-600' : persen >= 85 ? 'text-amber-600' : 'text-red-600';
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{r.nama}</td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{r.kelas}</td>
                      <td className="px-5 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">{r.hadir}</td>
                      <td className="px-5 py-4 text-center font-semibold text-blue-600">{r.izin}</td>
                      <td className="px-5 py-4 text-center font-semibold text-amber-600">{r.sakit}</td>
                      <td className="px-5 py-4 text-center font-bold text-red-600 dark:text-red-400">{r.alpha}</td>
                      <td className="px-5 py-4 text-center font-semibold text-orange-600">{r.terlambat}</td>
                      <td className="px-5 py-4 text-center font-black text-base"><span className={warna}>{persen}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: SUBJECT / JURNAL KBM TABLE */}
        {activeTab === 'kelas' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-5 py-4">Nama</th>
                  <th className="px-5 py-4">Kelas</th>
                  <th className="px-5 py-4 text-center">Total Jam Pelajaran</th>
                  <th className="px-5 py-4 text-center">Jam Hadir</th>
                  <th className="px-5 py-4 text-center">Jam Izin</th>
                  <th className="px-5 py-4 text-center">Jam Sakit</th>
                  <th className="px-5 py-4 text-center">Jam Alpha</th>
                  <th className="px-5 py-4 text-center">% Kehadiran KBM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredJurnal.map(r => {
                  const persen = r.totalJam > 0 ? Math.round(r.hadirJam / r.totalJam * 100) : 0;
                  const warna = persen >= 90 ? 'text-emerald-600' : persen >= 80 ? 'text-amber-600' : 'text-red-600';
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{r.nama}</td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{r.kelas}</td>
                      <td className="px-5 py-4 text-center font-semibold text-slate-500">{r.totalJam} Jam</td>
                      <td className="px-5 py-4 text-center font-bold text-emerald-600 dark:text-emerald-400">{r.hadirJam} Jam</td>
                      <td className="px-5 py-4 text-center font-semibold text-blue-600">{r.izinJam} Jam</td>
                      <td className="px-5 py-4 text-center font-semibold text-amber-600">{r.sakitJam} Jam</td>
                      <td className="px-5 py-4 text-center font-bold text-red-600 dark:text-red-400">{r.alphaJam} Jam</td>
                      <td className="px-5 py-4 text-center font-black text-base"><span className={warna}>{persen}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
