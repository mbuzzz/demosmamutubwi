const fs = require('fs');
const file = 'frontend/src/pages/admin/akademik/AdminUserList.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace handleExportExcel
content = content.replace(
  /const handleExportExcel = \(\) => \{[\s\S]*?  \};\n\n  const handleDownloadTemplate =/g,
  `const handleExportExcel = () => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const rootURL = apiURL.replace(/\\/api\\/?$/, '');
    window.open(\`\${rootURL}/api/users/export/xlsx?role=\${activeTab}\`, '_blank');
  };

  const handleExportPdf = () => {
    const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const rootURL = apiURL.replace(/\\/api\\/?$/, '');
    window.open(\`\${rootURL}/api/users/export/pdf?role=\${activeTab}\`, '_blank');
  };

  const handleDownloadTemplate =`
);

// Replace handleProcessImport
content = content.replace(
  /const handleProcessImport = \(\) => \{[\s\S]*?    \}\n  \};\n\n  return \(/g,
  `const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const uploadToast = toast.loading('Mengimpor pengguna...');

    try {
      const { api } = await import('../../../lib/api');
      const res = await api.post('/users/import/xlsx', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.dismiss(uploadToast);
      toast.success(res.data.message || 'Pengguna berhasil diimpor!');
      const { queryClient } = await import('../../../lib/queryClient');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err: any) {
      toast.dismiss(uploadToast);
      toast.error(err.response?.data?.message || 'Gagal mengimpor data pengguna.');
    }
    e.target.value = '';
    setShowImportModal(false);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (`
);

// Replace JSX for export/import buttons
content = content.replace(
  /<button onClick=\{handleExportExcel\} className="flex items-center gap-1\.5 px-3 py-1\.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">\s*<Download className="w-3\.5 h-3\.5" \/> Export Excel\s*<\/button>\s*<button onClick=\{handleDownloadTemplate\}/g,
  `<button onClick={handleExportPdf} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <FileText className="w-3.5 h-3.5" /> Export PDF
          </button>
          <button onClick={handleExportExcel} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Download className="w-3.5 h-3.5" /> Export Excel
          </button>
          <button onClick={handleDownloadTemplate}`
);

// Fix the import button click in JSX to use handleImportClick
content = content.replace(
  /<button onClick=\{() => setShowImportModal\(true\)\} className="flex items-center gap-1\.5 px-3 py-1\.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500\/10 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-500\/20 shadow-sm rounded-lg transition-colors">/g,
  `<button onClick={handleImportClick} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-500/20 shadow-sm rounded-lg transition-colors">`
);

// Add the hidden file input
content = content.replace(
  /\{showImportModal && \([\s\S]*?\}\)/g,
  `{/* Hidden file input */}
      <input 
        type="file" 
        accept=".xlsx, .xls"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImportExcel} 
      />`
);

fs.writeFileSync(file, content);
