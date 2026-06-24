import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Newspaper, 
  Image as ImageIcon, 
  ClipboardList, 
  Download, 
  Users, 
  School, 
  BookOpen, 
  LineChart, 
  FileText, 
  Settings,
  Tags,
  LayoutTemplate,
  Building2,
  MessageSquareQuote,
  CalendarDays,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  MonitorPlay,
  FileQuestion,
  GraduationCap,
  SmartphoneNfc,
  CreditCard,
  ScanLine,
  type LucideIcon
} from 'lucide-react';
import { useRoleSimulator } from '../simulator/RoleContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export default function AdminSidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { simulatedRole } = useRoleSimulator();

  let navGroups: NavGroup[] = [];

  if (simulatedRole === 'superadmin') {
    navGroups = [
      {
        title: "Menu Utama",
        items: [
          { name: "Dashboard Admin", path: "/panel", icon: LayoutDashboard }
        ]
      },
      {
        title: "Akademik & LMS",
        items: [
          { name: "Jadwal Pelajaran", path: "/panel/jadwal", icon: CalendarDays },
          { name: "Presensi / Absensi", path: "/panel/kehadiran", icon: UserCheck },
          { name: "Users & Pegawai", path: "/panel/users", icon: Users },
          { name: "Penugasan", path: "/panel/penugasan", icon: ClipboardList },
          { name: "Kelas & Jurusan", path: "/panel/kelas", icon: School },
          { name: "Mata Pelajaran", path: "/panel/mapel", icon: BookOpen },
          { name: "Kurikulum & Rumus", path: "/panel/kurikulum", icon: Settings },
        ]
      },
      {
        title: "Ujian Online (CBT)",
        items: [
          { name: "Bank Soal", path: "/panel/cbt/bank-soal", icon: FileQuestion },
          { name: "Jadwal & Sesi Ujian", path: "/panel/cbt/jadwal", icon: CalendarDays },
          { name: "Monitor Ujian", path: "/panel/cbt/monitor", icon: MonitorPlay },
        ]
      },
      {
        title: "Nilai & Rapor Akhir",
        items: [
          { name: "Ledger Nilai Akhir", path: "/panel/nilai", icon: LineChart },
          { name: "Cetak Rapor Master", path: "/panel/rapor", icon: FileText },
        ]
      },
      {
        title: "Absensi & RFID",
        items: [
          { name: "Absensi Harian", path: "/panel/absensi", icon: UserCheck },
          { name: "Rekap Absensi", path: "/panel/absensi/rekap", icon: ClipboardList },
          { name: "Kartu RFID", path: "/panel/absensi/rfid", icon: ScanLine },
        ]
      },
      {
        title: "Pembayaran / Keuangan",
        items: [
          { name: "Dashboard Bayar", path: "/panel/pembayaran", icon: CreditCard },
          { name: "Jenis Pembayaran", path: "/panel/pembayaran/jenis", icon: FileText },
          { name: "Pembayaran Siswa", path: "/panel/pembayaran/siswa", icon: Users },
        ]
      },
      {
        title: "Web Profile Publik",
        items: [
          { name: "Halaman Beranda", path: "/panel/beranda", icon: LayoutTemplate },
          { name: "Profil Sekolah", path: "/panel/profil-sekolah", icon: Building2 },
          { name: "Daftar Berita", path: "/panel/berita", icon: Newspaper },
          { name: "Kategori Berita", path: "/panel/kategori-berita", icon: Tags },
          { name: "Galeri Foto", path: "/panel/galeri", icon: ImageIcon },
          { name: "Pusat Unduhan", path: "/panel/downloads", icon: Download },
          { name: "Testimoni & FAQ", path: "/panel/faq-testimoni", icon: MessageSquareQuote },
        ]
      },
      {
        title: "SPMB (Penerimaan)",
        items: [
          { name: "Data Pendaftar", path: "/panel/spmb", icon: Users },
          { name: "Gelombang Daftar", path: "/panel/spmb/gelombang", icon: ClipboardList },
          { name: "Builder Form", path: "/panel/spmb/form-builder", icon: LayoutDashboard },
        ]
      },
      {
        title: "Sistem Admin",
        items: [
          { name: "Pengaturan Web", path: "/panel/settings", icon: Settings },
          { name: "Pengaturan RFID", path: "/panel/settings/rfid", icon: SmartphoneNfc },
        ]
      },
    ];
  } else if (simulatedRole === 'bendahara') {
    navGroups = [
      {
        title: "Menu Bendahara",
        items: [
          { name: "Dashboard", path: "/panel/bendahara", icon: LayoutDashboard },
        ]
      },
      {
        title: "Pembayaran",
        items: [
          { name: "Dashboard Bayar", path: "/panel/bendahara/pembayaran", icon: CreditCard },
          { name: "Jenis Pembayaran", path: "/panel/bendahara/pembayaran/jenis", icon: FileText },
          { name: "Pembayaran Siswa", path: "/panel/bendahara/pembayaran/siswa", icon: Users },
        ]
      },
    ];
  } else if (simulatedRole === 'kepala_sekolah') {
    navGroups = [
      {
        title: "Menu Kepsek",
        items: [
          { name: "Dashboard", path: "/panel/guru", icon: LayoutDashboard },
          { name: "Dashboard Kepsek", path: "/panel/guru/kepsek", icon: Building2 },
        ]
      },
      {
        title: "Laporan & Monitoring",
        items: [
          { name: "Rekap Absensi", path: "/panel/guru/absensi/rekap", icon: ClipboardList },
          { name: "Rapor Siswa", path: "/panel/guru/rapor", icon: FileText },
        ]
      },
    ];
  } else if (simulatedRole === 'kurikulum') {
    navGroups = [
      {
        title: "Menu Kurikulum",
        items: [
          { name: "Dashboard", path: "/panel/guru", icon: LayoutDashboard },
          { name: "Dashboard Kurikulum", path: "/panel/guru/kurikulum", icon: BookOpen },
        ]
      },
      {
        title: "Akademik",
        items: [
          { name: "Jadwal Pelajaran", path: "/panel/guru/jadwal", icon: CalendarDays },
          { name: "Kurikulum & Rumus", path: "/panel/guru/kurikulum/rumus", icon: Settings },
          { name: "Mata Pelajaran", path: "/panel/guru/mapel", icon: BookOpen },
          { name: "Kelas & Jurusan", path: "/panel/guru/kelas", icon: School },
          { name: "Buku Nilai", path: "/panel/guru/nilai", icon: LineChart },
        ]
      },
      {
        title: "Laporan",
        items: [
          { name: "Rekap Absensi", path: "/panel/guru/absensi/rekap", icon: ClipboardList },
          { name: "Rapor Siswa", path: "/panel/guru/rapor", icon: FileText },
        ]
      },
    ];
  } else if (simulatedRole === 'guru' || simulatedRole === 'walikelas') {
    navGroups = [
      {
        title: "Ruang Guru",
        items: [
          { name: "Dashboard Guru", path: "/panel/guru", icon: LayoutDashboard }
        ]
      },
      {
        title: "KBM & Penilaian",
        items: [
          { name: "Jurnal Mengajar", path: "/panel/guru/jurnal", icon: CalendarDays },
          { name: "Absensi Siswa", path: "/panel/guru/absensi", icon: UserCheck },
          { name: "Buku Nilai Harian", path: "/panel/guru/nilai", icon: FileText },
          { name: "Bank Materi", path: "/panel/guru/materi", icon: BookOpen },
          { name: "Daftar Tugas", path: "/panel/guru/tugas", icon: ClipboardList },
        ]
      },
      {
        title: "Ujian Online (CBT)",
        items: [
          { name: "Bank Soal Saya", path: "/panel/guru/soal", icon: FileQuestion },
          { name: "Jadwal Ujian", path: "/panel/guru/ujian", icon: CalendarDays },
          { name: "Monitor Ujian Kelas", path: "/panel/cbt/monitor", icon: MonitorPlay },
        ]
      }
    ];

    if (simulatedRole === 'walikelas') {
      navGroups.push({
        title: "Wali Kelas Binaan",
        items: [
          { name: "Data Siswa Kelas", path: "/panel/guru/wali-siswa", icon: Users },
          { name: "Input Catatan Rapor", path: "/panel/guru/catatan-wali", icon: ClipboardList },
          { name: "Cetak Rapor Kelas", path: "/panel/guru/rapor", icon: GraduationCap },
        ]
      });
    }
  } else if (simulatedRole === 'siswa') {
    navGroups = [
      {
        title: "Menu Utama",
        items: [
          { name: "Dashboard Siswa", path: "/panel/siswa", icon: LayoutDashboard }
        ]
      },
      {
        title: "Kegiatan Belajar (KBM)",
        items: [
          { name: "Jadwal Pelajaran", path: "/panel/siswa/jadwal", icon: CalendarDays },
          { name: "Materi Belajar", path: "/panel/siswa/materi", icon: BookOpen },
          { name: "Tugas & PR", path: "/panel/siswa/tugas", icon: ClipboardList },
          { name: "Absensi Saya", path: "/panel/siswa/absensi", icon: UserCheck },
          { name: "Pembayaran Saya", path: "/panel/siswa/pembayaran", icon: CreditCard },
        ]
      },
      {
        title: "Evaluasi & Rapor",
        items: [
          { name: "Ujian Online (CBT)", path: "/panel/siswa/cbt", icon: FileQuestion },
          { name: "Rapor & Nilai", path: "/panel/siswa/rapor", icon: GraduationCap },
        ]
      }
    ];
  }

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-full bg-white dark:bg-slate-900 shadow-card z-40 
        transition-all duration-300 ease-in-out flex flex-col border-r border-slate-100 dark:border-slate-800
        ${isCollapsed ? 'w-[80px]' : 'w-[260px]'}
      `}
    >
      <div className={`h-[72px] flex items-center shrink-0 border-b border-slate-100 dark:border-slate-800 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
        <Link to="/panel" className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'w-10 justify-center' : 'w-full'}`}>
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain shrink-0" />
          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap animate-in fade-in duration-300">
              <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm tracking-tight leading-tight">SIT ADMIN</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">SMAS Muh 1 Bwi</span>
            </div>
          )}
        </Link>
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-[26px] w-7 h-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-500 transition-all z-50 focus:outline-none"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-8 custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx} className="px-3">
            {!isCollapsed && (
              <div className="px-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 whitespace-nowrap">
                {group.title}
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-px bg-slate-100 dark:bg-slate-800 mx-auto mb-3"></div>
            )}

            <div className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = item.path === '/panel' 
                  ? currentPath === '/panel'
                  : currentPath.startsWith(item.path);
                  
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative group flex items-center w-full"
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className={`
                      flex items-center gap-3 w-full py-2.5 rounded-xl font-semibold transition-all duration-200
                      ${isCollapsed ? 'justify-center px-0 mx-2' : 'px-4 mx-1'}
                      ${isActive 
                        ? 'bg-indigo-50/80 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
                      }
                    `}>
                      <Icon className={`shrink-0 transition-colors ${isCollapsed ? 'w-5 h-5' : 'w-[18px] h-[18px]'} ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                      
                      {!isCollapsed && (
                        <span className="whitespace-nowrap text-[13px] tracking-wide">{item.name}</span>
                      )}
                    </div>
                    
                    {isCollapsed && (
                      <div className="absolute left-14 opacity-0 invisible group-hover:opacity-100 group-hover:visible bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap z-50 transition-all translate-x-2 group-hover:translate-x-0">
                        {item.name}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-800"></div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
