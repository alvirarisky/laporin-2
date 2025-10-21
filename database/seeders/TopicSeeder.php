<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Topic;

class TopicSeeder extends Seeder
{
    public function run(): void
    {
        // Hapus semua topik lama dulu
        Topic::query()->delete();

        // Baru buat yang baru
        Topic::create([
            'name' => 'Basis Data',
            'slug' => 'basis-data',
            'description' => 'Tantangan seputar SQL dan desain database.', // <-- TAMBAHKAN INI
        ]);

        Topic::create([
            'name' => 'Pemrograman Web',
            'slug' => 'pemrograman-web',
            'description' => 'Kuis interaktif tentang HTML, CSS, dan Flexbox.', // <-- TAMBAHKAN INI
        ]);
    }
}
