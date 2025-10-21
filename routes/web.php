<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\ReportSectionController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\GameProgressController;
use App\Http\Controllers\SqlGameController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- Rute Publik (Landing Page) ---
Route::get('/', function () {
    // Arahkan langsung ke Laporan Dashboard atau Game Room jika sudah login
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    // Jika belum login, tampilkan landing page standar
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- Rute yang Memerlukan Login ---
Route::middleware(['auth', 'verified'])->group(function () {

    // --- Rute Dashboard Utama (Asumsi ini adalah halaman pertama setelah login) ---
    Route::get('/dashboard', function () {
        $user = Auth::user();
        return Inertia::render('Dashboard', [
            'laporans' => $user->laporans()->latest()->get(),
            'templates' => $user->templates()->get(),
        ]);
    })->name('dashboard');

    // --- Rute Profil Pengguna ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- RUTE FITUR LAPORAN ---
    Route::resource('laporan', LaporanController::class);
    Route::get('/laporan/{laporan}/download', [LaporanController::class, 'download'])->name('laporan.download');
    Route::post('/laporan/preview-live', [LaporanController::class, 'previewLive'])->name('laporan.preview.live');
    Route::resource('laporan', LaporanController::class);
    Route::get('/laporan/{laporan}/download', [LaporanController::class, 'download'])->name('laporan.download');
    Route::put('/sections/{section}', [ReportSectionController::class, 'update'])->name('sections.update');
    Route::get('/laporan/{laporan}/preview', [LaporanController::class, 'preview'])->name('laporan.preview');
    Route::put('/sections/{section}', [ReportSectionController::class, 'update'])->name('sections.update');

    // --- Rute Fitur Template ---
    Route::resource('templates', TemplateController::class)->only(['index', 'store', 'destroy']);

    // --- RUTE FITUR QUESTIFY / GAME ROOM ---
    Route::get('/questify', [GameController::class, 'index'])->name('questify.index');
    // Rute ini sekarang menerima model Game berdasarkan slug-nya secara otomatis
    Route::get('/questify/{game:slug}', [GameController::class, 'show'])->name('questify.show');
});

require __DIR__ . '/auth.php';
