<?php

namespace Database\Seeders;

use App\Models\GameLevel;
use App\Models\Major;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB; // Tambahin ini buat reset ID kalau perlu

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $structures = [
            // A. Teknologi Informasi (TI)
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
                                        'instruction' => 'Pindahkan Chibi ke kanan menggunakan `justify-content: flex-end;`.',
                                        'setup_html' => <<<HTML
<div style="display:flex;align-items:center;justify-content:flex-start;width:100%;height:160px;padding:1rem;background:#eef2ff;">
    <img src="/images/chibi-default.png" alt="Chibi" style="width:72px;height:72px;">
</div>
HTML,
                                        'initial_code' => 'display:flex; justify-content:flex-start; align-items:center;',
                                        'solution' => 'display:flex; justify-content:flex-end; align-items:center;',
                                        'target_answer' => null,
                                        'target_css' => 'justify-content: flex-end;',
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Pindahkan Chibi ke tengah horizontal menggunakan `justify-content: center;`.',
                                        'setup_html' => <<<HTML
<div style="display:flex;align-items:center;justify-content:flex-start;width:100%;height:160px;padding:1rem;background:#eef2ff;">
    <img src="/images/chibi-default.png" alt="Chibi" style="width:72px;height:72px;">
</div>
HTML,
                                        'initial_code' => 'display:flex; justify-content:flex-start; align-items:center;',
                                        'solution' => 'display:flex; justify-content:center; align-items:center;',
                                        'target_answer' => null,
                                        'target_css' => 'justify-content: center;',
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Pindahkan Chibi ke bawah menggunakan `align-items: flex-end;`. Container sudah memiliki height.',
                                        'setup_html' => <<<HTML
<div style="display:flex;align-items:flex-start;justify-content:flex-start;width:100%;height:200px;padding:1rem;background:#eef2ff;">
    <img src="/images/chibi-default.png" alt="Chibi" style="width:72px;height:72px;">
</div>
HTML,
                                        'initial_code' => 'display:flex; align-items:flex-start; justify-content:flex-start;',
                                        'solution' => 'display:flex; align-items:flex-end; justify-content:flex-start;',
                                        'target_answer' => null,
                                        'target_css' => 'align-items: flex-end;',
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Pindahkan Chibi ke tengah (horizontal dan vertikal) menggunakan `justify-content: center; align-items: center;`.',
                                        'setup_html' => <<<HTML
<div style="display:flex;align-items:flex-start;justify-content:flex-start;width:100%;height:200px;padding:1rem;background:#eef2ff;">
    <img src="/images/chibi-default.png" alt="Chibi" style="width:72px;height:72px;">
</div>
HTML,
                                        'initial_code' => 'display:flex; align-items:flex-start; justify-content:flex-start;',
                                        'solution' => 'display:flex; justify-content:center; align-items:center;',
                                        'target_answer' => null,
                                        'target_css' => 'justify-content: center; align-items: center;',
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Balik urutan Chibi menggunakan `flex-direction: row-reverse;`.',
                                        'setup_html' => <<<HTML
<div style="display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%;height:160px;padding:1rem;background:#eef2ff;">
    <img src="/images/chibi-default.png" alt="Chibi" style="width:72px;height:72px;">
    <img src="/images/ice-cream.png" alt="Target" style="width:64px;height:64px;">
</div>
HTML,
                                        'initial_code' => 'display:flex; flex-direction:row; align-items:center; justify-content:flex-start;',
                                        'solution' => 'display:flex; flex-direction:row-reverse; align-items:center; justify-content:flex-start;',
                                        'target_answer' => null,
                                        'target_css' => 'flex-direction: row-reverse;',
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
                            // GAME 1: SQL DETECTIVE
                            [
                                'title' => 'SQL Detective',
                                'slug' => 'sql-detective',
                                'description' => 'Tuliskan query SQL untuk menyelidiki data.',
                                'game_type' => 'sql',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Tampilkan semua baris dari tabel `users`.',
                                        'setup_html' => null,
                                        'initial_code' => 'SELECT  FROM users;',
                                        'solution' => 'SELECT * FROM users;',
                                        'target_answer' => null,
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Tampilkan kolom `name` dan `email` dari tabel `users`.',
                                        'setup_html' => null,
                                        'initial_code' => 'SELECT  FROM users;',
                                        'solution' => 'SELECT name, email FROM users;',
                                        'target_answer' => null,
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Tampilkan semua data dari tabel `users` dimana `status` = "active".',
                                        'setup_html' => null,
                                        'initial_code' => 'SELECT * FROM users;',
                                        'solution' => 'SELECT * FROM users WHERE status = "active";',
                                        'target_answer' => null,
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Hitung jumlah baris di tabel `users` menggunakan COUNT.',
                                        'setup_html' => null,
                                        'initial_code' => 'SELECT  FROM users;',
                                        'solution' => 'SELECT COUNT(*) FROM users;',
                                        'target_answer' => null,
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Urutkan data dari tabel `users` berdasarkan `name` secara ascending (ASC).',
                                        'setup_html' => null,
                                        'initial_code' => 'SELECT * FROM users;',
                                        'solution' => 'SELECT * FROM users ORDER BY name ASC;',
                                        'target_answer' => null,
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                            // 🔥 GAME 2: LOGIC CASE FILES (INI YANG HILANG KEMAREN) 🔥
                            [
                                'title' => 'Logic Case Files',
                                'slug' => 'logic-case-files',
                                'description' => 'Pecahkan misteri kriminal menggunakan skill SQL-mu.',
                                'game_type' => 'sql', // Pakai tipe SQL karena solusinya query
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Sebuah kejahatan telah terjadi! Laporan pertama menyebutkan kejahatan terjadi di "SQL City Park". Gunakan SQL untuk melihat semua data dari tabel `crime_scene_reports` di mana lokasinya adalah "SQL City Park".',
                                        'setup_html' => '<h4>Tabel: crime_scene_reports</h4><p>Kolom: date, type, description, city</p>',
                                        'initial_code' => "SELECT * FROM crime_scene_reports WHERE ...",
                                        'solution' => "SELECT * FROM crime_scene_reports WHERE city = 'SQL City Park';",
                                        'target_answer' => null,
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Laporan dari TKP menyebutkan ada dua saksi. Saksi pertama tinggal di jalan "Northwestern Dr" dan saksi kedua bernama "Annabel". Temukan data mereka dari tabel `person`!',
                                        'setup_html' => '<h4>Tabel: person</h4><p>Kolom: id, name, license_id, address_street_name</p>',
                                        'initial_code' => "SELECT * FROM person WHERE ...",
                                        'solution' => "SELECT * FROM person WHERE address_street_name = 'Northwestern Dr' OR name = 'Annabel';",
                                        'target_answer' => null,
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Jaringan Komputer',
                        'slug' => 'jaringan-komputer',
                        'description' => 'Konsep dasar jaringan komputer dan subnetting.',
                        'games' => [
                            [
                                'title' => 'Subnet Calculator',
                                'slug' => 'subnet-calculator',
                                'description' => 'Hitung jumlah host dalam subnet mask.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Berapa jumlah host yang tersedia di subnet /24?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '254',
                                        'target_answer' => '254',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Berapa jumlah host yang tersedia di subnet /25?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '126',
                                        'target_answer' => '126',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Berapa jumlah host yang tersedia di subnet /26?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '62',
                                        'target_answer' => '62',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Jika IP address 192.168.1.0 dengan subnet mask /24, berapa IP pertama yang bisa digunakan?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '192.168.1.1',
                                        'target_answer' => '192.168.1.1',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Jika IP address 192.168.1.0 dengan subnet mask /24, berapa IP terakhir yang bisa digunakan?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '192.168.1.254',
                                        'target_answer' => '192.168.1.254',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Keamanan Siber',
                        'slug' => 'keamanan-siber',
                        'description' => 'Dasar-dasar kriptografi dan keamanan informasi.',
                        'games' => [
                            [
                                'title' => 'Caesar Cipher',
                                'slug' => 'caesar-cipher',
                                'description' => 'Decrypt pesan yang dienkripsi dengan Caesar Cipher.',
                                'game_type' => 'logic',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Decrypt teks "IFMMP" dengan geser -1 (shift -1).',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'HELLO',
                                        'target_answer' => 'HELLO',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Decrypt teks "KHOOR" dengan geser -3 (shift -3).',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'HELLO',
                                        'target_answer' => 'HELLO',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Encrypt teks "WORLD" dengan geser +1 (shift +1).',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'XPSME',
                                        'target_answer' => 'XPSME',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Decrypt teks "MJQQT" dengan geser -1 (shift -1).',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'LIPPS',
                                        'target_answer' => 'LIPPS',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Encrypt teks "SECRET" dengan geser +5 (shift +5).',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'XJHWJY',
                                        'target_answer' => 'XJHWJY',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Sistem Operasi',
                        'slug' => 'sistem-operasi',
                        'description' => 'Pengenalan sistem operasi Linux dan command line.',
                        'games' => [
                            [
                                'title' => 'Linux Command',
                                'slug' => 'linux-command',
                                'description' => 'Uji pengetahuanmu tentang perintah Linux dasar.',
                                'game_type' => 'quiz',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Perintah untuk menampilkan isi direktori (list directory)?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'ls',
                                        'target_answer' => 'ls',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Perintah untuk membuat direktori baru?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'mkdir',
                                        'target_answer' => 'mkdir',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Perintah untuk menghapus file?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'rm',
                                        'target_answer' => 'rm',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Perintah untuk menampilkan lokasi direktori saat ini?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'pwd',
                                        'target_answer' => 'pwd',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Perintah untuk mengubah direktori?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'cd',
                                        'target_answer' => 'cd',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            // B. Ilmu Komputer (CS)
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
                                        'instruction' => 'Turunan f(x)=x^2?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '2x',
                                        'target_answer' => '2x',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Turunan f(x)=3x^3?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '9x^2',
                                        'target_answer' => '9x^2',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Turunan f(x)=5x?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '5',
                                        'target_answer' => '5',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Turunan f(x)=x^2 + 3x?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '2x + 3',
                                        'target_answer' => '2x + 3',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Turunan f(x)=4x^4 - 2x^2?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '16x^3 - 4x',
                                        'target_answer' => '16x^3 - 4x',
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
                                        'instruction' => 'Output for(i=0;i<3;i++) print(i)?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '012',
                                        'target_answer' => '012',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Output for(i=1;i<=4;i++) print(i)?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '1234',
                                        'target_answer' => '1234',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Output for(i=0;i<5;i+=2) print(i)?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '024',
                                        'target_answer' => '024',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Output for(i=5;i>0;i--) print(i)?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '54321',
                                        'target_answer' => '54321',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Output for(i=0;i<4;i++) print(i*2)?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '0246',
                                        'target_answer' => '0246',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Matematika Diskrit',
                        'slug' => 'matematika-diskrit',
                        'description' => 'Teori himpunan, logika proposisional, dan kombinatorika.',
                        'games' => [
                            [
                                'title' => 'Set Theory',
                                'slug' => 'set-theory',
                                'description' => 'Hitung operasi himpunan dengan benar.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Biner 101 ke Desimal?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '5',
                                        'target_answer' => '5',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Biner 1100 ke Desimal?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '12',
                                        'target_answer' => '12',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Biner 1111 ke Desimal?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '15',
                                        'target_answer' => '15',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Desimal 8 ke Biner?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '1000',
                                        'target_answer' => '1000',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Desimal 10 ke Biner?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '1010',
                                        'target_answer' => '1010',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Struktur Data',
                        'slug' => 'struktur-data',
                        'description' => 'Array, linked list, stack, queue, dan tree.',
                        'games' => [
                            [
                                'title' => 'Data Structure Master',
                                'slug' => 'data-structure-master',
                                'description' => 'Analisis kompleksitas dan struktur data.',
                                'game_type' => 'logic',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Push(1), Push(2), Pop() = ?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '2',
                                        'target_answer' => '2',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Push(5), Push(10), Push(15), Pop(), Pop() = ?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '10',
                                        'target_answer' => '10',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Push(A), Push(B), Pop(), Push(C), Pop() = ?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'C',
                                        'target_answer' => 'C',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Queue: Enqueue(1), Enqueue(2), Dequeue() = ?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '1',
                                        'target_answer' => '1',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Stack: Push(X), Push(Y), Pop(), Push(Z), Pop() = ?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'Z',
                                        'target_answer' => 'Z',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Aljabar Linear',
                        'slug' => 'aljabar-linear',
                        'description' => 'Vektor, matriks, dan transformasi linear.',
                        'games' => [
                            [
                                'title' => 'Matrix Magic',
                                'slug' => 'matrix-magic',
                                'description' => 'Hitung operasi matriks dengan benar.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Det [[1,0],[0,1]]?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '1',
                                        'target_answer' => '1',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Det [[2,1],[1,2]]?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '3',
                                        'target_answer' => '3',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Det [[3,4],[5,6]]?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '-2',
                                        'target_answer' => '-2',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Det [[1,2,3],[0,1,4],[5,6,0]]? (hint: 3x3)',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '1',
                                        'target_answer' => '1',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Det [[a,b],[c,d]]? (rumus umum)',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'ad - bc',
                                        'target_answer' => 'ad - bc',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            // C. Sistem Informasi (SI)
            [
                'name' => 'Sistem Informasi',
                'slug' => 'sistem-informasi',
                'description' => 'Menggabungkan teknologi informasi dan proses bisnis.',
                'topics' => [
                    [
                        'name' => 'Manajemen Proyek',
                        'slug' => 'manajemen-proyek',
                        'description' => 'Perencanaan, eksekusi, dan kontrol proyek IT.',
                        'games' => [
                            [
                                'title' => 'Project Timeline',
                                'slug' => 'project-timeline',
                                'description' => 'Hitung durasi proyek dengan metode CPM.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Durasi jalur A(3)+B(4)?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '7',
                                        'target_answer' => '7',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Durasi jalur paralel: A(5) dan B(3), ambil yang terpanjang?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '5',
                                        'target_answer' => '5',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Durasi jalur sequential: A(2)+B(3)+C(4)?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '9',
                                        'target_answer' => '9',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Jika task A(3) dan B(2) paralel, lalu C(4) sequential setelahnya, total durasi?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '7',
                                        'target_answer' => '7',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Critical path: A(1)+B(5)+C(2) vs D(3)+E(4), pilih yang terpanjang?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '8',
                                        'target_answer' => '8',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
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
                    [
                        'name' => 'Analisis Data Bisnis',
                        'slug' => 'analisis-data-bisnis',
                        'description' => 'Teknik analisis data untuk mendukung keputusan bisnis.',
                        'games' => [
                            [
                                'title' => 'Business Analytics',
                                'slug' => 'business-analytics',
                                'description' => 'Hitung metrik bisnis dari dataset.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Revenue 100 - Cost 40?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '60',
                                        'target_answer' => '60',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Profit margin: (Revenue 200 - Cost 120) / Revenue 200 x 100%?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '40',
                                        'target_answer' => '40',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Rata-rata penjualan: 100, 150, 200, 250?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '175',
                                        'target_answer' => '175',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'ROI: (Profit 50 / Investment 200) x 100%?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '25',
                                        'target_answer' => '25',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Break-even point: Fixed Cost 1000 / (Price 10 - Variable Cost 6)?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '250',
                                        'target_answer' => '250',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Etika Profesi',
                        'slug' => 'etika-profesi',
                        'description' => 'Etika dalam profesi IT dan kode etik profesional.',
                        'games' => [
                            [
                                'title' => 'Ethics Quiz',
                                'slug' => 'ethics-quiz',
                                'description' => 'Uji pengetahuanmu tentang etika profesi IT.',
                                'game_type' => 'quiz',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Hak cipta software dilindungi?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'UU',
                                        'target_answer' => 'UU',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'E-Business',
                        'slug' => 'e-business',
                        'description' => 'Model bisnis digital dan e-commerce.',
                        'games' => [
                            [
                                'title' => 'E-Commerce Master',
                                'slug' => 'e-commerce-master',
                                'description' => 'Pahami konsep e-business dan e-commerce.',
                                'game_type' => 'quiz',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'B2B singkatan dari?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'Business to Business',
                                        'target_answer' => 'Business to Business',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            // D. Teknik Elektro (TE)
            [
                'name' => 'Teknik Elektro',
                'slug' => 'teknik-elektro',
                'description' => 'Mempelajari sistem kelistrikan dan logika digital.',
                'topics' => [
                    [
                        'name' => 'Rangkaian Listrik',
                        'slug' => 'rangkaian-listrik',
                        'description' => 'Hukum Ohm, Kirchhoff, dan analisis rangkaian.',
                        'games' => [
                            [
                                'title' => 'Circuit Solver',
                                'slug' => 'circuit-solver',
                                'description' => 'Hitung arus dan tegangan dalam rangkaian.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'V=10, R=2, I=?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '5',
                                        'target_answer' => '5',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'I=3, R=4, V=?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '12',
                                        'target_answer' => '12',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'V=24, I=6, R=?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '4',
                                        'target_answer' => '4',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Resistor seri: R1=3, R2=5, R_total=?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '8',
                                        'target_answer' => '8',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Resistor paralel: R1=4, R2=4, R_total=?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '2',
                                        'target_answer' => '2',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Logika Digital',
                        'slug' => 'logika-digital',
                        'description' => 'Representasi bilangan dan gerbang logika.',
                        'games' => [
                            [
                                'title' => 'Binary Breaker',
                                'slug' => 'binary-breaker',
                                'description' => 'Konversi bilangan biner ke desimal.',
                                'game_type' => 'logic',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => '1 AND 0 = ?',
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
                        'name' => 'Fisika Dasar',
                        'slug' => 'fisika-dasar',
                        'description' => 'Mekanika, termodinamika, dan gelombang.',
                        'games' => [
                            [
                                'title' => 'Physics Quiz',
                                'slug' => 'physics-quiz',
                                'description' => 'Uji pemahamanmu tentang konsep fisika dasar.',
                                'game_type' => 'quiz',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'F = m x ?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'a',
                                        'target_answer' => 'a',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Sinyal Sistem',
                        'slug' => 'sinyal-sistem',
                        'description' => 'Analisis sinyal kontinyu dan diskrit.',
                        'games' => [
                            [
                                'title' => 'Signal Processing',
                                'slug' => 'signal-processing',
                                'description' => 'Hitung transformasi sinyal dan frekuensi.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'T=0.5s, f=?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '2',
                                        'target_answer' => '2',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Mikrokontroler',
                        'slug' => 'mikrokontroler',
                        'description' => 'Pemrograman Arduino dan embedded systems.',
                        'games' => [
                            [
                                'title' => 'Arduino Code',
                                'slug' => 'arduino-code',
                                'description' => 'Pahami sintaks dan logika pemrograman Arduino.',
                                'game_type' => 'quiz',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Pin digital mode input/output?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'GPIO',
                                        'target_answer' => 'GPIO',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            // E. Sains Data (DS)
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
                                        'instruction' => 'Mean: 2, 4, 6?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '4',
                                        'target_answer' => '4',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 2,
                                        'instruction' => 'Median: 1, 3, 5, 7, 9?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '5',
                                        'target_answer' => '5',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 3,
                                        'instruction' => 'Mean: 10, 20, 30, 40?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '25',
                                        'target_answer' => '25',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 4,
                                        'instruction' => 'Median: 2, 4, 6, 8?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '5',
                                        'target_answer' => '5',
                                        'target_css' => null,
                                    ],
                                    [
                                        'level' => 5,
                                        'instruction' => 'Mode: 1, 2, 2, 3, 3, 3, 4?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '3',
                                        'target_answer' => '3',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Python Dasar',
                        'slug' => 'python-dasar',
                        'description' => 'Pemrograman Python untuk data science.',
                        'games' => [
                            [
                                'title' => 'Python Logic',
                                'slug' => 'python-logic',
                                'description' => 'Analisis kode Python dan hasil eksekusinya.',
                                'game_type' => 'logic',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'a=[1,2,3]; a[0]?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '1',
                                        'target_answer' => '1',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Probabilitas',
                        'slug' => 'probabilitas',
                        'description' => 'Teori probabilitas dan distribusi statistik.',
                        'games' => [
                            [
                                'title' => 'Probability Master',
                                'slug' => 'probability-master',
                                'description' => 'Hitung probabilitas kejadian dari berbagai skenario.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Peluang dadu ganjil?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '0.5',
                                        'target_answer' => '0.5',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Visualisasi Data',
                        'slug' => 'visualisasi-data',
                        'description' => 'Membuat chart dan grafik yang informatif.',
                        'games' => [
                            [
                                'title' => 'Chart Master',
                                'slug' => 'chart-master',
                                'description' => 'Pilih jenis visualisasi yang tepat untuk data.',
                                'game_type' => 'quiz',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'Grafik untuk proporsi?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => 'Pie Chart',
                                        'target_answer' => 'Pie Chart',
                                        'target_css' => null,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [
                        'name' => 'Machine Learning',
                        'slug' => 'machine-learning',
                        'description' => 'Algoritma pembelajaran mesin dan neural network.',
                        'games' => [
                            [
                                'title' => 'ML Basics',
                                'slug' => 'ml-basics',
                                'description' => 'Pahami konsep dasar machine learning.',
                                'game_type' => 'math',
                                'levels' => [
                                    [
                                        'level' => 1,
                                        'instruction' => 'TP=10, FP=0, Precision?',
                                        'setup_html' => null,
                                        'initial_code' => null,
                                        'solution' => '1',
                                        'target_answer' => '1',
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