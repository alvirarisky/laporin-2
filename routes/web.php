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

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Di sini kita mendaftarkan semua rute untuk halaman web.
| Rute API (untuk dipanggil oleh React) ada di routes/api.php.
|
*/

// --- Rute Publik (Landing Page) ---
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- Rute yang Memerlukan Login & Verifikasi Email ---
Route::middleware(['auth', 'verified'])->group(function () {

    // --- Rute Dashboard Utama ---
    Route::get('/dashboard', function () {
        $user = Auth::user();
        // Ambil laporan dan template milik user
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
    // Gunakan Route::resource sekali saja, ini sudah mencakup:
    // index, create, store, show, edit, update, destroy
    Route::resource('laporan', LaporanController::class);

    // Tambahkan rute-rute custom untuk Laporan di sini
    Route::get('/laporan/{laporan}/download-pdf', [LaporanController::class, 'downloadPdf'])->name('laporan.download.pdf');
    Route::get('/laporan/{laporan}/download-docx', [LaporanController::class, 'downloadDocx'])->name('laporan.download.docx');
    Route::post('/laporan/preview-live', [LaporanController::class, 'previewLive'])->name('laporan.preview.live');
    Route::get('/laporan/{laporan}/preview', [LaporanController::class, 'preview'])->name('laporan.preview');
    
    // Rute untuk update section/bab
    Route::put('/sections/{section}', [ReportSectionController::class, 'update'])->name('sections.update');

    // --- Rute Fitur Template ---
    Route::resource('templates', TemplateController::class)->only(['index', 'store', 'destroy']);

    // --- RUTE FITUR QUESTIFY / GAME ROOM ---
    // Halaman Lobby: menampilkan semua topik & game
    Route::get('/questify', [GameController::class, 'index'])->name('questify.index');
    // Halaman Game: menampilkan game berdasarkan slug
    Route::get('/questify/{game:slug}', [GameController::class, 'show'])->name('questify.show');
});

// --- Rute Autentikasi (login, register, dll) ---
require __DIR__ . '/auth.php';
