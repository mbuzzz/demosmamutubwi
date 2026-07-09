import AdminLayout from '../../../components/admin/AdminLayout';
import {
  Save,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Loader2,
  FileText,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Megaphone,
  Wallet,
} from 'lucide-react';
import { useState, useEffect, type ReactNode } from 'react';
import { useSistemKonfigurasi, useUpdateSistemKonfigurasi, useSistemKonfigurasiOptions } from '../../../hooks/useSistemKonfigurasi';
import { getFileUrl } from '../../../lib/api';
import { toast } from 'sonner';

const inputCls =
  'w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white';
const labelCls = 'block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5';

function SpmbField({
  step,
  icon,
  title,
  hint,
  value,
  onChange,
  rows = 3,
  mono = false,
}: {
  step: number | string;
  icon: ReactNode;
  title: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  mono?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-black text-sm">
          {typeof step === 'number' ? step : icon}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
            {icon}
            {title}
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-relaxed">{hint}</p>
        </div>
      </div>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} ${mono ? 'font-mono text-xs' : ''} resize-y min-h-[80px]`}
        placeholder={hint}
      />
    </div>
  );
}

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
      formData.append('_method', 'PUT');

      await updateConfig.mutateAsync(formData);
      setLogoFile(null);
      setKopSuratFile(null);
      toast.success('Identitas sekolah berhasil diperbarui');
    } catch {
      toast.error('Gagal menyimpan identitas');
    }
  };

  const handleSaveSpmb = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateConfig.mutateAsync({
        spmb_alur_online: spmbAlurOnline,
        spmb_alur_verifikasi: spmbAlurVerifikasi,
        spmb_alur_pembayaran: spmbAlurPembayaran,
        spmb_alur_tes: spmbAlurTes,
        spmb_alur_pengumuman: spmbAlurPengumuman,
        spmb_biaya_info: spmbBiayaInfo,
      });
      toast.success('Konten halaman SPMB berhasil disimpan');
    } catch {
      toast.error('Gagal menyimpan konten SPMB');
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

  const tabs = [
    { key: 'identitas', label: 'Identitas Sekolah' },
    { key: 'spmb', label: 'Konten Teks SPMB' },
    { key: 'akademik', label: 'Konfigurasi Akademik' },
    { key: 'footer', label: 'Tampilan & Sosmed' },
  ];

  return (
    <AdminLayout title="Pengaturan Sistem & Tampilan">
      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 min-h-[500px]">
          {/* IDENTITAS */}
          {activeTab === 'identitas' && (
            <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                Informasi Dasar Web
              </h3>
              {configLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
              ) : (
                <form onSubmit={handleSaveIdentitas} className="space-y-4">
                  <div>
                    <label className={labelCls}>Nama Sekolah</label>
                    <input type="text" value={namaSekolah} onChange={(e) => setNamaSekolah(e.target.value)} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Logo Sekolah</label>
                      {config?.logo_sekolah && (
                        <div className="mb-2 flex items-center gap-2">
                          <img
                            src={getFileUrl(config.logo_sekolah)}
                            alt="Logo"
                            className="h-12 w-12 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white"
                          />
                          <span className="text-[10px] text-slate-400">Logo saat ini</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                        className={inputCls}
                      />
                      {logoFile && <p className="text-[10px] text-indigo-500 mt-1">File baru: {logoFile.name}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Kop Surat / Banner</label>
                      {config?.kop_surat && (
                        <div className="mb-2 flex items-center gap-2">
                          <img
                            src={getFileUrl(config.kop_surat)}
                            alt="Kop"
                            className="h-12 w-auto rounded border border-slate-200 dark:border-slate-700 bg-white"
                          />
                          <span className="text-[10px] text-slate-400">Kop saat ini</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setKopSuratFile(e.target.files?.[0] || null)}
                        className={inputCls}
                      />
                      {kopSuratFile && <p className="text-[10px] text-indigo-500 mt-1">File baru: {kopSuratFile.name}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Deskripsi Singkat / Slogan</label>
                    <textarea
                      rows={3}
                      value={slogan}
                      onChange={(e) => setSlogan(e.target.value)}
                      placeholder="Membentuk generasi unggul berkarakter Islami..."
                      className={inputCls}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Nomor Telepon</label>
                      <input
                        type="text"
                        value={telepon}
                        onChange={(e) => setTelepon(e.target.value)}
                        placeholder="(0333) 421382"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Email Sekolah</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="info@smasmuh1bwi.sch.id"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={updateConfig.isPending}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
                    >
                      {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Simpan Identitas
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SPMB TEXT — dedicated clean form */}
          {activeTab === 'spmb' && (
            <div className="max-w-4xl space-y-5">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                <strong className="font-extrabold">Konten Halaman SPMB publik</strong>
                <p className="mt-1">
                  Teks di bawah tampil di halaman <code className="bg-white/60 dark:bg-slate-900/40 px-1 rounded">/spmb</code> (Alur
                  Pendaftaran & Rincian Biaya). Isi dengan bahasa yang jelas untuk calon siswa/orang tua. Setiap kotak = 1
                  langkah alur.
                </p>
              </div>

              {configLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
              ) : (
                <form onSubmit={handleSaveSpmb} className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <SpmbField
                      step={1}
                      icon={<FileText className="w-3.5 h-3.5" />}
                      title="Pengisian Formulir Online"
                      hint="Jelaskan cara mendaftar online, dokumen yang diunggah, dsb."
                      value={spmbAlurOnline}
                      onChange={setSpmbAlurOnline}
                    />
                    <SpmbField
                      step={2}
                      icon={<ClipboardList className="w-3.5 h-3.5" />}
                      title="Verifikasi Data"
                      hint="Proses validasi berkas oleh panitia."
                      value={spmbAlurVerifikasi}
                      onChange={setSpmbAlurVerifikasi}
                    />
                    <SpmbField
                      step={3}
                      icon={<CreditCard className="w-3.5 h-3.5" />}
                      title="Pembayaran Formulir / Registrasi"
                      hint="Cara bayar, rekening, atau bukti transfer."
                      value={spmbAlurPembayaran}
                      onChange={setSpmbAlurPembayaran}
                    />
                    <SpmbField
                      step={4}
                      icon={<GraduationCap className="w-3.5 h-3.5" />}
                      title="Tes / CBT"
                      hint="Jadwal, token ujian, lokasi, atau tes mandiri."
                      value={spmbAlurTes}
                      onChange={setSpmbAlurTes}
                    />
                    <SpmbField
                      step={5}
                      icon={<Megaphone className="w-3.5 h-3.5" />}
                      title="Pengumuman Kelulusan"
                      hint="Kapan dan di mana hasil diumumkan, langkah registrasi ulang."
                      value={spmbAlurPengumuman}
                      onChange={setSpmbAlurPengumuman}
                    />
                    <SpmbField
                      step="Rp"
                      icon={<Wallet className="w-3.5 h-3.5" />}
                      title="Rincian Biaya Pendidikan"
                      hint="Satu baris per item, contoh: Formulir: Rp 200.000"
                      value={spmbBiayaInfo}
                      onChange={setSpmbBiayaInfo}
                      rows={5}
                      mono
                    />
                  </div>

                  <div className="sticky bottom-4 flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={updateConfig.isPending}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors shadow-lg disabled:opacity-50"
                    >
                      {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Simpan Konten SPMB
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* AKADEMIK */}
          {activeTab === 'akademik' && (
            <div className="max-w-2xl space-y-6">
              {configLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                      Sistem Akademik Berjalan
                    </h3>
                    <form onSubmit={handleSaveAkademik} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Tahun Ajaran Aktif</label>
                          <input
                            type="text"
                            value={tahunAjaran}
                            onChange={(e) => setTahunAjaran(e.target.value)}
                            placeholder="Contoh: 2025/2026"
                            className={`${inputCls} font-bold`}
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Semester Aktif</label>
                          <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value as 'ganjil' | 'genap')}
                            className={`${inputCls} font-bold`}
                          >
                            <option value="ganjil">Ganjil (1)</option>
                            <option value="genap">Genap (2)</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Kurikulum Aktif</label>
                        <select
                          value={kurikulumId}
                          onChange={(e) => setKurikulumId(e.target.value)}
                          className={`${inputCls} font-bold`}
                        >
                          <option value="">-- Pilih Kurikulum --</option>
                          {options?.kurikulums?.map((k) => (
                            <option key={k.id} value={k.id}>
                              {k.nama} ({k.tahun_ajaran}) - {k.status}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={updateConfig.isPending}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
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
                      SIT Versi 1.0.0 • Tahun Ajaran: {config?.tahun_ajaran_aktif || '-'} • Semester:{' '}
                      {config?.semester_aktif || '-'}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* SOSMED */}
          {activeTab === 'footer' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-500" /> Tautan Media Sosial
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`${labelCls} flex items-center gap-2`}>
                      <Facebook className="w-4 h-4 text-[#1877F2]" /> Facebook
                    </label>
                    <input
                      type="url"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="https://facebook.com/..."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={`${labelCls} flex items-center gap-2`}>
                      <Instagram className="w-4 h-4 text-[#E4405F]" /> Instagram
                    </label>
                    <input
                      type="url"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/..."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={`${labelCls} flex items-center gap-2`}>
                      <Twitter className="w-4 h-4 text-[#1DA1F2]" /> Twitter / X
                    </label>
                    <input
                      type="url"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="https://twitter.com/..."
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500" /> Alamat & Embed Maps
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Alamat Lengkap</label>
                    <textarea
                      rows={2}
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Jl. Letkol Istiqlah No.109, Banyuwangi..."
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Embed Google Maps (URL / iFrame)</label>
                    <textarea
                      rows={4}
                      value={googleMapsEmbed}
                      onChange={(e) => setGoogleMapsEmbed(e.target.value)}
                      placeholder='Paste kode <iframe> dari Google Maps di sini...'
                      className={`${inputCls} font-mono text-xs`}
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Gunakan kode embed dari fitur &quot;Share &gt; Embed a map&quot; Google Maps.
                    </p>
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={handleSaveTampilan}
                    disabled={updateConfig.isPending}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
                  >
                    {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Update Tampilan Frontend
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
