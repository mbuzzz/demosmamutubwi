<?php

namespace App\Http\Controllers;

use App\Models\Download;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DownloadController extends Controller
{
    // GET /api/downloads (Admin view)
    public function index(Request $request)
    {
        $query = Download::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('nama', 'like', "%{$search}%");
        }

        if ($request->has('kategori') && $request->kategori) {
            $query->where('kategori', $request->kategori);
        }

        return response()->json($query->orderBy('id', 'desc')->get());
    }

    // GET /api/public/downloads (Public view)
    public function publicIndex(Request $request)
    {
        $query = Download::query();

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('nama', 'like', "%{$search}%");
        }

        return response()->json($query->orderBy('id', 'desc')->get());
    }

    // POST /api/downloads
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'kategori' => 'required|string|max:255',
            'file' => 'required|file|max:20480', // max 20MB
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            // Generate user-friendly file name but store to unique path
            $fileName = $file->getClientOriginalName();
            $path = $file->store('downloads', 'public');
            
            // Format file size
            $bytes = $file->getSize();
            $fileSize = $this->formatBytes($bytes);
            
            // File type / extension
            $fileType = strtoupper($file->getClientOriginalExtension());

            $download = Download::create([
                'nama' => $request->nama,
                'kategori' => $request->kategori,
                'file_name' => $fileName,
                'file_path' => $path,
                'file_size' => $fileSize,
                'file_type' => $fileType,
            ]);

            return response()->json([
                'message' => 'Dokumen berhasil diunggah',
                'download' => $download
            ], 201);
        }

        return response()->json(['message' => 'Gagal mengunggah file.'], 400);
    }

    // GET /api/downloads/{id}
    public function show($id)
    {
        $download = Download::findOrFail($id);
        return response()->json($download);
    }

    // POST /api/downloads/{id} (used with _method=PUT for multipart/form-data support in PHP/Laravel)
    // Or PUT /api/downloads/{id}
    public function update(Request $request, $id)
    {
        $download = Download::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255',
            'kategori' => 'required|string|max:255',
            'file' => 'nullable|file|max:20480',
        ]);

        $data = [
            'nama' => $request->nama,
            'kategori' => $request->kategori,
        ];

        if ($request->hasFile('file')) {
            // Delete old file
            if (Storage::disk('public')->exists($download->file_path)) {
                Storage::disk('public')->delete($download->file_path);
            }

            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $path = $file->store('downloads', 'public');
            
            $bytes = $file->getSize();
            $fileSize = $this->formatBytes($bytes);
            $fileType = strtoupper($file->getClientOriginalExtension());

            $data['file_name'] = $fileName;
            $data['file_path'] = $path;
            $data['file_size'] = $fileSize;
            $data['file_type'] = $fileType;
        }

        $download->update($data);

        return response()->json([
            'message' => 'Dokumen berhasil diperbarui',
            'download' => $download
        ]);
    }

    // DELETE /api/downloads/{id}
    public function destroy($id)
    {
        $download = Download::findOrFail($id);

        if (Storage::disk('public')->exists($download->file_path)) {
            Storage::disk('public')->delete($download->file_path);
        }

        $download->delete();

        return response()->json([
            'message' => 'Dokumen berhasil dihapus'
        ]);
    }

    // GET /api/public/downloads/{id}/file
    public function downloadFile($id)
    {
        $download = Download::findOrFail($id);
        $download->increment('downloads_count');

        $path = storage_path('app/public/' . $download->file_path);
        if (file_exists($path)) {
            return response()->download($path, $download->file_name);
        }

        // Fallback redirection to asset path
        return redirect(asset('storage/' . $download->file_path));
    }

    private function formatBytes($bytes, $precision = 1)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
