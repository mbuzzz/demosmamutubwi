import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">SMAS Muhammadiyah 1 Banyuwangi</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Membentuk generasi unggul berkarakter Islami, cerdas secara akademis, dan terampil menyongsong masa depan.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-400 transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="hover:text-emerald-400 transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="hover:text-emerald-400 transition-colors"><Twitter className="h-5 w-5" /></a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-4">Hubungi Kami</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Jl. Letkol Istiqlah No.109, Singonegaran, Kec. Banyuwangi, Kabupaten Banyuwangi, Jawa Timur 68415</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>(0333) 421382</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>info@smasmuh1bwi.sch.id</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-4">Peta Lokasi</h3>
          <div className="h-40 rounded-lg overflow-hidden border border-slate-700">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3948.868779646453!2d114.3644053!3d-8.2159239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd15ab67085c889%3A0xe5a3c004d41fa6e9!2sSMA%20Muhammadiyah%201%20Banyuwangi!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} SMAS Muhammadiyah 1 Banyuwangi. All Rights Reserved.
      </div>
    </footer>
  );
}
