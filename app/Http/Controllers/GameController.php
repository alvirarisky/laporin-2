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
        $game->load([
            'levels',
            'topic.major',
        ]);

        $progressCollection = $game->progresses()
            ->where('user_id', Auth::id())
            ->get()
            ->keyBy('level_id')
            ->map(fn (GameProgress $progress) => [
                'level_id' => $progress->level_id,
                'status' => $progress->status,
                'score' => $progress->score,
                'updated_at' => $progress->updated_at,
            ]);

        $progressPayload = $progressCollection->toArray();

        $startLevelIndex = $this->resolveStartingLevelIndex($game->levels, $progressCollection);

        return Inertia::render('Questify/Game', [
            'game' => $game,
            'startLevelIndex' => $startLevelIndex,
            'progress' => $progressPayload,
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

    public function checkAnswer(Request $request)
    {
        // Validasi input dasar
        $validated = $request->validate([
            'level_id' => 'required|exists:game_levels,id',
            'user_answer' => 'required|string',
        ]);

        // Sanitasi input dasar
        $levelId = (int) $validated['level_id'];
        $rawAnswer = trim($validated['user_answer']);

        // Cari level dan game
        $level = GameLevel::findOrFail($levelId);
        $game = $level->game()->firstOrFail();

        // Tentukan jawaban yang benar
        $correctAnswer = $level->target_answer ?? $level->solution;
        $isCorrect = false;
        $message = 'Masih ada yang salah, koreksi lagi ya!';

        // Logic pengecekan berdasarkan game_type
        switch ($game->game_type) {
            case 'math':
            case 'logic':
                // Math/Logic: Bandingkan sebagai angka jika memungkinkan, atau case-insensitive string
                $isCorrect = $this->compareMathLogic($rawAnswer, $correctAnswer);
                break;
            case 'css':
                // CSS: Hapus spasi berlebih, normalisasi sekitar tanda baca, abaikan semicolon di akhir
                if ($level->target_css) {
                    $isCorrect = $this->normalizeCss($rawAnswer) === $this->normalizeCss($level->target_css) ||
                                 $this->normalizeCss($rawAnswer) === $this->normalizeCss($level->solution);
                } else {
                $isCorrect = $this->normalizeCss($rawAnswer) === $this->normalizeCss($level->solution);
                }
                break;
            case 'sql':
                // SQL: Hapus spasi berlebih, normalisasi sekitar tanda baca, abaikan semicolon di akhir
                $isCorrect = $this->validateSqlAnswer($rawAnswer, $level->solution);
                break;
            default:
                // Quiz type - case-insensitive, trimmed comparison
                $isCorrect = $this->normalizeSimple($rawAnswer) === $this->normalizeSimple($correctAnswer);
                break;
        }

        // Response dan penyimpanan progress
        if ($isCorrect) {
            $message = 'Jawaban kamu tepat! 🎉';
            // Simpan progress jika benar
            $this->saveProgress($game->id, $level->id, 'completed');
        } else {
            $this->saveProgress($game->id, $level->id, 'failed');
        }

        return response()->json([
            'success' => $isCorrect,
            'message' => $message,
            'correct_answer' => $isCorrect ? null : $correctAnswer, // Hanya tampilkan jika salah
        ]);
    }

    private function saveProgress($gameId, $levelId, $status)
    {
        GameProgress::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'game_id' => $gameId,
                'level_id' => $levelId,
            ],
            [
                'status' => $status,
                'score' => $status === 'completed' ? 10 : 0,
            ]
        );
    }

    public function storeProgress(Request $request)
    {
        $validated = $request->validate([
            'game_id' => 'required|exists:games,id',
            'level_id' => 'required|exists:game_levels,id',
            'status' => 'required|in:completed,failed',
        ]);

        $userId = Auth::id();
        $level = GameLevel::where('id', $validated['level_id'])
            ->where('game_id', $validated['game_id'])
            ->firstOrFail();

        $progress = GameProgress::updateOrCreate(
            [
                'user_id' => $userId,
                'game_id' => $validated['game_id'],
                'level_id' => $validated['level_id'],
            ],
            [
                'status' => $validated['status'],
                'score' => $validated['status'] === 'completed' ? 10 : 0,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Progres tersimpan!',
            'progress' => $progress,
        ]);
    }

    private function resolveStartingLevelIndex(Collection $levels, Collection $progressCollection): int
    {
        if ($levels->isEmpty()) {
            return 0;
        }

        foreach ($levels as $index => $level) {
            $currentProgress = $progressCollection->get($level->id);
            if (!$currentProgress || $currentProgress['status'] !== 'completed') {
                return $index;
            }
        }

        return max($levels->count() - 1, 0);
    }

    private function normalizeCss(string $answer): string
    {
        // Trim spasi di awal/akhir
        $trimmed = trim($answer);
        
        // Convert to lowercase
        $lower = mb_strtolower($trimmed, 'UTF-8');
        
        // Hapus semua spasi berlebih (multiple spaces menjadi single space)
        $singleSpace = preg_replace('/\s+/', ' ', $lower);
        
        // Hapus spasi di sekitar tanda baca penting ( : menjadi :, ; menjadi ;)
        $noSpacesAroundSymbols = preg_replace('/\s*([:;])\s*/', '$1', $singleSpace);
        
        // Abaikan tanda titik koma (;) di akhir string
        $normalized = rtrim($noSpacesAroundSymbols, ';');
        
        return trim($normalized);
    }

    private function normalizeCssFlexible(string $answer): string
    {
        // More flexible CSS normalization - handles multiple properties
        $trimmed = trim($answer);
        $lower = mb_strtolower($trimmed, 'UTF-8');
        
        // Split by semicolon and normalize each property
        $properties = array_filter(array_map('trim', explode(';', $lower)));
        $normalizedProps = [];
        
        foreach ($properties as $prop) {
            if (empty($prop)) continue;
            // Remove spaces around colon
            $prop = preg_replace('/\s*:\s*/', ':', trim($prop));
            $normalizedProps[] = $prop;
        }
        
        // Sort properties for consistent comparison (optional, but helps)
        sort($normalizedProps);
        
        return implode(';', $normalizedProps);
    }

    private function normalizeSimple(string $answer): string
    {
        $lower = mb_strtolower($answer, 'UTF-8');
        return trim(preg_replace('/\s+/', ' ', $lower));
    }

    private function normalizeSql(string $answer): string
    {
        // Trim spasi di awal/akhir
        $trimmed = trim($answer);
        
        // Convert to lowercase
        $lower = mb_strtolower($trimmed, 'UTF-8');
        
        // Hapus semua spasi berlebih (multiple spaces menjadi single space)
        $singleSpace = preg_replace('/\s+/', ' ', $lower);
        
        // Hapus spasi di sekitar tanda baca penting (tetap pertahankan spasi antar keyword)
        $normalized = preg_replace('/\s*([,;()])\s*/', '$1', $singleSpace);
        
        // Abaikan tanda titik koma (;) di akhir string
        $normalized = rtrim($normalized, ';');
        
        return trim($normalized);
    }

    private function validateSqlAnswer(string $answer, ?string $solution): bool
    {
        if (!$solution) {
            return false;
        }

        $normalizedAnswer = $this->normalizeSql($answer);
        $normalizedSolution = $this->normalizeSql($solution);
        
        // Check if answer contains essential SQL keywords
        $hasSelect = str_contains($normalizedAnswer, 'select');
        $hasFrom = str_contains($normalizedAnswer, 'from');

        if (!$hasSelect || !$hasFrom) {
            return false;
        }

        // Compare normalized versions
        return $normalizedAnswer === $normalizedSolution;
    }

    private function compareMathLogic(?string $answer, ?string $target): bool
    {
        if ($answer === null || $target === null) {
            return false;
        }

        // Trim and normalize both (remove extra whitespace)
        $normalizedAnswer = trim(preg_replace('/\s+/', ' ', $answer));
        $normalizedTarget = trim(preg_replace('/\s+/', ' ', $target));

        // Try numeric comparison first (flexible: "5" == "5.0" == "5.00")
        $answerNumeric = $this->toNumeric($normalizedAnswer);
        $targetNumeric = $this->toNumeric($normalizedTarget);

        if ($answerNumeric !== null && $targetNumeric !== null) {
            // Use small epsilon for floating point comparison
            return abs($answerNumeric - $targetNumeric) < 0.00001;
        }

        // Fallback to case-insensitive string comparison
        $answerLower = mb_strtolower($normalizedAnswer, 'UTF-8');
        $targetLower = mb_strtolower($normalizedTarget, 'UTF-8');
        
        return $answerLower === $targetLower;
    }

    private function toNumeric(string $value): ?float
    {
        // Remove any whitespace
        $trimmed = trim($value);
        
        // Replace comma with dot (for decimal separator)
        $sanitized = str_replace(',', '.', $trimmed);
        
        // Remove any non-numeric characters except minus, dot, and e/E (for scientific notation)
        $cleaned = preg_replace('/[^0-9.\-eE]/', '', $sanitized);
        
        if (is_numeric($cleaned)) {
            return (float) $cleaned;
        }

        return null;
    }
}
