<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     * Metode ini akan memanggil semua seeder lain dalam urutan yang benar.
     */
    public function run(): void
    {
        // Panggil seeder lain dengan urutan yang logis:
        // 1. Buat Topik dulu, karena Game butuh Topik.
        $this->call(TopicSeeder::class);

        // 2. Buat Game setelah Topik ada, agar bisa dihubungkan.
        $this->call(GameSeeder::class);

        // 3. Buat Level untuk setiap Game setelah Game-nya ada.
        $this->call(GameLevelSeeder::class);
        $this->call(LogicCaseSeeder::class);

        // Anda bisa menambahkan pemanggilan seeder lain di sini jika perlu.
    }
}
