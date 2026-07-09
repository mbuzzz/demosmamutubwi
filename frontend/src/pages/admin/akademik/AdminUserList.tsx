import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, Upload, Download, X, FileText, CheckCircle2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { useUsers, useDeleteUser, useCreateUser, type UserRecord } from '../../../hooks/useUsers';
import { getFileUrl } from '../../../lib/api';

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  superadmin: { label: 'Superadmin', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400' },
  guru: { label: 'Guru', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400' },
  walikelas: { label: 'Wali Kelas', color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400' },
  kepala_sekolah: { label: 'Kepsek', color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400' },
  kurikulum: { label: 'Kurikulum', color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400' },
  bendahara: { label: 'Bendahara', color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400' },
  siswa: { label: 'Siswa', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400' },
  admin: { label: 'Admin', color: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400' },
};

export default function AdminUserList() {
  const [activeTab, setActiveTab] = useState('semua');
  const [search, setSearch] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const { data: users = [], isLoading, isError } = useUsers(activeTab, search);
  const deleteUserMutation = useDeleteUser();
  const createUserMutation = useCreateUser();

  const tabs = [
    { id: 'semua', label: 'Semua User' },
    { id: 'guru', label: 'Guru & Karyawan' },
    { id: 'siswa', label: 'Siswa' },
    { id: 'admin', label: 'Admin & Staf' },
  ];

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus pengguna ini dari sistem?')) return;
    try {
      await deleteUserMutation.mutateAsync(id);
      toast.success('Pengguna berhasil dihapus');
    } catch (err) {
      toast.error('Gagal menghapus pengguna');
    }
  };

  const handleExportExcel = () => {
    if (users.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }
    const reportData = users.map(u => ({
      'Nama Lengkap': u.name,
      'Username': u.email.split('@')[0], // simplified fallback
      'Email': u.email,
      'NIP / NISN': u.nip_nisn || '—',
      'Peran (Role)': u.role.toUpperCase(),
      'Keterangan / Info': u.kelas ? `Kelas ${u.kelas}` : u.jabatan || '—'
    }));

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daftar Pengguna');
    XLSX.writeFile(wb, `Daftar_Pengguna_SIT_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Daftar pengguna berhasil diekspor ke Excel');
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Nama Lengkap': 'John Doe',
        'Username': 'johndoe',
        'Email': 'johndoe@sekolah.com',
        'NIP / NISN': '1234567890',
        'Peran (Role)': 'siswa',
        'Keterangan / Info': 'X-1'
      },
      {
        'Nama Lengkap': 'Jane Smith, S.Pd',
        'Username': 'janesmith',
        'Email': 'janesmith@sekolah.com',
        'NIP / NISN': '198001012000012001',
        'Peran (Role)': 'guru',
        'Keterangan / Info': 'Guru Bahasa Inggris'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Impor User');
    XLSX.writeFile(wb, `Template_Impor_User.xlsx`);
  };

  const handleProcessImport = () => {
    if (!selectedFile) {
      toast.error('Pilih file Excel terlebih dahulu');
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const dataArr = evt.target?.result;
        if (!dataArr) return;
        const workbook = XLSX.read(dataArr, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<any>(worksheet);

        if (json.length === 0) {
          toast.error('Berkas Excel kosong');
          setIsImporting(false);
          return;
        }

        let importedCount = 0;

        for (let i = 0; i < json.length; i++) {
          const row = json[i];
          const name = row['Nama Lengkap'] || row['Nama'] || row['nama'];
          const username = row['Username'] || row['username'] || `user_${Date.now()}_${i}`;
          const email = row['Email'] || row['email'] || `${username}@smasmuh1.sch.id`;
          const nip_nisn = String(row['NIP / NISN'] || row['NIP'] || row['NISN'] || row['nip'] || row['nisn'] || '');
          const rawRole = String(row['Peran (Role)'] || row['Role'] || row['role'] || 'siswa').toLowerCase();
          const info = row['Keterangan / Info'] || row['Info'] || row['info'] || '';

          let role: UserRecord['role'] = 'siswa';
          if (rawRole.includes('guru')) role = 'guru';
          else if (rawRole.includes('wali')) role = 'walikelas';
          else if (rawRole.includes('kepsek')) role = 'kepala_sekolah';
          else if (rawRole.includes('kuri')) role = 'kurikulum';
          else if (rawRole.includes('benda')) role = 'bendahara';
          else if (rawRole.includes('super')) role = 'superadmin';
          else if (rawRole.includes('admin')) role = 'admin';

          if (name) {
            try {
              await createUserMutation.mutateAsync({
                name,
                username,
                email,
                password: '1234', // default password for imported accounts
                role,
                nip_nisn: nip_nisn || null,
                kelas: role === 'siswa' ? info : null,
                jabatan: role !== 'siswa' ? info : null,
                is_active: true
              });
              importedCount++;
            } catch (e) {
              console.error('Row failed', row, e);
            }
          }
        }

        toast.success(`Berhasil mengimpor ${importedCount} pengguna baru!`);
        setShowImportModal(false);
        setSelectedFile(null);
      } catch (err) {
        console.error(err);
        toast.error('Gagal membaca berkas Excel. Pastikan format kolom sesuai template.');
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <AdminLayout title="Manajemen Pengguna (Users)">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card dark:shadow-none border border-transparent dark:border-slate-800 overflow-hidden">
        
        {/* Tabs & Import/Export Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 px-2 sm:px-0 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-900/50">
          <div className="flex overflow-x-auto custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-[3px] transition-colors ${
                  activeTab === tab.id 
                    ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10' 
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 p-3 sm:p-0 sm:pr-4 bg-white dark:bg-slate-900 dark:bg-transparent">
            <button onClick={handleExportExcel} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700 rounded-xl transition-colors shadow-sm active:scale-95">
              <Download className="w-4 h-4" /> Export Excel
            </button>
            <button onClick={() => setShowImportModal(true)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-500/30 shadow-sm active:scale-95">
              <Upload className="w-4 h-4" /> Import Excel
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative max-w-sm w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama, email, NIP/NISN..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-medium dark:text-white transition-all"
              />
            </div>
          </div>
          <Link to="/panel/users/tambah" className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-transform active:scale-95 shrink-0 shadow-sm shadow-indigo-600/20">
            <Plus className="w-4 h-4" /> Tambah User Baru
          </Link>
        </div>
        
        {/* Table / Loading states */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400 font-semibold">Memuat data pengguna...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-16 text-red-500 font-bold text-sm">
              Gagal memuat data dari server
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-extrabold tracking-wider">
                <tr>
                  <th className="px-6 py-5">Nama Lengkap</th>
                  <th className="px-6 py-5">NIP / NISN</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Info Tambahan</th>
                  <th className="px-6 py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.length > 0 ? (
                  users.map((u) => {
                    const initial = u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    const roleStyle = ROLE_LABELS[u.role] || { label: u.role, color: 'bg-slate-100 text-slate-700 border-slate-200' };
                    
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {u.foto ? (
                              <img src={getFileUrl(`/storage/${u.foto}`)} alt="Avatar" className="w-10 h-10 rounded-full object-cover shadow-inner" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-sm shadow-inner">
                                {initial}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-slate-800 dark:text-white text-sm">{u.name}</div>
                              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-750 dark:text-slate-355">{u.nip_nisn || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${roleStyle.color}`}>
                            {roleStyle.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">
                          {u.kelas ? `Kelas ${u.kelas}` : u.jabatan || '—'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link to={`/panel/users/edit/${u.id}`} className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg transition-colors"><Edit className="w-4 h-4" /></Link>
                            <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                      Tidak ada pengguna ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/30 dark:bg-slate-900/30">
          <div>Menampilkan 1-{users.length} dari {users.length} data</div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 dark:text-slate-400 cursor-not-allowed font-bold">Seb</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-sm font-bold">1</button>
            <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 dark:text-slate-400 cursor-not-allowed font-bold">Sel</button>
          </div>
        </div>
      </div>

      {/* Import Excel Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isImporting && setShowImportModal(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-500" /> Impor Pengguna Baru
              </h3>
              {!isImporting && (
                <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
                <FileText className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Gunakan Format Template</p>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1 mb-2">Pastikan kolom Excel Anda sesuai dengan template standar kami untuk menghindari error saat proses impor data.</p>
                  <button onClick={handleDownloadTemplate} className="text-xs font-bold bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Unduh Template
                  </button>
                </div>
              </div>

              <div 
                onClick={() => !isImporting && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${selectedFile ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">{selectedFile.name}</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Siap untuk diproses</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Pilih berkas Excel (.xlsx)</span>
                    <span className="text-xs text-slate-400 mt-1">Klik di sini untuk menelusuri berkas</span>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
                accept=".xlsx, .xls" 
                className="hidden" 
              />
            </div>

            <div className="mt-6 flex gap-2">
              <button 
                onClick={() => { setSelectedFile(null); setShowImportModal(false); }}
                disabled={isImporting}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleProcessImport}
                disabled={isImporting || !selectedFile}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 shadow-sm flex justify-center items-center gap-2"
              >
                {isImporting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Memproses...</>
                ) : (
                  'Mulai Impor'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
