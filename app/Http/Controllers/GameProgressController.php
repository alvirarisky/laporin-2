<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class GameProgressController extends Controller
{
    /**
     * Menyimpan atau memperbarui progres game user.
     */
    public function store(Request $request, Game $game)
    {
        $request->validate(['score' => 'required|integer']);

        Auth::user()->gameProgress()->updateOrCreate(
            ['game_id' => $game->id],
            ['score' => $request->score]
        );

        return response()->noContent();
    }

    /**
     * Menghapus (mereset) progres game user.
     */
    public function destroy(Game $game)
    {
        Auth::user()->gameProgress()->where('game_id', $game->id)->delete();

        return Redirect::route('questify.show', $game->slug);
    }
}
