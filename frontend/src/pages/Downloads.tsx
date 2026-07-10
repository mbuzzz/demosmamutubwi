import { useState } from 'react';
import { Download, FileText, Search, Loader2 } from 'lucide-react';
import { usePublicDownloadsList } from '../hooks/useDownloads';

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

export default function Downloads() {
  const [search, setSearch] = useState('');
  const { data: documents = [], isLoading } = usePublicDownloadsList({ search });

  const handleDownload = (id: string) => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    window.open(`${apiURL}/public/downloads/${id}/file`, '_blank');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
                <p className="text-sm text-slate-400 font-semibold">Memuat dokumen...</p>
              </div>
            ) : (
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
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm text-slate-600 dark:text-slate-400">
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                          <FileText className="h-5 w-5 text-slate-400 shrink-0" />
                          <span>{doc.nama}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold px-2.5 sm:px-3 py-1 rounded whitespace-nowrap">
                            {doc.file_type}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center text-xs font-medium text-slate-500 dark:text-slate-400">{doc.file_size}</td>
                        <td className="py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">{formatDate(doc.created_at)}</td>
                        <td className="py-4 px-6 text-center">
                          <button 
                            onClick={() => handleDownload(doc.id)}
                            className="bg-brand-teal hover:bg-brand-teal/90 text-white font-bold p-2.5 rounded-xl inline-flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                        Tidak ada dokumen yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
