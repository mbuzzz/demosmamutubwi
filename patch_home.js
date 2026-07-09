const fs = require('fs');
const file = 'frontend/src/pages/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

// Import usePrestasiList
if (!content.includes('usePrestasiList')) {
  content = content.replace(
    "import { usePublicBeritaList } from '../hooks/useBerita';",
    "import { usePublicBeritaList } from '../hooks/useBerita';\nimport { usePrestasiList } from '../hooks/usePrestasi';\nimport { getFileUrl } from '../lib/api';"
  );
}

// Add hook inside Home()
if (!content.includes('const { data: prestasiList')) {
  content = content.replace(
    "  const { data: beritaList, isLoading: loadingBerita } = usePublicBeritaList();",
    "  const { data: beritaList, isLoading: loadingBerita } = usePublicBeritaList();\n  const { data: prestasiList } = usePrestasiList();"
  );
}

// Replace the Prestasi Section
const replacePattern = /\{\/\* Prestasi Section \*\/\}.*?(?=\{\/\* Latest News Section \*\/})/s;

const newPrestasi = `{/* Prestasi Section */}
      <section className="py-20 bg-brand-blueDark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold">Prestasi Unggulan</h2>
            <p className="text-slate-300 mt-2 text-lg">Dedikasi dan kerja keras civitas akademika kami membuahkan hasil membanggakan di tingkat nasional maupun internasional.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white dark:bg-slate-900/15 transition-colors text-slate-900 dark:text-white">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                <div className="p-3 bg-brand-yellow rounded-xl text-brand-blueDark dark:text-brand-yellow">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Prestasi</h3>
              </div>
              <ul className="space-y-4">
                {prestasiList?.slice(0, 5).map(p => (
                  <li key={p.id} className="flex items-start gap-4">
                    {p.gambar ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <img src={getFileUrl(p.gambar)} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <span className="bg-brand-teal text-white p-2 rounded-full shrink-0"><Award className="h-4 w-4" /></span>
                    )}
                    <div>
                      <h4 className="font-semibold text-lg leading-tight">{p.judul}</h4>
                      {p.kategori && <span className="text-[10px] uppercase font-bold text-brand-teal bg-brand-teal/10 px-2 py-0.5 rounded-full mt-1 inline-block">{p.kategori}</span>}
                      {p.deskripsi && <p className="text-sm text-slate-500 dark:text-slate-300 mt-1 line-clamp-2">{p.deskripsi}</p>}
                    </div>
                  </li>
                ))}
                {!prestasiList?.length && <li className="text-sm text-slate-400">Belum ada data prestasi</li>}
              </ul>
            </div>
            
            <div className="hidden md:flex items-center justify-center">
              <div className="relative w-full h-full min-h-[300px]">
                 <div className="absolute inset-0 bg-brand-teal/20 rounded-2xl animate-pulse"></div>
                 <div className="absolute inset-4 border border-white/20 rounded-xl flex items-center justify-center flex-col text-white/50">
                    <Award className="w-16 h-16 mb-4 opacity-50" />
                    <p className="font-semibold">Terus Mengukir Prestasi</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      `;

content = content.replace(replacePattern, newPrestasi);

fs.writeFileSync(file, content);
