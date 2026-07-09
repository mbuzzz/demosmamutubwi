const fs = require('fs');
const file = 'frontend/src/pages/admin/spmb/AdminGelombangList.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "    biaya_pendaftaran: '',\n    is_active: true,\n  });",
  "    biaya_pendaftaran: '',\n    is_active: true,\n    redirect_url: '',\n  });"
);

content = content.replace(
  "setForm({ nama: '', tanggal_mulai: '', tanggal_selesai: '', kuota: '', biaya_pendaftaran: '', is_active: true });",
  "setForm({ nama: '', tanggal_mulai: '', tanggal_selesai: '', kuota: '', biaya_pendaftaran: '', is_active: true, redirect_url: '' });"
);

content = content.replace(
  "      biaya_pendaftaran: g.biaya_pendaftaran.toString(),\n      is_active: g.is_active,\n    });",
  "      biaya_pendaftaran: g.biaya_pendaftaran.toString(),\n      is_active: g.is_active,\n      redirect_url: g.redirect_url || '',\n    });"
);

content = content.replace(
  "      kuota: form.kuota ? Number(form.kuota) : null,\n      biaya_pendaftaran: Number(form.biaya_pendaftaran) || 0,\n      is_active: form.is_active,\n    };",
  "      kuota: form.kuota ? Number(form.kuota) : null,\n      biaya_pendaftaran: Number(form.biaya_pendaftaran) || 0,\n      is_active: form.is_active,\n      redirect_url: form.redirect_url || null,\n    };"
);

content = content.replace(
  "              <div>\n                <label className=\"block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5\">Status Aktif?</label>",
  "              <div>\n                <label className=\"block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5\">Redirect URL setelah submit form</label>\n                <input type=\"text\" value={form.redirect_url} onChange={e => setForm({ ...form, redirect_url: e.target.value })} placeholder=\"Contoh: /success atau url WA grup\" className=\"w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4\" />\n              </div>\n              <div>\n                <label className=\"block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5\">Status Aktif?</label>"
);

fs.writeFileSync(file, content);
