const fs = require('fs');
const file = 'frontend/src/pages/admin/siswa/SiswaJadwal.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('useAuth')) {
    content = content.replace(
        "import { useJadwal } from '../../../hooks/useJadwal';",
        "import { useJadwal } from '../../../hooks/useJadwal';\nimport { useAuth } from '../../../hooks/useAuth';"
    );
}

if (!content.includes('const { user } = useAuth();')) {
    content = content.replace(
        "  const { data: schedules = [] } = useJadwal();",
        "  const { data: schedules = [] } = useJadwal();\n  const { user } = useAuth();\n  const isGuru = user?.role === 'guru';"
    );
}

if (content.includes("guru: match.guru?.name || '—',")) {
    content = content.replace(
        "guru: match.guru?.name || '—',",
        "guru: isGuru ? `Kelas ${match.kelas?.nama || ''}` : (match.guru?.name || '—'),"
    );
}

if (content.includes('<AdminLayout title="Jadwal Pelajaran Saya">')) {
    content = content.replace(
        '<AdminLayout title="Jadwal Pelajaran Saya">',
        '<AdminLayout title={isGuru ? "Jadwal Mengajar" : "Jadwal Pelajaran Saya"}>'
    );
}

if (content.includes('Jadwal Pelajaran Kelas X-1')) {
    content = content.replace(
        'Jadwal Pelajaran Kelas X-1',
        "{isGuru ? 'Jadwal Mengajar Saya' : `Jadwal Pelajaran Kelas ${user?.kelas || 'Anda'}`}"
    );
}

fs.writeFileSync(file, content);
