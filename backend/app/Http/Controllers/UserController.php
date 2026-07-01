<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('role') && $request->role !== 'semua') {
            if ($request->role === 'guru') {
                $query->whereIn('role', ['guru', 'walikelas', 'kepala_sekolah', 'kurikulum']);
            } elseif ($request->role === 'admin') {
                $query->whereIn('role', ['admin', 'superadmin', 'bendahara']);
            } else {
                $query->where('role', $request->role);
            }
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nip_nisn', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:superadmin,guru,walikelas,kepala_sekolah,kurikulum,bendahara,siswa,admin,orang_tua',
            'nip_nisn' => 'nullable|string|unique:users',
            'uid_rfid' => 'nullable|string|unique:users',
            'kelas' => 'nullable|string',
            'jabatan' => 'nullable|string',
            'phone' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        // Handle student class history (Kenaikan Kelas / Riwayat Kelas)
        if ($user->role === 'siswa' && $user->kelas) {
            $config = \App\Models\SistemKonfigurasi::first();
            $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';
            
            $kelasObj = \App\Models\Kelas::where('nama', $user->kelas)->first();
            if ($kelasObj) {
                \App\Models\RiwayatKelas::updateOrCreate(
                    [
                        'siswa_id' => $user->id,
                        'tahun_ajaran' => $tahunAjaran,
                    ],
                    [
                        'kelas_id' => $kelasObj->id,
                        'status' => 'aktif',
                    ]
                );
            }
        }

        return response()->json([
            'message' => 'User berhasil dibuat',
            'user' => $user,
        ], 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => [
                'required',
                'string',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:6',
            'role' => 'required|string|in:superadmin,guru,walikelas,kepala_sekolah,kurikulum,bendahara,siswa,admin,orang_tua',
            'nip_nisn' => [
                'nullable',
                'string',
                Rule::unique('users')->ignore($user->id),
            ],
            'uid_rfid' => [
                'nullable',
                'string',
                Rule::unique('users')->ignore($user->id),
            ],
            'kelas' => 'nullable|string',
            'jabatan' => 'nullable|string',
            'phone' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['password']) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        // Handle student class history (Kenaikan Kelas / Riwayat Kelas)
        if ($user->role === 'siswa' && $user->kelas) {
            $config = \App\Models\SistemKonfigurasi::first();
            $tahunAjaran = $config ? $config->tahun_ajaran_aktif : '2025/2026';
            
            $kelasObj = \App\Models\Kelas::where('nama', $user->kelas)->first();
            if ($kelasObj) {
                \App\Models\RiwayatKelas::updateOrCreate(
                    [
                        'siswa_id' => $user->id,
                        'tahun_ajaran' => $tahunAjaran,
                    ],
                    [
                        'kelas_id' => $kelasObj->id,
                        'status' => 'aktif',
                    ]
                );
            }
        }

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'user' => $user,
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'User berhasil dihapus',
        ]);
    }

    // Export PDF
    public function exportPdf(Request $request)
    {
        $query = User::query();

        if ($request->has('role') && $request->role !== 'semua') {
            if ($request->role === 'guru') {
                $query->whereIn('role', ['guru', 'walikelas', 'kepala_sekolah', 'kurikulum']);
            } elseif ($request->role === 'admin') {
                $query->whereIn('role', ['admin', 'superadmin', 'bendahara']);
            } else {
                $query->where('role', $request->role);
            }
        }

        $users = $query->orderBy('name')->get();

        $pdf = Pdf::loadView('exports.users', compact('users'));
        return $pdf->download('daftar_pengguna.pdf');
    }

    // Export XLSX
    public function exportXlsx(Request $request)
    {
        $query = User::query();

        if ($request->has('role') && $request->role !== 'semua') {
            if ($request->role === 'guru') {
                $query->whereIn('role', ['guru', 'walikelas', 'kepala_sekolah', 'kurikulum']);
            } elseif ($request->role === 'admin') {
                $query->whereIn('role', ['admin', 'superadmin', 'bendahara']);
            } else {
                $query->where('role', $request->role);
            }
        }

        $users = $query->orderBy('name')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Daftar Pengguna');

        // Set Headers: Added Username
        $headers = ['No', 'Nama Lengkap', 'Username', 'Email', 'NIP / NISN', 'Peran (Role)', 'Info Tambahan'];
        foreach ($headers as $colIndex => $header) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex + 1);
            $sheet->setCellValue($colLetter . '1', $header);
            $sheet->getStyle($colLetter . '1')->getFont()->setBold(true);
        }

        // Fill Data
        foreach ($users as $rowIndex => $user) {
            $rowNum = $rowIndex + 2;
            $sheet->setCellValue('A' . $rowNum, $rowIndex + 1);
            $sheet->setCellValue('B' . $rowNum, $user->name);
            $sheet->setCellValue('C' . $rowNum, $user->username);
            $sheet->setCellValue('D' . $rowNum, $user->email);
            $sheet->setCellValue('E' . $rowNum, $user->nip_nisn ?: '—');
            $sheet->setCellValue('F' . $rowNum, strtoupper($user->role));
            $sheet->setCellValue('G' . $rowNum, $user->kelas ? 'Kelas ' . $user->kelas : ($user->jabatan ?: '—'));
        }

        // Auto-fit Column Widths
        foreach (range(1, count($headers)) as $colIndex) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex);
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        $fileName = 'daftar_pengguna_' . date('Y-m-d_H-i-s') . '.xlsx';
        
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

            // Map: B = Nama, C = Username, D = Email, E = NIP/NISN, F = Role, G = Info
            $name = $row['B'];
            $username = $row['C'] ?: 'user_' . uniqid();
            $email = $row['D'] ?: $username . '@smasmuh1.sch.id';
            $nip_nisn = $row['E'] ?: null;
            $rawRole = strtolower($row['F'] ?: 'siswa');
            $info = $row['G'] ?: null;

            if (!$name) continue;

            // Resolve role
            $role = 'siswa';
            if (str_contains($rawRole, 'guru')) $role = 'guru';
            elseif (str_contains($rawRole, 'wali')) $role = 'walikelas';
            elseif (str_contains($rawRole, 'kepsek')) $role = 'kepala_sekolah';
            elseif (str_contains($rawRole, 'kuri')) $role = 'kurikulum';
            elseif (str_contains($rawRole, 'benda')) $role = 'bendahara';
            elseif (str_contains($rawRole, 'super')) $role = 'superadmin';
            elseif (str_contains($rawRole, 'admin')) $role = 'admin';

            // Check if username or email already exists
            if (User::where('username', $username)->orWhere('email', $email)->exists()) {
                continue;
            }

            User::create([
                'name' => $name,
                'username' => $username,
                'email' => $email,
                'password' => Hash::make('1234'), // default password: 1234
                'role' => $role,
                'nip_nisn' => $nip_nisn,
                'kelas' => $role === 'siswa' ? $info : null,
                'jabatan' => $role !== 'siswa' ? $info : null,
                'is_active' => true,
            ]);

            $importedCount++;
        }

        return response()->json([
            'message' => "Berhasil mengimpor {$importedCount} pengguna baru.",
            'imported_count' => $importedCount,
        ]);
    }
}
