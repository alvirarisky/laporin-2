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
        $validated = $request->validate([
            'level_id' => 'required|exists:game_levels,id',
            'user_answer' => 'required|string',
        ]);

        $level = GameLevel::findOrFail($validated['level_id']);
        $game = $level->game()->firstOrFail();

        $rawAnswer = $validated['user_answer'];
        $isCorrect = false;
        $message = 'Masih ada yang salah, koreksi lagi ya!';

        switch ($game->game_type) {
            case 'math':
            case 'logic':
                $target = $level->target_answer ?? $level->solution;
                $isCorrect = $this->compareMathLogic($rawAnswer, $target);
                break;
            case 'css':
                $isCorrect = $this->normalizeCss($rawAnswer) === $this->normalizeCss($level->solution);
                break;
            case 'sql':
                $isCorrect = $this->validateSqlAnswer($rawAnswer, $level->solution);
                break;
            default:
                $target = $level->target_answer ?? $level->solution;
                $isCorrect = $this->normalizeSimple($rawAnswer) === $this->normalizeSimple($target);
                break;
        }

        if ($isCorrect) {
            $message = 'Jawaban kamu tepat! 🎉';
        }

        return response()->json([
            'success' => $isCorrect,
            'message' => $message,
            'exp_gained' => $isCorrect ? 10 : 0,
        ]);
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
        $lower = mb_strtolower($answer, 'UTF-8');
        $normalized = preg_replace('/\s+/', '', $lower);
        return rtrim($normalized, ';');
    }

    private function normalizeSimple(string $answer): string
    {
        $lower = mb_strtolower($answer, 'UTF-8');
        return trim(preg_replace('/\s+/', ' ', $lower));
    }

    private function normalizeSql(string $answer): string
    {
        $lower = mb_strtolower($answer, 'UTF-8');
        $normalized = preg_replace('/\s+/', ' ', $lower);
        return trim($normalized);
    }

    private function validateSqlAnswer(string $answer, ?string $solution): bool
    {
        $normalizedAnswer = $this->normalizeSql($answer);
        $hasSelect = str_contains($normalizedAnswer, 'select ');
        $hasFrom = str_contains($normalizedAnswer, ' from ');

        if (!$hasSelect || !$hasFrom) {
            return false;
        }

        if ($solution) {
            return $normalizedAnswer === $this->normalizeSql($solution);
        }

        return true;
    }

    private function compareMathLogic(?string $answer, ?string $target): bool
    {
        if ($answer === null || $target === null) {
            return false;
        }

        $normalizedAnswer = $this->normalizeSimple($answer);
        $normalizedTarget = $this->normalizeSimple($target);

        $answerNumeric = $this->toNumeric($normalizedAnswer);
        $targetNumeric = $this->toNumeric($normalizedTarget);

        if ($answerNumeric !== null && $targetNumeric !== null) {
            return abs($answerNumeric - $targetNumeric) < 0.00001;
        }

        return $normalizedAnswer === $normalizedTarget;
    }

    private function toNumeric(string $value): ?float
    {
        $sanitized = str_replace(',', '.', $value);
        if (is_numeric($sanitized)) {
            return (float) $sanitized;
        }

        return null;
    }
}
