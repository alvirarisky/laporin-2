<?php

namespace App\Http\Controllers;

use App\Models\GameLevel;
use Illuminate\Http\Request;

class SqlGameController extends Controller
{
    public function execute(Request $request, GameLevel $gameLevel)
    {
        $request->validate(['query' => 'required|string']);

        // Bersihkan query dari user dan dari database
        $userQuery = str_replace(' ', '', strtolower(trim($request->input('query'))));
        $solutionQuery = str_replace(' ', '', strtolower(trim($gameLevel->solution)));

        if ($userQuery === $solutionQuery) {
            return response()->json([
                'correct' => true,
                'result' => json_decode($gameLevel->success_data),
            ]);
        }

        return response()->json([
            'correct' => false,
            'message' => 'Query salah, petunjuk tidak ditemukan. Coba lagi!',
        ]);
    }
}
