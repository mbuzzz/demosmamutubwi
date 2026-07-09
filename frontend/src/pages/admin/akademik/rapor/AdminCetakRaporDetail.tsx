import AdminLayout from '../../../../components/admin/AdminLayout';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useRapor } from '../../../../hooks/useRapor';
import { getFileUrl } from '../../../../lib/api';

export default function AdminCetakRaporDetail() {
  const { id } = useParams<{ id: string }>();

  // Fetch report card data dynamically
  const { data: responseData, isLoading, isError } = useRapor(id);

  const handlePrint = () => {
    if (!id) return;
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const rootURL = apiURL.replace(/\/api\/?$/, '');
    window.open(`${rootURL}/api/rapors/${id}/pdf`, '_blank');
  };

  if (isLoading) {
    return (
      <AdminLayout title="Preview Cetak Rapor">
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-semibold">Memuat data rapor...</p>
        </div>
      </AdminLayout>
    );
  }

  if (isError || !responseData) {
    return (
      <AdminLayout title="Preview Cetak Rapor">
        <div className="text-center py-16 text-red-500 font-bold text-sm">
          Gagal memuat data rapor dari server
        </div>
      </AdminLayout>
    );
  }

  const { rapor, nilais = [], wali_kelas_name, kepsek_name } = responseData as any;
  const siswa = rapor.siswa || {};
  const initials = siswa.name ? siswa.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'AS';

  const template = responseData.kurikulum?.rapor_template || [
    { id: 'kop', type: 'kop_surat', visible: true, properties: { mode: 'text_only' } },
    { id: 'biodata', type: 'biodata_siswa', visible: true },
    { id: 'nilai', type: 'tabel_nilai', visible: true },
    { id: 'ekskul', type: 'tabel_ekskul', visible: true },
    { id: 'absensi', type: 'tabel_absensi', visible: true },
    { id: 'ttd', type: 'signatures', visible: true, properties: { layout: 'two_columns' } }
  ];

  return (
    <AdminLayout title="Preview Cetak Rapor">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/panel/rapor" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Cetak
        </Link>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm active:scale-95">
          <Printer className="w-4 h-4" /> Cetak Rapor (PDF)
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Status Panel */}
        <div className="w-full lg:w-64 shrink-0 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            {siswa.foto ? (
              <img src={getFileUrl(`/storage/${siswa.foto}`)} alt="Avatar" className="w-16 h-16 rounded-full object-cover shadow-sm mx-auto mb-3" />
            ) : (
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-3">
                {initials}
              </div>
            )}
            <h3 className="font-bold text-center text-slate-800 dark:text-white">{siswa.name}</h3>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mb-4">NISN: {siswa.nip_nisn || '—'} • Kelas {siswa.kelas}</p>
            
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
            
            {/* Dynamic Rapor Content */}
            {template.map((block: any, index: number) => {
              if (block.visible === false) return null;

              if (block.type === 'kop_surat') {
                return (
                  <div key={index} className="text-center border-b-[3px] border-slate-800 pb-4 mb-6">
                    <h1 className="text-xl font-bold uppercase tracking-widest mb-1">Pencapaian Kompetensi Peserta Didik</h1>
                    <h2 className="text-lg font-bold">SMAS MUHAMMADIYAH 1 BANYUWANGI</h2>
                    <p className="text-xs">Tahun Pelajaran: {rapor.tahun_ajaran} | Semester: {rapor.semester === 'ganjil' ? 'Ganjil' : 'Genap'}</p>
                  </div>
                );
              }

              if (block.type === 'biodata_siswa') {
                return (
                  <div key={index} className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-semibold mb-8">
                    <div className="flex"><span className="w-32">Nama Sekolah</span> <span>: SMAS Muhammadiyah 1</span></div>
                    <div className="flex"><span className="w-32">Kelas</span> <span>: {siswa.kelas}</span></div>
                    <div className="flex"><span className="w-32">Nama Peserta Didik</span> <span>: {siswa.name?.toUpperCase()}</span></div>
                    <div className="flex"><span className="w-32">Semester</span> <span>: {rapor.semester === 'ganjil' ? '1 (Ganjil)' : '2 (Genap)'}</span></div>
                    <div className="flex"><span className="w-32">Nomor Induk / NISN</span> <span>: {siswa.nip_nisn || '—'}</span></div>
                    <div className="flex"><span className="w-32">Tahun Pelajaran</span> <span>: {rapor.tahun_ajaran}</span></div>
                  </div>
                );
              }

              if (block.type === 'tabel_nilai') {
                return (
                  <div key={index}>
                    <h3 className="font-bold text-sm mb-2 uppercase">NILAI AKADEMIK & CAPAIAN KOMPETENSI</h3>
                    <table className="w-full border-collapse border border-slate-800 text-xs text-center mb-8">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                          <td className="border border-slate-800 p-2 w-10 font-bold">No</td>
                          <td className="border border-slate-800 p-2 text-left font-bold">Mata Pelajaran</td>
                          <td className="border border-slate-800 p-2 w-16 font-bold">KKM</td>
                          <td className="border border-slate-800 p-2 w-16 font-bold">Nilai Akhir</td>
                          <td className="border border-slate-800 p-2 w-16 font-bold">Predikat</td>
                          <td className="border border-slate-800 p-2 text-left font-bold">Deskripsi</td>
                        </tr>
                      </thead>
                      <tbody>
                        {nilais.length > 0 ? (
                          nilais.map((n: any, idx: number) => (
                            <tr key={n.id}>
                              <td className="border border-slate-800 p-2">{idx + 1}</td>
                              <td className="border border-slate-800 p-2 text-left font-bold">{n.mapel?.nama}</td>
                              <td className="border border-slate-800 p-2">{n.mapel?.kkm || 75}</td>
                              <td className="border border-slate-800 p-2 font-bold">{n.nilai_akhir}</td>
                              <td className="border border-slate-800 p-2 font-bold uppercase">{n.predikat}</td>
                              <td className="border border-slate-800 p-2 text-left text-[10px] leading-tight">
                                {n.catatan || 'Menunjukkan perkembangan kompetensi yang cukup pada semua tujuan pembelajaran.'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="border border-slate-800 p-3 text-slate-400 text-center">Belum ada data nilai mata pelajaran.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (block.type === 'tabel_ekskul') {
                return (
                  <div key={index} className="mb-6">
                    <h3 className="font-bold text-sm mb-2 uppercase">KEGIATAN EKSTRAKURIKULER</h3>
                    <table className="w-full border-collapse border border-slate-800 text-xs">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                          <td className="border border-slate-800 p-2 w-10 text-center font-bold">No</td>
                          <td className="border border-slate-800 p-2 font-bold">Kegiatan Ekstrakurikuler</td>
                          <td className="border border-slate-800 p-2 text-center font-bold w-20">Predikat</td>
                          <td className="border border-slate-800 p-2 font-bold">Keterangan</td>
                        </tr>
                      </thead>
                      <tbody>
                        {rapor.nilai_ekskuls && rapor.nilai_ekskuls.length > 0 ? (
                          rapor.nilai_ekskuls.map((ne: any, i: number) => (
                            <tr key={i}>
                              <td className="border border-slate-800 p-2 text-center">{i + 1}</td>
                              <td className="border border-slate-800 p-2 font-bold">{ne.ekskul?.nama}</td>
                              <td className="border border-slate-800 p-2 text-center font-bold">{ne.nilai}</td>
                              <td className="border border-slate-800 p-2">{ne.keterangan || '—'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="border border-slate-800 p-2 text-center text-slate-400">
                              Tidak mengikuti ekstrakurikuler
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (block.type === 'tabel_absensi') {
                return (
                  <div key={index} className="mb-6 w-1/2">
                    <h3 className="font-bold text-sm mb-2 uppercase">KETIDAKHADIRAN</h3>
                    <table className="w-full border-collapse border border-slate-800 text-xs">
                      <tbody>
                        <tr>
                          <td className="border border-slate-800 p-2">Sakit</td>
                          <td className="border border-slate-800 p-2 text-center font-bold">{rapor.sakit || 0} Hari</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-800 p-2">Izin</td>
                          <td className="border border-slate-800 p-2 text-center font-bold">{rapor.izin || 0} Hari</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-800 p-2">Tanpa Keterangan (Alpha)</td>
                          <td className="border border-slate-800 p-2 text-center font-bold">{rapor.alpha || 0} Hari</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              }

              if (block.type === 'signatures') {
                return (
                  <div key={index} className="flex justify-between px-10 text-xs text-center mt-16">
                    <div>
                      Mengetahui,<br/>Orang Tua / Wali<br/><br/><br/><br/><br/>
                      <strong>( ......................................... )</strong>
                    </div>
                    <div>
                      Banyuwangi, 18 Desember 2024<br/>Wali Kelas<br/><br/><br/><br/><br/>
                      <strong>{wali_kelas_name}</strong>
                    </div>
                  </div>
                );
              }

              return null;
            })}

            <div className="text-center text-xs mt-12">
              Kepala Sekolah<br/><br/><br/><br/><br/>
              <strong>{kepsek_name}</strong>
            </div>


          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
