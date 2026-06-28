<!DOCTYPE html>
<html>
<head>
    <title>Daftar Pengguna</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; }
        h2 { text-align: center; margin-bottom: 20px; text-transform: uppercase; color: #1a365d; }
        table { wwidth: 100%; border-collapse: collapse; margin-top: 10px; }
        table, th, td { border: 1px solid #cbd5e1; }
        th { background-color: #f1f5f9; padding: 8px; font-weight: bold; text-align: left; color: #334155; }
        td { padding: 8px; }
        .text-center { text-align: center; }
        .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; }
        .superadmin { background-color: #fee2e2; color: #991b1b; }
        .guru, .walikelas, .kepala_sekolah, .kurikulum { background-color: #fef3c7; color: #92400e; }
        .siswa { background-color: #dcfce7; color: #166534; }
        .bendahara { background-color: #ccfbf1; color: #115e59; }
        .admin { background-color: #f1f5f9; color: #334155; }
        .footer { position: fixed; bottom: 0; left: 0; right: 0; height: 30px; text-align: center; font-size: 9px; color: #94a3b8; }
    </style>
</head>
<body>
    <h2>Laporan Daftar Pengguna (Users)</h2>
    <p>Tanggal Cetak: {{ now()->format('d-m-Y H:i') }}</p>
    
    <table style="width: 100%;">
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 20%;">Nama Lengkap</th>
                <th style="width: 15%;">Username</th>
                <th style="width: 20%;">Email</th>
                <th style="width: 15%;">NIP / NISN</th>
                <th style="width: 10%;">Role</th>
                <th style="width: 15%;">Info Tambahan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $index => $user)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $user->name }}</strong></td>
                    <td><code>{{ $user->username }}</code></td>
                    <td>{{ $user->email }}</td>
                    <td>{{ $user->nip_nisn ?? '—' }}</td>
                    <td class="text-center">
                        <span class="badge {{ $user->role }}">{{ str_replace('_', ' ', $user->role) }}</span>
                    </td>
                    <td>{{ $user->kelas ? 'Kelas '.$user->kelas : ($user->jabatan ?? '—') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        SMAS Muhammadiyah 1 Banyuwangi — Sistem Informasi Terpadu
    </div>
</body>
</html>
