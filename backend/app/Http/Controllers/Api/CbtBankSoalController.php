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
        $query = BankSoal::with(['mapel', 'guru'])->withCount('soals');

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
        $validated = $request->validate([
            'mapel_id' => 'required|exists:mapels,id',
            'tingkat' => 'required|integer',
            'judul' => 'required|string',
            'tipe' => 'required|in:ujian,ulangan_harian,kuis,matrikulasi',
            'deskripsi' => 'nullable|string',
            'waktu_pengerjaan' => 'required|integer',
            'status' => 'required|in:draft,published',
        ]);

        $validated['guru_id'] = $request->user()->id;

        $bankSoal = BankSoal::create($validated);

        return response()->json([
            'message' => 'Bank Soal berhasil dibuat',
            'data' => $bankSoal
        ], 201);
    }

    public function show(BankSoal $bankSoal)
    {
        $bankSoal->load(['mapel', 'guru', 'soals.opsiJawabans']);
        return response()->json($bankSoal);
    }

    public function update(Request $request, BankSoal $bankSoal)
    {
        $validated = $request->validate([
            'mapel_id' => 'sometimes|exists:mapels,id',
            'tingkat' => 'sometimes|integer',
            'judul' => 'sometimes|string',
            'tipe' => 'sometimes|in:ujian,ulangan_harian,kuis,matrikulasi',
            'deskripsi' => 'nullable|string',
            'waktu_pengerjaan' => 'sometimes|integer',
            'status' => 'sometimes|in:draft,published',
        ]);

        $bankSoal->update($validated);

        return response()->json([
            'message' => 'Bank Soal berhasil diupdate',
            'data' => $bankSoal
        ]);
    }

    public function destroy(BankSoal $bankSoal)
    {
        $bankSoal->delete();

        return response()->json([
            'message' => 'Bank Soal berhasil dihapus'
        ]);
    }

    // --- Soal Management ---

    public function storeSoal(Request $request, BankSoal $bankSoal)
    {
        $validated = $request->validate([
            'jenis' => 'required|in:pg,essay,pg_kompleks,pgk,bs',
            'pertanyaan' => 'required|string',
            'bobot_nilai' => 'required|numeric|min:1',
            'file_media' => 'nullable|string',
            'opsi_jawabans' => 'required_if:jenis,pg,pg_kompleks,pgk,bs|array',
            'opsi_jawabans.*.teks_opsi' => 'required_with:opsi_jawabans|string',
            'opsi_jawabans.*.is_benar' => 'required_with:opsi_jawabans|boolean',
        ]);
        // Cast bobot_nilai to integer for DB
        $validated['bobot_nilai'] = (int) $validated['bobot_nilai'];

        $soal = $bankSoal->soals()->create([
            'jenis' => $validated['jenis'],
            'pertanyaan' => $validated['pertanyaan'],
            'bobot_nilai' => $validated['bobot_nilai'],
            'file_media' => $validated['file_media'] ?? null,
        ]);

        if ($validated['jenis'] === 'pg' && isset($validated['opsi_jawabans'])) {
            $soal->opsiJawabans()->createMany($validated['opsi_jawabans']);
        }

        $soal->load('opsiJawabans');

        return response()->json([
            'message' => 'Soal berhasil ditambahkan',
            'data' => $soal
        ], 201);
    }

    public function updateSoal(Request $request, BankSoal $bankSoal, Soal $soal)
    {
        if ($soal->bank_soal_id !== $bankSoal->id) {
            return response()->json(['message' => 'Soal not found in this Bank Soal'], 404);
        }

        $validated = $request->validate([
            'jenis' => 'sometimes|in:pg,essay,pg_kompleks,pgk,bs',
            'pertanyaan' => 'sometimes|string',
            'bobot_nilai' => 'sometimes|numeric|min:1',
            'file_media' => 'nullable|string',
            'opsi_jawabans' => 'sometimes|array',
            'opsi_jawabans.*.id' => 'nullable|exists:opsi_jawabans,id',
            'opsi_jawabans.*.teks_opsi' => 'required_with:opsi_jawabans|string',
            'opsi_jawabans.*.is_benar' => 'required_with:opsi_jawabans|boolean',
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

        if (isset($validated['opsi_jawabans'])) {
            $existingOpsiIds = collect($validated['opsi_jawabans'])->pluck('id')->filter()->toArray();
            
            // Delete removed options
            $soal->opsiJawabans()->whereNotIn('id', $existingOpsiIds)->delete();

            // Update or create options
            foreach ($validated['opsi_jawabans'] as $opsiData) {
                if (isset($opsiData['id'])) {
                    OpsiJawaban::where('id', $opsiData['id'])->update([
                        'teks_opsi' => $opsiData['teks_opsi'],
                        'is_benar' => $opsiData['is_benar'],
                    ]);
                } else {
                    $soal->opsiJawabans()->create([
                        'teks_opsi' => $opsiData['teks_opsi'],
                        'is_benar' => $opsiData['is_benar'],
                    ]);
                }
            }
        }

        $soal->load('opsiJawabans');

        return response()->json([
            'message' => 'Soal berhasil diupdate',
            'data' => $soal
        ]);
    }

    public function destroySoal(BankSoal $bankSoal, Soal $soal)
    {
        if ($soal->bank_soal_id !== $bankSoal->id) {
            return response()->json(['message' => 'Soal not found in this Bank Soal'], 404);
        }

        $soal->delete();

        return response()->json([
            'message' => 'Soal berhasil dihapus'
        ]);
    }
}
