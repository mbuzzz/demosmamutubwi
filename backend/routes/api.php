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
    // Export & Import Routes (MUST be defined before resource routes)
    Route::get('/users/export/pdf', [UserController::class, 'exportPdf']);
    Route::get('/users/export/xlsx', [UserController::class, 'exportXlsx']);
    Route::post('/users/import/xlsx', [UserController::class, 'importXlsx']);

    Route::get('/kelas/export/pdf', [KelasController::class, 'exportPdf']);
    Route::get('/kelas/export/xlsx', [KelasController::class, 'exportXlsx']);
    Route::post('/kelas/import/xlsx', [KelasController::class, 'importXlsx']);

    Route::get('/mapels/export/pdf', [MapelController::class, 'exportPdf']);
    Route::get('/mapels/export/xlsx', [MapelController::class, 'exportXlsx']);
    Route::post('/mapels/import/xlsx', [MapelController::class, 'importXlsx']);

    Route::get('/ekskuls/export/pdf', [EkskulController::class, 'exportPdf']);
    Route::get('/ekskuls/export/xlsx', [EkskulController::class, 'exportXlsx']);
    Route::post('/ekskuls/import/xlsx', [EkskulController::class, 'importXlsx']);

    // Standard Resource CRUDs
    Route::apiResource('users', UserController::class);
    Route::apiResource('kelas', KelasController::class);
    Route::apiResource('mapels', MapelController::class);
    Route::apiResource('ekskuls', EkskulController::class);
});
