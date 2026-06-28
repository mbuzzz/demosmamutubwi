import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, Globe, Instagram, Facebook, Twitter, MapPin, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSistemKonfigurasi, useUpdateSistemKonfigurasi, useSistemKonfigurasiOptions } from '../../../hooks/useSistemKonfigurasi';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('identitas');

  const { data: config, isLoading: configLoading } = useSistemKonfigurasi();
  const { data: options } = useSistemKonfigurasiOptions();
  const updateConfig = useUpdateSistemKonfigurasi();

  const [tahunAjaran, setTahunAjaran] = useState('');
  const [semester, setSemester] = useState<'ganjil' | 'genap'>('ganjil');
  const [kurikulumId, setKurikulumId] = useState<string>('');
  
  const [namaSekolah, setNamaSekolah] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [kopSuratFile, setKopSuratFile] = useState<File | null>(null);

  const initForm = (c: typeof config) => {
    if (c) {
      setTahunAjaran(c.tahun_ajaran_aktif);
      setSemester(c.semester_aktif);
      setKurikulumId(c.kurikulum_aktif_id || '');
      setNamaSekolah(c.nama_sekolah || 'SMAS Muhammadiyah 1 Banyuwangi');
    }
  };

  const handleSaveIdentitas = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nama_sekolah', namaSekolah);
      if (logoFile) formData.append('logo_sekolah', logoFile);
      if (kopSuratFile) formData.append('kop_surat', kopSuratFile);

      await updateConfig.mutateAsync(formData);
      toast.success('Identitas & Gambar berhasil diperbarui');
    } catch {
      toast.error('Gagal menyimpan identitas');
    }
  };

  const handleSaveAkademik = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateConfig.mutateAsync({
        tahun_ajaran_aktif: tahunAjaran,
        semester_aktif: semester,
        kurikulum_aktif_id: kurikulumId || null,
      });
      toast.success('Konfigurasi akademik berhasil diperbarui');
    } catch {
      toast.error('Gagal menyimpan konfigurasi');
    }
  };

  return (
    <AdminLayout title="Pengaturan Sistem & Tampilan">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 mb-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button onClick={() => setActiveTab('identitas')} className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'identitas' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            Identitas Utama Sekolah
          </button>
          <button onClick={() => { setActiveTab('akademik'); if (config) initForm(config); }} className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'akademik' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
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
              <form onSubmit={handleSaveIdentitas} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nama Sekolah</label>
                  <input type="text" value={namaSekolah} onChange={e => setNamaSekolah(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Upload Logo Sekolah</label>
                    <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                    {config?.logo_sekolah && <p className="text-[10px] text-slate-400 mt-1">Logo saat ini: {config.logo_sekolah}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Upload Kop Surat (Banner)</label>
                    <input type="file" accept="image/*" onChange={e => setKopSuratFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                    {config?.kop_surat && <p className="text-[10px] text-slate-400 mt-1">Kop saat ini: {config.kop_surat}</p>}
                  </div>
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
                  <button type="submit" disabled={updateConfig.isPending} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50">
                    {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Identitas
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'akademik' && (
            <div className="max-w-2xl space-y-6">
              {configLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Sistem Akademik Berjalan</h3>
                    <form onSubmit={handleSaveAkademik} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Tahun Ajaran Aktif</label>
                          <input
                            type="text"
                            value={tahunAjaran}
                            onChange={e => setTahunAjaran(e.target.value)}
                            placeholder="Contoh: 2025/2026"
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Semester Aktif</label>
                          <select
                            value={semester}
                            onChange={e => setSemester(e.target.value as 'ganjil' | 'genap')}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                          >
                            <option value="ganjil">Ganjil (1)</option>
                            <option value="genap">Genap (2)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Kurikulum Aktif</label>
                        <select
                          value={kurikulumId}
                          onChange={e => setKurikulumId(e.target.value)}
                          className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        >
                          <option value="">-- Pilih Kurikulum --</option>
                          {options?.kurikulums?.map(k => (
                            <option key={k.id} value={k.id}>
                              {k.nama} ({k.tahun_ajaran}) - {k.status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={updateConfig.isPending}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm"
                        >
                          {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Simpan Periode
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-sm p-6 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500">
                    <h3 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">Status Environment</h3>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      SIT Versi 1.0.0 • Tahun Ajaran: {config?.tahun_ajaran_aktif || '-'} • Semester: {config?.semester_aktif || '-'}
                    </div>
                  </div>
                </>
              )}
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
