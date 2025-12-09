<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\GameLevel;
use App\Models\GameProgress;
use App\Models\Major;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index()
    {
        return Inertia::render('Questify/Lobby', [
            'majors' => Major::with(['topics.games' => fn ($query) => $query->withCount('levels')])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function show(Game $game)
    {
        $game->load(['levels', 'topic.major']);
        
        $progressCollection = $game->progresses()
            ->where('user_id', Auth::id())
            ->get()
            ->keyBy('level_id')
            ->map(fn ($p) => ['status' => $p->status, 'score' => $p->score]);

        return Inertia::render('Questify/Game', [
            'game' => $game,
            'startLevelIndex' => $this->resolveStartingLevelIndex($game->levels, $progressCollection),
            'progress' => $progressCollection,
        ]);
    }

    public function checkAnswer(Request $request)
    {
        $validated = $request->validate([
            'level_id' => 'required|exists:game_levels,id',
            'user_answer' => 'required|string',
        ]);

        $level = GameLevel::findOrFail($validated['level_id']);
        $game = $level->game;
        
        // AMBIL JAWABAN YANG BENAR (TARGET ANSWER DIPRIORITASKAN UNTUK MATH/LOGIC)
        $correctAnswer = $level->target_answer ?? $level->correct_answer;
        $userAnswer = trim($validated['user_answer']);
        $isCorrect = false;

        switch ($game->game_type) {
            case 'math':
            case 'logic':
                $isCorrect = $this->compareMathLogic($userAnswer, $correctAnswer);
                break;
            case 'css':
                // CSS fleksibel: cek target CSS atau full syntax
                if ($level->target_css) {
                     $isCorrect = $this->normalizeCss($userAnswer) === $this->normalizeCss($level->target_css) || 
                                  $this->normalizeCss($userAnswer) === $this->normalizeCss($level->correct_answer);
                } else {
                     $isCorrect = $this->normalizeCss($userAnswer) === $this->normalizeCss($level->correct_answer);
                }
                break;
            case 'sql':
                $isCorrect = $this->validateSqlAnswer($userAnswer, $level->correct_answer);
                break;
            default:
                $isCorrect = strtolower(trim($userAnswer)) === strtolower(trim($correctAnswer));
        }

        // SIMPAN PROGRESS
        $status = $isCorrect ? 'completed' : 'failed';
        GameProgress::updateOrCreate(
            ['user_id' => Auth::id(), 'game_id' => $game->id, 'level_id' => $level->id],
            ['status' => $status, 'score' => $isCorrect ? 10 : 0]
        );

        return response()->json([
            'success' => $isCorrect,
            'message' => $isCorrect ? 'Jawaban Benar! 🎉' : 'Kurang tepat, coba cek hint.',
            'correct_answer' => $isCorrect ? null : null // Jangan kasih kunci jawaban kalau salah
        ]);
    }

    // --- HELPER FUNCTIONS ---

    private function resolveStartingLevelIndex($levels, $progress)
    {
        foreach ($levels as $index => $level) {
            if (!isset($progress[$level->id]) || $progress[$level->id]['status'] !== 'completed') return $index;
        }
        return count($levels) > 0 ? count($levels) - 1 : 0;
    }

    private function normalizeCss($str) {
        $str = preg_replace('/\s+/', ' ', strtolower(trim($str))); // Hapus spasi ganda & lowercase
        $str = preg_replace('/\s*([:;])\s*/', '$1', $str); // Hapus spasi sekitar : dan ;
        return trim($str, ';'); // Hapus ; di akhir
    }

    private function normalizeSql($str) {
        $str = preg_replace('/\s+/', ' ', strtolower(trim($str)));
        $str = preg_replace('/\s*([,;()])\s*/', '$1', $str);
        return trim($str, ';');
    }

    private function validateSqlAnswer($user, $correct) {
        // Cek keyword wajib ada
        if (!str_contains(strtolower($user), 'select') || !str_contains(strtolower($user), 'from')) return false;
        return $this->normalizeSql($user) === $this->normalizeSql($correct);
    }

    private function compareMathLogic($user, $correct) {
        $userNum = floatval(preg_replace('/[^0-9.]/', '', $user));
        $correctNum = floatval(preg_replace('/[^0-9.]/', '', $correct));
        
        // Kalau keduanya angka valid, bandingkan nilai (biar 5 == 5.0)
        if (is_numeric($user) && is_numeric($correct)) {
            return abs($userNum - $correctNum) < 0.0001;
        }
        // Kalau string, bandingkan string
        return strtolower(trim($user)) === strtolower(trim($correct));
    }
}