import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Save, ArrowLeft, User as UserIcon, Lock, Camera, Mail, Phone, Building, Shield, ScanLine } from 'lucide-react';
import { toast } from 'sonner';
import { randomUid } from '../../../types/rfid';
import { useUser, useCreateUser, useUpdateUser } from '../../../hooks/useUsers';

export default function AdminUserForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  // Queries & Mutations
  const { data: user, isLoading: isUserLoading } = useUser(id);
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  // Form states
  const [role, setRole] = useState('siswa');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nipNisn, setNipNisn] = useState('');
  const [rfidUid, setRfidUid] = useState('');
  const [kelas, setKelas] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Load user data in edit mode
  useEffect(() => {
    if (isEdit && user) {
      setRole(user.role);
      setName(user.name);
      setEmail(user.email);
      setNipNisn(user.nip_nisn || '');
      setRfidUid(user.uid_rfid || '');
      setKelas(user.kelas || '');
      setJabatan(user.jabatan || '');
      setPhone(user.phone || '');
      setIsActive(user.is_active ?? true);
    }
  }, [isEdit, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Nama dan Email wajib diisi');
      return;
    }

    const userData: any = {
      name,
      email,
      role,
      nip_nisn: nipNisn || null,
      uid_rfid: rfidUid || null,
      kelas: role === 'siswa' ? kelas : null,
      jabatan: role !== 'siswa' ? (role === 'guru' || role === 'walikelas' || role === 'kurikulum' || role === 'kepala_sekolah' ? jabatan : null) : null,
      phone: phone || null,
      is_active: isActive,
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
      toast.error(err.response?.data?.message || 'Gagal menyimpan data pengguna. Periksa kembali input Anda.');
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
              <Shield className="w-4 h-4 text-indigo-500" /> Hak Akses (Role)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Peran Pengguna</label>
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
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Status Akun</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input type="radio" name="status" checked={isActive} onChange={() => setIsActive(true)} className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" /> Aktif
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input type="radio" name="status" checked={!isActive} onChange={() => setIsActive(false)} className="text-red-600 focus:ring-red-500 w-4 h-4" /> Nonaktif
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Data Pribadi & Spesifik Role */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none p-6 border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-500" /> Data Pribadi
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Masukkan nama lengkap" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email (Username Login)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@sekolah.com" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" required />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nomor Handphone (WhatsApp)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08123456789" className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password {isEdit && <span className="text-xs font-normal text-slate-450">(Kosongkan jika tidak diubah)</span>}
                  </label>
                  <div className="relative">
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
              Data Akademik Khusus ({role === 'siswa' ? 'Siswa' : 'Staf / Guru'})
            </h3>
            
            {role === 'siswa' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">UID Kartu RFID</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={rfidUid}
                      onChange={e => setRfidUid(e.target.value)}
                      placeholder="RF:XX:XX:XX:XX" 
                      className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono dark:text-white" 
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        setRfidUid(randomUid());
                        toast.success('Kartu RFID Terdeteksi (Mock)!');
                      }}
                      className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold px-4 rounded-lg text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-400"
                    >
                      <ScanLine className="w-4 h-4" /> Scan
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">NIS / NISN</label>
                  <input type="text" value={nipNisn} onChange={e => setNipNisn(e.target.value)} placeholder="Nomor Induk Siswa Nasional" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">Penempatan Kelas</label>
                  <select value={kelas} onChange={e => setKelas(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                    <option value="">-- Belum Ada Kelas --</option>
                    <option value="X-1">X-1 (Fase E)</option>
                    <option value="X-2">X-2 (Fase E)</option>
                    <option value="XI-IPA-1">XI IPA 1</option>
                  </select>
                </div>
              </div>
            )}

            {role !== 'siswa' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">NIP / NBM</label>
                  <input type="text" value={nipNisn} onChange={e => setNipNisn(e.target.value)} placeholder="Nomor Induk Pegawai" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">UID Kartu RFID (Staf)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={rfidUid}
                      onChange={e => setRfidUid(e.target.value)}
                      placeholder="RF:XX:XX:XX:XX" 
                      className="flex-1 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono dark:text-white" 
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        setRfidUid(randomUid());
                        toast.success('Kartu RFID Terdeteksi (Mock)!');
                      }}
                      className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold px-4 rounded-lg text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap dark:bg-indigo-950 dark:border-indigo-900 dark:text-indigo-400"
                    >
                      <ScanLine className="w-4 h-4" /> Scan
                    </button>
                  </div>
                </div>
                {['guru', 'walikelas', 'kurikulum', 'kepala_sekolah'].includes(role) && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">Jabatan / Spesialisasi Mapel</label>
                    <input type="text" value={jabatan} onChange={e => setJabatan(e.target.value)} placeholder="Contoh: Guru Matematika / Wali Kelas X-1" className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                )}
                {role === 'walikelas' && (
                  <div>
                    <label className="block text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">Wali Kelas dari Kelas</label>
                    <select value={kelas} onChange={e => setKelas(e.target.value)} className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white">
                      <option value="">-- Pilih Kelas Binaan --</option>
                      <option value="X-1">X-1 (Fase E)</option>
                      <option value="X-2">X-2 (Fase E)</option>
                      <option value="XI-IPA-1">XI IPA 1</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

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
