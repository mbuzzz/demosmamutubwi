import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, X, Save, Eye, Palette } from 'lucide-react';
import {
  useCbtTemplateList,
  useCreateCbtTemplate,
  useUpdateCbtTemplate,
  useDeleteCbtTemplate,
  type CbtTemplate,
} from '../../../hooks/useCbtTemplate';
import { toast } from 'sonner';

export default function AdminCbtTemplateList() {
  const { data: templates = [], isLoading } = useCbtTemplateList();
  const createTemplate = useCreateCbtTemplate();
  const updateTemplate = useUpdateCbtTemplate();
  const deleteTemplate = useDeleteCbtTemplate();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [nama, setNama] = useState('');
  const [layout, setLayout] = useState<'standar' | 'compact' | 'wide'>('standar');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [accentColor, setAccentColor] = useState('#4f46e5');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#1e293b');
  const [cardBg, setCardBg] = useState('#f8fafc');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [showTimer, setShowTimer] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [showQuestionNav, setShowQuestionNav] = useState(true);
  const [headerLogoFile, setHeaderLogoFile] = useState<File | null>(null);
  const [headerLogoUrl, setHeaderLogoUrl] = useState('');

  function openCreate() {
    setEditingId(null);
    setNama('');
    setLayout('standar');
    setPrimaryColor('#6366f1');
    setAccentColor('#4f46e5');
    setBgColor('#ffffff');
    setTextColor('#1e293b');
    setCardBg('#f8fafc');
    setFontSize(16);
    setFontFamily('Inter');
    setHeaderText('');
    setFooterText('');
    setShowTimer(true);
    setShowProgress(true);
    setShowQuestionNav(true);
    setHeaderLogoFile(null);
    setHeaderLogoUrl('');
    setShowModal(true);
  }

  function openEdit(t: CbtTemplate) {
    setEditingId(t.id);
    setNama(t.nama);
    setLayout(t.layout);
    setPrimaryColor(t.primary_color);
    setAccentColor(t.accent_color);
    setBgColor(t.bg_color);
    setTextColor(t.text_color);
    setCardBg(t.card_bg);
    setFontSize(t.font_size);
    setFontFamily(t.font_family);
    setHeaderText(t.header_text || '');
    setFooterText(t.footer_text || '');
    setShowTimer(t.show_timer);
    setShowProgress(t.show_progress);
    setShowQuestionNav(t.show_question_nav);
    setHeaderLogoFile(null);
    setHeaderLogoUrl(t.header_logo || '');
    setShowModal(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!nama) {
      toast.error('Nama template wajib diisi');
      return;
    }

    const formData = new FormData();
    formData.append('nama', nama);
    formData.append('layout', layout);
    formData.append('primary_color', primaryColor);
    formData.append('accent_color', accentColor);
    formData.append('bg_color', bgColor);
    formData.append('text_color', textColor);
    formData.append('card_bg', cardBg);
    formData.append('font_size', fontSize.toString());
    formData.append('font_family', fontFamily);
    formData.append('header_text', headerText);
    formData.append('footer_text', footerText);
    formData.append('show_timer', showTimer ? '1' : '0');
    formData.append('show_progress', showProgress ? '1' : '0');
    formData.append('show_question_nav', showQuestionNav ? '1' : '0');
    if (headerLogoFile) {
      formData.append('header_logo', headerLogoFile);
    }

    try {
      if (editingId) {
        await updateTemplate.mutateAsync({ id: editingId, data: formData });
      } else {
        await createTemplate.mutateAsync(formData);
      }
      setShowModal(false);
    } catch (err) {
      // toast shown in hook
    }
  }

  function handleDelete(id: number) {
    if (window.confirm('Hapus template tampilan CBT ini?')) {
      deleteTemplate.mutate(id);
    }
  }

  return (
    <AdminLayout title="Template Tampilan CBT">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">Kustomisasi Template Ujian</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Atur skema warna, font, dan layout ruang ujian siswa.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-indigo-650 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95">
          <Plus className="w-4 h-4" /> Buat Template Baru
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-semibold">Memuat template...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800">
          <Palette className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">Belum Ada Template</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Mulai kustomisasi visual ujian siswa dengan membuat template baru.</p>
          <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Buat Template Pertama</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(t => (
            <div key={t.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{t.nama}</h4>
                    <span className="text-[10px] text-slate-400">Dibuat oleh: {t.creator?.name || 'Admin'}</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t.layout}</span>
                </div>

                <div className="space-y-3 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Skema Warna</span>
                    <div className="flex gap-1.5">
                      <span className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700" style={{ backgroundColor: t.primary_color }} title="Primary" />
                      <span className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700" style={{ backgroundColor: t.accent_color }} title="Accent" />
                      <span className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700" style={{ backgroundColor: t.bg_color }} title="Background" />
                      <span className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700" style={{ backgroundColor: t.card_bg }} title="Card Background" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Font</span>
                    <span className="font-bold text-slate-700 dark:text-slate-350">{t.font_family} ({t.font_size}px)</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Timer / Navigasi / Progress</span>
                    <span className="font-bold text-slate-700 dark:text-slate-350">
                      {t.show_timer ? 'ON' : 'OFF'} / {t.show_question_nav ? 'ON' : 'OFF'} / {t.show_progress ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-850/50 border-t border-slate-100 dark:border-slate-800/80 flex justify-end gap-2">
                <button onClick={() => openEdit(t)} className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 px-2.5 py-1.5 rounded-lg transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(t.id)} className="flex items-center gap-1 text-xs font-bold text-red-650 hover:bg-red-50 dark:hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl overflow-hidden flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
            
            {/* Form Side */}
            <form onSubmit={handleSave} className="flex-1 p-6 space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Palette className="w-5 h-5 text-indigo-500" />
                  {editingId ? 'Edit Template CBT' : 'Buat Template CBT Baru'}
                </h3>
                <button type="button" onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 bg-slate-100 dark:bg-slate-800 rounded-lg"><X className="w-4 h-4" /></button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nama Template</label>
                <input type="text" value={nama} onChange={e => setNama(e.target.value)} placeholder="Contoh: Template Ujian Strict Biru" className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Layout</label>
                  <select value={layout} onChange={e => setLayout(e.target.value as any)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="standar">Standar</option>
                    <option value="compact">Compact (Teks Kecil/Padat)</option>
                    <option value="wide">Wide (Layar Penuh)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Font Family</label>
                  <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white">
                    <option value="Inter">Inter</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Roboto">Roboto</option>
                    <option value="sans-serif">System Sans</option>
                    <option value="serif">System Serif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Warna Utama</label>
                  <div className="flex gap-1.5 items-center">
                    <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded border cursor-pointer bg-transparent" />
                    <span className="text-[10px] font-mono font-semibold uppercase">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Warna Aksen</label>
                  <div className="flex gap-1.5 items-center">
                    <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-8 h-8 rounded border cursor-pointer bg-transparent" />
                    <span className="text-[10px] font-mono font-semibold uppercase">{accentColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Latar Belakang</label>
                  <div className="flex gap-1.5 items-center">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded border cursor-pointer bg-transparent" />
                    <span className="text-[10px] font-mono font-semibold uppercase">{bgColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Warna Teks</label>
                  <div className="flex gap-1.5 items-center">
                    <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-8 h-8 rounded border cursor-pointer bg-transparent" />
                    <span className="text-[10px] font-mono font-semibold uppercase">{textColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Latar Kartu Soal</label>
                  <div className="flex gap-1.5 items-center">
                    <input type="color" value={cardBg} onChange={e => setCardBg(e.target.value)} className="w-8 h-8 rounded border cursor-pointer bg-transparent" />
                    <span className="text-[10px] font-mono font-semibold uppercase">{cardBg}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Ukuran Font</label>
                  <input type="number" value={fontSize} onChange={e => setFontSize(parseInt(e.target.value) || 16)} min={12} max={24} className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Logo Header</label>
                  <input type="file" onChange={e => setHeaderLogoFile(e.target.files?.[0] || null)} accept="image/*" className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  {headerLogoUrl && !headerLogoFile && <span className="text-[10px] text-slate-400 block mt-1">Logo saat ini: {headerLogoUrl.substring(headerLogoUrl.lastIndexOf('/')+1)}</span>}
                </div>
                <div className="flex flex-col gap-2 justify-end pt-3">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" checked={showTimer} onChange={e => setShowTimer(e.target.checked)} className="w-4 h-4 rounded text-indigo-650" /> Tampilkan Timer Ujian
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" checked={showProgress} onChange={e => setShowProgress(e.target.checked)} className="w-4 h-4 rounded text-indigo-650" /> Tampilkan Progress Pengisian
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input type="checkbox" checked={showQuestionNav} onChange={e => setShowQuestionNav(e.target.checked)} className="w-4 h-4 rounded text-indigo-650" /> Tampilkan Navigasi Soal
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Teks Header</label>
                <textarea value={headerText} onChange={e => setHeaderText(e.target.value)} placeholder="Teks yang muncul di sebelah logo. Contoh: SMAS Muhammadiyah 1 Banyuwangi" rows={2} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Teks Footer</label>
                <textarea value={footerText} onChange={e => setFooterText(e.target.value)} placeholder="Contoh: Kerjakan dengan jujur. Harap tenang selama ujian berlangsung." rows={2} className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold">Batal</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"><Save className="w-4 h-4 inline mr-1" /> Simpan Template</button>
              </div>
            </form>

            {/* Preview Side */}
            <div className="hidden md:flex flex-col w-[380px] bg-slate-100 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
              <div className="flex items-center gap-1.5 text-slate-500 font-bold mb-4 text-xs"><Eye className="w-4 h-4" /> Live Preview</div>
              
              <div className="flex-1 rounded-2xl shadow-inner overflow-hidden border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between" style={{ backgroundColor: bgColor, fontFamily: fontFamily }}>
                
                {/* Header Preview */}
                <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: accentColor }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-[10px] text-slate-400">Logo</div>
                    <span className="text-[10px] font-bold truncate max-w-[150px]" style={{ color: textColor }}>{headerText || 'CBT SMAM1'}</span>
                  </div>
                  {showTimer && <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold" style={{ backgroundColor: accentColor, color: '#ffffff' }}>01:29:45</span>}
                </div>

                {/* Body Preview */}
                <div className="p-4 flex-1 flex flex-col gap-3 justify-center items-center">
                  {showProgress && (
                    <div className="w-full flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: '40%', backgroundColor: primaryColor }} />
                      </div>
                      <span className="text-[9px] font-semibold" style={{ color: textColor }}>4/10</span>
                    </div>
                  )}

                  <div className="w-full rounded-xl p-4 shadow-sm border" style={{ backgroundColor: cardBg, borderColor: primaryColor + '20', color: textColor, fontSize: `${fontSize * 0.75}px` }}>
                    <div className="font-extrabold mb-3 text-[11px]" style={{ color: textColor }}>Soal No. 4</div>
                    <p className="leading-relaxed mb-4 text-[10px]">Siapakah pendiri Persyarikatan Muhammadiyah?</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-1.5 rounded border border-slate-200 bg-white/50 text-[9px] font-medium"><span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center font-bold text-[8px]">A</span> KH. Ahmad Dahlan</div>
                      <div className="flex items-center gap-2 p-1.5 rounded border border-slate-200 bg-white/50 text-[9px] font-medium"><span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center font-bold text-[8px]">B</span> KH. Hasyim Asy'ari</div>
                    </div>
                  </div>

                  {showQuestionNav && (
                    <div className="w-full flex gap-1 justify-center mt-1">
                      <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: primaryColor, color: '#ffffff' }}>1</span>
                      <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: primaryColor, color: '#ffffff' }}>2</span>
                      <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ backgroundColor: primaryColor, color: '#ffffff' }}>3</span>
                      <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold border" style={{ borderColor: primaryColor, color: primaryColor }}>4</span>
                    </div>
                  )}
                </div>

                {/* Footer Preview */}
                <div className="p-2.5 text-center text-[9px] border-t" style={{ borderColor: primaryColor + '10', color: textColor + '80' }}>
                  {footerText || 'SMAS MUH 1 BANYUWANGI • CBT'}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
