<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tugas;
use App\Models\PengumpulanTugas;
use App\Models\KomentarLms;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LmsTugasController extends Controller
{
    public function index(Request $request)
    {
        $query = Tugas::with(['guru', 'mapel', 'kelas', 'pengumpulanTugas' => function($q) use ($request) {
            if ($request->user() && $request->user()->role === 'siswa') {
                $q->where('siswa_id', $request->user()->id);
            }
        }]);
        $user = $request->user();

        if ($user) {
            $targetKelasId = null;
            if ($user->role === 'siswa') {
                $kelasObj = \App\Models\Kelas::where('nama', $user->kelas)->first();
                if ($kelasObj) $targetKelasId = $kelasObj->id;
            } elseif ($user->role === 'orang_tua') {
                $siswa = $user->siswa;
                if ($siswa) {
                    $kelasObj = \App\Models\Kelas::where('nama', $siswa->kelas)->first();
                    if ($kelasObj) $targetKelasId = $kelasObj->id;
                }
            } else {
                if ($request->has('kelas_id')) {
                    $targetKelasId = $request->kelas_id;
                }
            }

            if ($targetKelasId) {
                $query->whereHas('kelas', function($q) use ($targetKelasId) {
                    $q->where('kelas.id', $targetKelasId);
                });
            } elseif (in_array($user->role, ['siswa', 'orang_tua'])) {
                $query->whereRaw('1 = 0');
            }
        }

        if ($request->has('guru_id')) {
            $query->where('guru_id', $request->guru_id);
        }
        
        if ($request->has('mapel_id')) {
            $query->where('mapel_id', $request->mapel_id);
        }

        $tugas = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $tugas
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'guru_id' => 'required|exists:users,id',
            'mapel_id' => 'required|exists:mapels,id',
            'kelas_ids' => 'required|array',
            'kelas_ids.*' => 'exists:kelas,id',
            'judul' => 'required|string|max:255',
            'instruksi' => 'nullable|string',
            'lampiran_url' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,zip,rar,jpg,jpeg,png|max:10240',
            'tenggat_waktu' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except(['lampiran_url', 'kelas_ids']);

        if ($request->hasFile('lampiran_url')) {
            $file = $request->file('lampiran_url');
            $path = $file->store('lms/tugas', 'public');
            $data['lampiran_url'] = '/storage/' . $path;
        }

        $tugas = Tugas::create($data);
        if ($request->has('kelas_ids')) {
            $tugas->kelas()->sync($request->kelas_ids);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tugas berhasil ditambahkan',
            'data' => $tugas
        ], 201);
    }

    public function show($id)
    {
        $tugas = Tugas::with(['guru', 'mapel', 'kelas', 'komentarLms.user'])->find($id);

        if (!$tugas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $tugas
        ]);
    }

    public function update(Request $request, $id)
    {
        $tugas = Tugas::find($id);

        if (!$tugas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'guru_id' => 'sometimes|exists:users,id',
            'mapel_id' => 'sometimes|exists:mapels,id',
            'kelas_ids' => 'sometimes|array',
            'kelas_ids.*' => 'exists:kelas,id',
            'judul' => 'sometimes|string|max:255',
            'instruksi' => 'nullable|string',
            'lampiran_url' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,zip,rar,jpg,jpeg,png|max:10240',
            'tenggat_waktu' => 'sometimes|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except(['lampiran_url', 'kelas_ids']);

        if ($request->hasFile('lampiran_url')) {
            // Hapus file lama jika ada
            if ($tugas->lampiran_url) {
                $oldPath = str_replace('/storage/', '', $tugas->lampiran_url);
                Storage::disk('public')->delete($oldPath);
            }

            $file = $request->file('lampiran_url');
            $path = $file->store('lms/tugas', 'public');
            $data['lampiran_url'] = '/storage/' . $path;
        }

        $tugas->update($data);
        if ($request->has('kelas_ids')) {
            $tugas->kelas()->sync($request->kelas_ids);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tugas berhasil diupdate',
            'data' => $tugas
        ]);
    }

    public function destroy($id)
    {
        $tugas = Tugas::find($id);

        if (!$tugas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas tidak ditemukan'
            ], 404);
        }

        if ($tugas->lampiran_url) {
            $path = str_replace('/storage/', '', $tugas->lampiran_url);
            Storage::disk('public')->delete($path);
        }

        $tugas->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Tugas berhasil dihapus'
        ]);
    }

    public function addKomentar(Request $request, $id)
    {
        $tugas = Tugas::find($id);

        if (!$tugas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'isi_komentar' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $komentar = KomentarLms::create([
            'user_id'     => $request->user()->id,
            'tugas_id'    => $id,
            'isi_komentar' => $request->isi_komentar,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Komentar berhasil ditambahkan',
            'data' => $komentar->load('user')
        ], 201);
    }

    public function getSubmissions($id)
    {
        $tugas = Tugas::find($id);

        if (!$tugas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas tidak ditemukan'
            ], 404);
        }

        $kelasNames = $tugas->kelas->pluck('nama')->toArray();

        $query = User::where('role', 'siswa');
        if (!empty($kelasNames)) {
            $query->whereIn('kelas', $kelasNames);
        }

        $submissions = $query
            ->with(['pengumpulanTugas' => function ($q) use ($id) {
                $q->where('tugas_id', $id);
            }])
            ->get()
            ->map(function ($siswa) {
                $pengumpulan = $siswa->pengumpulanTugas->first();
                return [
                    'siswa_id'           => $siswa->id,
                    'nama_siswa'         => $siswa->name,
                    'nisn'               => $siswa->nip_nisn,
                    'status_pengumpulan' => $pengumpulan ? true : false,
                    'data_pengumpulan'   => $pengumpulan
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $submissions
        ]);
    }

    public function submitTugas(Request $request, $id)
    {
        $tugas = Tugas::find($id);

        if (!$tugas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'file_jawaban_url' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,zip,rar,jpg,jpeg,png|max:10240',
            'catatan_siswa' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $siswa_id = $request->user()->id;

        // Cek apakah sudah pernah submit
        $pengumpulan = PengumpulanTugas::where('tugas_id', $id)->where('siswa_id', $siswa_id)->first();

        if (!$pengumpulan) {
            $pengumpulan = new PengumpulanTugas();
            $pengumpulan->tugas_id = $id;
            $pengumpulan->siswa_id = $siswa_id;
        }

        $pengumpulan->dikumpulkan_pada = now();
        $pengumpulan->catatan_siswa = $request->catatan_siswa;

        if ($request->hasFile('file_jawaban_url')) {
            // Hapus file lama jika ada
            if ($pengumpulan->file_jawaban_url) {
                $oldPath = str_replace('/storage/', '', $pengumpulan->file_jawaban_url);
                Storage::disk('public')->delete($oldPath);
            }

            $file = $request->file('file_jawaban_url');
            $path = $file->store('lms/pengumpulan', 'public');
            $pengumpulan->file_jawaban_url = '/storage/' . $path;
        }

        $pengumpulan->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Tugas berhasil dikumpulkan',
            'data' => $pengumpulan
        ]);
    }

    public function gradeSubmission(Request $request, $id, $siswa_id)
    {
        $tugas = Tugas::find($id);

        if (!$tugas) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nilai'       => 'required|numeric|min:0|max:100',
            'feedback_guru' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Cek apakah pengumpulan ada
        $pengumpulan = PengumpulanTugas::where('tugas_id', $id)->where('siswa_id', $siswa_id)->first();

        if (!$pengumpulan) {
            // Buat record kosong untuk dinilai walau belum kumpul
            $pengumpulan = new PengumpulanTugas();
            $pengumpulan->tugas_id = $id;
            $pengumpulan->siswa_id = $siswa_id;
        }

        $pengumpulan->nilai        = $request->nilai;
        $pengumpulan->feedback_guru = $request->feedback_guru;
        $pengumpulan->status       = 'sudah_dinilai';
        $pengumpulan->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Nilai berhasil disimpan',
            'data' => $pengumpulan
        ]);
    }

    public function mySubmission(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthenticated.'], 401);
        }

        $siswaId = $user->role === 'orang_tua' ? $user->siswa_id : $user->id;

        if (!$siswaId) {
            return response()->json(['status' => 'error', 'message' => 'Siswa tidak ditemukan.'], 404);
        }

        $pengumpulan = PengumpulanTugas::where('tugas_id', $id)->where('siswa_id', $siswaId)->first();

        return response()->json([
            'status' => 'success',
            'data' => $pengumpulan
        ]);
    }
}
