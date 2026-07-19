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

        // Hanya notifikasi milik user login (ortu sudah dapat salinan khusus)
        $notifications = Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $notifications,
            'unread_count' => $notifications->where('read', false)->count(),
        ]);
    }

    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $notification = Notification::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $notification->update(['read' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Notifikasi ditandai dibaca',
            'data' => $notification,
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        Notification::where('user_id', $user->id)->update(['read' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Semua notifikasi ditandai dibaca',
        ]);
    }
}
