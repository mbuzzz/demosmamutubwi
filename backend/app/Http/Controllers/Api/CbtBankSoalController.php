<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BankSoal;
use App\Models\OpsiJawaban;
use App\Models\Soal;
use Illuminate\Http\Request;

class CbtBankSoalController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = BankSoal::with(['mapel', 'guru'])->withCount('soals');

        // Multi-mapel: guru hanya lihat bank soal mapel penugasannya (milik sendiri)
        if ($user && $user->shouldScopeAsGuru()) {
            $mapelIds = $user->penugasanMapelIds();
            $query->where('guru_id', $user->id);
            if (empty($mapelIds)) {
                $query->whereRaw('1 = 0');
            } else {
                $query->whereIn('mapel_id', $mapelIds);
            }
        }

        if ($request->has('mapel_id')) {
            $query->where('mapel_id', $request->mapel_id);
        }

        if ($request->has('tingkat')) {
            $query->where('tingkat', $request->tingkat);
        }

        $bankSoals = $query->latest()->paginate($request->per_page ?? 10);

        return response()->json($bankSoals);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            'mapel_id' => 'required|exists:mapels,id',
            'tingkat' => 'required|integer',
            'judul' => 'required|string',
            'tipe' => 'required|in:ujian,ulangan_harian,kuis,matrikulasi',
            'deskripsi' => 'nullable|string',
            'waktu_pengerjaan' => 'required|integer',
            'status' => 'required|in:draft,published',
        ]);

        if ($user) {
            $user->ensurePenugasanMapel((int) $validated['mapel_id']);
        }

        $validated['guru_id'] = $user->id;

        $bankSoal = BankSoal::create($validated);

        return response()->json([
            'message' => 'Bank Soal berhasil dibuat',
            'data' => $bankSoal
        ], 201);
    }

    public function show(Request $request, BankSoal $bankSoal)
    {
        $user = $request->user();
        if ($user) {
            $user->ensureOwnsResource($bankSoal->guru_id);
            if ($user->shouldScopeAsGuru()) {
                $user->ensurePenugasanMapel((int) $bankSoal->mapel_id);
            }
        }

        $bankSoal->load(['mapel', 'guru', 'soals.opsiJawabans']);
        return response()->json($bankSoal);
    }

    public function update(Request $request, BankSoal $bankSoal)
    {
        $user = $request->user();
        if ($user) {
            $user->ensureOwnsResource($bankSoal->guru_id);
        }

        $validated = $request->validate([
            'mapel_id' => 'sometimes|exists:mapels,id',
            'tingkat' => 'sometimes|integer',
            'judul' => 'sometimes|string',
            'tipe' => 'sometimes|in:ujian,ulangan_harian,kuis,matrikulasi',
            'deskripsi' => 'nullable|string',
            'waktu_pengerjaan' => 'sometimes|integer',
            'status' => 'sometimes|in:draft,published',
        ]);

        if ($user && isset($validated['mapel_id'])) {
            $user->ensurePenugasanMapel((int) $validated['mapel_id']);
        }

        $bankSoal->update($validated);

        return response()->json([
            'message' => 'Bank Soal berhasil diupdate',
            'data' => $bankSoal
        ]);
    }

    public function destroy(Request $request, BankSoal $bankSoal)
    {
        $user = $request->user();
        if ($user) {
            $user->ensureOwnsResource($bankSoal->guru_id);
        }

        $bankSoal->delete();

        return response()->json([
            'message' => 'Bank Soal berhasil dihapus'
        ]);
    }

    // --- Soal Management ---

    public function storeSoal(Request $request, BankSoal $bankSoal)
    {
        $user = $request->user();
        if ($user) {
            $user->ensureOwnsResource($bankSoal->guru_id);
        }

        $validated = $request->validate([
            'jenis' => 'required|in:pg,essay,pg_kompleks,pgk,bs',
            'pertanyaan' => 'required|string',
            'bobot_nilai' => 'required|numeric|min:1',
            'file_media' => 'nullable|string',
            'opsi_jawabans' => 'required_if:jenis,pg,pg_kompleks,pgk,bs|array',
            'opsi_jawabans.*.teks_opsi' => 'required_with:opsi_jawabans|string',
            'opsi_jawabans.*.is_benar' => 'required_with:opsi_jawabans|boolean',
            'opsi_jawabans.*.file_media' => 'nullable|string',
        ]);
        // Cast bobot_nilai to integer for DB
        $validated['bobot_nilai'] = (int) $validated['bobot_nilai'];

        $soal = $bankSoal->soals()->create([
            'jenis' => $validated['jenis'],
            'pertanyaan' => $validated['pertanyaan'],
            'bobot_nilai' => $validated['bobot_nilai'],
            'file_media' => $validated['file_media'] ?? null,
        ]);

        if (isset($validated['opsi_jawabans'])) {
            $soal->opsiJawabans()->createMany(
                collect($validated['opsi_jawabans'])->map(function ($o) {
                    return [
                        'teks_opsi' => $o['teks_opsi'],
                        'is_benar' => $o['is_benar'],
                        'file_media' => $o['file_media'] ?? null,
                    ];
                })->all()
            );
        }

        $soal->load('opsiJawabans');

        return response()->json([
            'message' => 'Soal berhasil ditambahkan',
            'data' => $soal
        ], 201);
    }

    public function updateSoal(Request $request, BankSoal $bankSoal, Soal $soal)
    {
        $user = $request->user();
        if ($user) {
            $user->ensureOwnsResource($bankSoal->guru_id);
        }

        if ($soal->bank_soal_id !== $bankSoal->id) {
            return response()->json(['message' => 'Soal not found in this Bank Soal'], 404);
        }

        $validated = $request->validate([
            'jenis' => 'sometimes|in:pg,essay,pg_kompleks,pgk,bs',
            'pertanyaan' => 'sometimes|string',
            'bobot_nilai' => 'sometimes|numeric|min:1',
            'file_media' => 'nullable|string',
            'opsi_jawabans' => 'sometimes|array',
            'opsi_jawabans.*.id' => 'nullable|integer',
            'opsi_jawabans.*.teks_opsi' => 'required_with:opsi_jawabans|string',
            'opsi_jawabans.*.is_benar' => 'required_with:opsi_jawabans|boolean',
            'opsi_jawabans.*.file_media' => 'nullable|string',
        ]);
        if (isset($validated['bobot_nilai'])) {
            $validated['bobot_nilai'] = (int) $validated['bobot_nilai'];
        }

        $soal->update([
            'jenis' => $validated['jenis'] ?? $soal->jenis,
            'pertanyaan' => $validated['pertanyaan'] ?? $soal->pertanyaan,
            'bobot_nilai' => $validated['bobot_nilai'] ?? $soal->bobot_nilai,
            'file_media' => array_key_exists('file_media', $validated) ? $validated['file_media'] : $soal->file_media,
        ]);

        // Hapus rubrik/kunci lama saat soal diubah menjadi essay tanpa rubrik baru.
        if (($validated['jenis'] ?? $soal->jenis) === 'essay' && !isset($validated['opsi_jawabans'])) {
            $soal->opsiJawabans()->delete();
        }

        if (isset($validated['opsi_jawabans'])) {
            $existingOpsiIds = collect($validated['opsi_jawabans'])->pluck('id')->filter()->toArray();
            
            // Delete removed options
            $soal->opsiJawabans()->whereNotIn('id', $existingOpsiIds)->delete();

            // Update or create options
            foreach ($validated['opsi_jawabans'] as $opsiData) {
                $payload = [
                    'teks_opsi' => $opsiData['teks_opsi'],
                    'is_benar' => $opsiData['is_benar'],
                    'file_media' => $opsiData['file_media'] ?? null,
                ];
                if (isset($opsiData['id'])) {
                    OpsiJawaban::where('id', $opsiData['id'])
                        ->where('soal_id', $soal->id)
                        ->update($payload);
                } else {
                    $soal->opsiJawabans()->create($payload);
                }
            }
        }

        $soal->load('opsiJawabans');

        return response()->json([
            'message' => 'Soal berhasil diupdate',
            'data' => $soal
        ]);
    }

    public function destroySoal(Request $request, BankSoal $bankSoal, Soal $soal)
    {
        $user = $request->user();
        if ($user) {
            $user->ensureOwnsResource($bankSoal->guru_id);
        }

        if ($soal->bank_soal_id !== $bankSoal->id) {
            return response()->json(['message' => 'Soal not found in this Bank Soal'], 404);
        }

        $soal->delete();

        return response()->json([
            'message' => 'Soal berhasil dihapus'
        ]);
    }
}
