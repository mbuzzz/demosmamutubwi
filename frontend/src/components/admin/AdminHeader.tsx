import { Search, Bell, LogOut, ChevronDown, User, Moon, Sun } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';
import RoleSimulator from '../simulator/RoleSimulator';

export default function AdminHeader({ 
  isMobile,
  title
}: { 
  isMobile: boolean,
  title?: string
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="h-[72px] bg-white dark:bg-slate-900/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0 transition-colors">
      
      <div className="flex items-center gap-4">
        {/* Mobile Header Title */}
        {isMobile && title && (
          <h1 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight truncate max-w-[200px]">{title}</h1>
        )}
        
        {/* Desktop Search */}
        {!isMobile && (
          <div className="relative group hidden lg:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari siswa, kelas, berita..." 
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700 rounded-full text-sm font-medium focus:bg-white dark:bg-slate-900 dark:focus:bg-slate-800 focus:border-indigo-200 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 transition-all w-64 placeholder:font-normal dark:text-white"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        
        {/* Role Simulator Switcher */}
        <RoleSimulator />

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full"
          title="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        <button className="relative p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 sm:gap-3 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-100 dark:border-slate-800 dark:hover:border-slate-700"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              SA
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300 dark:text-slate-200 leading-none mb-1">Superadmin</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 leading-none">Admin Utama</span>
            </div>
            <ChevronDown className={`w-3 h-3 text-slate-400 dark:text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''} hidden sm:block`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 dark:border-slate-700 py-1.5 animate-in fade-in slide-in-from-top-4 z-50">
              <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-700 sm:hidden">
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Superadmin</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admin Utama</div>
              </div>
              <div className="p-1.5">
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/panel/profile');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors"
                >
                  <User className="w-4 h-4" /> Profil Saya
                </button>
                <div className="h-px bg-slate-50 dark:bg-slate-800 dark:bg-slate-700 my-1.5 mx-2"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Keluar Sistem
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
