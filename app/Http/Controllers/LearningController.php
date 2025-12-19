<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LearningController extends Controller
{
    public function show($gameSlug)
    {
        // Cari game berdasarkan slug, load relasi materinya
        $game = Game::with('learningMaterial')->where('slug', $gameSlug)->firstOrFail();
        
        // Cek: Kalau game ini GAK PUNYA materi, langsung lempar ke Game Level
        if (!$game->learningMaterial) {
            return redirect()->route('questify.show', $game->slug);
        }

        return Inertia::render('Questify/Learning', [
            'game' => $game,
            'material' => $game->learningMaterial
        ]);
    }
}