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
  X
} from 'lucide-react';
import { useEffect } from 'react';

export default function AdminSidebar({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen: boolean; 
  setIsOpen: (v: boolean) => void;
}) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Auto-close sidebar on mobile when path changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };
    
    // Close on mobile navigation
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPath, setIsOpen]);

  const navGroups = [
    {
      title: "Menu Utama",
      items: [
        { name: "Dashboard", path: "/panel", icon: LayoutDashboard }
      ]
    },
    {
      title: "Web Profile (Frontend)",
      items: [
        { name: "Halaman Beranda", path: "/panel/beranda", icon: LayoutTemplate },
        { name: "Profil Sekolah", path: "/panel/profil-sekolah", icon: Building2 },
        { name: "Daftar Berita", path: "/panel/berita", icon: Newspaper },
        { name: "Kategori Berita", path: "/panel/kategori-berita", icon: Tags },
        { name: "Galeri", path: "/panel/galeri", icon: ImageIcon },
        { name: "Pusat Unduhan", path: "/panel/downloads", icon: Download },
        { name: "Testimoni & FAQ", path: "/panel/faq-testimoni", icon: MessageSquareQuote },
      ]
    },
    {
      title: "SPMB (Penerimaan)",
      items: [
        { name: "Data Pendaftar", path: "/panel/spmb", icon: Users },
        { name: "Gelombang", path: "/panel/spmb/gelombang", icon: ClipboardList },
        { name: "Form Builder", path: "/panel/spmb/form-builder", icon: LayoutDashboard },
      ]
    },
    {
      title: "Akademik (LMS & Rapor)",
      items: [
        { name: "Users", path: "/panel/users", icon: Users },
        { name: "Penugasan", path: "/panel/penugasan", icon: ClipboardList },
        { name: "Kurikulum", path: "/panel/kurikulum", icon: BookOpen },
        { name: "Kelas & Jurusan", path: "/panel/kelas", icon: School },
        { name: "Mata Pelajaran", path: "/panel/mapel", icon: BookOpen },
        { name: "Jadwal Pelajaran", path: "/panel/jadwal", icon: CalendarDays },
        { name: "Presensi Siswa", path: "/panel/kehadiran", icon: UserCheck },
        { name: "Entry Nilai", path: "/panel/nilai", icon: LineChart },
        { name: "Cetak Rapor", path: "/panel/rapor", icon: FileText },
      ]
    },
    {
      title: "Sistem",
      items: [
        { name: "Profil Saya", path: "/panel/profile", icon: Users },
        { name: "Pengaturan Web", path: "/panel/settings", icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-[hsl(var(--sidebar-bg))] text-slate-300 w-64 z-50 
        transition-transform duration-300 ease-in-out flex flex-col border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10 shrink-0">
          <Link to="/panel" className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-tight">SIT ADMIN</div>
              <div className="text-[10px] text-slate-400">SMAS Muh 1 Bwi</div>
            </div>
          </Link>
          <button 
            className="lg:hidden p-1 hover:bg-white/10 rounded-md text-slate-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
          {navGroups.map((group, idx) => (
            <div key={idx}>
              <div className="px-3 text-xs font-semibold text-[hsl(var(--sidebar-text))] uppercase tracking-wider mb-2">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = currentPath === item.path || currentPath.startsWith(`${item.path}/`);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                        ${isActive 
                          ? 'bg-[hsl(var(--sidebar-active))] text-white shadow-sm' 
                          : 'text-[hsl(var(--sidebar-text))] hover:bg-[hsl(var(--sidebar-hover))] hover:text-white'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/10 text-xs text-slate-500 text-center">
          v1.0.0 &copy; {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
}
