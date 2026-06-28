<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\MapelController;
use App\Http\Controllers\EkskulController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    // 1. USER MANAGEMENT (Only Superadmin & Admin)
    Route::middleware('role:superadmin,admin')->group(function () {
        Route::get('/users/export/pdf', [UserController::class, 'exportPdf']);
        Route::get('/users/export/xlsx', [UserController::class, 'exportXlsx']);
        Route::post('/users/import/xlsx', [UserController::class, 'importXlsx']);
        Route::apiResource('users', UserController::class);
    });

    // 2. KELAS MANAGEMENT (Superadmin, Admin, Kurikulum)
    Route::middleware('role:superadmin,admin,kurikulum')->group(function () {
        Route::get('/kelas/export/pdf', [KelasController::class, 'exportPdf']);
        Route::get('/kelas/export/xlsx', [KelasController::class, 'exportXlsx']);
        Route::post('/kelas/import/xlsx', [KelasController::class, 'importXlsx']);
        Route::apiResource('kelas', KelasController::class);
    });

    // 3. MAPEL MANAGEMENT (Superadmin, Admin, Kurikulum)
    Route::middleware('role:superadmin,admin,kurikulum')->group(function () {
        Route::get('/mapels/export/pdf', [MapelController::class, 'exportPdf']);
        Route::get('/mapels/export/xlsx', [MapelController::class, 'exportXlsx']);
        Route::post('/mapels/import/xlsx', [MapelController::class, 'importXlsx']);
        Route::apiResource('mapels', MapelController::class);
    });

    // 4. EKSKUL MANAGEMENT (Superadmin, Admin, Kurikulum)
    Route::middleware('role:superadmin,admin,kurikulum')->group(function () {
        Route::get('/ekskuls/export/pdf', [EkskulController::class, 'exportPdf']);
        Route::get('/ekskuls/export/xlsx', [EkskulController::class, 'exportXlsx']);
        Route::post('/ekskuls/import/xlsx', [EkskulController::class, 'importXlsx']);
        Route::apiResource('ekskuls', EkskulController::class);
    });
});
