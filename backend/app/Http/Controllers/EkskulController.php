<?php

namespace App\Http\Controllers;

use App\Models\Ekskul;
use App\Models\JadwalEkskul;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

class EkskulController extends Controller
{
    public function index(Request $request)
    {
        $query = Ekskul::with('jadwals.pembina:id,name,nip_nisn');

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('nama', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
        }

        return response()->json($query->orderBy('nama')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:ekskuls',
            'deskripsi' => 'nullable|string',
        ]);

        $ekskul = Ekskul::create($validated);

        return response()->json([
            'message' => 'Ekstrakurikuler berhasil dibuat',
            'ekskul' => $ekskul,
        ], 201);
    }

    public function show($id)
    {
        $ekskul = Ekskul::findOrFail($id);
        return response()->json($ekskul);
    }

    public function update(Request $request, $id)
    {
        $ekskul = Ekskul::findOrFail($id);

        $validated = $request->validate([
            'nama' => [
                'required',
                'string',
                'max:255',
                Rule::unique('ekskuls')->ignore($ekskul->id),
            ],
            'deskripsi' => 'nullable|string',
        ]);

        $ekskul->update($validated);

        return response()->json([
            'message' => 'Ekstrakurikuler berhasil diperbarui',
            'ekskul' => $ekskul,
        ]);
    }

    public function destroy($id)
    {
        $ekskul = Ekskul::findOrFail($id);
        $ekskul->delete();

        return response()->json([
            'message' => 'Ekstrakurikuler berhasil dihapus',
        ]);
    }

    // Export PDF
    public function exportPdf()
    {
        $ekskuls = Ekskul::orderBy('nama')->get();
        $pdf = Pdf::loadView('exports.ekskuls', compact('ekskuls'));
        return $pdf->download('daftar_ekstrakurikuler.pdf');
    }

    // Export XLSX
    public function exportXlsx()
    {
        $ekskuls = Ekskul::orderBy('nama')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Daftar Ekskul');

        // Set Headers
        $headers = ['No', 'Nama Ekstrakurikuler', 'Deskripsi / Kegiatan'];
        foreach ($headers as $colIndex => $header) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex + 1);
            $sheet->setCellValue($colLetter . '1', $header);
            $sheet->getStyle($colLetter . '1')->getFont()->setBold(true);
        }

        // Fill Data
        foreach ($ekskuls as $rowIndex => $e) {
            $rowNum = $rowIndex + 2;
            $sheet->setCellValue('A' . $rowNum, $rowIndex + 1);
            $sheet->setCellValue('B' . $rowNum, $e->nama);
            $sheet->setCellValue('C' . $rowNum, $e->deskripsi ?: '—');
        }

        // Auto-fit Column Widths
        foreach (range(1, count($headers)) as $colIndex) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        $fileName = 'daftar_ekstrakurikuler_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        header('Cache-Control: max-age=0');

        $writer = new Xlsx($spreadsheet);
        $writer->save('php://output');
        exit;
    }

    // Import XLSX
    public function importXlsx(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $file = $request->file('file');
        $spreadsheet = IOFactory::load($file->getRealPath());
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        $importedCount = 0;
        
        $header = true;
        foreach ($rows as $row) {
            if ($header) {
                $header = false;
                continue;
            }

            // Map: B = Nama Ekskul, C = Deskripsi
            $nama = $row['B'];
            $deskripsi = $row['C'] ?: null;

            if (!$nama) continue;

            // Skip if ekskul name already exists
            if (Ekskul::where('nama', $nama)->exists()) {
                continue;
            }

            Ekskul::create([
                'nama' => $nama,
                'deskripsi' => $deskripsi,
            ]);

            $importedCount++;
        }

        return response()->json([
            'message' => "Berhasil mengimpor {$importedCount} ekstrakurikuler baru.",
            'imported_count' => $importedCount,
        ]);
    }

    // Jadwal Ekskul CRUD
    public function getJadwal($ekskulId)
    {
        $jadwals = JadwalEkskul::where('ekskul_id', $ekskulId)
            ->with('pembina:id,name,nip_nisn')
            ->orderBy('hari')
            ->orderBy('jam_mulai')
            ->get();
        return response()->json($jadwals);
    }

    public function storeJadwal(Request $request, $ekskulId)
    {
        $validated = $request->validate([
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'pola' => 'required|in:setiap_minggu,minggu_ganjil,minggu_genap,minggu_ke_1,minggu_ke_2,minggu_ke_3,minggu_ke_4',
            'ruang' => 'nullable|string',
            'pembina_id' => 'nullable|exists:users,id',
        ]);
        $validated['ekskul_id'] = $ekskulId;
        $jadwal = JadwalEkskul::create($validated);
        return response()->json(['message' => 'Jadwal berhasil ditambahkan', 'data' => $jadwal->load('pembina:id,name,nip_nisn')], 201);
    }

    public function updateJadwal(Request $request, $ekskulId, $jadwalId)
    {
        $jadwal = JadwalEkskul::where('ekskul_id', $ekskulId)->findOrFail($jadwalId);
        $validated = $request->validate([
            'hari' => 'sometimes|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
            'jam_mulai' => 'sometimes|date_format:H:i',
            'jam_selesai' => 'sometimes|date_format:H:i',
            'pola' => 'sometimes|in:setiap_minggu,minggu_ganjil,minggu_genap,minggu_ke_1,minggu_ke_2,minggu_ke_3,minggu_ke_4',
            'ruang' => 'nullable|string',
            'pembina_id' => 'nullable|exists:users,id',
        ]);
        $jadwal->update($validated);
        return response()->json(['message' => 'Jadwal berhasil diupdate', 'data' => $jadwal->load('pembina:id,name,nip_nisn')]);
    }

    public function destroyJadwal($ekskulId, $jadwalId)
    {
        $jadwal = JadwalEkskul::where('ekskul_id', $ekskulId)->findOrFail($jadwalId);
        $jadwal->delete();
        return response()->json(['message' => 'Jadwal berhasil dihapus']);
    }
}
