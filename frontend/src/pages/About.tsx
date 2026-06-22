import React from 'react';
import { Target, Shield, Compass } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-brand-blueDark mb-4">Profil SMAS Muhammadiyah 1 Banyuwangi</h1>
          <p className="text-lg text-slate-500">Mengenal lebih dekat visi, misi, dan sejarah perjalanan institusi kami.</p>
        </div>

        {/* Sejarah */}
        <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-100 mb-8 leading-relaxed hover:shadow-card-hover transition-shadow">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Sejarah Singkat</h2>
          <p className="text-slate-600 mb-4 text-lg">
            SMAS Muhammadiyah 1 Banyuwangi didirikan di bawah naungan Persyarikatan Muhammadiyah dengan komitmen memberikan kontribusi nyata dalam bidang pendidikan nasional di Kabupaten Banyuwangi. Sejak berdirinya, sekolah ini secara konsisten mendidik putra-putri daerah dengan memadukan kurikulum pendidikan umum dan pendidikan keislaman yang kuat.
          </p>
          <p className="text-slate-600 text-lg">
            Melalui dedikasi tinggi para pendidik dan jajaran manajemen sekolah, SMAS Muhammadiyah 1 Banyuwangi kini terus bertumbuh sebagai lembaga pendidikan modern, berakreditasi A, serta menjadi sekolah rujukan dalam hal pemanfaatan teknologi informasi untuk manajemen pembelajaran (E-Learning dan CBT) serta administrasi sekolah.
          </p>
        </div>

        {/* Visi & Misi */}
        <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-100 mb-8 hover:shadow-card-hover transition-shadow">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Visi, Misi & Tujuan</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="bg-brand-teal/10 p-3 rounded-2xl text-brand-teal shrink-0 h-14 w-14 flex items-center justify-center">
                <Target className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-2">Visi</h3>
                <p className="text-slate-600 leading-relaxed italic text-lg">
                  "Menjadi lembaga pendidikan unggulan yang melahirkan lulusan berakhlak mulia, cerdas secara intelektual, kompeten, dan berkemajuan berdasarkan nilai-nilai Islam."
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="bg-brand-blueDark/10 p-3 rounded-2xl text-brand-blueDark shrink-0 h-14 w-14 flex items-center justify-center">
                <Compass className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-3">Misi</h3>
                <ul className="list-disc pl-5 text-slate-600 space-y-3 leading-relaxed text-lg">
                  <li>Menyelenggarakan proses pembelajaran yang mengintegrasikan ilmu pengetahuan dengan nilai-nilai akhlakul karimah.</li>
                  <li>Mengembangkan potensi bakat akademis maupun non-akademis siswa secara optimal melalui program kurikuler dan ekstrakurikuler.</li>
                  <li>Mengintegrasikan pemanfaatan teknologi informasi modern dalam seluruh kegiatan pembelajaran, evaluasi hasil belajar, dan administrasi sekolah.</li>
                  <li>Membangun iklim sekolah yang Islami, kondusif, disiplin, toleran, dan berwawasan lingkungan.</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="bg-brand-green/10 p-3 rounded-2xl text-brand-green shrink-0 h-14 w-14 flex items-center justify-center">
                <Shield className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-2">Tujuan</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Mencetak alumni mandiri yang siap bersaing memasuki jenjang perguruan tinggi negeri maupun swasta favorit, berkomitmen keagamaan yang kokoh, serta memiliki keterampilan adaptif terhadap perkembangan teknologi abad ke-21.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
