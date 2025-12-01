<?php

namespace Database\Seeders;

use App\Models\GameLevel;
use App\Models\Major;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $structures = [
            // A. Teknologi Informasi
            [
                'name' => 'Teknologi Informasi',
                'slug' => 'teknologi-informasi',
                'description' => 'Program studi yang fokus pada rekayasa perangkat lunak dan teknologi informasi.',
                'topics' => [
                    [
                        'name' => 'Pemrograman Web',
                        'slug' => 'pemrograman-web',
                        'description' => 'Dasar-dasar pemrograman web dan layout CSS.',
                        'games' => [
                            [
                                'title' => 'Flexbox Chibi',
                                'slug' => 'flexbox-chibi',
                                'description' => 'Bantu Chibi bergerak menggunakan properti Flexbox.',
                                'game_type' => 'css',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Gunakan properti CSS untuk memindahkan Chibi ke sisi kanan dengan `justify-content`.',
                                        'setup_html' => <<<HTML
<div style="display:flex;align-items:center;justify-content:flex-start;width:100%;height:160px;padding:1rem;background:#eef2ff;">
    <img src="/assets/chibi/chibi-default.png" alt="Chibi" style="width:72px;height:72px;">
</div>
HTML,
                                        'initial_code' => 'display:flex; justify-content:flex-start; align-items:center;',
                                        'solution' => 'display:flex; justify-content:flex-end; align-items:center;',
                                        'target_answer' => null,
                                        'target_css' => 'justify-content:flex-end;',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Basis Data',
                        'slug' => 'basis-data',
                        'description' => 'Pengenalan query SQL dasar.',
                        'games' => [
                            [
                                'title' => 'SQL Detective',
                                'slug' => 'sql-detective',
                                'description' => 'Tuliskan query SQL untuk menyelidiki data.',
                                'game_type' => 'sql',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Tampilkan semua baris dari tabel `mahasiswa`.',
                                        'setup_html' => null,
                                        'initial_code' => 'SELECT  FROM mahasiswa;',
                                        'solution' => 'SELECT * FROM mahasiswa;',
                                        'target_answer' => null,
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            // B. Ilmu Komputer
            [
                'name' => 'Ilmu Komputer',
                'slug' => 'ilmu-komputer',
                'description' => 'Program studi yang mempelajari teori komputasi dan algoritma.',
                'topics' => [
                    [
                        'name' => 'Kalkulus Dasar',
                        'slug' => 'kalkulus-dasar',
                        'description' => 'Konsep dasar turunan dan limit.',
                        'games' => [
                            [
                                'title' => 'Derivative Dash',
                                'slug' => 'derivative-dash',
                                'description' => 'Jawab pertanyaan turunan fungsi secara cepat.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Turunan dari f(x) = 2x^2?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '4x',
                                        'target_answer' => '4x',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Turunan dari f(x) = 5?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '0',
                                        'target_answer' => '0',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Algoritma',
                        'slug' => 'algoritma',
                        'description' => 'Struktur kontrol dan perulangan dalam pemrograman.',
                        'games' => [
                            [
                                'title' => 'Loop Logic',
                                'slug' => 'loop-logic',
                                'description' => 'Analisis perilaku perulangan.',
                                'game_type' => 'logic',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Berapa kali loop berjalan: for(i = 0; i < 5; i++) ?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '5',
                                        'target_answer' => '5',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            // C. Sistem Informasi
            [
                'name' => 'Sistem Informasi',
                'slug' => 'sistem-informasi',
                'description' => 'Menggabungkan teknologi informasi dan proses bisnis.',
                'topics' => [
                    [
                        'name' => 'Logika Bisnis',
                        'slug' => 'logika-bisnis',
                        'description' => 'Dasar-dasar alur proses bisnis dan dokumentasi.',
                        'games' => [
                            [
                                'title' => 'Process Flow',
                                'slug' => 'process-flow',
                                'description' => 'Uji pemahamanmu tentang tahapan SDLC.',
                                'game_type' => 'quiz',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Apa langkah pertama dalam Software Development Life Cycle (SDLC)?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'planning',
                                        'target_answer' => 'planning',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            // D. Teknik Elektro
            [
                'name' => 'Teknik Elektro',
                'slug' => 'teknik-elektro',
                'description' => 'Mempelajari sistem kelistrikan dan logika digital.',
                'topics' => [
                    [
                        'name' => 'Logika Digital',
                        'slug' => 'logika-digital',
                        'description' => 'Representasi bilangan dan gerbang logika.',
                        'games' => [
                            [
                                'title' => 'Binary Breaker',
                                'slug' => 'binary-breaker',
                                'description' => 'Konversi bilangan biner ke desimal.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Konversi bilangan biner 101 ke desimal.',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '5',
                                        'target_answer' => '5',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Konversi bilangan biner 1111 ke desimal.',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '15',
                                        'target_answer' => '15',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            // E. Sains Data
            [
                'name' => 'Sains Data',
                'slug' => 'sains-data',
                'description' => 'Belajar mengekstrak insight dari data.',
                'topics' => [
                    [
                        'name' => 'Statistika Dasar',
                        'slug' => 'statistika-dasar',
                        'description' => 'Konsep dasar mean, median, dan modus.',
                        'games' => [
                            [
                                'title' => 'Mean Median Mode',
                                'slug' => 'mean-median-mode',
                                'description' => 'Hitung nilai rata-rata, median, dan modus dari kumpulan data.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Berapa mean dari data: 2, 4, 6 ?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '4',
                                        'target_answer' => '4',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($structures as $majorData) {
            $major = Major::updateOrCreate(
                ['slug' => $majorData['slug']],
                Arr::except($majorData, ['topics'])
            );

            foreach ($majorData['topics'] as $topicData) {
                $topic = $major->topics()->updateOrCreate(
                    ['slug' => $topicData['slug']],
                    Arr::except($topicData, ['games'])
                );

                foreach ($topicData['games'] as $gameData) {
                    $game = $topic->games()->updateOrCreate(
                        ['slug' => $gameData['slug']],
                        Arr::only($gameData, ['title', 'slug', 'description', 'game_type'])
                    );

                    foreach ($gameData['levels'] as $levelData) {
                        GameLevel::updateOrCreate(
                            [
                                'game_id' => $game->id,
                                'level' => $levelData['level'],
                            ],
                            Arr::except($levelData, ['level'])
                        );
                    }
                }
            }
        }
    }
}
