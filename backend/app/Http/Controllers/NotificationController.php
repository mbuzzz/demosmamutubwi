<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $userIds = [$user->id];
        if ($user->isOrangTua() && $user->siswa_id) {
            $userIds[] = $user->siswa_id;
        }

        $notifications = Notification::whereIn('user_id', $userIds)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $notifications
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $userIds = [$user->id];
        if ($user->isOrangTua() && $user->siswa_id) {
            $userIds[] = $user->siswa_id;
        }

        Notification::whereIn('user_id', $userIds)->update(['read' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Semua notifikasi ditandai dibaca'
        ]);
    }
}
