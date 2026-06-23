import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Users, Download, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Menutup dropdown saat klik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Menutup menu mobile saat path berubah
  useEffect(() => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const isDirektoriActive = location.pathname === '/guru' || location.pathname === '/unduhan';

  return (
    <nav className="bg-brand-blueDark text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo SMAS Muh 1" className="h-10 w-10 object-contain drop-shadow-sm" />
            <div>
              <span className="font-bold text-base sm:text-lg block leading-none">SMAS MUHAMMADIYAH 1</span>
              <span className="text-[10px] text-slate-300 block mt-0.5 tracking-widest uppercase">Banyuwangi</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-blueSlate/50 text-brand-yellow font-semibold shadow-inner' 
                    : 'text-slate-100 hover:bg-brand-blueSlate/30 hover:text-white'
                }`
              }
            >
              Beranda
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-blueSlate/50 text-brand-yellow font-semibold shadow-inner' 
                    : 'text-slate-100 hover:bg-brand-blueSlate/30 hover:text-white'
                }`
              }
            >
              Profil Sekolah
            </NavLink>
            
            {/* Dropdown Direktori (Desktop) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDirektoriActive 
                    ? 'bg-brand-blueSlate/50 text-brand-yellow font-semibold shadow-inner' 
                    : 'text-slate-100 hover:bg-brand-blueSlate/30 hover:text-white'
                }`}
              >
                Direktori <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-[15px] shadow-lg border border-slate-100 dark:border-slate-800 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <Link 
                    to="/guru" 
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 hover:text-brand-teal transition-colors"
                  >
                    <Users className="w-4 h-4" /> Guru & Karyawan
                  </Link>
                  <Link 
                    to="/unduhan" 
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 hover:text-brand-teal transition-colors"
                  >
                    <Download className="w-4 h-4" /> Pusat Unduhan
                  </Link>
                </div>
              )}
            </div>

            <NavLink
              to="/berita"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-blueSlate/50 text-brand-yellow font-semibold shadow-inner' 
                    : 'text-slate-100 hover:bg-brand-blueSlate/30 hover:text-white'
                }`
              }
            >
              Berita
            </NavLink>
            <NavLink
              to="/spmb"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-blueSlate/50 text-brand-yellow font-semibold shadow-inner' 
                    : 'text-slate-100 hover:bg-brand-blueSlate/30 hover:text-white'
                }`
              }
            >
              SPMB
            </NavLink>

            <button onClick={toggleTheme} className="p-2.5 rounded-lg text-slate-100 hover:bg-brand-blueSlate/30 transition-colors" title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link 
              to="/login"
              className="ml-2 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-blueDark dark:text-brand-blueDark font-bold px-5 py-2.5 rounded-[15px] text-sm shadow-sm transition-all duration-200"
            >
              Masuk Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-brand-blueSlate/30">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-blueDark/95 backdrop-blur-md border-t border-slate-700 px-4 pt-4 pb-6 space-y-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-[15px] text-base font-medium ${
                isActive ? 'bg-brand-blueSlate text-brand-yellow' : 'text-slate-100 hover:bg-brand-blueSlate/50'
              }`
            }
          >
            Beranda
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-[15px] text-base font-medium ${
                isActive ? 'bg-brand-blueSlate text-brand-yellow' : 'text-slate-100 hover:bg-brand-blueSlate/50'
              }`
            }
          >
            Profil Sekolah
          </NavLink>

          {/* Mobile Dropdown */}
          <div className="space-y-2">
            <div className={`px-4 py-2 font-semibold text-sm ${isDirektoriActive ? 'text-brand-yellow' : 'text-slate-400'}`}>
              DIREKTORI
            </div>
            <div className="pl-4 space-y-2 border-l-2 border-slate-700 ml-4">
              <NavLink
                to="/guru"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-brand-blueSlate text-brand-yellow' : 'text-slate-200 hover:bg-brand-blueSlate/30'
                  }`
                }
              >
                <Users className="w-4 h-4" /> Guru & Karyawan
              </NavLink>
              <NavLink
                to="/unduhan"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-brand-blueSlate text-brand-yellow' : 'text-slate-200 hover:bg-brand-blueSlate/30'
                  }`
                }
              >
                <Download className="w-4 h-4" /> Pusat Unduhan
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/berita"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-[15px] text-base font-medium ${
                isActive ? 'bg-brand-blueSlate text-brand-yellow' : 'text-slate-100 hover:bg-brand-blueSlate/50'
              }`
            }
          >
            Berita
          </NavLink>
          <NavLink
            to="/spmb"
            className={({ isActive }) =>
              `block px-4 py-3 rounded-[15px] text-base font-medium ${
                isActive ? 'bg-brand-blueSlate text-brand-yellow' : 'text-slate-100 hover:bg-brand-blueSlate/50'
              }`
            }
          >
            SPMB
          </NavLink>

          <div className="flex items-center justify-between pt-4 px-4">
            <button onClick={toggleTheme} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
            </button>
          </div>

          <Link
            to="/login"
            className="block text-center mt-2 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-blueDark dark:text-brand-blueDark font-bold px-4 py-3.5 rounded-[15px] text-base shadow-sm"
          >
            Masuk Portal
          </Link>
        </div>
      )}
    </nav>
  );
}
