<?php

namespace App\Http\Controllers;

use App\Models\Mapel;
use App\Models\Penugasan;
use App\Models\SistemKonfigurasi;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

class MapelController extends Controller
{
    public function index(Request $request)
    {
        $query = Mapel::query();

        // Guru/wali hanya boleh melihat mapel yang benar-benar ditugaskan.
        $user = $request->user();
        if ($user?->shouldScopeAsGuru()) {
            $tahun = optional(SistemKonfigurasi::first())->tahun_ajaran_aktif ?: '2025/2026';
            $mapelIds = Penugasan::where('guru_id', $user->id)
                ->where('tahun_ajaran', $tahun)
                ->pluck('mapel_id');
            $query->whereIn('id', $mapelIds);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('kode', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('nama')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|max:50|unique:mapels',
            'kkm' => 'required|integer|min:0|max:100',
            'tingkat' => 'required|string|max:10',
        ]);

        $mapel = Mapel::create($validated);

        return response()->json([
            'message' => 'Mata pelajaran berhasil dibuat',
            'mapel' => $mapel,
        ], 201);
    }

    public function show($id)
    {
        $mapel = Mapel::findOrFail($id);
        $this->ensureGuruMapelAccess(request()->user(), $mapel->id);
        return response()->json($mapel);
    }

    private function ensureGuruMapelAccess($user, int $mapelId): void
    {
        if (!$user?->shouldScopeAsGuru()) {
            return;
        }

        $tahun = optional(SistemKonfigurasi::first())->tahun_ajaran_aktif ?: '2025/2026';
        $allowed = Penugasan::where('guru_id', $user->id)
            ->where('mapel_id', $mapelId)
            ->where('tahun_ajaran', $tahun)
            ->exists();
        abort_unless($allowed, 403, 'Anda tidak ditugaskan mengajar mata pelajaran ini pada tahun ajaran aktif.');
    }

    public function update(Request $request, $id)
    {
        $mapel = Mapel::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => [
                'required',
                'string',
                'max:50',
                Rule::unique('mapels')->ignore($mapel->id),
            ],
            'kkm' => 'required|integer|min:0|max:100',
            'tingkat' => 'required|string|max:10',
        ]);

        $mapel->update($validated);

        return response()->json([
            'message' => 'Mata pelajaran berhasil diperbarui',
            'mapel' => $mapel,
        ]);
    }

    public function destroy($id)
    {
        $mapel = Mapel::findOrFail($id);
        $mapel->delete();

        return response()->json([
            'message' => 'Mata pelajaran berhasil dihapus',
        ]);
    }

    // Export PDF
    public function exportPdf()
    {
        $mapels = Mapel::orderBy('nama')->get();
        $pdf = Pdf::loadView('exports.mapels', compact('mapels'));
        return $pdf->download('daftar_mapel.pdf');
    }

    // Export XLSX
    public function exportXlsx()
    {
        $mapels = Mapel::orderBy('nama')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Daftar Mapel');

        // Set Headers
        $headers = ['No', 'Nama Mata Pelajaran', 'Kode Mapel', 'KKM', 'Tingkat'];
        foreach ($headers as $colIndex => $header) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex + 1);
            $sheet->setCellValue($colLetter . '1', $header);
            $sheet->getStyle($colLetter . '1')->getFont()->setBold(true);
        }

        // Fill Data
        foreach ($mapels as $rowIndex => $m) {
            $rowNum = $rowIndex + 2;
            $sheet->setCellValue('A' . $rowNum, $rowIndex + 1);
            $sheet->setCellValue('B' . $rowNum, $m->nama);
            $sheet->setCellValue('C' . $rowNum, $m->kode);
            $sheet->setCellValue('D' . $rowNum, $m->kkm);
            $sheet->setCellValue('E' . $rowNum, $m->tingkat);
        }

        // Auto-fit Column Widths
        foreach (range(1, count($headers)) as $colIndex) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        $fileName = 'daftar_mapel_' . date('Y-m-d_H-i-s') . '.xlsx';
        
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

            // Map: B = Nama, C = Kode, D = KKM, E = Tingkat
            $nama = $row['B'];
            $kode = $row['C'];
            $kkm = intval($row['D'] ?: 75);
            $tingkat = $row['E'];

            if (!$nama || !$kode || !$tingkat) continue;

            // Skip if subject code already exists
            if (Mapel::where('kode', $kode)->exists()) {
                continue;
            }

            Mapel::create([
                'nama' => $nama,
                'kode' => $kode,
                'kkm' => $kkm,
                'tingkat' => $tingkat,
            ]);

            $importedCount++;
        }

        return response()->json([
            'message' => "Berhasil mengimpor {$importedCount} mata pelajaran baru.",
            'imported_count' => $importedCount,
        ]);
    }
}
