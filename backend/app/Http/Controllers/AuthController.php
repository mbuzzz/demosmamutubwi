<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if ($user->isOrangTua()) {
                $user->load('siswa');
            }

            // Mobile clients (React Native / Expo) authenticate via Bearer token
            // because cookie-based sessions are not reliable outside the browser.
            $isMobile = $request->header('X-Client') === 'mobile';

            if ($isMobile) {
                $token = $user->createToken('mobile-app')->plainTextToken;

                return response()->json([
                    'message' => 'Login successful',
                    'token' => $token,
                    'user' => $user,
                ]);
            }

            $request->session()->regenerate();

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
            ]);
        }

        return response()->json([
            'message' => 'Kredensial yang diberikan salah.',
        ], 422);
    }

    public function logout(Request $request)
    {
        // Token-based (mobile): revoke the current access token only.
        $token = $request->user()?->currentAccessToken();
        if ($token && !($token instanceof \Laravel\Sanctum\TransientToken)) {
            $token->delete();

            return response()->json([
                'message' => 'Logged out successfully',
            ]);
        }

        // Session-based (web SPA): full session invalidation.
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request)
    {
        $user = $request->user();
        if ($user && $user->isOrangTua()) {
            $user->load('siswa');
        }
        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $rules = [
            'name' => 'required|string|max:255',
            'username' => [
                'required',
                'string',
                'max:255',
                \Illuminate\Validation\Rule::unique('users')->ignore($user->id),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                \Illuminate\Validation\Rule::unique('users')->ignore($user->id),
            ],
            'phone' => 'nullable|string',
        ];

        $validated = $request->validate($rules);

        // Handle foto upload (POST with FormData)
        if ($request->hasFile('foto')) {
            if ($user->foto && Storage::disk('public')->exists($user->foto)) {
                Storage::disk('public')->delete($user->foto);
            }
            $path = $request->file('foto')->store('fotos', 'public');
            $validated['foto'] = $path;
        }

        // Handle foto removal (JSON with foto: '__delete__')
        if ($request->input('foto') === '__delete__') {
            if ($user->foto && Storage::disk('public')->exists($user->foto)) {
                Storage::disk('public')->delete($user->foto);
            }
            $validated['foto'] = null;
        }

        $user->update($validated);

        $freshUser = $user->fresh();
        if ($freshUser && $freshUser->isOrangTua()) {
            $freshUser->load('siswa');
        }

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'user' => $freshUser,
        ]);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Password saat ini tidak cocok.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password berhasil diperbarui',
        ]);
    }
}
