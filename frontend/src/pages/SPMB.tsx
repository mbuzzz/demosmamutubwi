import { ArrowRight, FileText, CheckCircle, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SPMB() {
  return (
    <div className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 text-xs font-bold text-brand-blueDark uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
            Tahun Ajaran 2026/2027
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Penerimaan Siswa Baru (SPMB)</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Bergabunglah menjadi bagian dari generasi cerdas dan berkarakter Islami. 
            Proses pendaftaran kami rancang agar mudah, transparan, dan dapat dilakukan secara daring (online).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-[15px] p-8 shadow-card border border-slate-100 flex flex-col items-center text-center hover:shadow-card-hover transition-all">
            <div className="w-16 h-16 bg-slate-100 rounded-[15px] flex items-center justify-center text-brand-blueDark mb-6 shadow-sm">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">1. Mengisi Formulir</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Lengkapi biodata diri dan asal sekolah melalui form digital. Dokumen dapat diunggah dengan format foto/PDF.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-[15px] p-8 shadow-card border border-slate-100 flex flex-col items-center text-center hover:shadow-card-hover transition-all">
            <div className="w-16 h-16 bg-brand-teal/10 rounded-[15px] flex items-center justify-center text-brand-teal mb-6 shadow-sm">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">2. Seleksi & Verifikasi</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Panitia akan memverifikasi kelengkapan berkas Anda. Siswa juga akan mengikuti tes penempatan akademik berbasis CBT.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-[15px] p-8 shadow-card border border-slate-100 flex flex-col items-center text-center hover:shadow-card-hover transition-all">
            <div className="w-16 h-16 bg-brand-green/10 rounded-[15px] flex items-center justify-center text-brand-green mb-6 shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">3. Pengumuman</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">Hasil seleksi kelulusan dan daftar ulang dapat dipantau langsung dari Dasbor Kabin Pendaftar secara transparan.</p>
          </div>
        </div>

        <div className="mt-16 bg-gradien-biru-hijau rounded-[2rem] p-10 sm:p-16 text-center text-white shadow-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60"></div>
           <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-4">Siap untuk Bergabung?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">Klik tombol di bawah untuk membuat akun Pendaftaran atau masuk jika Anda sudah memiliki akun calon siswa.</p>
            <Link to="/login" className="inline-flex items-center gap-2 bg-brand-yellow text-brand-blueDark hover:bg-white font-extrabold px-8 py-4 rounded-[15px] shadow-card transition-all duration-300">
              Mulai Pendaftaran Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
