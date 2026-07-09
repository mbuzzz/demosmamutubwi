const fs = require('fs');
const file = 'frontend/src/pages/admin/halaman/AdminProfilSekolah.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add activeTab state
content = content.replace(
  "  const [kepsekFoto, setKepsekFoto] = useState<File | null>(null);",
  "  const [kepsekFoto, setKepsekFoto] = useState<File | null>(null);\n  const [activeTab, setActiveTab] = useState<'sejarah' | 'visimisi' | 'sambutan'>('sejarah');"
);

// Replace the layout to use tabs
const tabsHtml = `
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-6 pb-2 overflow-x-auto">
              <button onClick={() => setActiveTab('sejarah')} className={\`px-4 py-2 font-bold text-sm rounded-lg transition-colors \${activeTab === 'sejarah' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}\`}>Sejarah Sekolah</button>
              <button onClick={() => setActiveTab('visimisi')} className={\`px-4 py-2 font-bold text-sm rounded-lg transition-colors \${activeTab === 'visimisi' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}\`}>Visi & Misi</button>
              <button onClick={() => setActiveTab('sambutan')} className={\`px-4 py-2 font-bold text-sm rounded-lg transition-colors \${activeTab === 'sambutan' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}\`}>Sambutan Kepsek</button>
            </div>
`;

content = content.replace(
  "          <>\n            <div className=\"bg-white dark:bg-slate-900 rounded-[15px] border border-slate-100 dark:border-slate-800 p-6\">\n              <h3 className=\"font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2\">",
  "          <>\n            <div className=\"bg-white dark:bg-slate-900 rounded-[15px] border border-slate-100 dark:border-slate-800 p-6\">\n" + tabsHtml + "\n              {activeTab === 'sejarah' && (<>\n              <h3 className=\"font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2\">"
);

content = content.replace(
  "              </div>\n            </div>\n\n            <div className=\"bg-white dark:bg-slate-900 rounded-[15px] border border-slate-100 dark:border-slate-800 p-6\">\n              <h3 className=\"font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2\">\n                <Target",
  "              </div>\n              </>)}\n              {activeTab === 'visimisi' && (<>\n              <h3 className=\"font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2\">\n                <Target"
);

content = content.replace(
  "              </div>\n            </div>\n\n            <div className=\"bg-white dark:bg-slate-900 rounded-[15px] border border-slate-100 dark:border-slate-800 p-6\">\n              <h3 className=\"font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2\">\n                <Quote",
  "              </div>\n              </>)}\n              {activeTab === 'sambutan' && (<>\n              <h3 className=\"font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2\">\n                <Quote"
);

content = content.replace(
  "              </div>\n            </div>\n          </>",
  "              </div>\n              </>)}\n            </div>\n          </>"
);

fs.writeFileSync(file, content);
