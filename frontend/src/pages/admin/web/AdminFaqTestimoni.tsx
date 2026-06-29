import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Edit, Trash2, HelpCircle, MessageSquareQuote, Loader2, Save } from 'lucide-react';
import { useState } from 'react';
import { useTestimoniList, useCreateTestimoni, useDeleteTestimoni } from '../../../hooks/useTestimoni';
import { useFaqList, useCreateFaq, useUpdateFaq, useDeleteFaq } from '../../../hooks/useFaq';
import Swal from 'sweetalert2';
import Modal from '../../../components/ui/Modal';

export default function AdminFaqTestimoni() {
  const [activeTab, setActiveTab] = useState('testimoni');
  
  // Testimoni State
  const { data: testimonis, isLoading: loadTestimoni } = useTestimoniList();
  const createTestimoni = useCreateTestimoni();
  const deleteTestimoni = useDeleteTestimoni();
  const [showModalTestimoni, setShowModalTestimoni] = useState(false);
  const [testimoniForm, setTestimoniForm] = useState({ nama: '', peran: '', isi_testimoni: '' });
  const [testimoniFile, setTestimoniFile] = useState<File | null>(null);

  // FAQ State
  const { data: faqs, isLoading: loadFaq } = useFaqList();
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [faqForm, setFaqForm] = useState({ pertanyaan: '', jawaban: '' });
  const [showModalFaq, setShowModalFaq] = useState(false);

  // Handlers
  const handleSaveTestimoni = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('nama', testimoniForm.nama);
      formData.append('peran', testimoniForm.peran);
      formData.append('isi_testimoni', testimoniForm.isi_testimoni);
      formData.append('is_active', '1');
      if (testimoniFile) formData.append('foto', testimoniFile);

      await createTestimoni.mutateAsync(formData);
      setShowModalTestimoni(false);
      setTestimoniForm({ nama: '', peran: '', isi_testimoni: '' });
      setTestimoniFile(null);
    } catch {}
  };

  const handleDelTestimoni = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Testimoni?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!'
    });
    if (result.isConfirmed) {
      await deleteTestimoni.mutateAsync(id);
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await updateFaq.mutateAsync({ id: editingFaq, data: faqForm });
        setEditingFaq(null);
      } else {
        await createFaq.mutateAsync({ ...faqForm, urutan: 0, is_active: true });
      }
      setShowModalFaq(false);
      setFaqForm({ pertanyaan: '', jawaban: '' });
    } catch {}
  };

  const handleDelFaq = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus FAQ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus!'
    });
    if (result.isConfirmed) {
      await deleteFaq.mutateAsync(id);
    }
  };

  return (
    <AdminLayout title="Manajemen Testimoni & FAQ">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto bg-slate-50/50 dark:bg-slate-900/50">
          <button onClick={() => setActiveTab('testimoni')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-[3px] transition-colors ${activeTab === 'testimoni' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <MessageSquareQuote className="w-4 h-4" /> 1. Testimoni Alumni & Wali
          </button>
          <button onClick={() => setActiveTab('faq')} className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap border-b-[3px] transition-colors ${activeTab === 'faq' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <HelpCircle className="w-4 h-4" /> 2. Pertanyaan Umum (FAQ)
          </button>
        </div>

        <div className="p-6 bg-slate-50/50 dark:bg-slate-900 min-h-[500px]">
          
          {/* TESTIMONI */}
          {activeTab === 'testimoni' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Daftar Testimoni</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Testimoni ini akan ditampilkan secara acak di halaman Beranda dan SPMB.</p>
                </div>
                <button onClick={() => setShowModalTestimoni(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah Testimoni
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {loadTestimoni ? (
                  <div className="col-span-2 flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
                ) : testimonis?.length === 0 ? (
                  <div className="col-span-2 text-center py-10 text-slate-500">Belum ada testimoni</div>
                ) : (
                  testimonis?.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative group hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button onClick={() => handleDelTestimoni(item.id)} className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="flex gap-4">
                        {item.foto ? (
                          <img src={item.foto} alt={item.nama} className="w-16 h-16 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0 flex items-center justify-center text-slate-400 text-xs font-bold">No Img</div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{item.nama}</h4>
                          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">{item.peran}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">"{item.isi_testimoni}"</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeTab === 'faq' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg">Tanya Jawab (FAQ)</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pertanyaan yang sering diajukan untuk halaman Pendaftaran (SPMB).</p>
                </div>
                <button onClick={() => { setEditingFaq(null); setFaqForm({ pertanyaan: '', jawaban: '' }); setShowModalFaq(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Tambah FAQ
                </button>
              </div>

              <div className="space-y-4 mt-6">
                {loadFaq ? (
                  <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
                ) : faqs?.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">Belum ada FAQ</div>
                ) : (
                  faqs?.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 flex gap-4 group hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors">
                      <div className="flex-1 space-y-3">
                        <div className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-white transition-colors">{item.pertanyaan}</div>
                        <div className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 transition-colors">{item.jawaban}</div>
                      </div>
                      <div className="pt-2 flex flex-col gap-2">
                        <button onClick={() => { setEditingFaq(item.id); setFaqForm({ pertanyaan: item.pertanyaan, jawaban: item.jawaban }); setShowModalFaq(true); }} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-colors"><Edit className="w-5 h-5" /></button>
                        <button onClick={() => handleDelFaq(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      <Modal isOpen={showModalTestimoni} onClose={() => setShowModalTestimoni(false)} title="Tambah Testimoni">
        <form onSubmit={handleSaveTestimoni} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Nama Lengkap</label>
            <input type="text" value={testimoniForm.nama} onChange={e => setTestimoniForm({ ...testimoniForm, nama: e.target.value })} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Peran (Cth: Alumni 2021 / Wali Murid)</label>
            <input type="text" value={testimoniForm.peran} onChange={e => setTestimoniForm({ ...testimoniForm, peran: e.target.value })} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Isi Testimoni</label>
            <textarea rows={3} value={testimoniForm.isi_testimoni} onChange={e => setTestimoniForm({ ...testimoniForm, isi_testimoni: e.target.value })} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"></textarea>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Foto Profil</label>
            <input type="file" accept="image/*" onChange={e => setTestimoniFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setShowModalTestimoni(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Batal</button>
            <button type="submit" disabled={createTestimoni.isPending} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
              {createTestimoni.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showModalFaq} onClose={() => setShowModalFaq(false)} title={editingFaq ? "Edit FAQ" : "Tambah FAQ"}>
        <form onSubmit={handleSaveFaq} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Pertanyaan</label>
            <input type="text" value={faqForm.pertanyaan} onChange={e => setFaqForm({ ...faqForm, pertanyaan: e.target.value })} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Jawaban</label>
            <textarea rows={4} value={faqForm.jawaban} onChange={e => setFaqForm({ ...faqForm, jawaban: e.target.value })} required className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"></textarea>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setShowModalFaq(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Batal</button>
            <button type="submit" disabled={createFaq.isPending || updateFaq.isPending} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50">
              {(createFaq.isPending || updateFaq.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
            </button>
          </div>
        </form>
      </Modal>

    </AdminLayout>
  );
}
