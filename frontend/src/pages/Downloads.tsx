import { useState } from 'react';
import { Download, FileText, Search } from 'lucide-react';

export default function Downloads() {
  const [search, setSearch] = useState('');

  const documents = [
    { name: 'Brosur Pendaftaran Siswa Baru 2026/2027', type: 'PDF', size: '2.4 MB', date: '01 Mei 2026' },
    { name: 'Kalender Akademik Semester Ganjil 2026/2027', type: 'PDF', size: '1.2 MB', date: '15 Mei 2026' },
    { name: 'Buku Panduan Penggunaan Portal SIT (Siswa & Ortu)', type: 'PDF', size: '3.8 MB', date: '10 Juni 2026' },
    { name: 'Formulir Pendaftaran Beasiswa Berprestasi Muhammadiyah', type: 'DOCX', size: '320 KB', date: '18 Juni 2026' },
    { name: 'Overview Kurikulum Merdeka Fase F Kelas XI-XII', type: 'PDF', size: '1.8 MB', date: '21 Juni 2026' }
  ];

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Pusat Unduhan Dokumen</h1>
          <p className="text-slate-500 dark:text-slate-400">Akses dokumen publik resmi, kalender, brosur, serta panduan administrasi sekolah.</p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama dokumen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-teal bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm"
          />
        </div>

        {/* Table List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-4 px-6">Nama Dokumen</th>
                  <th className="py-4 px-6 text-center">Tipe</th>
                  <th className="py-4 px-6 text-center">Ukuran</th>
                  <th className="py-4 px-6 text-center">Tanggal Rilis</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600 dark:text-slate-400">
                {filteredDocs.length > 0 ? (
                  filteredDocs.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                        <FileText className="h-5 w-5 text-slate-400 shrink-0" />
                        <span>{doc.name}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2.5 sm:px-3 py-1 rounded whitespace-nowrap">
                          {doc.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-xs font-medium text-slate-500 dark:text-slate-400">{doc.size}</td>
                      <td className="py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">{doc.date}</td>
                      <td className="py-4 px-6 text-center">
                        <button className="bg-brand-teal hover:bg-brand-teal/90 text-white font-bold p-2.5 rounded-xl inline-flex items-center justify-center transition-colors shadow-sm">
                          <Download className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                      Tidak ada dokumen yang sesuai dengan pencarian "{search}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
