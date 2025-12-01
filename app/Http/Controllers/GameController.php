<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameLevel;
use App\Models\GameProgress;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB; // Jika pakai raw query
use Inertia\Inertia;

class GameController extends Controller
{
    /**
     * Menampilkan daftar topik dan game yang tersedia (Lobby).
     */
    public function index()
    {
        return Inertia::render('Questify/Lobby', [
            // Ambil semua topik beserta game-game di dalamnya
            // Eager load relasi 'games'
            'topics' => Topic::with('games')->get(),
        ]);
    }

    /**
     * Menampilkan halaman detail game beserta level-levelnya.
     * Menggunakan route model binding dengan slug.
     */
    public function show(Game $game) // Laravel otomatis cari Game by slug
    {
        // Muat relasi 'levels' agar data level ikut terkirim ke frontend
        // Relasi sudah diurutkan di Model Game
        $game->load('levels');

        // Opsional: Ambil progress terakhir user untuk game ini
        $lastProgress = GameProgress::where('user_id', Auth::id())
            ->where('game_id', $game->id)
            ->latest('updated_at') // Ambil yg terbaru
            ->first();

        $startLevelIndex = 0;
        if ($lastProgress && $lastProgress->status === 'completed') {
            // Jika level terakhir selesai, cari level selanjutnya
            $nextLevel = GameLevel::where('game_id', $game->id)
                ->where('level', '>', $lastProgress->level->level) // Cari level > level terakhir yg disimpan
                ->orderBy('level', 'asc')
                ->first();
            if ($nextLevel) {
                // Cari index level selanjutnya di collection $game->levels
                $startLevelIndex = $game->levels->search(function ($level) use ($nextLevel) {
                    return $level->id === $nextLevel->id;
                });
                if ($startLevelIndex === false) {
                    $startLevelIndex = 0;
                } // Fallback
            } else {
                // Semua level sudah selesai? Tampilkan level terakhir lagi atau pesan khusus
                $startLevelIndex = $game->levels->count() - 1; // Index level terakhir
            }
        } elseif ($lastProgress) {
            // Jika belum selesai, mulai dari level terakhir yg tercatat
            $startLevelIndex = $game->levels->search(function ($level) use ($lastProgress) {
                return $level->id === $lastProgress->level_id;
            });
            if ($startLevelIndex === false) {
                $startLevelIndex = 0;
            } // Fallback
        }

        return Inertia::render('Questify/Game', [
            'game' => $game,
            'startLevelIndex' => $startLevelIndex, // Kirim index level awal
        ]);
    }

    /**
     * API endpoint untuk mengambil level berdasarkan ID Game.
     * Tidak perlu jika 'show' sudah load 'levels'.
     */
    // public function getLevels(Game $game)
    // {
    //     return response()->json($game->levels);
    // }

    /**
     * API endpoint untuk memeriksa jawaban user.
     * Dipanggil via axios dari Game.jsx.
     */
    public function checkAnswer(Request $request)
    {
        $validated = $request->validate([
            'level_id' => 'required|exists:game_levels,id',
            'user_answer' => 'required|string',
        ]);

        $level = GameLevel::findOrFail($validated['level_id']);
        $game = $level->game; // Ambil game terkait

        $isCorrect = false;
        $message = 'Jawaban salah, coba lagi ya!';

        // Normalisasi jawaban (hapus spasi berlebih, lowercase)
        $userAnswerClean = trim(preg_replace('/\s+/', ' ', strtolower($validated['user_answer'])));
        $solutionClean = trim(preg_replace('/\s+/', ' ', strtolower($level->solution)));

        // Logika pengecekan (sesuaikan per game type jika perlu)
        if ($game->game_type === 'sql' && $level->solution_query) {
            // TODO: Eksekusi $userAnswerClean dan $level->solution_query
            // Bandingkan hasilnya. Ini kompleks dan butuh environment SQL sandbox.
            // Untuk sementara, kita cek string saja.
            if ($userAnswerClean === $solutionClean) { // Placeholder check
                $isCorrect = true;
            }
        } else { // Default check (CSS, Quiz, etc.)
            if ($userAnswerClean === $solutionClean) {
                $isCorrect = true;
            }
        }

        if ($isCorrect) {
            $message = 'Yeay, benar! 🎉 Lanjut ke level berikutnya!';
            // Langsung simpan progres di sini
            $this->storeProgressInternal(Auth::id(), $game->id, $level->id, true);
        } else {
            // Simpan progres gagal (opsional)
            // $this->storeProgressInternal(Auth::id(), $game->id, $level->id, false);
        }

        return response()->json([
            'success' => $isCorrect,
            'message' => $message,
        ]);
    }

    /**
     * API endpoint untuk menyimpan progres (dipanggil setelah jawaban benar).
     * Bisa juga dipanggil internal oleh checkAnswer.
     */
    public function storeProgress(Request $request)
    {
        $validated = $request->validate([
            'game_id' => 'required|exists:games,id',
            'level_id' => 'required|exists:game_levels,id',
            'status' => 'required|in:completed,failed', // Atau 'in_progress'
        ]);

        $userId = Auth::id();
        $scoreIncrement = ($validated['status'] === 'completed') ? 10 : 0; // Contoh skor

        $progress = GameProgress::updateOrCreate(
            [
                'user_id' => $userId,
                'game_id' => $validated['game_id'],
                'level_id' => $validated['level_id'], // Kunci unik per user, game, level
            ],
            [
                'status' => $validated['status'],
                // Update score jika perlu (misal: tambah jika complete)
                'score' => DB::raw('score + '.$scoreIncrement), // Hati-hati jika mau replace score
            ]
        );

        return response()->json(['success' => true, 'message' => 'Progres disimpan!']);
    }

    /**
     * Helper internal untuk simpan progres.
     */
    private function storeProgressInternal($userId, $gameId, $levelId, $isCorrect)
    {
        $status = $isCorrect ? 'completed' : 'failed'; // Atau 'in_progress'
        $scoreIncrement = $isCorrect ? 10 : 0; // Contoh skor

        // Gunakan updateOrCreate untuk handle insert atau update
        GameProgress::updateOrCreate(
            [
                'user_id' => $userId,
                'game_id' => $gameId,
                'level_id' => $levelId,
            ],
            [
                'status' => $status,
                // Hanya update score jika status completed dan belum pernah complete sebelumnya?
                // Logic score bisa lebih kompleks
                'score' => DB::raw('score + '.$scoreIncrement),
            ]
        );
    }
}
