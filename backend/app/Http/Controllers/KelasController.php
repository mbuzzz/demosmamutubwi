<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

class KelasController extends Controller
{
    public function index(Request $request)
    {
        $query = Kelas::with('waliKelas');

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('nama', 'like', "%{$search}%");
        }

        return response()->json($query->orderBy('nama')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255|unique:kelas',
            'tingkat' => 'required|string|max:10',
            'wali_kelas_id' => 'nullable|exists:users,id',
        ]);

        $kelas = Kelas::create($validated);

        // Sync walikelas role and structural assignment
        \App\Services\WaliKelasSyncService::syncKelas($kelas);

        return response()->json([
            'message' => 'Kelas berhasil dibuat',
            'kelas' => $kelas->load('waliKelas'),
        ], 201);
    }

    public function show($id)
    {
        $kelas = Kelas::with('waliKelas')->findOrFail($id);
        return response()->json($kelas);
    }

    public function update(Request $request, $id)
    {
        $kelas = Kelas::findOrFail($id);

        $validated = $request->validate([
            'nama' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kelas')->ignore($kelas->id),
            ],
            'tingkat' => 'required|string|max:10',
            'wali_kelas_id' => 'nullable|exists:users,id',
        ]);

        $oldWaliId = $kelas->wali_kelas_id;
        $kelas->update($validated);

        // Sync walikelas role and structural assignment
        \App\Services\WaliKelasSyncService::syncKelas($kelas, $oldWaliId);

        return response()->json([
            'message' => 'Kelas berhasil diperbarui',
            'kelas' => $kelas->load('waliKelas'),
        ]);
    }

    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);

        // Sync before deletion to revert roles/assignments
        \App\Services\WaliKelasSyncService::syncKelasDelete($kelas);

        $kelas->delete();

        return response()->json([
            'message' => 'Kelas berhasil dihapus',
        ]);
    }

    // Export PDF
    public function exportPdf()
    {
        $kelas = Kelas::with('waliKelas')->orderBy('nama')->get();
        $pdf = Pdf::loadView('exports.kelas', compact('kelas'));
        return $pdf->download('daftar_kelas.pdf');
    }

    // Export XLSX
    public function exportXlsx()
    {
        $kelas = Kelas::with('waliKelas')->orderBy('nama')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Daftar Kelas');

        // Set Headers
        $headers = ['No', 'Nama Kelas', 'Tingkat', 'Wali Kelas'];
        foreach ($headers as $colIndex => $header) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex + 1);
            $sheet->setCellValue($colLetter . '1', $header);
            $sheet->getStyle($colLetter . '1')->getFont()->setBold(true);
        }

        // Fill Data
        foreach ($kelas as $rowIndex => $k) {
            $rowNum = $rowIndex + 2;
            $sheet->setCellValue('A' . $rowNum, $rowIndex + 1);
            $sheet->setCellValue('B' . $rowNum, $k->nama);
            $sheet->setCellValue('C' . $rowNum, $k->tingkat);
            $sheet->setCellValue('D' . $rowNum, $k->waliKelas ? $k->waliKelas->name : 'Belum Ditentukan');
        }

        // Auto-fit Column Widths
        foreach (range(1, count($headers)) as $colIndex) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        $fileName = 'daftar_kelas_' . date('Y-m-d_H-i-s') . '.xlsx';
        
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

            // Map: B = Nama Kelas, C = Tingkat, D = Wali Kelas Email (opsional)
            $nama = $row['B'];
            $tingkat = $row['C'];
            $waliEmail = $row['D'] ?: null;

            if (!$nama || !$tingkat) continue;

            // Find Wali Kelas
            $waliKelasId = null;
            if ($waliEmail) {
                $wali = User::where('email', $waliEmail)->first();
                if ($wali) {
                    $waliKelasId = $wali->id;
                }
            }

            // Skip if class name already exists
            if (Kelas::where('nama', $nama)->exists()) {
                continue;
            }

            Kelas::create([
                'nama' => $nama,
                'tingkat' => $tingkat,
                'wali_kelas_id' => $waliKelasId,
            ]);

            $importedCount++;
        }

        return response()->json([
            'message' => "Berhasil mengimpor {$importedCount} kelas baru.",
            'imported_count' => $importedCount,
        ]);
    }
}
