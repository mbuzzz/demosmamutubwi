import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, School, BookOpen } from 'lucide-react';

export default function FormSPMB() {
  const { gelombangId } = useParams<{ gelombangId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaLengkap: '',
    nisn: '',
    email: '',
    noHp: '',
    asalSekolah: '',
    alamat: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send data to API
    console.log('SPMB Form submitted', { gelombangId, ...formData });
    alert('Pendaftaran Berhasil! Anda akan diarahkan ke halaman login untuk mengunggah dokumen lanjutan.');
    navigate('/login');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800 py-12 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        
        <Link 
          to="/spmb"
          className="text-slate-500 dark:text-slate-400 hover:text-brand-blueDark dark:text-brand-yellow font-semibold text-sm flex items-center gap-2 mb-6 transition-colors bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 w-max"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke SPMB
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden relative">
          {/* Form Header */}
          <div className="bg-gradien-biru-hijau p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-extrabold mb-2">Formulir Pendaftaran Siswa</h1>
                <p className="text-white/80">SMAS Muhammadiyah 1 Banyuwangi (T.A 2026/2027)</p>
              </div>
              <div className="bg-white dark:bg-slate-900/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center shrink-0 border border-white/30">
                <span className="block text-xs uppercase tracking-wider text-brand-yellow font-bold mb-1">Mendaftar pada</span>
                <span className="font-semibold text-lg">{gelombangId === 'gel-1' ? 'Gelombang 1' : gelombangId === 'gel-2' ? 'Gelombang 2' : 'Gelombang 3'}</span>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pl-1">Nama Lengkap Sesuai Ijazah <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
                  <input type="text" name="namaLengkap" required value={formData.namaLengkap} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] focus:ring-2 focus:ring-brand-teal focus:outline-none transition-all" placeholder="Masukkan nama lengkap Anda..." />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pl-1">NISN <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><BookOpen className="h-5 w-5 text-slate-400" /></div>
                  <input type="number" name="nisn" required value={formData.nisn} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] focus:ring-2 focus:ring-brand-teal focus:outline-none transition-all" placeholder="10 Digit NISN..." />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pl-1">Asal Sekolah Dasar/Menengah <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><School className="h-5 w-5 text-slate-400" /></div>
                  <input type="text" name="asalSekolah" required value={formData.asalSekolah} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] focus:ring-2 focus:ring-brand-teal focus:outline-none transition-all" placeholder="Contoh: SMPN 1 Banyuwangi" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pl-1">Email Aktif <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-400" /></div>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] focus:ring-2 focus:ring-brand-teal focus:outline-none transition-all" placeholder="email@contoh.com" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pl-1">No. WhatsApp / HP Aktif <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-slate-400" /></div>
                  <input type="tel" name="noHp" required value={formData.noHp} onChange={handleChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] focus:ring-2 focus:ring-brand-teal focus:outline-none transition-all" placeholder="0812xxxxxx" />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 pl-1">Alamat Domisili Lengkap <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none"><MapPin className="h-5 w-5 text-slate-400" /></div>
                  <textarea name="alamat" required value={formData.alamat} onChange={handleChange} rows={3} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[15px] focus:ring-2 focus:ring-brand-teal focus:outline-none transition-all resize-none" placeholder="Masukkan alamat lengkap..." />
                </div>
              </div>
            </div>

            <div className="bg-brand-yellow/10 border border-brand-yellow/30 p-4 rounded-[15px] mt-6 flex items-start gap-3">
              <input type="checkbox" required id="consent" className="mt-1 w-4 h-4 text-brand-teal dark:text-emerald-400 rounded border-slate-300 dark:border-slate-600 focus:ring-brand-teal" />
              <label htmlFor="consent" className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer">
                Saya menyatakan bahwa seluruh data yang saya isikan adalah benar dan valid. Saya bersedia mematuhi seluruh tata tertib dan kebijakan seleksi yang ditetapkan oleh Panitia SPMB SMAS Muhammadiyah 1 Banyuwangi.
              </label>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 flex flex-col sm:flex-row justify-end gap-4">
              <button type="button" onClick={() => navigate('/spmb')} className="px-6 py-3.5 rounded-[15px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 transition-colors">
                Batal
              </button>
              <button type="submit" className="px-8 py-3.5 rounded-[15px] font-bold text-white bg-brand-teal hover:bg-brand-teal/90 shadow-card dark:shadow-none transition-all">
                Simpan & Lanjutkan
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
