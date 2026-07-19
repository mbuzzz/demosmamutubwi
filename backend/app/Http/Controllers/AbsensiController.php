<?php

namespace App\Http\Controllers;

use App\Models\Absensi;
use App\Models\AbsensiGuru;
use App\Models\KartuRfid;
use App\Models\KonfigurasiAbsensi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $query = Absensi::with(['user', 'admin']);

        // Date filter: tanggal (single) OR start_date/end_date range
        $tanggal = $request->query('tanggal');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        if ($tanggal) {
            $query->whereDate('tanggal', $tanggal);
        } elseif ($startDate || $endDate) {
            if ($startDate) {
                $query->whereDate('tanggal', '>=', $startDate);
            }
            if ($endDate) {
                $query->whereDate('tanggal', '<=', $endDate);
            }
        } else {
            $query->whereDate('tanggal', Carbon::today()->toDateString());
        }

        $user = $request->user();
        if ($user) {
            if ($user->isSiswa()) {
                $query->where('siswa_id', $user->id);
            } elseif ($user->isOrangTua()) {
                $query->where('siswa_id', $user->siswa_id);
            } else {
                // Filter by class name (users.kelas is a string column)
                $kelas = $request->query('kelas') ?: $request->query('kelas_id');
                $kelasName = null;
                if ($kelas) {
                    if (is_numeric($kelas)) {
                        $kelasModel = \App\Models\Kelas::find($kelas);
                        $kelasName = $kelasModel?->nama;
                    } else {
                        $kelasName = $kelas;
                    }
                }

                // Multi-role: guru/wali hanya absensi kelas penugasan/binaan
                if ($user->shouldScopeByKelas()) {
                    $allowed = $user->accessibleKelasNames();
                    if (empty($allowed)) {
                        $query->whereRaw('1 = 0');
                    } elseif ($kelasName) {
                        $user->ensureAccessToKelasName($kelasName);
                        $query->whereHas('user', function ($q) use ($kelasName) {
                            $q->where('kelas', $kelasName);
                        });
                    } else {
                        $query->whereHas('user', function ($q) use ($allowed) {
                            $q->whereIn('kelas', $allowed);
                        });
                    }
                } elseif ($kelasName) {
                    $query->whereHas('user', function ($q) use ($kelasName) {
                        $q->where('kelas', $kelasName);
                    });
                }

                $role = $request->query('role');
                if ($role === 'siswa') {
                    $query->whereHas('user', function ($q) {
                        $q->where('role', 'siswa');
                    });
                }

                $search = $request->query('search');
                if ($search) {
                    $query->whereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('nip_nisn', 'like', "%{$search}%")
                            ->orWhere('kelas', 'like', "%{$search}%");
                    });
                }
            }
        }

        $absensi = $query->orderByDesc('tanggal')->orderBy('jam_masuk')->get();

        return response()->json($absensi);
    }

    public function rekap(Request $request)
    {
        $bulan = (int) $request->query('bulan', Carbon::now()->month);
        $tahun = (int) $request->query('tahun', Carbon::now()->year);
        $kelasFilter = $request->query('kelas') ?: $request->query('kelas_id');

        // Use single quotes for string literals (PostgreSQL-safe)
        $rows = Absensi::query()
            ->select(
                'siswa_id',
                DB::raw("COUNT(CASE WHEN status_masuk = 'hadir' THEN 1 END) as hadir"),
                DB::raw("COUNT(CASE WHEN status_masuk = 'sakit' THEN 1 END) as sakit"),
                DB::raw("COUNT(CASE WHEN status_masuk = 'izin' THEN 1 END) as izin"),
                DB::raw("COUNT(CASE WHEN status_masuk = 'alpha' THEN 1 END) as alpha"),
                DB::raw("COUNT(CASE WHEN status_masuk = 'terlambat' THEN 1 END) as terlambat")
            )
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->groupBy('siswa_id')
            ->get();

        $siswaIds = $rows->pluck('siswa_id')->filter()->unique()->values();
        $users = User::whereIn('id', $siswaIds)->get()->keyBy('id');

        $result = $rows->map(function ($row) use ($users) {
            $u = $users->get($row->siswa_id);
            return [
                'user_id' => (int) $row->siswa_id,
                'siswa_id' => (int) $row->siswa_id,
                'name' => $u?->name ?? '—',
                'nip_nisn' => $u?->nip_nisn ?? '',
                'kelas' => $u?->kelas ?? null,
                'total_hadir' => (int) $row->hadir,
                'total_izin' => (int) $row->izin,
                'total_sakit' => (int) $row->sakit,
                'total_alpha' => (int) $row->alpha,
                'total_terlambat' => (int) $row->terlambat,
            ];
        });

        $authUser = $request->user();

        if ($kelasFilter) {
            $kelasName = $kelasFilter;
            if (is_numeric($kelasFilter)) {
                $kelasModel = \App\Models\Kelas::find($kelasFilter);
                $kelasName = $kelasModel?->nama;
            }
            if ($kelasName) {
                if ($authUser && $authUser->shouldScopeByKelas()) {
                    $authUser->ensureAccessToKelasName($kelasName);
                }
                $result = $result->filter(fn ($r) => $r['kelas'] === $kelasName)->values();
            }
        } elseif ($authUser && $authUser->shouldScopeByKelas()) {
            $allowed = $authUser->accessibleKelasNames();
            $result = empty($allowed)
                ? collect()
                : $result->filter(fn ($r) => in_array($r['kelas'], $allowed, true))->values();
        }

        $role = $request->query('role');
        if ($role === 'siswa') {
            // already only siswa_id from absensi; optionally drop non-siswa
            $result = $result->filter(function ($r) use ($users) {
                $u = $users->get($r['user_id']);
                return $u && $u->isSiswa();
            })->values();
        }

        return response()->json($result->values());
    }

    public function rekapSiswa($id)
    {
        $user = auth()->user();
        if ($user) {
            if ($user->isSiswa() && $user->id != $id) {
                abort(403, 'Unauthorized');
            }
            if ($user->isOrangTua() && $user->siswa_id != $id) {
                abort(403, 'Unauthorized');
            }
        }

        $absensi = Absensi::where('siswa_id', $id)->get();
        $siswa = User::find($id);

        return response()->json([
            'user_id' => (int) $id,
            'siswa_id' => (int) $id,
            'name' => $siswa?->name ?? '—',
            'nip_nisn' => $siswa?->nip_nisn ?? '',
            'kelas' => $siswa?->kelas,
            'total_hadir' => $absensi->where('status_masuk', 'hadir')->count(),
            'total_izin' => $absensi->where('status_masuk', 'izin')->count(),
            'total_sakit' => $absensi->where('status_masuk', 'sakit')->count(),
            'total_alpha' => $absensi->where('status_masuk', 'alpha')->count(),
            'total_terlambat' => $absensi->where('status_masuk', 'terlambat')->count(),
        ]);
    }

    public function store(Request $request)
    {
        // Normalize frontend aliases → backend columns
        $payload = $request->all();
        if (!empty($payload['user_id']) && empty($payload['siswa_id'])) {
            $payload['siswa_id'] = $payload['user_id'];
        }
        if (!empty($payload['tipe']) && empty($payload['status_masuk'])) {
            $payload['status_masuk'] = $payload['tipe'];
        }
        if (!empty($payload['waktu_masuk']) && empty($payload['jam_masuk'])) {
            $payload['jam_masuk'] = $this->normalizeTime($payload['waktu_masuk']);
        }
        if (!empty($payload['waktu_pulang']) && empty($payload['jam_pulang'])) {
            $payload['jam_pulang'] = $this->normalizeTime($payload['waktu_pulang']);
        }
        if (!empty($payload['keterangan']) && empty($payload['catatan'])) {
            $payload['catatan'] = $payload['keterangan'];
        }
        if (empty($payload['metode'])) {
            $payload['metode'] = 'manual';
        }

        $request->merge($payload);

        $validated = $request->validate([
            'siswa_id' => 'required|exists:users,id',
            'tanggal' => 'required|date',
            'jam_masuk' => 'nullable|date_format:H:i,H:i:s',
            'jam_pulang' => 'nullable|date_format:H:i,H:i:s',
            'status_masuk' => 'required|in:hadir,izin,sakit,alpha,terlambat',
            'status_pulang' => 'nullable|in:hadir,pulang_awal,alpha',
            'metode' => 'required|in:manual,rfid',
            'catatan' => 'nullable|string',
        ]);

        if (!empty($validated['jam_masuk']) && strlen($validated['jam_masuk']) === 5) {
            $validated['jam_masuk'] .= ':00';
        }
        if (!empty($validated['jam_pulang']) && strlen($validated['jam_pulang']) === 5) {
            $validated['jam_pulang'] .= ':00';
        }

        $actor = $request->user();
        if ($actor) {
            $actor->ensureAccessToSiswaId((int) $validated['siswa_id']);
        }

        $validated['created_by'] = $actor?->id;

        // Upsert per siswa + tanggal (hindari duplikat)
        $absensi = Absensi::updateOrCreate(
            [
                'siswa_id' => $validated['siswa_id'],
                'tanggal' => $validated['tanggal'],
            ],
            $validated
        );

        return response()->json($absensi->load('user'), $absensi->wasRecentlyCreated ? 201 : 200);
    }

    public function update(Request $request, $id)
    {
        $absensi = Absensi::findOrFail($id);
        $actor = $request->user();
        if ($actor && $absensi->siswa_id) {
            $actor->ensureAccessToSiswaId((int) $absensi->siswa_id);
        }

        $payload = $request->all();
        if (!empty($payload['tipe']) && empty($payload['status_masuk'])) {
            $payload['status_masuk'] = $payload['tipe'];
        }
        if (!empty($payload['waktu_masuk']) && empty($payload['jam_masuk'])) {
            $payload['jam_masuk'] = $this->normalizeTime($payload['waktu_masuk']);
        }
        if (!empty($payload['waktu_pulang']) && empty($payload['jam_pulang'])) {
            $payload['jam_pulang'] = $this->normalizeTime($payload['waktu_pulang']);
        }
        if (!empty($payload['keterangan']) && empty($payload['catatan'])) {
            $payload['catatan'] = $payload['keterangan'];
        }
        $request->merge($payload);

        $validated = $request->validate([
            'jam_masuk' => 'nullable|date_format:H:i,H:i:s',
            'jam_pulang' => 'nullable|date_format:H:i,H:i:s',
            'status_masuk' => 'nullable|in:hadir,izin,sakit,alpha,terlambat',
            'status_pulang' => 'nullable|in:hadir,pulang_awal,alpha',
            'catatan' => 'nullable|string',
        ]);

        if (!empty($validated['jam_masuk']) && strlen($validated['jam_masuk']) === 5) {
            $validated['jam_masuk'] .= ':00';
        }
        if (!empty($validated['jam_pulang']) && strlen($validated['jam_pulang']) === 5) {
            $validated['jam_pulang'] .= ':00';
        }

        $absensi->update($validated);

        return response()->json($absensi->load('user'));
    }

    public function tap(Request $request)
    {
        if ($request->has('uid_rfid')) {
            $request->merge(['uid' => $request->uid_rfid]);
        }

        $validated = $request->validate([
            'uid' => 'required|string',
        ]);

        $kartu = KartuRfid::where('uid', $validated['uid'])->first();

        if (!$kartu) {
            return response()->json(['message' => 'Kartu tidak terdaftar'], 404);
        }

        if ($kartu->status !== 'aktif') {
            return response()->json(['message' => 'Kartu tidak aktif'], 403);
        }

        $config = KonfigurasiAbsensi::first();
        if (!$config) {
            return response()->json(['message' => 'Konfigurasi absensi belum diatur'], 500);
        }

        // Resolve: apakah kartu milik guru (user_id) atau siswa (siswa_id)?
        $isGuru = !is_null($kartu->user_id);
        $ownerId = $isGuru ? $kartu->user_id : $kartu->siswa_id;

        // Load user info
        $kartu->load('user');

        $now = Carbon::now();
        $tanggalHariIni = $now->toDateString();
        $jamSekarang = $now->format('H:i:s');

        if ($isGuru) {
            // ── GURU / STAFF absensi ──────────────────────────────────────────
            $absensiHariIni = AbsensiGuru::where('user_id', $ownerId)
                ->where('tanggal', $tanggalHariIni)
                ->first();

            if (!$absensiHariIni) {
                $statusMasuk = 'hadir';
                $toleransiTerlambat = Carbon::createFromFormat('H:i:s', $config->jam_masuk)
                    ->addMinutes((int) $config->toleransi_terlambat);

                if ($now->format('H:i:s') > $config->batas_alpha) {
                    $statusMasuk = 'alpha';
                } elseif ($now->format('H:i:s') > $toleransiTerlambat->format('H:i:s')) {
                    $statusMasuk = 'terlambat';
                }

                AbsensiGuru::create([
                    'user_id'     => $ownerId,
                    'tanggal'     => $tanggalHariIni,
                    'jam_masuk'   => $jamSekarang,
                    'status_masuk'=> $statusMasuk,
                    'metode'      => 'rfid',
                    'uid_rfid'    => $kartu->uid,
                ]);

                return response()->json([
                    'message' => 'Absen masuk berhasil',
                    'status'  => $statusMasuk,
                    'tipe'    => 'guru',
                    'user'    => $kartu->user,
                    'jam'     => $jamSekarang,
                ]);
            }

            if ($absensiHariIni->jam_pulang) {
                return response()->json([
                    'message' => 'Sudah melakukan absen pulang hari ini',
                    'tipe'    => 'guru',
                    'user'    => $kartu->user,
                ], 400);
            }

            $statusPulang = $now->format('H:i:s') < $config->jam_pulang ? 'pulang_awal' : 'hadir';
            $absensiHariIni->update([
                'jam_pulang'   => $jamSekarang,
                'status_pulang'=> $statusPulang,
            ]);

            return response()->json([
                'message' => 'Absen pulang berhasil',
                'status'  => $statusPulang,
                'tipe'    => 'guru',
                'user'    => $kartu->user,
                'jam'     => $jamSekarang,
            ]);
        }

        // ── SISWA absensi (logic lama, tidak berubah) ─────────────────────────
        $absensiHariIni = Absensi::where('siswa_id', $ownerId)
            ->where('tanggal', $tanggalHariIni)
            ->first();

        if (!$absensiHariIni) {
            $statusMasuk = 'hadir';

            $toleransiTerlambat = Carbon::createFromFormat('H:i:s', $config->jam_masuk)
                ->addMinutes((int) $config->toleransi_terlambat);

            if ($now->format('H:i:s') > $config->batas_alpha) {
                $statusMasuk = 'alpha';
            } elseif ($now->format('H:i:s') > $toleransiTerlambat->format('H:i:s')) {
                $statusMasuk = 'terlambat';
            }

            Absensi::create([
                'siswa_id'    => $ownerId,
                'tanggal'     => $tanggalHariIni,
                'jam_masuk'   => $jamSekarang,
                'status_masuk'=> $statusMasuk,
                'metode'      => 'rfid',
                'uid_rfid'    => $kartu->uid,
            ]);

            return response()->json([
                'message' => 'Absen masuk berhasil',
                'status'  => $statusMasuk,
                'tipe'    => 'siswa',
                'user'    => $kartu->user,
                'jam'     => $jamSekarang,
            ]);
        }

        if ($absensiHariIni->jam_pulang) {
            return response()->json([
                'message' => 'Sudah melakukan absen pulang hari ini',
                'user'    => $kartu->user,
            ], 400);
        }

        $statusPulang = 'hadir';
        if ($now->format('H:i:s') < $config->jam_pulang) {
            $statusPulang = 'pulang_awal';
        }

        $absensiHariIni->update([
            'jam_pulang'   => $jamSekarang,
            'status_pulang'=> $statusPulang,
        ]);

        return response()->json([
            'message' => 'Absen pulang berhasil',
            'status'  => $statusPulang,
            'tipe'    => 'siswa',
            'user'    => $kartu->user,
            'jam'     => $jamSekarang,
        ]);
    }

    // ── GURU ATTENDANCE ENDPOINTS ──────────────────────────────────────────────

    /**
     * List absensi guru — harian atau rentang tanggal.
     */
    public function indexGuru(Request $request)
    {
        $query = AbsensiGuru::with('user');

        $tanggal   = $request->query('tanggal');
        $startDate = $request->query('start_date');
        $endDate   = $request->query('end_date');

        if ($tanggal) {
            $query->whereDate('tanggal', $tanggal);
        } elseif ($startDate || $endDate) {
            if ($startDate) $query->whereDate('tanggal', '>=', $startDate);
            if ($endDate)   $query->whereDate('tanggal', '<=', $endDate);
        } else {
            $query->whereDate('tanggal', Carbon::today()->toDateString());
        }

        $search = $request->query('search');
        if ($search) {
            $query->whereHas('user', fn ($q) =>
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('nip_nisn', 'like', "%{$search}%")
            );
        }

        return response()->json($query->orderByDesc('tanggal')->orderBy('jam_masuk')->get());
    }

    /**
     * Rekap bulanan absensi guru.
     */
    public function rekapGuru(Request $request)
    {
        $bulan = (int) $request->query('bulan', Carbon::now()->month);
        $tahun = (int) $request->query('tahun', Carbon::now()->year);

        $rows = AbsensiGuru::query()
            ->select(
                'user_id',
                DB::raw("COUNT(CASE WHEN status_masuk = 'hadir' THEN 1 END) as hadir"),
                DB::raw("COUNT(CASE WHEN status_masuk = 'sakit' THEN 1 END) as sakit"),
                DB::raw("COUNT(CASE WHEN status_masuk = 'izin' THEN 1 END) as izin"),
                DB::raw("COUNT(CASE WHEN status_masuk = 'alpha' THEN 1 END) as alpha"),
                DB::raw("COUNT(CASE WHEN status_masuk = 'terlambat' THEN 1 END) as terlambat")
            )
            ->whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->groupBy('user_id')
            ->get();

        $userIds = $rows->pluck('user_id')->filter()->unique()->values();
        $users   = User::whereIn('id', $userIds)->get()->keyBy('id');

        $result = $rows->map(function ($row) use ($users) {
            $u = $users->get($row->user_id);
            return [
                'user_id'         => (int) $row->user_id,
                'name'            => $u?->name ?? '—',
                'nip_nisn'        => $u?->nip_nisn ?? '',
                'role'            => $u?->role ?? '',
                'jabatan'         => $u?->jabatan ?? '',
                'total_hadir'     => (int) $row->hadir,
                'total_izin'      => (int) $row->izin,
                'total_sakit'     => (int) $row->sakit,
                'total_alpha'     => (int) $row->alpha,
                'total_terlambat' => (int) $row->terlambat,
            ];
        });

        return response()->json($result->values());
    }

    /**
     * Manual store absensi guru (oleh admin/kepala sekolah).
     */
    public function storeGuru(Request $request)
    {
        $payload = $request->all();
        if (!empty($payload['tipe']) && empty($payload['status_masuk'])) {
            $payload['status_masuk'] = $payload['tipe'];
        }
        $request->merge($payload);

        $validated = $request->validate([
            'user_id'     => 'required|exists:users,id',
            'tanggal'     => 'required|date',
            'jam_masuk'   => 'nullable|date_format:H:i,H:i:s',
            'status_masuk'=> 'required|in:hadir,izin,sakit,alpha,terlambat',
            'catatan'     => 'nullable|string',
        ]);

        if (!empty($validated['jam_masuk']) && strlen($validated['jam_masuk']) === 5) {
            $validated['jam_masuk'] .= ':00';
        }
        $validated['metode']     = 'manual';
        $validated['created_by'] = $request->user()?->id;

        $absensi = AbsensiGuru::updateOrCreate(
            ['user_id' => $validated['user_id'], 'tanggal' => $validated['tanggal']],
            $validated
        );

        return response()->json($absensi->load('user'), $absensi->wasRecentlyCreated ? 201 : 200);
    }

    private function normalizeTime(?string $value): ?string
    {
        if (!$value) {
            return null;
        }
        // Accept H:i, H:i:s, or locale formats like 06.45
        $value = str_replace('.', ':', trim($value));
        if (preg_match('/^\d{1,2}:\d{2}$/', $value)) {
            return $value . ':00';
        }
        if (preg_match('/^\d{1,2}:\d{2}:\d{2}$/', $value)) {
            return $value;
        }
        return $value;
    }
}
