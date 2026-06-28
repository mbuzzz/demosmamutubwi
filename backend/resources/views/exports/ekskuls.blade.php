<!DOCTYPE html>
<html>
<head>
    <title>Daftar Ekstrakurikuler</title>
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
    <h2>Laporan Daftar Ekstrakurikuler</h2>
    <p>Tanggal Cetak: {{ now()->format('d-m-Y H:i') }}</p>
    
    <table style="width: 100%;">
        <thead>
            <tr>
                <th style="width: 5%;">No</th>
                <th style="width: 35%;">Nama Ekstrakurikuler</th>
                <th style="width: 60%;">Deskripsi / Kegiatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($ekskuls as $index => $e)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $e->nama }}</strong></td>
                    <td>{{ $e->deskripsi ?? '—' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        SMAS Muhammadiyah 1 Banyuwangi — Sistem Informasi Terpadu
    </div>
</body>
</html>
