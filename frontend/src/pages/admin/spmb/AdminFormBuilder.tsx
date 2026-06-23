import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, GripVertical, Edit, Trash2, Settings, ListPlus, ToggleLeft } from 'lucide-react';
import { useState } from 'react';

export default function AdminFormBuilder() {
  const [fieldType, setFieldType] = useState('text');

  const formFields = [
    { id: 1, label: 'Nama Lengkap', type: 'Text (Input)', required: true, width: 'Full (100%)' },
    { id: 2, label: 'NISN', type: 'Number', required: true, width: 'Half (50%)' },
    { id: 3, label: 'Asal Sekolah', type: 'Text (Input)', required: true, width: 'Half (50%)' },
    { id: 4, label: 'Jalur Pendaftaran', type: 'Select (Dropdown)', required: true, width: 'Full (100%)', options: 'Prestasi, Reguler, Afirmasi' },
    { id: 5, label: 'Scan Kartu Keluarga', type: 'File Upload', required: false, width: 'Full (100%)', options: 'PDF/JPG, Max 2MB' },
  ];

  return (
    <AdminLayout title="Form Builder SPMB">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Sidebar settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <ListPlus className="w-4 h-4 text-indigo-500" /> Tambah Field Baru
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Tipe Field</label>
                <select 
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="text">Text Input (Singkat)</option>
                  <option value="textarea">Textarea (Panjang)</option>
                  <option value="number">Angka / Number</option>
                  <option value="select">Dropdown (Pilihan)</option>
                  <option value="file">File Upload (PDF/JPG)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Label Field</label>
                <input type="text" placeholder="Contoh: Nama Ayah" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              {fieldType === 'select' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Opsi Pilihan (Pisahkan dgn koma)</label>
                  <input type="text" placeholder="Islam, Kristen, Katolik..." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-200 mb-1.5">Lebar Kolom UI</label>
                <select className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="100">Full (100%)</option>
                  <option value="50">Separuh (50%)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <input type="checkbox" id="req" className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" defaultChecked />
                <label htmlFor="req" className="text-sm font-medium text-slate-700 dark:text-slate-300 dark:text-slate-200 cursor-pointer">Wajib Diisi (Required)</label>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mt-2">
                <Plus className="w-4 h-4" /> Tambah Field ke Form
              </button>
            </div>
          </div>
        </div>

        {/* List Fields */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><Settings className="w-4 h-4 text-slate-500 dark:text-slate-400"/> Urutan & Field Aktif</h3>
              <span className="text-xs font-medium px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-500 dark:text-slate-400 shadow-sm">Drag & Drop untuk urutan</span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {formFields.map(field => (
                <div key={field.id} className="flex items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800dark:bg-slate-800/50 transition-colors group bg-white dark:bg-slate-900">
                  <div className="cursor-grab text-slate-400 dark:text-slate-500 dark:text-slate-400 hover:text-indigo-500 mr-4 active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 dark:text-white">{field.label}</span>
                      {field.required ? (
                        <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-red-100">Wajib</span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">Opsional</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1"><ToggleLeft className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 dark:text-slate-400" /> {field.type}</span>
                      <span>Lebar: <strong className="text-slate-600 dark:text-slate-400">{field.width}</strong></span>
                      {field.options && <span className="text-indigo-500 truncate max-w-[200px]">[{field.options}]</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:border-indigo-200"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 hover:border-red-200"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 shadow-sm flex items-start gap-3">
            <div className="p-1 bg-amber-100 rounded-md shrink-0">
              <Settings className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <strong>Catatan Sistem:</strong> Form dinamis ini akan langsung tampil dan digunakan pada halaman Pendaftaran Calon Siswa Baru di Front-End Publik (<code>/spmb/form/:id</code>). Perubahan urutan atau field wajib akan langsung berlaku secara *real-time*.
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
