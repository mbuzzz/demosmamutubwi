import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, User as UserIcon, Camera, ArrowLeft, Building, Lock, Mail, Phone, ScanLine, Shield, BookOpen, ExternalLink } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useUser, useCreateUser, useUpdateUser, useUsers } from '../../../hooks/useUsers';
import { useKelasList } from '../../../hooks/useKelas';
import { toast } from 'sonner';

const MULTI_ROLE_OPTIONS = [
  { val: 'guru', name: 'Guru / Pendidik' },
  { val: 'walikelas', name: 'Wali Kelas' },
  { val: 'kepala_sekolah', name: 'Kepala Sekolah' },
  { val: 'kurikulum', name: 'Kurikulum' },
  { val: 'bendahara', name: 'Bendahara' },
  { val: 'admin', name: 'Admin / Staff TU' },
];

export default function AdminUserForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: user, isLoading: isUserLoading } = useUser(id);
  const { data: kelasList = [] } = useKelasList();
  const { data: siswaList = [] } = useUsers('siswa');
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('siswa');
  const [roles, setRoles] = useState<string[]>([]);
  
  const [nipNisn, setNipNisn] = useState('');
  const [kelas, setKelas] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [phone, setPhone] = useState('');
  const [rfidUid, setRfidUid] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [siswaId, setSiswaId] = useState('');

  useEffect(() => {
    if (isEdit && user) {
      setName(user.name);
      setEmail(user.email);
      setUsername(user.username);
      setRole(user.role);
      // Prefer all_roles, fallback roles array
      const loaded =
        (Array.isArray(user.all_roles) && user.all_roles.length
          ? user.all_roles
          : user.roles) || [];
      setRoles(loaded.filter((r) => r !== user.role));
      setNipNisn(user.nip_nisn || '');
      setKelas(user.kelas || '');
      setJabatan(user.jabatan || '');
      setPhone(user.phone || '');
      setRfidUid(user.uid_rfid || '');
      setIsActive(user.is_active !== false);
      setSiswaId(user.siswa_id ? String(user.siswa_id) : '');
    }
  }, [isEdit, user]);

  const penugasanList = useMemo(() => user?.penugasans || [], [user]);
  const isStaffRole = role !== 'siswa' && role !== 'orang_tua';
  const canHaveMapel = ['guru', 'walikelas', 'kurikulum', 'kepala_sekolah'].includes(role)
    || roles.some((r) => ['guru', 'walikelas', 'kurikulum', 'kepala_sekolah'].includes(r));

  const handleRoleCheckboxChange = (r: string) => {
    if (r === role) return; // primary always checked
    if (roles.includes(r)) {
      setRoles(roles.filter(x => x !== r));
    } else {
      setRoles([...roles, r]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !username) {
      toast.error('Nama, Username, dan Email wajib diisi');
      return;
    }

    // Multi-role: kirim roles (primary digabung di backend), pastikan unique
    const multiRoles = isStaffRole
      ? Array.from(new Set([role, ...roles.filter((r) => r !== role)]))
      : null;

    // Wali kelas (primary atau multi) butuh kelas binaan
    const needsKelas = role === 'siswa' || role === 'walikelas' || multiRoles?.includes('walikelas');

    const userData: any = {
      name,
      username,
      email,
      role,
      roles: multiRoles,
      nip_nisn: nipNisn || null,
      uid_rfid: rfidUid || null,
      kelas: needsKelas ? (kelas || null) : null,
      jabatan: isStaffRole ? jabatan : null,
      phone: phone || null,
      is_active: isActive,
      siswa_id: role === 'orang_tua' ? (siswaId ? parseInt(siswaId) : null) : null,
    };

    if (password) {
      userData.password = password;
    } else if (!isEdit) {
      toast.error('Password wajib diisi untuk pengguna baru');
      return;
    }

    try {
      if (isEdit) {
        await updateUserMutation.mutateAsync({ id: id!, data: userData });
        toast.success('Data Pengguna berhasil diperbarui!');
      } else {
        await createUserMutation.mutateAsync(userData);
        toast.success('Data Pengguna baru berhasil disimpan!');
      }
      navigate('/panel/users');
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : null) ||
        'Gagal menyimpan data pengguna. Periksa kembali input Anda.';
      toast.error(msg);
    }
  };

  if (isEdit && isUserLoading) {
    return (
      <AdminLayout title="Form Data Pengguna">
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-semibold">Memuat data pengguna...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? 'Edit Data Pengguna' : 'Form Data Pengguna'}>
      <div className="mb-6 flex items-center justify-between">
        <Link to="/panel/users" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar User
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Kolom Kiri: Profil & Foto */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800 text-center">
            <div className="w-32 h-32 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full border-4 border-white shadow-md relative mb-4 flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
              <button type="button" className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-sm border-2 border-white">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Foto Profil</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Format JPG/PNG, Maksimal 2MB. Rasio 1:1.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" /> Hak Akses (Role Utama)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Peran Utama</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-400"
                >
                  <option value="siswa">Siswa / Peserta Didik</option>
                  <option value="guru">Guru / Tenaga Pendidik</option>
                  <option value="walikelas">Wali Kelas</option>
                  <option value="kepala_sekolah">Kepala Sekolah</option>
                  <option value="kurikulum">Kurikulum</option>
                  <option value="bendahara">Bendahara</option>
                  <option value="admin">Admin / Staff Tata Usaha</option>
                  <option value="superadmin">Superadmin Sistem</option>
                  <option value="orang_tua">Orang Tua / Wali Murid</option>
                </select>
              </div>

              {isStaffRole && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Peran Tambahan (Multi-Role)
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                    Satu akun bisa punya beberapa peran, mis. <strong>Guru + Wali Kelas + Bendahara</strong>.
                    Menu panel mengikuti mode akses yang dipilih saat login.
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    {MULTI_ROLE_OPTIONS.map(item => (
                      <label key={item.val} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-750 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={roles.includes(item.val) || role === item.val}
                          disabled={role === item.val}
                          onChange={() => handleRoleCheckboxChange(item.val)}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded border-slate-300"
                        />
                        <span>
                          {item.name}
                          {role === item.val && (
                            <span className="ml-1 text-[10px] text-indigo-500 font-bold">(utama)</span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Status Akun</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="status" checked={isActive} onChange={() => setIsActive(true)} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Aktif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="status" checked={!isActive} onChange={() => setIsActive(false)} className="w-4 h-4 text-red-500 focus:ring-red-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Nonaktif</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Data Personal & Kredensial */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-500" /> Data Personal & Kredensial
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap Sesuai Identitas <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Budi Santoso" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Username Login <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold text-sm">@</span>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))} placeholder="budisantoso" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Alamat Email Valid <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="budi@example.com" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nomor Telepon / WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08123456789" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password Login {isEdit && <span className="text-slate-400 font-normal">(Kosongi jika tidak diubah)</span>}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative md:col-span-2">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={isEdit ? "Ketik untuk mengganti password" : "Minimal 6 karakter"} className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" required={!isEdit} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Dinamis Berdasarkan Role */}
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800 border-l-4 border-l-indigo-500 bg-indigo-50/20">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-4 pb-2 border-b border-indigo-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" /> 
              Data Spesifik ({role === 'siswa' ? 'Siswa' : role === 'orang_tua' ? 'Orang Tua' : 'Staf / Guru'})
            </h3>
            
            {role === 'siswa' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">UID Kartu RFID</label>
                   <div className="relative">
                     <ScanLine className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                     <input 
                       type="text" 
                       value={rfidUid}
                       onChange={e => setRfidUid(e.target.value)}
                       placeholder="Contoh: A1B2C3D4 atau RF:XX:XX:XX:XX" 
                       className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono dark:text-white" 
                     />
                   </div>
                   <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Masukkan UID kartu RFID yang sudah terdaftar di mesin tap. Kosongkan jika belum ada kartu.</p>
                 </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">NIS / NISN</label>
                  <input type="text" value={nipNisn} onChange={e => setNipNisn(e.target.value)} placeholder="Nomor Induk Siswa Nasional" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">Penempatan Kelas</label>
                  <select value={kelas} onChange={e => setKelas(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                    <option value="">-- Belum Ada Kelas --</option>
                    {kelasList.map(k => (
                      <option key={k.id} value={k.nama}>{k.nama}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {role === 'orang_tua' && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">Pilih Data Siswa (Anak)</label>
                  <select value={siswaId} onChange={e => setSiswaId(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                    <option value="">-- Pilih Anak / Siswa --</option>
                    {siswaList.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.kelas || 'Belum Ada Kelas'})</option>
                    ))}
                  </select>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Akun wali murid ini akan memiliki akses untuk memantau data anak yang dipilih.</p>
                </div>
              </div>
            )}

            {role !== 'siswa' && role !== 'orang_tua' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">NIP / NBM</label>
                  <input type="text" value={nipNisn} onChange={e => setNipNisn(e.target.value)} placeholder="Nomor Induk Pegawai" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
                 <div>
                   <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">UID Kartu RFID (Staf)</label>
                   <div className="relative">
                     <ScanLine className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                     <input 
                       type="text" 
                       value={rfidUid}
                       onChange={e => setRfidUid(e.target.value)}
                       placeholder="Contoh: A1B2C3D4 atau RF:XX:XX:XX:XX" 
                       className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono dark:text-white" 
                     />
                   </div>
                   <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Masukkan UID kartu RFID yang sudah terdaftar di mesin tap. Kosongkan jika belum ada kartu.</p>
                 </div>
                {isStaffRole && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">
                      Jabatan (Label Tampilan)
                    </label>
                    <input
                      type="text"
                      value={jabatan}
                      onChange={e => setJabatan(e.target.value)}
                      placeholder="Contoh: Waka Kurikulum / Guru Matematika / Wali Kelas X-1"
                      className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                    <div className="mt-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 px-3 py-2 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed space-y-1">
                      <p><strong>Jabatan ≠ hak akses.</strong> Ini hanya teks yang tampil di direktori guru, absensi, dan daftar user.</p>
                      <p>• Hak akses sistem → centang <strong>Multi-Role</strong> di kiri / lewat penugasan struktural.</p>
                      <p>• Mapel resmi multi-mapel → menu <strong>Penugasan → Mengajar</strong>.</p>
                      <p>• Jabatan resmi di bagan organisasi → menu <strong>Penugasan → Struktural</strong> (otomatis mengisi label ini).</p>
                    </div>
                  </div>
                )}
                {(role === 'walikelas' || roles.includes('walikelas')) && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">Wali Kelas dari Kelas</label>
                    <select value={kelas} onChange={e => setKelas(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                      <option value="">-- Pilih Kelas Binaan --</option>
                      {kelasList.map(k => (
                        <option key={k.id} value={k.nama}>{k.nama}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Multi-mapel via penugasan (read-only summary) */}
          {isEdit && canHaveMapel && (
            <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800 border-l-4 border-l-emerald-500">
              <div className="flex items-start justify-between gap-3 mb-4 pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Multi-Mapel (Penugasan Mengajar)
                </h3>
                <Link
                  to="/panel/penugasan"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  Kelola di Penugasan <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                Satu guru bisa mengajar banyak mapel di banyak kelas. Setiap baris = 1 penugasan (Guru × Mapel × Kelas).
              </p>
              {penugasanList.length === 0 ? (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-200 dark:border-slate-700 px-4 py-6 text-center">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Belum ada penugasan mapel</p>
                  <p className="text-xs text-slate-400 mt-1">Tambahkan di menu Akademik → Penugasan</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">
                        <th className="pb-2 pr-3">Mata Pelajaran</th>
                        <th className="pb-2 pr-3">Kelas</th>
                        <th className="pb-2">Jam/minggu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {penugasanList.map((p) => (
                        <tr key={String(p.id)}>
                          <td className="py-2.5 pr-3 font-semibold text-slate-800 dark:text-slate-100">
                            {p.mapel?.nama || '—'}
                          </td>
                          <td className="py-2.5 pr-3 text-slate-600 dark:text-slate-300">
                            {p.kelas?.nama || '—'}
                          </td>
                          <td className="py-2.5 text-slate-600 dark:text-slate-300">
                            {p.total_jam ?? '—'} jp
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-colors shadow-md hover:shadow-lg active:scale-95">
              <Save className="w-5 h-5" /> Simpan Data Pengguna
            </button>
          </div>
        </div>

      </form>
    </AdminLayout>
  );
}
