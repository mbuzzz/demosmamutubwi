<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\KartuRfid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\IOFactory;

class UserController extends Controller
{
    /**
     * Filter user berdasarkan role utama ATAU multi-role JSON.
     */
    private function applyRoleFilter($query, string $role)
    {
        if ($role === 'semua' || $role === '') {
            return $query;
        }

        if ($role === 'guru') {
            $targets = ['guru', 'walikelas', 'kepala_sekolah', 'kurikulum'];
        } elseif ($role === 'admin') {
            $targets = ['admin', 'superadmin', 'bendahara'];
        } else {
            $targets = [$role];
        }

        return $query->where(function ($q) use ($targets) {
            $q->whereIn('role', $targets);
            foreach ($targets as $target) {
                $q->orWhereJsonContains('roles', $target);
            }
        });
    }

    private function syncSiswaRiwayat(User $user): void
    {
        if (!$user->isSiswa() || !$user->kelas) {
            return;
        }

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

    public function publicDirectory()
    {
        // Multi-role: guru bisa punya role utama lain tapi tetap staf pengajar
        $gurus = User::query()
            ->where(function ($q) {
                $targets = ['guru', 'walikelas', 'kepala_sekolah', 'kurikulum'];
                $q->whereIn('role', $targets);
                foreach ($targets as $target) {
                    $q->orWhereJsonContains('roles', $target);
                }
            })
            ->with(['penugasans.mapel', 'penugasans.kelas'])
            ->get();

        $result = $gurus->map(function ($guru) {
            $mapels = $guru->penugasans->map(fn ($p) => $p->mapel?->nama)->filter()->unique()->values()->implode(', ');
            return [
                'id' => $guru->id,
                'name' => $guru->name,
                'email' => $guru->email,
                'jabatan' => $guru->jabatan,
                'foto' => $guru->foto,
                'subject' => $mapels ?: ($guru->jabatan ?: 'Tenaga Pendidik'),
                'mapels' => $guru->penugasans->map(fn ($p) => $p->mapel?->nama)->filter()->unique()->values(),
                'roles' => $guru->all_roles,
            ];
        });

        return response()->json($result);
    }

    /**
     * Sinkronkan uid_rfid user ke tabel kartu_rfids.
     * Jika uid_rfid diisi → buat/update kartu aktif.
     * Jika uid_rfid dihapus/dikosongkan → nonaktifkan kartu lama.
     */
    private function syncRfidCard(User $user, ?string $uidRfid): void
    {
        // Nonaktifkan kartu lama untuk user ini
        KartuRfid::where('siswa_id', $user->id)->orWhere('user_id', $user->id)
            ->update(['status' => 'nonaktif']);

        if (!$uidRfid) return;

        // Tentukan kolom relasi: siswa → siswa_id, staf/guru → user_id
        $isSiswa = $user->isSiswa();
        $data = [
            'uid'    => $uidRfid,
            'status' => 'aktif',
        ];
        if ($isSiswa) {
            $data['siswa_id'] = $user->id;
            $data['user_id'] = null;
        } else {
            $data['user_id'] = $user->id;
            $data['siswa_id'] = null;
        }

        // Update kartu yang sudah ada dengan UID ini, atau buat baru
        KartuRfid::updateOrCreate(
            ['uid' => $uidRfid],
            $data
        );
    }

    public function index(Request $request)
    {
        $query = User::query()->with(['penugasans.mapel', 'penugasans.kelas']);

        // Guru/wali hanya boleh membaca siswa dari kelas yang diampu/diwalikan.
        // Ini diperlukan oleh halaman absensi, jurnal, nilai, dan wali siswa.
        if ($request->user()?->shouldScopeByKelas()) {
            $allowedKelas = $request->user()->accessibleKelasNames();
            $query->where('role', 'siswa');
            if (empty($allowedKelas)) {
                $query->whereRaw('1 = 0');
            } else {
                $query->whereIn('kelas', $allowedKelas);
            }
        }

        if ($request->has('role') && $request->role !== 'semua') {
            $this->applyRoleFilter($query, $request->role);
        }

        if ($request->has('kelas') && $request->kelas) {
            $query->where('kelas', $request->kelas);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nip_nisn', 'like', "%{$search}%")
                  ->orWhere('uid_rfid', 'like', "%{$search}%");
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
            'roles' => 'nullable|array',
            'roles.*' => 'string|in:superadmin,guru,walikelas,kepala_sekolah,kurikulum,bendahara,admin',
            'nip_nisn' => 'nullable|string|unique:users',
            'uid_rfid' => 'nullable|string|unique:users',
            'kelas' => 'nullable|string',
            'jabatan' => 'nullable|string',
            'phone' => 'nullable|string',
            'alamat' => 'nullable|string',
            'is_active' => 'boolean',
            'siswa_id' => 'nullable|exists:users,id',
            'foto' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        $validated = User::normalizeRolesPayload($validated);
        $validated['password'] = Hash::make($validated['password']);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('fotos', 'public');
        }

        $user = User::create($validated);

        $this->syncSiswaRiwayat($user);
        $this->syncRfidCard($user, $user->uid_rfid);

        $user->load(['penugasans.mapel', 'penugasans.kelas']);

        return response()->json([
            'message' => 'User berhasil dibuat',
            'user' => $user,
        ], 201);
    }

    public function show($id)
    {
        $user = User::with(['penugasans.mapel', 'penugasans.kelas', 'siswa'])->findOrFail($id);
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
            'roles' => 'nullable|array',
            'roles.*' => 'string|in:superadmin,guru,walikelas,kepala_sekolah,kurikulum,bendahara,admin',
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
            'alamat' => 'nullable|string',
            'is_active' => 'boolean',
            'siswa_id' => 'nullable|exists:users,id',
            'foto' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);

        $validated = User::normalizeRolesPayload($validated);

        if ($request->hasFile('foto')) {
            if ($user->foto && Storage::disk('public')->exists($user->foto)) {
                Storage::disk('public')->delete($user->foto);
            }
            $validated['foto'] = $request->file('foto')->store('fotos', 'public');
        }

        if (isset($validated['password']) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);
        $this->syncSiswaRiwayat($user->fresh());
        $this->syncRfidCard($user->fresh(), $user->uid_rfid);

        $user->load(['penugasans.mapel', 'penugasans.kelas', 'siswa']);

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'user' => $user,
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Nonaktifkan kartu RFID terkait
        KartuRfid::where('siswa_id', $user->id)->orWhere('user_id', $user->id)
            ->update(['status' => 'nonaktif']);
        
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
            $this->applyRoleFilter($query, $request->role);
        }

        $users = $query->orderBy('name')->get();

        $pdf = Pdf::loadView('exports.users', compact('users'));
        return $pdf->download('daftar_pengguna.pdf');
    }

    // Export XLSX
    public function exportXlsx(Request $request)
    {
        $query = User::query()->with(['penugasans.mapel']);

        if ($request->has('role') && $request->role !== 'semua') {
            $this->applyRoleFilter($query, $request->role);
        }

        $users = $query->orderBy('name')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Daftar Pengguna');

        // Set Headers: Added Username + multi-role
        $headers = ['No', 'Nama Lengkap', 'Username', 'Email', 'NIP / NISN', 'Peran Utama', 'Multi-Role', 'Info / Mapel'];
        foreach ($headers as $colIndex => $header) {
            $colLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($colIndex + 1);
            $sheet->setCellValue($colLetter . '1', $header);
            $sheet->getStyle($colLetter . '1')->getFont()->setBold(true);
        }

        // Fill Data
        foreach ($users as $rowIndex => $user) {
            $rowNum = $rowIndex + 2;
            $mapels = $user->penugasans
                ? $user->penugasans->map(fn ($p) => $p->mapel?->nama)->filter()->unique()->implode(', ')
                : '';
            $info = $user->kelas
                ? 'Kelas ' . $user->kelas
                : ($mapels ?: ($user->jabatan ?: '—'));

            $sheet->setCellValue('A' . $rowNum, $rowIndex + 1);
            $sheet->setCellValue('B' . $rowNum, $user->name);
            $sheet->setCellValue('C' . $rowNum, $user->username);
            $sheet->setCellValue('D' . $rowNum, $user->email);
            $sheet->setCellValue('E' . $rowNum, $user->nip_nisn ?: '—');
            $sheet->setCellValue('F' . $rowNum, strtoupper($user->role));
            $sheet->setCellValue('G' . $rowNum, implode(', ', array_map('strtoupper', $user->all_roles)));
            $sheet->setCellValue('H' . $rowNum, $info);
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

    /**
     * Daftar pengguna untuk cetak ID Card.
     * ?role=siswa → siswa; ?role=guru → staf/guru; ?q= untuk pencarian.
     */
    public function indexIdCard(Request $request)
    {
        $request->validate([
            'role' => ['nullable', 'in:siswa,guru'],
            'q' => ['nullable', 'string', 'max:100'],
        ]);

        $query = User::query()->where('is_active', true);

        if ($request->input('role', 'siswa') === 'siswa') {
            $query->where('role', 'siswa');
        } else {
            $query->where(function ($q) {
                $targets = ['guru', 'walikelas', 'kepala_sekolah', 'kurikulum', 'bendahara'];
                $q->whereIn('role', $targets);
                foreach ($targets as $target) {
                    $q->orWhereJsonContains('roles', $target);
                }
            });
        }

        if ($q = $request->input('q')) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('nip_nisn', 'like', "%{$q}%")
                    ->orWhere('kelas', 'like', "%{$q}%")
                    ->orWhere('jabatan', 'like', "%{$q}%");
            });
        }

        $users = $query->orderBy('name')->get();

        $result = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role,
                'roles' => $user->all_roles,
                'nip_nisn' => $user->nip_nisn,
                'kelas' => $user->kelas,
                'jabatan' => $user->jabatan,
                'phone' => $user->phone,
                'alamat' => $user->alamat,
                'foto' => $user->foto,
            ];
        });

        return response()->json($result);
    }
}
