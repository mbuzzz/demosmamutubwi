<?php

namespace App\Http\Controllers;

use App\Models\GelombangPendaftaran;
use App\Models\Pendaftar;
use App\Models\FormField;
use Illuminate\Http\Request;

class SPMBController extends Controller
{
    // ==================== GELOMBANG ====================

    public function indexGelombang()
    {
        return response()->json(
            GelombangPendaftaran::withCount('pendaftars')
                ->orderBy('tanggal_mulai', 'desc')
                ->get()
        );
    }

    public function storeGelombang(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'kuota' => 'nullable|integer|min:1',
            'biaya_pendaftaran' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'redirect_url' => 'nullable|string|max:255',
        ]);

        $gelombang = GelombangPendaftaran::create($validated);

        return response()->json([
            'message' => 'Gelombang berhasil dibuat',
            'gelombang' => $gelombang,
        ], 201);
    }

    public function showGelombang($id)
    {
        $gelombang = GelombangPendaftaran::withCount('pendaftars')->findOrFail($id);
        return response()->json($gelombang);
    }

    public function updateGelombang(Request $request, $id)
    {
        $gelombang = GelombangPendaftaran::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'kuota' => 'nullable|integer|min:1',
            'biaya_pendaftaran' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'redirect_url' => 'nullable|string|max:255',
        ]);

        $gelombang->update($validated);

        return response()->json([
            'message' => 'Gelombang berhasil diperbarui',
            'gelombang' => $gelombang,
        ]);
    }

    public function destroyGelombang($id)
    {
        $gelombang = GelombangPendaftaran::withCount('pendaftars')->findOrFail($id);
        if ($gelombang->pendaftars_count > 0) {
            return response()->json([
                'message' => 'Tidak bisa menghapus gelombang yang sudah memiliki pendaftar',
            ], 422);
        }
        $gelombang->delete();
        return response()->json(['message' => 'Gelombang berhasil dihapus']);
    }

    // ==================== PENDAFTAR ====================

    public function indexPendaftar(Request $request)
    {
        $query = Pendaftar::with('gelombang');

        if ($request->has('gelombang_id') && $request->gelombang_id) {
            $query->where('gelombang_id', $request->gelombang_id);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function storePendaftar(Request $request)
    {
        $validated = $request->validate([
            'gelombang_id' => 'required|exists:gelombang_pendaftarans,id',
            'nisn' => 'required|string|unique:pendaftars,nisn',
            'nama_lengkap' => 'required|string|max:255',
            'asal_sekolah' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'required|string',
        ]);

        $gelombang = GelombangPendaftaran::findOrFail($validated['gelombang_id']);

        if (!$gelombang->is_active) {
            return response()->json(['message' => 'Gelombang pendaftaran tidak aktif.'], 422);
        }

        $today = now()->toDateString();
        if ($today < $gelombang->tanggal_mulai || $today > $gelombang->tanggal_selesai) {
            return response()->json(['message' => 'Periode pendaftaran belum dimulai atau sudah berakhir.'], 422);
        }

        if ($gelombang->kuota && $gelombang->pendaftars()->count() >= $gelombang->kuota) {
            return response()->json(['message' => 'Kuota pendaftaran sudah penuh.'], 422);
        }

        // Handle dynamic form data including files
        $dataForm = [];
        $formFields = \App\Models\FormField::where('gelombang_id', $gelombang->id)
            ->orWhereNull('gelombang_id')
            ->get();

        foreach ($formFields as $field) {
            $key = $field->label;
            $requestKey = str_replace(' ', '_', $key); // PHP converts spaces to underscores in file/post keys
            
            if ($field->field_type === 'file' && $request->hasFile($requestKey)) {
                $path = $request->file($requestKey)->store('spmb_files', 'public');
                $dataForm[$key] = '/storage/' . $path;
            } else if ($request->has($requestKey)) {
                $dataForm[$key] = $request->input($requestKey);
            }
        }

        $validated['data_form'] = !empty($dataForm) ? $dataForm : null;
        $validated['status'] = 'baru';

        $pendaftar = \App\Models\Pendaftar::create($validated);

        return response()->json([
            'message' => 'Pendaftaran berhasil dikirim',
            'pendaftar' => $pendaftar->load('gelombang'),
        ], 201);
    }

    public function showPendaftar($id)
    {
        $pendaftar = Pendaftar::with('gelombang')->findOrFail($id);
        return response()->json($pendaftar);
    }

    public function updatePendaftar(Request $request, $id)
    {
        $pendaftar = Pendaftar::findOrFail($id);

        $validated = $request->validate([
            'gelombang_id' => 'required|exists:gelombang_pendaftarans,id',
            'nisn' => "required|string|unique:pendaftars,nisn,{$id}",
            'nama_lengkap' => 'required|string|max:255',
            'asal_sekolah' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'no_hp' => 'required|string|max:20',
            'alamat' => 'required|string',
            'status' => 'string|in:baru,diverifikasi,diterima,ditolak',
            'data_form' => 'nullable|array',
        ]);

        $pendaftar->update($validated);

        return response()->json([
            'message' => 'Data pendaftar berhasil diperbarui',
            'pendaftar' => $pendaftar->load('gelombang'),
        ]);
    }

    public function destroyPendaftar($id)
    {
        $pendaftar = Pendaftar::findOrFail($id);
        $pendaftar->delete();
        return response()->json(['message' => 'Pendaftar berhasil dihapus']);
    }

    // ==================== FORM FIELDS ====================

    public function indexFormField(Request $request)
    {
        $query = FormField::orderBy('urutan');

        if ($request->has('gelombang_id') && $request->gelombang_id) {
            $query->where(function ($q) use ($request) {
                $q->where('gelombang_id', $request->gelombang_id)
                  ->orWhereNull('gelombang_id');
            });
        }

        return response()->json($query->get());
    }

    public function storeFormField(Request $request)
    {
        $validated = $request->validate([
            'gelombang_id' => 'nullable|exists:gelombang_pendaftarans,id',
            'label' => 'required|string|max:255',
            'field_type' => 'required|string|in:text,textarea,select,file,date',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'urutan' => 'integer|min:0',
        ]);

        $field = FormField::create($validated);

        return response()->json([
            'message' => 'Field berhasil ditambahkan',
            'field' => $field,
        ], 201);
    }

    public function updateFormField(Request $request, $id)
    {
        $field = FormField::findOrFail($id);

        $validated = $request->validate([
            'gelombang_id' => 'nullable|exists:gelombang_pendaftarans,id',
            'label' => 'required|string|max:255',
            'field_type' => 'required|string|in:text,textarea,select,file,date',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'urutan' => 'integer|min:0',
        ]);

        $field->update($validated);

        return response()->json([
            'message' => 'Field berhasil diperbarui',
            'field' => $field,
        ]);
    }

    public function destroyFormField($id)
    {
        $field = FormField::findOrFail($id);
        $field->delete();
        return response()->json(['message' => 'Field berhasil dihapus']);
    }

    // ==================== PUBLIC ====================

    public function publicGelombangAktif()
    {
        // Show all active gelombang (not filtered by date) — admin controls via is_active flag.
        // The frontend will show upcoming/ongoing/past status based on dates.
        return response()->json(
            GelombangPendaftaran::where('is_active', true)
                ->withCount('pendaftars')
                ->orderBy('tanggal_mulai')
                ->get()
        );
    }

    public function publicFormFields($gelombangId)
    {
        $fields = FormField::where(function ($q) use ($gelombangId) {
            $q->where('gelombang_id', $gelombangId)
              ->orWhereNull('gelombang_id');
        })->orderBy('urutan')->get();

        return response()->json($fields);
    }
}
