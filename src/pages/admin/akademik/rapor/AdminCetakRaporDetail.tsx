import AdminLayout from '../../../../components/admin/AdminLayout';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminCetakRaporDetail() {
  return (
    <AdminLayout title="Preview Cetak Rapor">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/panel/rapor" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Cetak
        </Link>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
          <Printer className="w-4 h-4" /> Cetak Rapor (PDF)
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Status Panel */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">AS</div>
            <h3 className="font-bold text-center text-slate-800 dark:text-white">Agus Setiawan</h3>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mb-4">NISN: 0081234501 • Kelas X-1</p>
            
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Nilai Akademik Lengkap
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Catatan Wali Kelas Ada
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Kehadiran Terekap
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-800 leading-relaxed">
            <strong>Catatan Sistem:</strong> Tampilan di kanan adalah *mockup preview*. Hasil cetakan PDF akan menggunakan kertas A4 dengan margin standar dinas pendidikan.
          </div>
        </div>

        {/* Paper Canvas Preview */}
        <div className="flex-1 w-full flex justify-center">
          <div className="w-full max-w-[800px] bg-white dark:bg-slate-900 shadow-lg border border-slate-300 dark:border-slate-600 p-10 md:p-14 pb-20 relative aspect-[1/1.414] overflow-y-auto custom-scrollbar text-slate-900 dark:text-white font-serif">
            
            {/* Header Rapor */}
            <div className="text-center border-b-[3px] border-slate-800 pb-4 mb-6">
              <h1 className="text-xl font-bold uppercase tracking-widest mb-1">Pencapaian Kompetensi Peserta Didik</h1>
              <h2 className="text-lg font-bold">SMAS MUHAMMADIYAH 1 BANYUWANGI</h2>
            </div>

            {/* Biodata Mini */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-semibold mb-8">
              <div className="flex"><span className="w-32">Nama Sekolah</span> <span>: SMAS Muhammadiyah 1</span></div>
              <div className="flex"><span className="w-32">Kelas</span> <span>: X-1</span></div>
              <div className="flex"><span className="w-32">Nama Peserta Didik</span> <span>: AGUS SETIAWAN</span></div>
              <div className="flex"><span className="w-32">Semester</span> <span>: 1 (Ganjil)</span></div>
              <div className="flex"><span className="w-32">Nomor Induk / NISN</span> <span>: 1029 / 0081234501</span></div>
              <div className="flex"><span className="w-32">Tahun Pelajaran</span> <span>: 2024/2025</span></div>
            </div>

            {/* Tabel Nilai */}
            <h3 className="font-bold text-sm mb-2 uppercase">A. Sikap</h3>
            <div className="border border-slate-800 p-3 text-xs text-justify mb-6">
              <strong>Sikap Spiritual:</strong> Baik, sangat rajin melaksanakan sholat dhuha dan dhuhur berjamaah.<br/><br/>
              <strong>Sikap Sosial:</strong> Sangat Baik, menunjukkan sikap santun kepada guru dan kepedulian tinggi terhadap teman.
            </div>

            <h3 className="font-bold text-sm mb-2 uppercase">B. Pengetahuan & Keterampilan</h3>
            <table className="w-full border-collapse border border-slate-800 text-xs text-center mb-8">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <td className="border border-slate-800 p-2 w-10">No</td>
                  <td className="border border-slate-800 p-2 text-left">Mata Pelajaran</td>
                  <td className="border border-slate-800 p-2 w-16">KKM</td>
                  <td className="border border-slate-800 p-2 w-16">Nilai</td>
                  <td className="border border-slate-800 p-2 w-16">Predikat</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-800 p-2" colSpan={5} align="left"><strong>Kelompok A (Nasional)</strong></td>
                </tr>
                <tr>
                  <td className="border border-slate-800 p-2">1</td>
                  <td className="border border-slate-800 p-2 text-left">Pendidikan Agama Islam</td>
                  <td className="border border-slate-800 p-2">75</td>
                  <td className="border border-slate-800 p-2 font-bold">88</td>
                  <td className="border border-slate-800 p-2">B</td>
                </tr>
                <tr>
                  <td className="border border-slate-800 p-2">2</td>
                  <td className="border border-slate-800 p-2 text-left">Bahasa Indonesia</td>
                  <td className="border border-slate-800 p-2">75</td>
                  <td className="border border-slate-800 p-2 font-bold">85</td>
                  <td className="border border-slate-800 p-2">B</td>
                </tr>
                <tr>
                  <td className="border border-slate-800 p-2">3</td>
                  <td className="border border-slate-800 p-2 text-left">Matematika</td>
                  <td className="border border-slate-800 p-2">75</td>
                  <td className="border border-slate-800 p-2 font-bold">92</td>
                  <td className="border border-slate-800 p-2">A</td>
                </tr>
              </tbody>
            </table>

            {/* Ekstra & Absen grid */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="font-bold text-sm mb-2 uppercase">C. Ekstrakurikuler</h3>
                <table className="w-full border-collapse border border-slate-800 text-xs">
                  <tr>
                    <td className="border border-slate-800 p-2 font-bold">Pramuka</td>
                    <td className="border border-slate-800 p-2 text-center">B (Baik)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-800 p-2 font-bold">Tapak Suci</td>
                    <td className="border border-slate-800 p-2 text-center">A (Sangat Baik)</td>
                  </tr>
                </table>
              </div>
              <div>
                <h3 className="font-bold text-sm mb-2 uppercase">D. Ketidakhadiran</h3>
                <table className="w-full border-collapse border border-slate-800 text-xs">
                  <tr><td className="border border-slate-800 p-2">Sakit</td><td className="border border-slate-800 p-2 text-center">2 Hari</td></tr>
                  <tr><td className="border border-slate-800 p-2">Izin</td><td className="border border-slate-800 p-2 text-center">-</td></tr>
                  <tr><td className="border border-slate-800 p-2">Tanpa Keterangan</td><td className="border border-slate-800 p-2 text-center">-</td></tr>
                  <tr><td className="border border-slate-800 p-2 font-bold">Terlambat</td><td className="border border-slate-800 p-2 text-center font-bold">1 Hari</td></tr>
                </table>
                <p className="text-[9px] text-slate-500 mt-1">Data absensi dari sistem RFID & manual</p>
              </div>
            </div>

            {/* Signature Area */}
            <div className="flex justify-between px-10 text-xs text-center mt-16">
              <div>
                Mengetahui,<br/>Orang Tua / Wali<br/><br/><br/><br/><br/>
                <strong>( ......................................... )</strong>
              </div>
              <div>
                Banyuwangi, 18 Desember 2024<br/>Wali Kelas<br/><br/><br/><br/><br/>
                <strong>Ahmad Hidayat, S.Pd</strong><br/>NBM. 1234567
              </div>
            </div>
            <div className="text-center text-xs mt-12">
              Kepala Sekolah<br/><br/><br/><br/><br/>
              <strong>Drs. H. Sugeng, M.Pd</strong><br/>NBM. 19650412
            </div>

          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
