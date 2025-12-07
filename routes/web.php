<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\ImageUploadController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportSectionController;
use App\Http\Controllers\TemplateController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

        // Ambil laporan dan template milik user dengan sections untuk progress calculation
        return Inertia::render('Dashboard', [
            'laporans' => $user->laporans()->with('sections')->latest()->get(),
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

    // Rute untuk CRUD section/bab
    Route::post('/laporan/{laporan}/sections', [ReportSectionController::class, 'store'])->name('sections.store');
    Route::put('/sections/{section}', [ReportSectionController::class, 'update'])->name('sections.update');
    Route::delete('/sections/{section}', [ReportSectionController::class, 'destroy'])->name('sections.destroy');

    // --- Rute Fitur Template ---
    Route::resource('templates', TemplateController::class)->only(['index', 'store', 'destroy']);
    Route::post('/laporan/{laporan}/import-template', [TemplateController::class, 'import'])->name('templates.import');
    Route::post('/templates/{template}/use', [TemplateController::class, 'useTemplate'])->name('templates.use');
    Route::post('/templates/{template}/use/laporan/{laporan}', [TemplateController::class, 'useTemplate'])->name('templates.use.laporan');
    Route::post('/templates/{template}/apply/{laporan}', [TemplateController::class, 'apply'])->name('templates.apply');

    // --- Rute Upload Gambar ---
    Route::post('/upload-image', [ImageUploadController::class, 'store'])->name('images.upload');

    // --- RUTE FITUR QUESTIFY / GAME ROOM ---
    // Halaman Lobby: menampilkan semua topik & game
    Route::get('/questify', [GameController::class, 'index'])->name('questify.index');
    // Halaman Game: menampilkan game berdasarkan slug
    Route::get('/questify/{game:slug}', [GameController::class, 'show'])->name('questify.show');

    Route::get('/templates', function () {
        return response()->json([
            'status' => 'success',
            'data' => [
                ['id' => 1, 'name' => 'Basic Layout', 'code' => 'display: flex;'],
                ['id' => 2, 'name' => 'Center Chibi', 'code' => 'justify-content: center;']
            ]
        ]);
    })->name('questify.templates');
});

// --- Rute Autentikasi (login, register, dll) ---
require __DIR__ . '/auth.php';
