<!DOCTYPE html>
<html>
<head>
    <title>Rapor Hasil Belajar - {{ $siswa->name }}</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 12px; color: #000; line-height: 1.4; padding: 10px; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-justify { text-align: justify; }
        .font-bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        .mb-4 { margin-bottom: 15px; }
        .mb-6 { margin-bottom: 25px; }
        
        /* Kop Surat Styles */
        .kop-container { border-b: 3px double #000; padding-bottom: 8px; margin-bottom: 20px; }
        .kop-banner { width: 100%; max-height: 120px; object-fit: contain; }
        .kop-table { width: 100%; border: none; }
        .kop-logo { width: 70px; height: 70px; object-fit: contain; }
        .kop-text-1 { font-size: 14px; font-weight: bold; margin: 0; }
        .kop-text-2 { font-size: 16px; font-weight: bold; margin: 2px 0; }
        .kop-text-3 { font-size: 10px; margin: 0; }

        /* Biodata */
        .bio-table { width: 100%; margin-bottom: 20px; font-size: 12px; font-weight: bold; }
        .bio-table td { padding: 3px 0; vertical-align: top; }

        /* General Tables */
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .data-table th, .data-table td { border: 1px solid #000; padding: 6px 8px; }
        .data-table th { background-color: #f2f2f2; font-weight: bold; }
        
        /* Signature Area */
        .sig-container { width: 100%; margin-top: 30px; }
        .sig-table { width: 100%; border: none; }
        .sig-table td { text-align: center; vertical-align: top; width: 50%; padding-top: 10px; }

        .page-break { page-break-after: always; }
    </style>
</head>
<body>

    @foreach($template as $block)
        @if(!isset($block['visible']) || $block['visible'])
            
            <!-- 1. KOP SURAT -->
            @if($block['type'] === 'kop_surat')
                <div class="kop-container">
                    @php
                        $props = $block['properties'] ?? [];
                        $mode = $props['mode'] ?? 'text_only';
                    @endphp

                    @if($mode === 'banner' && isset($props['banner_path']))
                        <img src="{{ public_path('storage/' . $props['banner_path']) }}" class="kop-banner" />
                    @elseif($mode === 'logo_text')
                        <table class="kop-table">
                            <tr>
                                <td style="width: 15%; text-align: center;">
                                    @if(isset($props['logo_path']))
                                        <img src="{{ public_path('storage/' . $props['logo_path']) }}" class="kop-logo" />
                                    @else
                                        <img src="{{ public_path('logo.png') }}" class="kop-logo" />
                                    @endif
                                </td>
                                <td style="width: 85%; text-align: center;">
                                    <div class="kop-text-1">{{ $props['header_text']['line1'] ?? 'MAJELIS PENDIDIKAN DASAR DAN MENENGAH' }}</div>
                                    <div class="kop-text-2">{{ $props['header_text']['line2'] ?? 'SMAS MUHAMMADIYAH 1 BANYUWANGI' }}</div>
                                    <div class="kop-text-3">{{ $props['header_text']['line3'] ?? 'Terakreditasi A - NSS: 302052501010 - NPSN: 20525847' }}</div>
                                    <div class="kop-text-3">{{ $props['header_text']['line4'] ?? 'Jl. Letkol Istiqlah No. 109, Kec. Banyuwangi, Telp: (0333) 421382' }}</div>
                                </td>
                            </tr>
                        </table>
                    @else
                        <!-- Text Only -->
                        <div class="text-center">
                            <div class="kop-text-1">LAPORAN HASIL BELAJAR (RAPOR)</div>
                            <div class="kop-text-2">SMAS MUHAMMADIYAH 1 BANYUWANGI</div>
                            <div class="kop-text-3">Tahun Pelajaran: {{ $rapor->tahun_ajaran }} | Semester: {{ ucfirst($rapor->semester) }}</div>
                        </div>
                    @endif
                </div>
            @endif

            <!-- 2. BIODATA SISWA -->
            @if($block['type'] === 'biodata_siswa')
                <table class="bio-table">
                    <tr>
                        <td style="width: 20%;">Nama Sekolah</td>
                        <td style="width: 3%;">:</td>
                        <td style="width: 37%;">SMAS Muhammadiyah 1 BWI</td>
                        <td style="width: 15%;">Kelas</td>
                        <td style="width: 3%;">:</td>
                        <td style="width: 22%;">{{ $kelas ? $kelas->nama : $siswa->kelas }}</td>
                    </tr>
                    <tr>
                        <td>Nama Siswa</td>
                        <td>:</td>
                        <td>{{ strtoupper($siswa->name) }}</td>
                        <td>Semester</td>
                        <td>:</td>
                        <td>{{ $rapor->semester === 'ganjil' ? '1 (Ganjil)' : '2 (Genap)' }}</td>
                    </tr>
                    <tr>
                        <td>NISN / NIS</td>
                        <td>:</td>
                        <td>{{ $siswa->nip_nisn ?? '—' }}</td>
                        <td>Tahun Pelajaran</td>
                        <td>:</td>
                        <td>{{ $rapor->tahun_ajaran }}</td>
                    </tr>
                </table>
            @endif

            <!-- 3. TABEL NILAI AKADEMIK -->
            @if($block['type'] === 'tabel_nilai')
                <h3 class="font-bold text-sm mb-4">A. NILAI AKADEMIK & CAPAIAN KOMPETENSI</h3>
                <table class="data-table text-center">
                    <thead>
                        <tr>
                            <th style="width: 5%;">No</th>
                            <th style="width: 30%; text-align: left;">Mata Pelajaran</th>
                            <th style="width: 10%;">KKM</th>
                            <th style="width: 10%;">Nilai Akhir</th>
                            <th style="width: 10%;">Predikat</th>
                            <th style="width: 35%; text-align: left;">Capaian Kompetensi (Deskripsi)</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if($nilais->isEmpty())
                            <tr>
                                <td colSpan="6" class="text-center">Belum ada data nilai mata pelajaran.</td>
                            </tr>
                        @else
                            @foreach($nilais as $index => $nilai)
                                <tr>
                                    <td>{{ $index + 1 }}</td>
                                    <td style="text-align: left;"><strong>{{ $nilai->mapel ? $nilai->mapel->nama : 'Mata Pelajaran' }}</strong></td>
                                    <td>{{ $nilai->mapel ? $nilai->mapel->kkm : 75 }}</td>
                                    <td class="font-bold">{{ $nilai->nilai_akhir }}</td>
                                    <td class="font-bold">{{ $nilai->predikat }}</td>
                                    <td style="text-align: left; font-size: 10px; line-height: 1.3;" class="text-justify">
                                        {{ $nilai->catatan ?: 'Menunjukkan perkembangan kompetensi yang cukup pada semua tujuan pembelajaran.' }}
                                    </td>
                                </tr>
                              @endforeach
                        @endif
                    </tbody>
                </table>
            @endif

            <!-- 4. TABEL EKSTRAKURIKULER -->
            @if($block['type'] === 'tabel_ekskul')
                <h3 class="font-bold text-sm mb-4">B. KEGIATAN EKSTRAKURIKULER</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width: 10%; text-align: center;">No</th>
                            <th style="width: 40%;">Kegiatan Ekstrakurikuler</th>
                            <th style="width: 15%; text-align: center;">Predikat</th>
                            <th style="width: 35%;">Keterangan / Capaian</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if($nilaiEkskuls->isEmpty())
                            <tr>
                                <td colSpan="4" class="text-center">Tidak mengikuti kegiatan ekstrakurikuler.</td>
                            </tr>
                        @else
                            @foreach($nilaiEkskuls as $index => $ne)
                                <tr>
                                    <td class="text-center">{{ $index + 1 }}</td>
                                    <td><strong>{{ $ne->ekskul ? $ne->ekskul->nama : 'Ekskul' }}</strong></td>
                                    <td class="text-center font-bold">{{ $ne->nilai }}</td>
                                    <td style="font-size: 11px;">{{ $ne->keterangan ?? '—' }}</td>
                                </tr>
                            @endforeach
                        @endif
                    </tbody>
                </table>
            @endif

            <!-- 5. TABEL ABSENSI / KETIDAKHADIRAN -->
            @if($block['type'] === 'tabel_absensi')
                <h3 class="font-bold text-sm mb-4">C. KETIDAKHADIRAN</h3>
                <table class="data-table" style="width: 50%;">
                    <thead>
                        <tr>
                            <th style="width: 60%;">Alasan Ketidakhadiran</th>
                            <th style="width: 40%; text-align: center;">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sakit</td>
                            <td class="text-center font-bold">{{ $rapor->sakit }} Hari</td>
                        </tr>
                        <tr>
                            <td>Izin</td>
                            <td class="text-center font-bold">{{ $rapor->izin }} Hari</td>
                        </tr>
                        <tr>
                            <td>Tanpa Keterangan (Alpha)</td>
                            <td class="text-center font-bold">{{ $rapor->alpha }} Hari</td>
                        </tr>
                        <tr>
                            <td class="font-bold">Terlambat</td>
                            <td class="text-center font-bold">{{ $rapor->terlambat }} Hari</td>
                        </tr>
                    </tbody>
                </table>
            @endif

            <!-- 6. SIGNATURE AREA -->
            @if($block['type'] === 'signatures')
                <div class="sig-container">
                    <table class="sig-table">
                        <tr>
                            <td>
                                Mengetahui,<br/>Orang Tua / Wali Siswa<br/><br/><br/><br/><br/>
                                <strong>( ......................................... )</strong>
                            </td>
                            <td>
                                Banyuwangi, {{ now()->format('d F Y') }}<br/>Wali Kelas<br/><br/><br/><br/><br/>
                                <strong>{{ $waliKelasName }}</strong>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" style="text-align: center; padding-top: 30px;">
                                Mengetahui,<br/>Kepala Sekolah<br/><br/><br/><br/><br/>
                                <strong>{{ $kepsekName }}</strong>
                            </td>
                        </tr>
                    </table>
                </div>
            @endif

        @endif
    @endforeach

</body>
</html>
