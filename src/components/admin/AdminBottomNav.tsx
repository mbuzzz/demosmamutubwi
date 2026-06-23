import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays,
  FileQuestion,
  FileText,
  Menu,
  X,
  Settings,
  Users,
  Building2,
  Newspaper,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function AdminBottomNav({ currentPath }: { currentPath: string }) {
  const [showMore, setShowMore] = useState(false);

  const mainTabs = [
    { name: "Beranda", path: "/panel", icon: LayoutDashboard },
    { name: "Akademik", path: "/panel/jadwal", icon: CalendarDays },
    { name: "Ujian", path: "/panel/cbt/jadwal", icon: FileQuestion },
    { name: "Rapor", path: "/panel/rapor", icon: FileText },
  ];

  const moreMenuGroups = [
    {
      title: "Master Data",
      items: [
        { name: "Users & Pegawai", path: "/panel/users", icon: Users },
        { name: "Pengaturan Kurikulum", path: "/panel/kurikulum", icon: Settings },
      ]
    },
    {
      title: "Web Publik",
      items: [
        { name: "Edit Profil Sekolah", path: "/panel/profil-sekolah", icon: Building2 },
        { name: "Kelola Berita", path: "/panel/berita", icon: Newspaper },
      ]
    }
  ];

  return (
    <>
      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none z-50 safe-area-pb pb-2 px-2 pt-2 flex justify-between items-center transition-colors">
        {mainTabs.map((tab) => {
          const isActive = tab.path === '/panel' 
            ? currentPath === '/panel' 
            : currentPath.startsWith(tab.path.split('/')[2] ? `/${tab.path.split('/')[1]}/${tab.path.split('/')[2]}` : tab.path);
            
          return (
            <Link 
              key={tab.path} 
              to={tab.path}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-1"
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-400'}`}>
                <tab.icon className={`w-[22px] h-[22px] ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-400'}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}

        {/* More Button */}
        <button 
          onClick={() => setShowMore(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-1"
        >
          <div className="p-1.5 text-slate-400">
            <Menu className="w-[22px] h-[22px] stroke-[2px]" />
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            Lainnya
          </span>
        </button>
      </div>

      {/* More Bottom Sheet Overlay */}
      {showMore && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowMore(false)}
          />
          <div className="absolute bottom-0 left-0 w-full bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom-full duration-300 max-h-[85vh] overflow-hidden flex flex-col transition-colors">
            
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 dark:bg-slate-800/50">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">Menu Lainnya</h3>
              <button 
                onClick={() => setShowMore(false)}
                className="p-2 bg-white dark:bg-slate-900 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar pb-10">
              {moreMenuGroups.map((group, idx) => (
                <div key={idx}>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 px-2">{group.title}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {group.items.map(item => (
                      <Link 
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowMore(false)}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 dark:border-slate-700 p-3 rounded-2xl flex flex-col gap-2 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 active:scale-95 transition-all"
                      >
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="pt-4 mt-2">
                <Link 
                  to="/panel/settings"
                  onClick={() => setShowMore(false)}
                  className="w-full bg-slate-800 text-white p-4 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 opacity-80" />
                    <span className="font-bold text-sm">Pengaturan Sistem Lengkap</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
