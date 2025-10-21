<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Topic;
use Inertia\Inertia;

class GameController extends Controller
{
    public function index()
    {
        return Inertia::render('Questify/Lobby', [
            'topics' => Topic::with('games')->get(),
        ]);
    }

    public function show(Game $game)
    {
        return Inertia::render('Questify/Game', [
            'game' => $game->load('levels'), // Pastikan relasi 'levels' ada di model Game
        ]);
    }
}