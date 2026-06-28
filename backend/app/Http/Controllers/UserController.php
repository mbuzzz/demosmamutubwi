<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Filter by role
        if ($request->has('role') && $request->role !== 'semua') {
            if ($request->role === 'guru') {
                $query->whereIn('role', ['guru', 'walikelas', 'kepala_sekolah', 'kurikulum']);
            } elseif ($request->role === 'admin') {
                $query->whereIn('role', ['admin', 'superadmin', 'bendahara']);
            } else {
                $query->where('role', $request->role);
            }
        }

        // Search by name, email, or NIP/NISN
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
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
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:superadmin,guru,walikelas,kepala_sekolah,kurikulum,bendahara,siswa,admin',
            'nip_nisn' => 'nullable|string|unique:users',
            'uid_rfid' => 'nullable|string|unique:users',
            'kelas' => 'nullable|string',
            'jabatan' => 'nullable|string',
            'phone' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json([
            'message' => 'User berhasil dibuat',
            'user' => $user,
        ], 211); // Use 201 Created
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
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:6',
            'role' => 'required|string|in:superadmin,guru,walikelas,kepala_sekolah,kurikulum,bendahara,siswa,admin',
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
}
