import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
  Save, ArrowLeft, Calculator, Settings,
  CheckCircle, GripVertical,
  Layout, Image, AlignLeft, LayoutTemplate, FileText, PenTool, X, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useKurikulum, useCreateKurikulum, useUpdateKurikulum } from '../../../hooks/useKurikulum';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type RaporBlockType = 'kop_surat' | 'biodata_siswa' | 'tabel_nilai' | 'tabel_ekskul' | 'tabel_absensi' | 'teks_bebas' | 'signatures';

interface RaporBlock {
  id: string;
  type: RaporBlockType;
  visible: boolean;
  properties?: Record<string, unknown>;
}

const BLOCK_LIBRARY: { type: RaporBlockType; label: string; icon: React.ReactNode }[] = [
  { type: 'kop_surat', label: 'Kop Surat Sekolah', icon: <Image className="w-4 h-4" /> },
  { type: 'biodata_siswa', label: 'Biodata Peserta Didik', icon: <AlignLeft className="w-4 h-4" /> },
  { type: 'tabel_nilai', label: 'Tabel Nilai Utama', icon: <LayoutTemplate className="w-4 h-4" /> },
  { type: 'tabel_ekskul', label: 'Tabel Ekskul', icon: <FileText className="w-4 h-4" /> },
  { type: 'tabel_absensi', label: 'Tabel Absensi', icon: <FileText className="w-4 h-4" /> },
  { type: 'teks_bebas', label: 'Teks Paragraf Bebas', icon: <PenTool className="w-4 h-4" /> },
  { type: 'signatures', label: 'Area Tanda Tangan', icon: <PenTool className="w-4 h-4" /> },
];

function SortableBlock({ block, onToggle, onRemove, onEditProps }: {
  block: RaporBlock;
  onToggle: () => void;
  onRemove: () => void;
  onEditProps: (props: Record<string, unknown>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const info = BLOCK_LIBRARY.find(b => b.type === block.type);

  return (
    <div ref={setNodeRef} style={style} className={`relative border-2 rounded-xl p-4 transition-colors ${block.visible ? 'border-slate-200 dark:border-slate-700 hover:border-indigo-400' : 'border-dashed border-slate-300 dark:border-slate-600 opacity-60'}`}>
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="p-1.5 cursor-grab active:cursor-grabbing text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
          {info?.icon}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{info?.label || block.type}</div>
          <div className="text-xs text-slate-400">{block.type === 'kop_surat' ? `Mode: ${(block.properties?.mode as string) || 'text_only'}` : block.type === 'signatures' ? `Layout: ${(block.properties?.layout as string) || 'two_columns'}` : 'Klik untuk pengaturan'}</div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onToggle} className={`p-1.5 rounded-lg text-xs font-bold ${block.visible ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
            {block.visible ? 'Tampil' : 'Sembunyi'}
          </button>
          {block.type === 'kop_surat' && (
            <select
              value={(block.properties?.mode as string) || 'text_only'}
              onChange={e => onEditProps({ ...block.properties, mode: e.target.value })}
              className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-900"
              onClick={e => e.stopPropagation()}
            >
              <option value="text_only">Teks</option>
              <option value="banner">Banner</option>
              <option value="logo_text">Logo + Teks</option>
            </select>
          )}
          {block.type === 'signatures' && (
            <select
              value={(block.properties?.layout as string) || 'two_columns'}
              onChange={e => onEditProps({ ...block.properties, layout: e.target.value })}
              className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-white dark:bg-slate-900"
              onClick={e => e.stopPropagation()}
            >
              <option value="two_columns">2 Kolom</option>
              <option value="single_row">1 Baris</option>
            </select>
          )}
          <button onClick={onRemove} className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminKurikulumForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { data: existingData, isLoading: loadingExisting } = useKurikulum(isEdit ? id : undefined);
  const createKurikulum = useCreateKurikulum();
  const updateKurikulum = useUpdateKurikulum();

  const [activeTab, setActiveTab] = useState('umum');

  // Form fields
  const [nama, setNama] = useState('');
  const [tahunAjaran, setTahunAjaran] = useState('');
  const [status, setStatus] = useState<'aktif' | 'draft'>('draft');
  const [kkmDefault, setKkmDefault] = useState(75);
  const [metodeRemedial, setMetodeRemedial] = useState('Maksimal setara KKM');
  const [usesTp, setUsesTp] = useState(false);

  // Bobot penilaian
  const [bobotTugas, setBobotTugas] = useState(30);
  const [bobotUts, setBobotUts] = useState(30);
  const [bobotUas, setBobotUas] = useState(40);

  // Deskripsi config
  const [thresholdTinggi, setThresholdTinggi] = useState(80);
  const [thresholdRendah, setThresholdRendah] = useState(75);
  const [templateTinggi, setTemplateTinggi] = useState('Menunjukkan penguasaan yang sangat baik dalam {deskripsi_tp}');
  const [templateRendah, setTemplateRendah] = useState('Perlu bimbingan lebih lanjut dalam {deskripsi_tp}');

  // Rapor template blocks
  const [raporBlocks, setRaporBlocks] = useState<RaporBlock[]>([]);

  useEffect(() => {
    if (existingData) {
      const k = existingData.kurikulum;
      setNama(k.nama);
      setTahunAjaran(k.tahun_ajaran);
      setStatus(k.status);
      setKkmDefault(k.kkm_default);
      setMetodeRemedial(k.metode_remedial);
      setUsesTp(k.uses_tp);
      setBobotTugas(k.bobot_tugas);
      setBobotUts(k.bobot_uts);
      setBobotUas(k.bobot_uas);
      if (k.deskripsi_config) {
        setThresholdTinggi(k.deskripsi_config.threshold_tinggi ?? 80);
        setThresholdRendah(k.deskripsi_config.threshold_rendah ?? 75);
        setTemplateTinggi(k.deskripsi_config.template_tinggi ?? '');
        setTemplateRendah(k.deskripsi_config.template_rendah ?? '');
      }
      if (k.rapor_template) {
        setRaporBlocks(k.rapor_template as RaporBlock[]);
      }
    }
  }, [existingData]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = raporBlocks.findIndex(b => b.id === active.id);
    const newIndex = raporBlocks.findIndex(b => b.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      setRaporBlocks(arrayMove(raporBlocks, oldIndex, newIndex));
    }
  };

  const addBlock = (type: RaporBlockType) => {
    const newBlock: RaporBlock = {
      id: `${type}_${Date.now()}`,
      type,
      visible: true,
      properties: type === 'kop_surat' ? { mode: 'text_only' } : type === 'signatures' ? { layout: 'two_columns' } : {},
    };
    setRaporBlocks([...raporBlocks, newBlock]);
  };

  const toggleBlock = (id: string) => {
    setRaporBlocks(raporBlocks.map(b => b.id === id ? { ...b, visible: !b.visible } : b));
  };

  const removeBlock = (id: string) => {
    setRaporBlocks(raporBlocks.filter(b => b.id !== id));
  };

  const updateBlockProps = (id: string, props: Record<string, unknown>) => {
    setRaporBlocks(raporBlocks.map(b => b.id === id ? { ...b, properties: props } : b));
  };

  const totalBobot = bobotTugas + bobotUts + bobotUas;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalBobot !== 100) {
      toast.error('Total Bobot Penilaian harus persis 100%!');
      return;
    }
    if (!nama || !tahunAjaran) {
      toast.error('Nama dan Tahun Ajaran harus diisi');
      return;
    }

    const payload = {
      nama,
      tahun_ajaran: tahunAjaran,
      status,
      kkm_default: kkmDefault,
      metode_remedial: metodeRemedial,
      uses_tp: usesTp,
      bobot_tugas: bobotTugas,
      bobot_uts: bobotUts,
      bobot_uas: bobotUas,
      rumus_penilaian: null,
      rapor_template: raporBlocks,
      deskripsi_config: {
        threshold_tinggi: thresholdTinggi,
        threshold_rendah: thresholdRendah,
        template_tinggi: templateTinggi,
        template_rendah: templateRendah,
        template_gabungan: '{kalimat_tinggi}, serta {kalimat_rendah}.',
      },
    };

    try {
      if (isEdit) {
        await updateKurikulum.mutateAsync({ id: id!, data: payload });
        toast.success('Kurikulum berhasil diperbarui');
      } else {
        await createKurikulum.mutateAsync(payload);
        toast.success('Kurikulum berhasil dibuat');
      }
      navigate('/panel/kurikulum');
    } catch {
      toast.error('Gagal menyimpan kurikulum');
    }
  };

  if (isEdit && loadingExisting) {
    return (
      <AdminLayout title="Memuat Kurikulum...">
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? 'Edit Kurikulum' : 'Tambah Kurikulum'}>
      <div className="mb-6 flex items-center justify-between">
        <Link to="/panel/kurikulum" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
        </Link>
        <button onClick={handleSubmit} disabled={createKurikulum.isPending || updateKurikulum.isPending} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
          {createKurikulum.isPending || updateKurikulum.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? 'Update Kurikulum' : 'Simpan Kurikulum'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 mb-6">
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button onClick={() => setActiveTab('umum')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'umum' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <Settings className="w-4 h-4" /> 1. Identitas & Penilaian
          </button>
          <button onClick={() => setActiveTab('deskripsi')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'deskripsi' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <FileText className="w-4 h-4" /> 2. Otomasi Deskripsi Rapor
          </button>
          <button onClick={() => setActiveTab('rapor')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'rapor' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <Layout className="w-4 h-4" /> 3. Builder Template Rapor
          </button>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 min-h-[500px]">

          {/* TAB 1: IDENTITAS & PENILAIAN */}
          {activeTab === 'umum' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              <div className="xl:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Identitas Kurikulum</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nama Kurikulum</label>
                      <input type="text" value={nama} onChange={e => setNama(e.target.value)} placeholder="Contoh: Kurikulum Merdeka" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Tahun Ajaran</label>
                      <input type="text" value={tahunAjaran} onChange={e => setTahunAjaran(e.target.value)} placeholder="Contoh: 2025/2026" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Status</label>
                      <select value={status} onChange={e => setStatus(e.target.value as 'aktif' | 'draft')} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="draft">Draft</option>
                        <option value="aktif">Aktif</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">KKM Default</label>
                      <input type="number" value={kkmDefault} onChange={e => setKkmDefault(Number(e.target.value))} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Metode Remedial</label>
                      <select value={metodeRemedial} onChange={e => setMetodeRemedial(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option>Maksimal setara KKM</option>
                        <option>Nilai murni ujian remedial</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="usesTp" checked={usesTp} onChange={e => setUsesTp(e.target.checked)} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <label htmlFor="usesTp" className="text-sm font-medium text-slate-700 dark:text-slate-200">Gunakan Tujuan Pembelajaran (TP)</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2"><Calculator className="w-4 h-4 text-indigo-500" /> Bobot Komponen Penilaian</h3>
                  <p className="text-xs text-slate-500 mb-4">Nilai Akhir = (Tugas × {bobotTugas}% + UTS × {bobotUts}% + UAS × {bobotUas}%) ÷ 100</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Nilai Tugas / Harian</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={0} max={100} value={bobotTugas} onChange={e => setBobotTugas(Number(e.target.value))} className="flex-1 accent-indigo-600" />
                        <span className="text-sm font-bold text-indigo-600 w-12 text-right">{bobotTugas}%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">UTS</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={0} max={100} value={bobotUts} onChange={e => setBobotUts(Number(e.target.value))} className="flex-1 accent-indigo-600" />
                        <span className="text-sm font-bold text-indigo-600 w-12 text-right">{bobotUts}%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">UAS</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={0} max={100} value={bobotUas} onChange={e => setBobotUas(Number(e.target.value))} className="flex-1 accent-indigo-600" />
                        <span className="text-sm font-bold text-indigo-600 w-12 text-right">{bobotUas}%</span>
                      </div>
                    </div>
                  </div>
                  <div className={`mt-4 p-4 rounded-xl flex items-center justify-between border ${totalBobot === 100 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <div>
                      <div className="font-bold text-sm text-slate-800">Total Bobot Penilaian</div>
                      <div className="text-xs text-slate-500 mt-0.5">Harus tepat 100%</div>
                    </div>
                    <div className={`text-2xl font-black flex items-center gap-2 ${totalBobot === 100 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {totalBobot === 100 && <CheckCircle className="w-6 h-6" />}
                      {totalBobot}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OTOMASI DESKRIPSI RAPOR */}
          {activeTab === 'deskripsi' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">Template Deskripsi Otomatis</h3>
                <p className="text-sm text-slate-500 mb-4">Sistem akan otomatis membuat deskripsi rapor berdasarkan TP dengan nilai tertinggi dan terendah. Gunakan variabel <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded text-xs">{'{deskripsi_tp}'}</code> untuk menyisipkan teks deskripsi TP.</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Threshold Nilai Tinggi</label>
                    <input type="number" value={thresholdTinggi} onChange={e => setThresholdTinggi(Number(e.target.value))} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Threshold Nilai Rendah</label>
                    <input type="number" value={thresholdRendah} onChange={e => setThresholdRendah(Number(e.target.value))} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Template Nilai Tinggi</label>
                    <textarea value={templateTinggi} onChange={e => setTemplateTinggi(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                    <div className="text-xs text-slate-400 mt-1">Contoh output: <span className="text-indigo-600">"Menunjukkan penguasaan yang sangat baik dalam {thresholdTinggi > 0 ? 'menganalisis fungsi kuadrat' : '...'}"</span></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">Template Nilai Rendah</label>
                    <textarea value={templateRendah} onChange={e => setTemplateRendah(e.target.value)} rows={2} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" />
                    <div className="text-xs text-slate-400 mt-1">Contoh output: <span className="text-indigo-600">"Perlu bimbingan lebih lanjut dalam memahami konsep dasar"</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAPOR BUILDER (CANVA STYLE) */}
          {activeTab === 'rapor' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

              {/* Kiri: Widget Palette */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden sticky top-24">
                  <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 text-white">
                    <h3 className="font-bold flex items-center gap-2"><Layout className="w-4 h-4" /> Elemen Rapor</h3>
                    <p className="text-[10px] text-indigo-100 mt-1 opacity-90">Klik untuk menambah ke kanvas.</p>
                  </div>
                  <div className="p-4 space-y-2 bg-slate-50 dark:bg-slate-800/50">
                    {BLOCK_LIBRARY.map(item => (
                      <button
                        key={item.type}
                        onClick={() => addBlock(item.type)}
                        className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-3 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md transition-all"
                      >
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">{item.icon}</div>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-xs text-slate-500 uppercase mb-2">Info</h4>
                  <p className="text-xs text-slate-400">Drag & drop untuk mengurutkan blok. Klik "Sembunyi" untuk menyembunyikan blok dari PDF. Simpan kurikulum untuk menyusun template rapor.</p>
                </div>
              </div>

              {/* Kanan: Canvas */}
              <div className="lg:col-span-3 bg-slate-200 dark:bg-slate-700/50 p-6 rounded-[20px] border border-slate-200 dark:border-slate-700 shadow-inner overflow-x-auto">
                {raporBlocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Layout className="w-12 h-12 mb-3 opacity-50" />
                    <p className="font-bold text-sm">Belum ada blok</p>
                    <p className="text-xs mt-1">Klik elemen di panel kiri untuk menambah blok rapor</p>
                  </div>
                ) : (
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={raporBlocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                      <div className="w-full max-w-[800px] mx-auto bg-white dark:bg-slate-900 shadow-2xl p-8 border border-slate-300 dark:border-slate-600 space-y-3">
                        {raporBlocks.map(block => (
                          <SortableBlock
                            key={block.id}
                            block={block}
                            onToggle={() => toggleBlock(block.id)}
                            onRemove={() => removeBlock(block.id)}
                            onEditProps={(props) => updateBlockProps(block.id, props)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
}
