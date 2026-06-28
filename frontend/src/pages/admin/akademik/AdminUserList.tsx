import AdminLayout from '../../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2, Upload, Download } from 'lucide-react';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { useUsers, useDeleteUser, useCreateUser, type UserRecord } from '../../../hooks/useUsers';

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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
          return;
        }

        toast.info(`Memproses ${json.length} baris data...`);
        let importedCount = 0;

        for (let i = 0; i < json.length; i++) {
          const row = json[i];
          const name = row['Nama Lengkap'] || row['Nama'] || row['nama'];
          const email = row['Email'] || row['email'] || `${Date.now()}-${i}@smasmuh1.sch.id`;
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
            await createUserMutation.mutateAsync({
              name,
              email,
              password: 'password', // default password for imported accounts
              role,
              nip_nisn: nip_nisn || null,
              kelas: role === 'siswa' ? info : null,
              jabatan: role !== 'siswa' ? info : null,
              is_active: true
            });
            importedCount++;
          }
        }

        toast.success(`Berhasil mengimpor ${importedCount} pengguna baru ke database!`);
      } catch (err) {
        console.error(err);
        toast.error('Gagal membaca berkas Excel atau ada data duplikat (Email/NIP/NISN).');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = ''; // clear input
  };

  return (
    <AdminLayout title="Manajemen Pengguna (Users)">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-card dark:shadow-none border border-transparent dark:border-slate-800 overflow-hidden">
        
        {/* Hidden File Input for Import */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImportExcel} 
          accept=".xlsx, .xls" 
          className="hidden" 
        />

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
            <button onClick={handleImportClick} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 rounded-xl transition-colors border border-indigo-200 dark:border-indigo-500/30 shadow-sm active:scale-95">
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
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-sm shadow-inner">
                              {initial}
                            </div>
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
    </AdminLayout>
  );
}
