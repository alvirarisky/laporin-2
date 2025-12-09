<?php

namespace Database\Seeders;

use App\Models\Major;
use App\Models\Topic;
use Illuminate\Database\Seeder;

class TopicSeeder extends Seeder
{
    public function run(): void
    {
        // ==========================================
        // 1. PRODI: TEKNOLOGI INFORMASI (IT)
        // ==========================================
        $itMajor = Major::updateOrCreate([
            'slug' => 'teknologi-informasi'
        ], [
            'name' => 'Teknologi Informasi',
            'description' => 'Fakultas Rekayasa Industri - Jurusan paling santuy tapi tugasnya ngeri.',
        ]);

        // Matkul 1: Pemrograman Web (ID 1 - Buat Game CSS)
        Topic::updateOrCreate([
            'id' => 1, // Kita paksa ID-nya 1 biar connect sama LogicCaseSeeder
        ], [
            'major_id' => $itMajor->id,
            'name' => 'Pemrograman Web',
            'slug' => 'pemrograman-web',
            'description' => 'Belajar HTML, CSS, JS, dan cara memusatkan div.',
        ]);

        // Matkul 2: Basis Data (ID 2 - Buat Game SQL)
        Topic::updateOrCreate([
            'id' => 2, // Kita paksa ID-nya 2
        ], [
            'major_id' => $itMajor->id,
            'name' => 'Basis Data (SQL)',
            'slug' => 'basis-data',
            'description' => 'Seni memanggil data dengan SELECT * FROM kenangan_mantan.',
        ]);

        // Matkul 3: Algoritma & Pemrograman
        Topic::updateOrCreate([
            'slug' => 'algoritma-pemrograman'
        ], [
            'major_id' => $itMajor->id,
            'name' => 'Algoritma & Pemrograman',
            'description' => 'Logika dasar koding. Kalau ini gak lulus, wassalam.',
        ]);


        // ==========================================
        // 2. PRODI: DESAIN KOMUNIKASI VISUAL (DKV)
        // ==========================================
        $dkvMajor = Major::updateOrCreate([
            'slug' => 'desain-komunikasi-visual'
        ], [
            'name' => 'Desain Komunikasi Visual',
            'description' => 'Fakultas Industri Kreatif - Jurusan estetik, begadang demi pixel perfect.',
        ]);

        Topic::updateOrCreate([
            'slug' => 'tipografi'
        ], [
            'major_id' => $dkvMajor->id,
            'name' => 'Tipografi',
            'description' => 'Belajar milih font yang gak bikin sakit mata.',
        ]);

        Topic::updateOrCreate([
            'slug' => 'nirmana'
        ], [
            'major_id' => $dkvMajor->id,
            'name' => 'Nirmana',
            'description' => 'Seni abstrak yang bikin dosen geleng-geleng kepala.',
        ]);


        // ==========================================
        // 3. PRODI: SISTEM INFORMASI (SI)
        // ==========================================
        $siMajor = Major::updateOrCreate([
            'slug' => 'sistem-informasi'
        ], [
            'name' => 'Sistem Informasi',
            'description' => 'Jembatan antara kodingan error dan bisnis cuan.',
        ]);

        Topic::updateOrCreate([
            'slug' => 'manajemen-proyek'
        ], [
            'major_id' => $siMajor->id,
            'name' => 'Manajemen Proyek TI',
            'description' => 'Belajar ngatur deadline biar gak tipes.',
        ]);
    }
}