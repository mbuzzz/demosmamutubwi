import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Beranda' },
    { path: '/profile', label: 'Profil Sekolah' },
    { path: '/guru', label: 'Direktori Guru' },
    { path: '/berita', label: 'Berita' },
    { path: '/unduhan', label: 'Unduhan' }
  ];

  return (
    <nav className="bg-brand-blueDark text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-brand-teal" />
            <div>
              <span className="font-bold text-base sm:text-lg block leading-none">SMAS MUHAMMADIYAH 1</span>
              <span className="text-xs text-slate-300 block mt-0.5">BANYUWANGI</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-brand-blueSlate/50 text-brand-yellow font-semibold shadow-inner' 
                      : 'text-slate-100 hover:bg-brand-blueSlate/30 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a 
              href="#portal-login"
              className="ml-4 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-blueDark font-bold px-4 py-2 rounded-xl text-sm shadow-sm transition-all duration-200"
            >
              Portal SIT
            </a>
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
        <div className="md:hidden bg-brand-blueDark/95 backdrop-blur-md border-t border-slate-700 px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive ? 'bg-brand-blueSlate text-brand-yellow' : 'text-slate-100 hover:bg-brand-blueSlate/50'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href="#portal-login"
            className="block text-center mt-4 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-blueDark font-bold px-4 py-2.5 rounded-xl text-base"
          >
            Portal SIT
          </a>
        </div>
      )}
    </nav>
  );
}
