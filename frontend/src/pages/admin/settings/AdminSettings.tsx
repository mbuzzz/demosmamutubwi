import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, Globe, Instagram, Facebook, Twitter, MapPin, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSistemKonfigurasi, useUpdateSistemKonfigurasi, useSistemKonfigurasiOptions } from '../../../hooks/useSistemKonfigurasi';
import { getFileUrl } from '../../../lib/api';
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
  const [slogan, setSlogan] = useState('');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [alamat, setAlamat] = useState('');
  const [googleMapsEmbed, setGoogleMapsEmbed] = useState('');
  
  // SPMB Content States
  const [spmbAlurOnline, setSpmbAlurOnline] = useState('');
  const [spmbAlurVerifikasi, setSpmbAlurVerifikasi] = useState('');
  const [spmbAlurPembayaran, setSpmbAlurPembayaran] = useState('');
  const [spmbAlurTes, setSpmbAlurTes] = useState('');
  const [spmbAlurPengumuman, setSpmbAlurPengumuman] = useState('');
  const [spmbBiayaInfo, setSpmbBiayaInfo] = useState('');

  // Auto-populate form when config loads
  useEffect(() => {
    if (config) {
      setTahunAjaran(config.tahun_ajaran_aktif ?? '');
      setSemester(config.semester_aktif ?? 'ganjil');
      setKurikulumId(String(config.kurikulum_aktif_id ?? ''));
      setNamaSekolah(config.nama_sekolah ?? '');
      setSlogan(config.slogan ?? '');
      setTelepon(config.telepon ?? '');
      setEmail(config.email ?? '');
      setFacebook(config.facebook ?? '');
      setInstagram(config.instagram ?? '');
      setTwitter(config.twitter ?? '');
      setAlamat(config.alamat ?? '');
      setGoogleMapsEmbed(config.google_maps_embed ?? '');
      
      // Populate SPMB Content
      setSpmbAlurOnline(config.spmb_alur_online ?? '');
      setSpmbAlurVerifikasi(config.spmb_alur_verifikasi ?? '');
      setSpmbAlurPembayaran(config.spmb_alur_pembayaran ?? '');
      setSpmbAlurTes(config.spmb_alur_tes ?? '');
      setSpmbAlurPengumuman(config.spmb_alur_pengumuman ?? '');
      setSpmbBiayaInfo(config.spmb_biaya_info ?? '');
    }
  }, [config]);

  const handleSaveIdentitas = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nama_sekolah', namaSekolah);
      formData.append('slogan', slogan);
      formData.append('telepon', telepon);
      formData.append('email', email);
      if (logoFile) formData.append('logo_sekolah', logoFile);
      if (kopSuratFile) formData.append('kop_surat', kopSuratFile);
      
      // SPMB Content
      formData.append('spmb_alur_online', spmbAlurOnline);
      formData.append('spmb_alur_verifikasi', spmbAlurVerifikasi);
      formData.append('spmb_alur_pembayaran', spmbAlurPembayaran);
      formData.append('spmb_alur_tes', spmbAlurTes);
      formData.append('spmb_alur_pengumuman', spmbAlurPengumuman);
      formData.append('spmb_biaya_info', spmbBiayaInfo);
      
      // _method=PUT so Laravel recognizes as PUT for method spoofing
      formData.append('_method', 'PUT');

      await updateConfig.mutateAsync(formData);
      setLogoFile(null);
      setKopSuratFile(null);
      toast.success('Identitas & Konten SPMB berhasil diperbarui');
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

  const handleSaveTampilan = async () => {
    try {
      await updateConfig.mutateAsync({
        facebook,
        instagram,
        twitter,
        alamat,
        google_maps_embed: googleMapsEmbed,
      });
      toast.success('Pengaturan tampilan & sosial media berhasil disimpan');
    } catch {
      toast.error('Gagal menyimpan pengaturan tampilan');
    }
  };

  return (
    <AdminLayout title="Pengaturan Sistem & Tampilan">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 mb-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          {[
            { key: 'identitas', label: 'Identitas Utama Sekolah' },
            { key: 'akademik', label: 'Konfigurasi Akademik' },
            { key: 'footer', label: 'Tampilan & Sosial Media' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 min-h-[500px]">
          
          {/* ── TAB: IDENTITAS ────────────────────────────────── */}
          {activeTab === 'identitas' && (
            <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Informasi Dasar Web</h3>
              {configLoading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
              ) : (
              <form onSubmit={handleSaveIdentitas} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nama Sekolah</label>
                  <input type="text" value={namaSekolah} onChange={e => setNamaSekolah(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Logo Sekolah</label>
                    {config?.logo_sekolah && (
                      <div className="mb-2 flex items-center gap-2">
                        <img src={getFileUrl(config.logo_sekolah)} alt="Logo" className="h-12 w-12 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white" />
                        <span className="text-[10px] text-slate-400">Logo saat ini</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                    {logoFile && <p className="text-[10px] text-indigo-500 mt-1">File baru dipilih: {logoFile.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Kop Surat / Banner</label>
                    {config?.kop_surat && (
                      <div className="mb-2 flex items-center gap-2">
                        <img src={getFileUrl(config.kop_surat)} alt="Kop" className="h-12 w-auto rounded border border-slate-200 dark:border-slate-700 bg-white" />
                        <span className="text-[10px] text-slate-400">Kop saat ini</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={e => setKopSuratFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                    {kopSuratFile && <p className="text-[10px] text-indigo-500 mt-1">File baru dipilih: {kopSuratFile.name}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Deskripsi Singkat / Slogan</label>
                  <textarea rows={3} value={slogan} onChange={e => setSlogan(e.target.value)} placeholder="Membentuk generasi unggul berkarakter Islami..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"></textarea>
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200 mb-3">Konten Halaman SPMB (Dapat Diedit)</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Alur 1: Pengisian Formulir Online</label>
                      <textarea rows={2} value={spmbAlurOnline} onChange={e => setSpmbAlurOnline(e.target.value)} placeholder="Calon siswa memilih gelombang yang tersedia dan melengkapi biodata diri secara penuh..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Alur 2: Verifikasi Data & Tes CBT</label>
                      <textarea rows={2} value={spmbAlurVerifikasi} onChange={e => setSpmbAlurVerifikasi(e.target.value)} placeholder="Panitia memvalidasi berkas pendaftaran. Siswa akan mendapatkan Token Ujian Mandiri..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Rincian Biaya Pendaftaran & SPP</label>
                      <textarea rows={3} value={spmbBiayaInfo} onChange={e => setSpmbBiayaInfo(e.target.value)} placeholder="Biaya Formulir: Rp 200.000&#10;Uang Seragam: Rp 1.500.000&#10;SPP Bulanan: Rp 450.000..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white font-mono"></textarea>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nomor Telepon</label>
                    <input type="text" value={telepon} onChange={e => setTelepon(e.target.value)} placeholder="(0333) 421382" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Email Sekolah</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="info@smasmuh1bwi.sch.id" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={updateConfig.isPending} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50">
                    {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Identitas
                  </button>
                </div>
              </form>
              )}
            </div>
          )}

          {/* ── TAB: AKADEMIK ─────────────────────────────────── */}
          {activeTab === 'akademik' && (
            <div className="max-w-2xl space-y-6">
              {configLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
              ) : (
                <>
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Sistem Akademik Berjalan</h3>
                    <form onSubmit={handleSaveAkademik} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Tahun Ajaran Aktif</label>
                          <input type="text" value={tahunAjaran} onChange={e => setTahunAjaran(e.target.value)} placeholder="Contoh: 2025/2026" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Semester Aktif</label>
                          <select value={semester} onChange={e => setSemester(e.target.value as 'ganjil' | 'genap')} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                            <option value="ganjil">Ganjil (1)</option>
                            <option value="genap">Genap (2)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Kurikulum Aktif</label>
                        <select value={kurikulumId} onChange={e => setKurikulumId(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                          <option value="">-- Pilih Kurikulum --</option>
                          {options?.kurikulums?.map(k => (
                            <option key={k.id} value={k.id}>{k.nama} ({k.tahun_ajaran}) - {k.status}</option>
                          ))}
                        </select>
                      </div>
                      <div className="pt-4">
                        <button type="submit" disabled={updateConfig.isPending} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                          {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Periode
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

          {/* ── TAB: TAMPILAN & SOSMED ─────────────────────────── */}
          {activeTab === 'footer' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-500" /> Tautan Media Sosial
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Facebook className="w-4 h-4 text-[#1877F2]" /> Facebook</label>
                    <input type="url" value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="https://facebook.com/..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Instagram className="w-4 h-4 text-[#E4405F]" /> Instagram</label>
                    <input type="url" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-2"><Twitter className="w-4 h-4 text-[#1DA1F2]" /> Twitter / X</label>
                    <input type="url" value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="https://twitter.com/..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
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
                    <textarea rows={2} value={alamat} onChange={e => setAlamat(e.target.value)} placeholder="Jl. Letkol Istiqlah No.109, Banyuwangi..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Embed Google Maps (URL / iFrame)</label>
                    <textarea rows={4} value={googleMapsEmbed} onChange={e => setGoogleMapsEmbed(e.target.value)} placeholder="Paste kode <iframe> dari Google Maps disini..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"></textarea>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Gunakan kode embed dari fitur "Share &gt; Embed a map" Google Maps.</p>
                  </div>
                </div>
                <div className="pt-6">
                  <button type="button" onClick={handleSaveTampilan} disabled={updateConfig.isPending} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50">
                    {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Update Tampilan Frontend
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
