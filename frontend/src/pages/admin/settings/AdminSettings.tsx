import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, Globe, Instagram, Facebook, Twitter, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('identitas');

  return (
    <AdminLayout title="Pengaturan Sistem & Tampilan">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 mb-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button onClick={() => setActiveTab('identitas')} className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'identitas' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            Identitas Utama Sekolah
          </button>
          <button onClick={() => setActiveTab('akademik')} className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'akademik' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            Konfigurasi Akademik
          </button>
          <button onClick={() => setActiveTab('footer')} className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'footer' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            Tampilan & Sosial Media
          </button>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 min-h-[500px]">
          
          {activeTab === 'identitas' && (
            <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Informasi Dasar Web</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nama Sekolah</label>
                  <input type="text" defaultValue="SMAS Muhammadiyah 1 Banyuwangi" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Deskripsi Singkat / Slogan</label>
                  <textarea rows={3} defaultValue="Membentuk generasi unggul berkarakter Islami, cerdas secara akademis, dan terampil menyongsong masa depan." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nomor Telepon</label>
                    <input type="text" defaultValue="(0333) 421382" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Email Sekolah</label>
                    <input type="email" defaultValue="info@smasmuh1bwi.sch.id" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="button" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Simpan Identitas
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'akademik' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Sistem Akademik Berjalan</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Tahun Ajaran Aktif</label>
                      <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="2023/2024">2023/2024</option>
                        <option value="2024/2025" selected>2024/2025</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Semester Aktif</label>
                      <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="ganjil">Ganjil (1)</option>
                        <option value="genap">Genap (2)</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button type="button" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                      <Save className="w-4 h-4" /> Simpan Periode
                    </button>
                  </div>
                </form>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-sm p-6 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">Status Environment</h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">SIT Versi 1.0.0 (Production) • Database: PostgreSQL Terkoneksi</div>
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-500" /> Tautan Media Sosial
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Facebook className="w-4 h-4 text-[#1877F2]" /> Facebook</label>
                    <input type="url" placeholder="https://facebook.com/..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Instagram className="w-4 h-4 text-[#E4405F]" /> Instagram</label>
                    <input type="url" placeholder="https://instagram.com/..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Twitter className="w-4 h-4 text-[#1DA1F2]" /> Twitter / X</label>
                    <input type="url" placeholder="https://twitter.com/..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500" /> Alamat & Embed Maps
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Alamat Lengkap</label>
                    <textarea rows={2} defaultValue="Jl. Letkol Istiqlah No.109, Singonegaran, Kec. Banyuwangi, Kabupaten Banyuwangi, Jawa Timur 68415" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Embed Google Maps (URL / iFrame)</label>
                    <textarea rows={4} placeholder="Paste kode <iframe> dari Google Maps disini..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"></textarea>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Gunakan kode embed src="..." yang didapat dari fitur "Share &gt; Embed a map" Google Maps.</p>
                  </div>
                </div>
                <div className="pt-6">
                  <button type="button" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Update Tampilan Frontend
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}
