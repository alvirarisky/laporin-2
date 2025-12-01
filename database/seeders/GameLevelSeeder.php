<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\GameLevel;
use Illuminate\Database\Seeder;

class GameLevelSeeder extends Seeder
{
    public function run(): void
    {
        // Cari game berdasarkan slug yang benar
        $game = Game::where('slug', 'flexcode-challenge')->first();

        if ($game) {
            // Hapus level lama dulu biar bersih
            $game->levels()->delete();

            // Buat Level 1 dengan SEMUA field yang dibutuhkan
            GameLevel::create([
                'game_id' => $game->id,
                'level_number' => 1,
                'instruction' => 'Karakter Chibi ini butuh bantuanmu! Gunakan `justify-content` untuk memandunya ke es krim di sebelah kanan.',
                'setup_html' => '<div class="chibi"></div>',
                'solution' => 'justify-content:flex-end;',
                'target_css' => 'background-position: bottom right;',
            ]);

            // Buat Level 2 dengan SEMUA field yang dibutuhkan
            GameLevel::create([
                'game_id' => $game->id,
                'level_number' => 2,
                'instruction' => 'Bagus! Sekarang ada dua karakter. Posisikan mereka di tengah agar bisa berbagi es krim.',
                'setup_html' => '<div class="chibi"></div><div class="chibi"></div>',
                'solution' => 'justify-content:center;',
                'target_css' => 'background-position: bottom center;',
            ]);
        }
    }
}
