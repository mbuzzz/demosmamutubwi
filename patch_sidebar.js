const fs = require('fs');
const files = [
  'frontend/src/components/admin/AdminSidebar.tsx',
  'frontend/src/components/admin/AdminBottomNav.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    "{ name: \"Profil Sekolah\", path: \"/panel/profil-sekolah\", icon: Building2 },",
    "{ name: \"Profil Sekolah\", path: \"/panel/profil-sekolah\", icon: Building2 },\n          { name: \"Prestasi Unggulan\", path: \"/panel/prestasi\", icon: Award },"
  );
  content = content.replace(
    "{ name: \"Edit Profil Sekolah\", path: \"/panel/profil-sekolah\", icon: Building2 },",
    "{ name: \"Edit Profil Sekolah\", path: \"/panel/profil-sekolah\", icon: Building2 },\n            { name: \"Edit Prestasi\", path: \"/panel/prestasi\", icon: Award },"
  );
  if (!content.includes('Award')) {
    content = content.replace("import { ", "import { Award, ");
  }
  fs.writeFileSync(file, content);
}

let appContent = fs.readFileSync('frontend/src/App.tsx', 'utf8');
if (!appContent.includes('AdminPrestasiList')) {
  appContent = appContent.replace(
    "import AdminProfilSekolah from './pages/admin/halaman/AdminProfilSekolah';",
    "import AdminProfilSekolah from './pages/admin/halaman/AdminProfilSekolah';\nimport AdminPrestasiList from './pages/admin/halaman/AdminPrestasiList';"
  );
  appContent = appContent.replace(
    "<Route path=\"/panel/profil-sekolah\" element={<AdminProfilSekolah />} />",
    "<Route path=\"/panel/profil-sekolah\" element={<AdminProfilSekolah />} />\n                <Route path=\"/panel/prestasi\" element={<AdminPrestasiList />} />"
  );
  fs.writeFileSync('frontend/src/App.tsx', appContent);
}

