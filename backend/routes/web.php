<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NilaiController;
use App\Http\Controllers\RaporController;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('web');
    Route::get('/user', [AuthController::class, 'user'])->middleware('web');

    Route::middleware('web')->group(function () {
        Route::get('/nilais', [NilaiController::class, 'index']);
        Route::post('/nilais', [NilaiController::class, 'store']);

        Route::get('/rapors', [RaporController::class, 'index']);
        Route::get('/rapors/{id}', [RaporController::class, 'show']);
        Route::post('/rapors', [RaporController::class, 'store']);
    });
});
