<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Topic;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil topik yang dibutuhkan dari database
        $topicDb = Topic::where('slug', 'basis-data')->firstOrFail();
        $topicAlgo = Topic::where('slug', 'algoritma-logika')->firstOrFail();
        $topicWeb = Topic::where('slug', 'pemrograman-web')->firstOrFail();
        $topicUiux = Topic::where('slug', 'ui-ux-design')->firstOrFail();

        // Buat Game #1 dan hubungkan ke topiknya
        $game1 = Game::create([
            'title' => 'Logic Case Files',
            'slug' => 'logic-case-files',
            'description' => 'Berperan sebagai detektif digital dan pecahkan kasus dengan mengeksekusi perintah logika.',
        ]);
        $game1->topics()->attach([$topicDb->id, $topicAlgo->id]);

        // Buat Game #2 dan hubungkan ke topiknya
        $game2 = Game::create([
            'title' => 'FlexCode Challenge',
            'slug' => 'flexcode-challenge',
            'description' => 'Asah skill front-end-mu dengan menulis kode CSS untuk mengatur posisi elemen visual.',
        ]);
        $game2->topics()->attach([$topicWeb->id, $topicUiux->id]);
    }
}
