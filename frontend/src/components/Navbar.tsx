import React, { useState } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Navbar({ currentPage, onPageChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'about', label: 'Profil Sekolah' },
    { id: 'guru', label: 'Direktori Guru' },
    { id: 'news', label: 'Berita' },
    { id: 'downloads', label: 'Unduhan' }
  ];

  return (
    <nav className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onPageChange('home')}>
            <BookOpen className="h-8 w-8 text-emerald-300" />
            <div>
              <span className="font-bold text-lg block leading-none">SMAS MUHAMMADIYAH 1</span>
              <span className="text-xs text-emerald-200 block">BANYUWANGI</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id 
                    ? 'bg-emerald-950 text-white' 
                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a 
              href="#portal-login"
              className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-semibold px-4 py-2 rounded-md text-sm transition-colors"
            >
              Portal SIT
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-100 hover:text-white hover:bg-emerald-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-emerald-900 border-t border-emerald-700 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                currentPage === item.id 
                  ? 'bg-emerald-950 text-white' 
                  : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <a
            href="#portal-login"
            className="block w-full text-center mt-4 bg-yellow-500 hover:bg-yellow-600 text-emerald-950 font-semibold px-4 py-2 rounded-md text-base transition-colors"
          >
            Portal SIT
          </a>
        </div>
      )}
    </nav>
  );
}
