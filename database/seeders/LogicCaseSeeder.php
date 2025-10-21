<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;
use App\Models\GameLevel;

class LogicCaseSeeder extends Seeder
{
    public function run(): void
    {
        // Cari game "Logic Case Files"
        $game = Game::where('slug', 'logic-case-files')->first();

        if ($game) {
            // Hapus level lama jika ada biar bersih
            $game->levels()->delete();

            // LEVEL 1: MENEMUKAN TKP (LENGKAPI SEMUA FIELD)
            GameLevel::create([
                'game_id' => $game->id,
                'level_number' => 1,
                'instruction' => 'Sebuah kejahatan telah terjadi! Laporan pertama menyebutkan kejahatan terjadi di "SQL City Park". Gunakan SQL untuk melihat semua data dari tabel `crime_scene_reports` di mana lokasinya adalah "SQL City Park".',
                'setup_html' => '<h4>Tabel: crime_scene_reports</h4><p>Kolom: date, type, description, city</p>',
                'solution' => "SELECT * FROM crime_scene_reports WHERE city = 'SQL City Park';",
                'success_data' => json_encode([
                    'headers' => ['date', 'type', 'description'],
                    'rows' => [
                        ['2025-10-13', 'pembunuhan', 'Kejahatan terjadi di SQL City Park. Ada dua saksi.'],
                    ]
                ])
            ]);

            // LEVEL 2: MENCARI SAKSI (LENGKAPI SEMUA FIELD)
            GameLevel::create([
                'game_id' => $game->id,
                'level_number' => 2,
                'instruction' => 'Laporan dari TKP menyebutkan ada dua saksi. Saksi pertama tinggal di jalan "Northwestern Dr" dan saksi kedua bernama "Annabel". Temukan data mereka dari tabel `person`!',
                'setup_html' => '<h4>Tabel: person</h4><p>Kolom: id, name, license_id, address_street_name</p>',
                'solution' => "SELECT * FROM person WHERE address_street_name = 'Northwestern Dr' OR name = 'Annabel';",
                'success_data' => json_encode([
                    'headers' => ['id', 'name', 'address_street_name'],
                    'rows' => [
                        ['14887', 'Morty Schapiro', 'Northwestern Dr'],
                        ['16371', 'Annabel Miller', 'Franklin Ave'],
                    ]
                ])
            ]);
        }
    }
}