import AdminLayout from '../../../components/admin/AdminLayout';
import { FileText, Printer, Award, BarChart3 } from 'lucide-react';
import { useState } from 'react';

interface GradeItem {
  name: string;
  mapel: string;
  grade: number;
  date: string;
  feedback?: string;
}

const tugasGrades: GradeItem[] = [
  { name: 'Tugas Rumus Eksponen', mapel: 'Matematika Wajib', grade: 90, date: '15 Jul 2024', feedback: 'Kerja bagus Agus, langkah pengerjaan teratur dan benar.' },
  { name: 'Laporan Praktikum Kinematika', mapel: 'Fisika', grade: 82, date: '18 Jul 2024', feedback: 'Laporan lengkap, tabel pengamatan tepat.' },
  { name: 'Analisis Paragraf', mapel: 'Bahasa Indonesia', grade: 88, date: '10 Jul 2024', feedback: 'Argumen sangat kuat dan terstruktur.' },
];

const kuisGrades: GradeItem[] = [
  { name: 'Kuis Logaritma Dasar', mapel: 'Matematika Wajib', grade: 95, date: '12 Jul 2024' },
  { name: 'Kuis Vektor 2D', mapel: 'Fisika', grade: 80, date: '05 Jul 2024' },
  { name: 'Kuis Puisi Rakyat', mapel: 'Bahasa Indonesia', grade: 85, date: '28 Jun 2024' },
];

const ujianGrades: GradeItem[] = [
  { name: 'Penilaian Tengah Semester Ganjil', mapel: 'Matematika Wajib', grade: 88, date: '22 Okt 2024' },
  { name: 'Penilaian Tengah Semester Ganjil', mapel: 'Fisika', grade: 78, date: '24 Okt 2024' },
  { name: 'Penilaian Tengah Semester Ganjil', mapel: 'Bahasa Indonesia', grade: 86, date: '20 Okt 2024' },
];

const finalRapor = [
  { mapel: 'Matematika Wajib', kkm: 75, tugas: 87, kuis: 88, ujian: 88, akhir: 88, predikat: 'A-', catatan: 'Sangat baik dalam pemecahan masalah logaritma dan relasi fungsi.' },
  { mapel: 'Fisika', kkm: 75, tugas: 81, kuis: 80, ujian: 78, akhir: 80, predikat: 'B+', catatan: 'Baik dalam praktikum gerak lurus dan pemahaman analisis vektor.' },
  { mapel: 'Bahasa Indonesia', kkm: 75, tugas: 88, kuis: 85, ujian: 86, akhir: 86, predikat: 'A-', catatan: 'Sangat baik dalam penulisan karya ilmiah dan membaca teks prosedural.' },
];

export default function SiswaRapor() {
  const [activeTab, setActiveTab] = useState<'tugas' | 'kuis' | 'ujian' | 'rapor'>('tugas');

  const averageGrade = Math.round(finalRapor.reduce((a, s) => a + s.akhir, 0) / finalRapor.length);

  return (
    <AdminLayout title="Rapor & Nilai Saya">
      
      {/* Ringkasan Dashboard Nilai */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-6 text-white shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Rerata Nilai Akhir</span>
            <h3 className="text-4xl font-black mt-2">{averageGrade}</h3>
            <p className="text-[10px] text-indigo-200 mt-1">Skala 1 - 100 • Sangat Baik</p>
          </div>
          <Award className="w-12 h-12 text-indigo-200 opacity-80" />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tugas Dinilai</span>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-2">{tugasGrades.length}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Semua tugas terkirim</p>
          </div>
          <FileText className="w-10 h-10 text-emerald-500 opacity-80" />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kuis Diikuti</span>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-2">{kuisGrades.length}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Rerata kuis harian: 87</p>
          </div>
          <BarChart3 className="w-10 h-10 text-amber-500 opacity-80" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          {([
            { key: 'tugas' as const, label: 'Nilai Tugas' },
            { key: 'kuis' as const, label: 'Nilai Kuis' },
            { key: 'ujian' as const, label: 'Nilai Ujian' },
            { key: 'rapor' as const, label: 'Laporan Rapor Akhir' },
          ]).map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t.key 
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/20 dark:bg-indigo-500/10' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          
          {/* Nilai Tugas */}
          {activeTab === 'tugas' && (
            <div className="space-y-4">
              {tugasGrades.map((g, i) => (
                <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">{g.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{g.mapel} • {g.date}</p>
                    </div>
                    <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 shrink-0">{g.grade}</div>
                  </div>
                  {g.feedback && (
                    <div className="mt-3 p-3 bg-white dark:bg-slate-900 border border-slate-250/50 dark:border-slate-750/50 rounded-xl">
                      <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">Catatan Guru</span>
                      <p className="text-xs text-slate-600 dark:text-slate-350 italic">"{g.feedback}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Nilai Kuis */}
          {activeTab === 'kuis' && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-4">Nama Kuis</th>
                    <th className="px-5 py-4">Mata Pelajaran</th>
                    <th className="px-5 py-4">Tanggal Pelaksanaan</th>
                    <th className="px-5 py-4 text-center w-28">Skor Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {kuisGrades.map((g, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{g.name}</td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">{g.mapel}</td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{g.date}</td>
                      <td className="px-5 py-4 text-center font-black text-indigo-600 dark:text-indigo-400 text-lg">{g.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Nilai Ujian */}
          {activeTab === 'ujian' && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-4">Nama Ujian</th>
                    <th className="px-5 py-4">Mata Pelajaran</th>
                    <th className="px-5 py-4">Tanggal Pelaksanaan</th>
                    <th className="px-5 py-4 text-center w-28">Skor Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {ujianGrades.map((g, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{g.name}</td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">{g.mapel}</td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{g.date}</td>
                      <td className="px-5 py-4 text-center font-black text-indigo-600 dark:text-indigo-400 text-lg">{g.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Laporan Rapor Akhir */}
          {activeTab === 'rapor' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-indigo-50 dark:bg-indigo-500/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                <div>
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">Hasil Belajar Semester Ganjil</h4>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5">Semua komponen nilai telah divalidasi oleh wali kelas.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95">
                  <Printer className="w-4 h-4" /> Cetak Rapor Mandiri
                </button>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-500/20">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4" /> Rekap Absensi Semester
                </h4>
                <div className="grid grid-cols-5 gap-3 text-center">
                  {[
                    { label: 'Hadir', value: 42, color: 'text-emerald-600' },
                    { label: 'Izin', value: 1, color: 'text-blue-600' },
                    { label: 'Sakit', value: 2, color: 'text-amber-600' },
                    { label: 'Alpha', value: 0, color: 'text-red-600' },
                    { label: 'Terlambat', value: 1, color: 'text-orange-600' },
                  ].map(item => (
                    <div key={item.label} className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-emerald-100 dark:border-emerald-500/20">
                      <p className={`text-lg font-black ${item.color}`}>{item.value}</p>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-850 text-white text-xs font-bold">
                    <tr>
                      <th className="px-5 py-4">Mata Pelajaran</th>
                      <th className="px-5 py-4 text-center w-20">KKM</th>
                      <th className="px-5 py-4 text-center w-20">Tugas</th>
                      <th className="px-5 py-4 text-center w-20">Kuis</th>
                      <th className="px-5 py-4 text-center w-20">Ujian</th>
                      <th className="px-5 py-4 text-center w-20">Akhir</th>
                      <th className="px-5 py-4 text-center w-20">Predikat</th>
                      <th className="px-5 py-4">Catatan Perkembangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                    {finalRapor.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-850 dark:text-white">{r.mapel}</td>
                        <td className="px-5 py-4 text-center font-bold text-slate-500">{r.kkm}</td>
                        <td className="px-5 py-4 text-center font-medium text-slate-750 dark:text-slate-350">{r.tugas}</td>
                        <td className="px-5 py-4 text-center font-medium text-slate-750 dark:text-slate-350">{r.kuis}</td>
                        <td className="px-5 py-4 text-center font-medium text-slate-750 dark:text-slate-350">{r.ujian}</td>
                        <td className="px-5 py-4 text-center font-black text-indigo-600 dark:text-indigo-400 text-lg bg-slate-50 dark:bg-slate-800/50">{r.akhir}</td>
                        <td className="px-5 py-4 text-center font-bold text-emerald-600">{r.predikat}</td>
                        <td className="px-5 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs truncate md:max-w-none md:whitespace-normal">{r.catatan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}
