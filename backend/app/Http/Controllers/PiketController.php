<?php

namespace App\Http\Controllers;

use App\Models\JadwalPiket;
use App\Models\AbsensiPiket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class PiketController extends Controller
{
    private const HARI = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

    /**
     * Daftar guru yang bisa dijadwalkan piket (staf pendidik/oversight).
     */
    public function guruPiket()
    {
        $gurus = User::query()
            ->where('is_active', true)
            ->where(function ($q) {
                $targets = ['guru', 'walikelas', 'kepala_sekolah', 'kurikulum', 'bendahara'];
                $q->whereIn('role', $targets);
                foreach ($targets as $target) {
                    $q->orWhereJsonContains('roles', $target);
                }
            })
            ->orderBy('name')
            ->get(['id', 'name', 'nip_nisn', 'jabatan', 'foto', 'role', 'roles']);

        return response()->json($gurus);
    }

    /**
     * Daftar jadwal piket, dikelompokkan per hari.
     */
    public function indexJadwal()
    {
        $jadwals = JadwalPiket::with(['user' => fn ($q) => $q->select('id', 'name', 'nip_nisn', 'jabatan', 'foto', 'role', 'roles')])
            ->orderBy('hari')
            ->orderBy('created_at')
            ->get();

        $grouped = collect(self::HARI)->mapWithKeys(function ($hari) use ($jadwals) {
            $items = $jadwals->where('hari', $hari)->values()->map(fn ($j) => [
                'id' => $j->id,
                'user_id' => $j->user_id,
                'hari' => $j->hari,
                'keterangan' => $j->keterangan,
                'user' => $j->user,
            ]);
            return [$hari => $items];
        });

        return response()->json($grouped);
    }

    public function storeJadwal(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'user_id' => ['required', 'exists:users,id'],
            'hari' => ['required', Rule::in(self::HARI)],
            'keterangan' => ['nullable', 'string', 'max:500'],
        ])->validate();

        $validated['created_by'] = auth()->id();

        $exists = JadwalPiket::where('user_id', $validated['user_id'])
            ->where('hari', $validated['hari'])
            ->exists();
        if ($exists) {
            return response()->json(['message' => 'Guru sudah dijadwalkan piket pada hari tersebut'], 422);
        }

        $jadwal = JadwalPiket::create($validated);
        $jadwal->load('user');

        return response()->json(['message' => 'Jadwal piket berhasil ditambahkan', 'data' => $jadwal], 201);
    }

    public function updateJadwal(Request $request, $id)
    {
        $jadwal = JadwalPiket::findOrFail($id);

        $validated = Validator::make($request->all(), [
            'user_id' => ['required', 'exists:users,id'],
            'hari' => ['required', Rule::in(self::HARI)],
            'keterangan' => ['nullable', 'string', 'max:500'],
        ])->validate();

        $exists = JadwalPiket::where('user_id', $validated['user_id'])
            ->where('hari', $validated['hari'])
            ->where('id', '!=', $jadwal->id)
            ->exists();
        if ($exists) {
            return response()->json(['message' => 'Guru sudah dijadwalkan piket pada hari tersebut'], 422);
        }

        $jadwal->update($validated);
        $jadwal->load('user');

        return response()->json(['message' => 'Jadwal piket berhasil diperbarui', 'data' => $jadwal]);
    }

    public function deleteJadwal($id)
    {
        $jadwal = JadwalPiket::findOrFail($id);
        AbsensiPiket::where('jadwal_piket_id', $jadwal->id)->delete();
        $jadwal->delete();

        return response()->json(['message' => 'Jadwal piket berhasil dihapus']);
    }

    /**
     * Absensi untuk input per tanggal, atau kalender per bulan.
     * ?tanggal=2026-08-05 → jadwal hari itu + status absensi per guru.
     * ?bulan=2026-08 → semua absensi bulan itu (untuk kalender).
     */
    public function getAbsensi(Request $request)
    {
        $request->validate([
            'tanggal' => ['nullable', 'date'],
            'bulan' => ['nullable', 'string', 'regex:/^\d{4}-\d{2}$/'],
        ]);

        if ($request->has('bulan') && !$request->has('tanggal')) {
            $bulan = $request->input('bulan');
            $absensis = AbsensiPiket::with(['user' => fn ($q) => $q->select('id', 'name', 'nip_nisn', 'jabatan', 'foto', 'role', 'roles')])
                ->where('tanggal', 'like', $bulan . '%')
                ->orderBy('tanggal')
                ->orderBy('id')
                ->get();

            $grouped = $absensis->groupBy('tanggal')->map(fn ($items) => $items->map(fn ($a) => [
                'id' => $a->id,
                'user_id' => $a->user_id,
                'jadwal_piket_id' => $a->jadwal_piket_id,
                'tanggal' => $a->tanggal,
                'status' => $a->status,
                'catatan' => $a->catatan,
                'user' => $a->user,
            ]));

            return response()->json($grouped);
        }

        $tanggal = $request->input('tanggal', now()->toDateString());
        $hari = self::HARI[\Carbon\Carbon::parse($tanggal)->dayOfWeek === 0 ? 6 : \Carbon\Carbon::parse($tanggal)->dayOfWeek - 1];

        $jadwals = JadwalPiket::with(['user' => fn ($q) => $q->select('id', 'name', 'nip_nisn', 'jabatan', 'foto', 'role', 'roles')])
            ->where('hari', $hari)
            ->orderBy('created_at')
            ->get();

        $absensis = AbsensiPiket::where('tanggal', $tanggal)->get()->keyBy('user_id');

        $items = $jadwals->map(function ($jadwal) use ($absensis, $tanggal, $hari) {
            $absensi = $absensis->get($jadwal->user_id);
            return [
                'id' => $absensi?->id,
                'user_id' => $jadwal->user_id,
                'jadwal_piket_id' => $jadwal->id,
                'hari' => $hari,
                'tanggal' => $tanggal,
                'keterangan' => $jadwal->keterangan,
                'status' => $absensi?->status ?? 'belum',
                'catatan' => $absensi?->catatan,
                'user' => $jadwal->user,
            ];
        });

        return response()->json([
            'tanggal' => $tanggal,
            'hari' => $hari,
            'data' => $items,
        ]);
    }

    public function storeAbsensi(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'user_id' => ['required', 'exists:users,id'],
            'tanggal' => ['required', 'date'],
            'status' => ['required', Rule::in(['hadir', 'izin', 'sakit', 'alpha', 'terlambat'])],
            'catatan' => ['nullable', 'string', 'max:500'],
            'jadwal_piket_id' => ['nullable', 'exists:jadwal_pikets,id'],
        ])->validate();

        $validated['created_by'] = auth()->id();

        $absensi = AbsensiPiket::updateOrCreate(
            ['user_id' => $validated['user_id'], 'tanggal' => $validated['tanggal']],
            [
                'status' => $validated['status'],
                'catatan' => $validated['catatan'] ?? null,
                'jadwal_piket_id' => $validated['jadwal_piket_id'] ?? null,
                'created_by' => $validated['created_by'],
            ]
        );

        return response()->json(['message' => 'Absensi piket berhasil disimpan', 'data' => $absensi], 201);
    }

    public function updateAbsensi(Request $request, $id)
    {
        $absensi = AbsensiPiket::findOrFail($id);

        $validated = Validator::make($request->all(), [
            'status' => ['required', Rule::in(['hadir', 'izin', 'sakit', 'alpha', 'terlambat'])],
            'catatan' => ['nullable', 'string', 'max:500'],
        ])->validate();

        $absensi->update([
            'status' => $validated['status'],
            'catatan' => $validated['catatan'] ?? null,
        ]);

        return response()->json(['message' => 'Absensi piket berhasil diperbarui', 'data' => $absensi]);
    }

    public function deleteAbsensi($id)
    {
        $absensi = AbsensiPiket::findOrFail($id);
        $absensi->delete();

        return response()->json(['message' => 'Absensi piket berhasil dihapus']);
    }

    /**
     * Rekap laporan piket per guru dalam satu bulan.
     * ?bulan=2026-08
     */
    public function getLaporan(Request $request)
    {
        $request->validate([
            'bulan' => ['required', 'string', 'regex:/^\d{4}-\d{2}$/'],
        ]);

        $bulan = $request->input('bulan');
        $from = $bulan . '-01';
        $to = \Carbon\Carbon::parse($from)->endOfMonth()->toDateString();

        $absensis = AbsensiPiket::with(['user' => fn ($q) => $q->select('id', 'name', 'nip_nisn', 'jabatan', 'foto', 'role', 'roles')])
            ->whereBetween('tanggal', [$from, $to])
            ->orderBy('tanggal')
            ->get();

        $jadwalCounts = JadwalPiket::selectRaw('user_id, COUNT(*) as total')
            ->groupBy('user_id')
            ->get()
            ->keyBy('user_id');

        $grouped = $absensis->groupBy('user_id')->map(function ($items) use ($jadwalCounts) {
            $user = $items->first()->user;
            $counts = $items->countBy('status');

            return [
                'user_id' => $items->first()->user_id,
                'user' => $user,
                'total_jadwal' => $jadwalCounts->get($items->first()->user_id)?->total ?? 0,
                'hadir' => $counts->get('hadir', 0),
                'izin' => $counts->get('izin', 0),
                'sakit' => $counts->get('sakit', 0),
                'alpha' => $counts->get('alpha', 0),
                'terlambat' => $counts->get('terlambat', 0),
                'total_terisi' => $items->count(),
                'detail' => $items->map(fn ($a) => [
                    'id' => $a->id,
                    'tanggal' => $a->tanggal,
                    'status' => $a->status,
                    'catatan' => $a->catatan,
                ])->values(),
            ];
        })->values();

        $ringkasan = [
            'bulan' => $bulan,
            'total_guru' => $grouped->count(),
            'total_hadir' => $grouped->sum('hadir'),
            'total_izin' => $grouped->sum('izin'),
            'total_sakit' => $grouped->sum('sakit'),
            'total_alpha' => $grouped->sum('alpha'),
            'total_terlambat' => $grouped->sum('terlambat'),
        ];

        return response()->json(['ringkasan' => $ringkasan, 'data' => $grouped]);
    }
}
