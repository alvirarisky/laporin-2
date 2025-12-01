<?php

use App\Http\Controllers\GameController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Di sini kita mendaftarkan rute API. Rute ini stateless dan
| biasanya dipanggil oleh frontend (React) menggunakan axios/fetch.
|
*/

// Rute default untuk mendapatkan user yang sedang login (jika pakai Sanctum)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// --- RUTE API UNTUK FITUR QUESTIFY ---
// Semua rute di sini perlu login (di-protect oleh Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Rute untuk memvalidasi jawaban user
    // Frontend akan POST ke /api/game/check-answer
    Route::post('/game/check-answer', [GameController::class, 'checkAnswer'])->name('api.game.checkAnswer');

    // Rute untuk menyimpan progres user setelah menyelesaikan level
    // Frontend akan POST ke /api/game/store-progress
    Route::post('/game/store-progress', [GameController::class, 'storeProgress'])->name('api.game.storeProgress');
});
