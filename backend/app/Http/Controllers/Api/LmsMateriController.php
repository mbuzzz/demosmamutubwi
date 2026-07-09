<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use App\Models\KomentarLms;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class LmsMateriController extends Controller
{
    public function index(Request $request)
    {
        $query = Materi::with(['guru', 'mapel', 'kelas']);
        $user = $request->user();

        if ($user) {
            if ($user->role === 'siswa') {
                $kelasObj = \App\Models\Kelas::where('nama', $user->kelas)->first();
                if ($kelasObj) {
                    $query->where('kelas_id', $kelasObj->id);
                } else {
                    $query->whereRaw('1 = 0');
                }
            } elseif ($user->role === 'orang_tua') {
                $siswa = $user->siswa;
                if ($siswa) {
                    $kelasObj = \App\Models\Kelas::where('nama', $siswa->kelas)->first();
                    if ($kelasObj) {
                        $query->where('kelas_id', $kelasObj->id);
                    } else {
                        $query->whereRaw('1 = 0');
                    }
                } else {
                    $query->whereRaw('1 = 0');
                }
            } else {
                if ($request->has('kelas_id')) {
                    $query->where('kelas_id', $request->kelas_id);
                }
            }
        }

        if ($request->has('guru_id')) {
            $query->where('guru_id', $request->guru_id);
        }
        
        if ($request->has('mapel_id')) {
            $query->where('mapel_id', $request->mapel_id);
        }

        $materi = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $materi
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'guru_id' => 'required|exists:users,id',
            'mapel_id' => 'required|exists:mapels,id',
            'kelas_id' => 'required|exists:kelas,id',
            'judul' => 'required|string|max:255',
            'konten' => 'nullable|string',
            'file_url' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,zip,rar,jpg,jpeg,png|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('file_url');

        if ($request->hasFile('file_url')) {
            $file = $request->file('file_url');
            $path = $file->store('lms/materi', 'public');
            $data['file_url'] = '/storage/' . $path;
        }

        $materi = Materi::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Materi berhasil ditambahkan',
            'data' => $materi
        ], 201);
    }

    public function show($id)
    {
        $materi = Materi::with(['guru', 'mapel', 'kelas', 'komentarLms.user'])->find($id);

        if (!$materi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Materi tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $materi
        ]);
    }

    public function update(Request $request, $id)
    {
        $materi = Materi::find($id);

        if (!$materi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Materi tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'guru_id' => 'sometimes|exists:users,id',
            'mapel_id' => 'sometimes|exists:mapels,id',
            'kelas_id' => 'sometimes|exists:kelas,id',
            'judul' => 'sometimes|string|max:255',
            'konten' => 'nullable|string',
            'file_url' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,zip,rar,jpg,jpeg,png|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('file_url');

        if ($request->hasFile('file_url')) {
            // Hapus file lama jika ada
            if ($materi->file_url) {
                $oldPath = str_replace('/storage/', '', $materi->file_url);
                Storage::disk('public')->delete($oldPath);
            }

            $file = $request->file('file_url');
            $path = $file->store('lms/materi', 'public');
            $data['file_url'] = '/storage/' . $path;
        }

        $materi->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Materi berhasil diupdate',
            'data' => $materi
        ]);
    }

    public function destroy($id)
    {
        $materi = Materi::find($id);

        if (!$materi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Materi tidak ditemukan'
            ], 404);
        }

        if ($materi->file_url) {
            $path = str_replace('/storage/', '', $materi->file_url);
            Storage::disk('public')->delete($path);
        }

        $materi->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Materi berhasil dihapus'
        ]);
    }

    public function addKomentar(Request $request, $id)
    {
        $materi = Materi::find($id);

        if (!$materi) {
            return response()->json([
                'status' => 'error',
                'message' => 'Materi tidak ditemukan'
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
            'user_id'   => $request->user()->id,
            'materi_id' => $id,
            'isi_komentar' => $request->isi_komentar,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Komentar berhasil ditambahkan',
            'data' => $komentar->load('user')
        ], 201);
    }
}
