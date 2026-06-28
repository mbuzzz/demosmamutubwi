<!DOCTYPE html>
<html>
<head>
    <title>Daftar Kelas</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; }
        h2 { text-align: center; margin-bottom: 20px; text-transform: uppercase; color: #1a365d; }
        table { wwidth: 100%; border-collapse: collapse; margin-top: 10px; }
        table, th, td { border: 1px solid #cbd5e1; }
        th { background-color: #f1f5f9; padding: 8px; font-weight: bold; text-align: left; color: #334155; }
        td { padding: 8px; }
        .text-center { text-align: center; }
        .footer { position: fixed; bottom: 0; left: 0; right: 0; height: 30px; text-align: center; font-size: 9px; color: #94a3b8; }
    </style>
</head>
<body>
    <h2>Laporan Daftar Kelas & Jurusan</h2>
    <p>Tanggal Cetak: {{ now()->format('d-m-Y H:i') }}</p>
    
    <table style="width: 100%;">
        <thead>
            <tr>
                <th style="width: 10%;">No</th>
                <th style="width: 30%;">Nama Kelas</th>
                <th style="width: 25%;">Tingkat</th>
                <th style="width: 35%;">Wali Kelas</th>
            </tr>
        </thead>
        <tbody>
            @foreach($kelas as $index => $k)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $k->nama }}</strong></td>
                    <td class="text-center">{{ $k->tingkat }}</td>
                    <td>{{ $k->waliKelas ? $k->waliKelas->name : 'Belum Ditentukan' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        SMAS Muhammadiyah 1 Banyuwangi — Sistem Informasi Terpadu
    </div>
</body>
</html>
