import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, GripVertical, Edit, Trash2, Settings, ListPlus, ToggleLeft, Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useFormFieldList, useCreateFormField, useUpdateFormField, useDeleteFormField, useGelombangList } from '../../../hooks/useSPMB';
import { toast } from 'sonner';

export default function AdminFormBuilder() {
  const { data: fields, isLoading } = useFormFieldList();
  const { data: gelombangList } = useGelombangList();
  const createField = useCreateFormField();
  const updateField = useUpdateFormField();
  const deleteField = useDeleteFormField();

  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: '',
    field_type: 'text',
    options: '',
    is_required: true,
    gelombang_id: '',
    urutan: 0,
  });

  const resetForm = () => {
    setForm({ label: '', field_type: 'text', options: '', is_required: true, gelombang_id: '', urutan: 0 });
    setEditId(null);
    setShowAdd(false);
  };

  const openEdit = (f: any) => {
    setForm({
      label: f.label,
      field_type: f.field_type,
      options: f.options?.join(', ') || '',
      is_required: f.is_required,
      gelombang_id: f.gelombang_id || '',
      urutan: f.urutan || 0,
    });
    setEditId(f.id);
    setShowAdd(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label) { toast.error('Label harus diisi'); return; }
    const payload: any = {
      label: form.label,
      field_type: form.field_type,
      is_required: form.is_required,
      gelombang_id: form.gelombang_id || null,
      urutan: form.urutan,
    };
    if (form.field_type === 'select') {
      payload.options = form.options.split(',').map(s => s.trim()).filter(Boolean);
    }
    try {
      if (editId) {
        await updateField.mutateAsync({ id: editId, data: payload });
        toast.success('Field berhasil diperbarui');
      } else {
        await createField.mutateAsync(payload);
        toast.success('Field berhasil ditambahkan');
      }
      resetForm();
    } catch { toast.error('Gagal menyimpan'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus field ini?')) return;
    try {
      await deleteField.mutateAsync(id);
      toast.success('Field berhasil dihapus');
    } catch { toast.error('Gagal menghapus'); }
  };

  return (
    <AdminLayout title="Form Builder SPMB">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <ListPlus className="w-4 h-4 text-indigo-500" /> {editId ? 'Edit Field' : 'Tambah Field Baru'}
            </h3>
            {!showAdd ? (
              <button onClick={() => setShowAdd(true)} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Tambah Field Baru
              </button>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Tipe Field</label>
                <select value={form.field_type} onChange={e => setForm({ ...form, field_type: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="text">Text Input</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Dropdown</option>
                  <option value="date">Date</option>
                  <option value="file">File Upload</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Label Field</label>
                <input type="text" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Contoh: Nama Ayah" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              {form.field_type === 'select' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Opsi Pilihan (Pisahkan dgn koma)</label>
                  <input type="text" value={form.options} onChange={e => setForm({ ...form, options: e.target.value })} placeholder="Islam, Kristen, Katolik..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Gelombang (optional)</label>
                <select value={form.gelombang_id} onChange={e => setForm({ ...form, gelombang_id: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Semua Gelombang</option>
                  {gelombangList?.map(g => <option key={g.id} value={g.id}>{g.nama}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Urutan</label>
                <input type="number" value={form.urutan} onChange={e => setForm({ ...form, urutan: Number(e.target.value) })} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="req" checked={form.is_required} onChange={e => setForm({ ...form, is_required: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                <label htmlFor="req" className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">Wajib Diisi</label>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={createField.isPending || updateField.isPending} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                  {(createField.isPending || updateField.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editId ? 'Update' : 'Simpan'}
                </button>
                <button type="button" onClick={resetForm} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Settings className="w-4 h-4 text-slate-500"/> Daftar Field Form</h3>
              <span className="text-xs font-medium px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 shadow-sm">{fields?.length || 0} field</span>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
            ) : (
            <div className="divide-y divide-slate-100">
              {fields?.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">Belum ada field. Tambah field baru dari panel kiri.</div>
              )}
              {fields?.map(field => (
                <div key={field.id} className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group bg-white dark:bg-slate-900">
                  <div className="cursor-grab text-slate-400 hover:text-indigo-500 mr-4 active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 dark:text-white">{field.label}</span>
                      {field.is_required ? (
                        <span className="text-[11px] bg-red-50 text-red-600 px-2.5 py-1 rounded font-bold uppercase tracking-wider border border-red-100 whitespace-nowrap">Wajib</span>
                      ) : (
                        <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700 whitespace-nowrap">Opsional</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1"><ToggleLeft className="w-3.5 h-3.5 text-slate-400" /> {field.field_type}</span>
                      <span>Urutan: <strong>{field.urutan}</strong></span>
                      {field.gelombang_id ? (
                        <span className="text-emerald-500 font-medium">Gelombang Khusus</span>
                      ) : (
                        <span className="text-indigo-500 font-medium">Semua Gelombang</span>
                      )}
                      {field.options && <span className="text-indigo-500 truncate max-w-[200px]">[{field.options.join(', ')}]</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(field)} className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg text-slate-500 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(field.id)} className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 shadow-sm flex items-start gap-3">
            <div className="p-1 bg-amber-100 rounded-md shrink-0">
              <Settings className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <strong>Catatan Sistem:</strong> Form dinamis ini akan langsung tampil pada halaman Pendaftaran Calon Siswa Baru di Front-End Publik (<code>/spmb/form/:id</code>).
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
