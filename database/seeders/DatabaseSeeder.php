<?php

namespace Database\Seeders;

use App\Models\GameLevel;
use App\Models\Major;
use App\Models\User;
use App\Models\LearningMaterial; // [WAJIB ADA]
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. User Default
        User::firstOrCreate([
            'email' => 'alvira@laporin.com',
        ], [
            'name' => 'Alvira Risky',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        $structures = [
            // ==========================================
            // 1. TEKNOLOGI INFORMASI
            // ==========================================
            [
                'name' => 'Teknologi Informasi',
                'slug' => 'teknologi-informasi',
                'description' => 'Rekayasa perangkat lunak dan teknologi masa depan.',
                'topics' => [
                    [
                        'name' => 'Pemrograman Web', 'slug' => 'pemrograman-web', 'description' => 'Mastering CSS Layout.',
                        'games' => [
                            [
                                'title' => 'Flexbox Chibi', 'slug' => 'flexbox-chibi', 'description' => 'Bantu Chibi bergerak dengan Flexbox.', 'game_type' => 'css',
                                // [MATERI MANUAL]
                                'learning_material' => [
                                    'title' => 'Pengenalan Flexbox Layout',
                                    'video_url' => 'https://www.youtube.com/watch?v=phWxA89Dy94',
                                    'min_read_seconds' => 10,
                                    'content' => '
                                        <h3>Apa itu Flexbox?</h3>
                                        <p>Flexbox (Flexible Box) adalah metode layout CSS untuk mengatur elemen dalam satu dimensi.</p>
                                        <h4>Properti Penting:</h4>
                                        <ul>
                                            <li><code>justify-content</code>: Mengatur posisi horizontal (sumbu utama).</li>
                                            <li><code>align-items</code>: Mengatur posisi vertikal (sumbu silang).</li>
                                            <li><code>flex-direction</code>: Mengatur arah elemen (baris/kolom).</li>
                                        </ul>'
                                ],
                                'levels' => [
                                    [
                                        'level' => 1, 'question' => 'Misi 1: Ke Kanan', 
                                        'instruction' => 'Pindahkan Chibi ke kanan untuk mengambil es krim.', 
                                        'hint' => "Gunakan properti untuk mengatur posisi horizontal (main-axis) ke 'flex-end'.",
                                        'setup_html' => '<div style="display:flex;align-items:center;justify-content:flex-start;width:100%;height:160px;padding:1rem;background:#eef2ff;"><img src="/images/chibi-default.png" alt="Chibi" style="width:72px;height:72px;"></div>',
                                        'initial_code' => 'display:flex; justify-content:flex-start; align-items:center;',
                                        'correct_answer' => 'justify-content: flex-end;', 'target_css' => 'justify-content: flex-end;'
                                    ],
                                    [
                                        'level' => 2, 'question' => 'Misi 2: Ke Bawah', 
                                        'instruction' => 'Pindahkan Chibi ke bawah secara vertikal.', 
                                        'hint' => "Untuk sumbu silang (vertikal), gunakan properti 'align-items' ke 'flex-end'.",
                                        'setup_html' => '<div style="display:flex;align-items:flex-start;justify-content:flex-start;width:100%;height:200px;padding:1rem;background:#eef2ff;"><img src="/images/chibi-default.png" alt="Chibi" style="width:72px;height:72px;"></div>',
                                        'initial_code' => 'display:flex; align-items:flex-start; justify-content:flex-start;',
                                        'correct_answer' => 'align-items: flex-end;', 'target_css' => 'align-items: flex-end;'
                                    ],
                                    [
                                        'level' => 3, 'question' => 'Misi 3: Balik Arah', 
                                        'instruction' => 'Balik urutan Chibi agar bisa mengambil item di kirinya.', 
                                        'hint' => "Gunakan properti 'flex-direction' dengan nilai 'row-reverse'.",
                                        'setup_html' => '<div style="display:flex;flex-direction:row;align-items:center;justify-content:flex-start;width:100%;height:160px;padding:1rem;background:#eef2ff;"><img src="/images/chibi-default.png" alt="Chibi" style="width:72px;height:72px;"><img src="/images/ice-cream.png" alt="Target" style="width:64px;height:64px;"></div>',
                                        'initial_code' => 'display:flex; flex-direction:row; align-items:center; justify-content:flex-start;',
                                        'correct_answer' => 'flex-direction: row-reverse;', 'target_css' => 'flex-direction: row-reverse;'
                                    ],
                                    [
                                        'level' => 4, 'question' => 'Misi 4: Pusat Perhatian', 
                                        'instruction' => 'Letakkan Chibi tepat di tengah-tengah panggung (Horizontal & Vertikal).', 
                                        'hint' => "Set 'justify-content' dan 'align-items' keduanya ke 'center'.",
                                        'initial_code' => 'display:flex; align-items:flex-start; justify-content:flex-start;',
                                        'correct_answer' => 'justify-content: center; align-items: center;', 'target_css' => 'justify-content: center; align-items: center;'
                                    ],
                                    [
                                        'level' => 5, 'question' => 'Misi 5: Jaga Jarak', 
                                        'instruction' => 'Berikan jarak yang merata di antara Chibi dan Es Krim.', 
                                        'hint' => "Gunakan 'justify-content: space-between'.",
                                        'initial_code' => 'display:flex;',
                                        'correct_answer' => 'justify-content: space-between;', 'target_css' => 'justify-content: space-between;'
                                    ]
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Basis Data', 'slug' => 'basis-data', 'description' => 'Seni mengelola data.',
                        'games' => [
                            [
                                'title' => 'SQL Detective', 'slug' => 'sql-detective', 'description' => 'Investigasi data menggunakan SQL.', 'game_type' => 'sql',
                                // [MATERI MANUAL]
                                'learning_material' => [
                                    'title' => 'Dasar SQL: SELECT & WHERE',
                                    'video_url' => 'https://www.youtube.com/watch?v=7S_tz1z_5bA',
                                    'min_read_seconds' => 15,
                                    'content' => '
                                        <h3>Perintah Dasar SQL</h3>
                                        <p>Gunakan <strong>SELECT</strong> untuk memilih kolom dan <strong>FROM</strong> untuk memilih tabel.</p>
                                        <pre class="bg-black text-green-400 p-2 rounded mb-2">SELECT * FROM users;</pre>
                                        <p>Gunakan <strong>WHERE</strong> untuk memfilter data.</p>'
                                ],
                                'levels' => [
                                    ['level' => 1, 'question' => 'Cek Seluruh Data', 'instruction' => 'Tampilkan semua kolom dari tabel users.', 'hint' => 'Gunakan tanda bintang (*) setelah SELECT.', 'initial_code' => 'SELECT  FROM users;', 'correct_answer' => 'SELECT * FROM users;'],
                                    ['level' => 2, 'question' => 'Pilih Kolom', 'instruction' => 'Hanya tampilkan nama (`name`) dan email (`email`) dari tabel `users`.', 'hint' => 'Tulis nama kolom dipisahkan koma.', 'initial_code' => 'SELECT  FROM users;', 'correct_answer' => 'SELECT name, email FROM users;'],
                                    ['level' => 3, 'question' => 'Filter Data', 'instruction' => 'Cari user yang statusnya "active" saja.', 'hint' => "Gunakan WHERE status = 'active'.", 'initial_code' => 'SELECT * FROM users;', 'correct_answer' => "SELECT * FROM users WHERE status = 'active';"],
                                    ['level' => 4, 'question' => 'Hitung Data', 'instruction' => 'Hitung berapa banyak total user yang terdaftar.', 'hint' => 'Gunakan fungsi COUNT(*).', 'initial_code' => 'SELECT  FROM users;', 'correct_answer' => 'SELECT COUNT(*) FROM users;'],
                                    ['level' => 5, 'question' => 'Urutkan Data', 'instruction' => 'Urutkan daftar user berdasarkan nama dari A ke Z.', 'hint' => 'Gunakan ORDER BY name ASC.', 'initial_code' => 'SELECT * FROM users;', 'correct_answer' => 'SELECT * FROM users ORDER BY name ASC;'],
                                ]
                            ],
                            [
                                'title' => 'Logic Case Files', 'slug' => 'logic-case-files', 'description' => 'Pecahkan misteri kriminal dengan SQL.', 'game_type' => 'sql',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Kasus 1: Lokasi Kejadian', 'instruction' => 'Cek laporan di "SQL City Park".', 'hint' => 'Filter kolom city pada tabel crime_scene_reports.', 'setup_html' => '<h4>Tabel: crime_scene_reports</h4>', 'initial_code' => "SELECT * FROM crime_scene_reports WHERE ...", 'correct_answer' => "SELECT * FROM crime_scene_reports WHERE city = 'SQL City Park';"],
                                    ['level' => 2, 'question' => 'Kasus 2: Cari Saksi', 'instruction' => 'Saksi tinggal di "Northwestern Dr" ATAU bernama "Annabel".', 'hint' => 'Gunakan operator OR di dalam WHERE.', 'setup_html' => '<h4>Tabel: person</h4>', 'initial_code' => "SELECT * FROM person WHERE ...", 'correct_answer' => "SELECT * FROM person WHERE address_street_name = 'Northwestern Dr' OR name = 'Annabel';"],
                                    ['level' => 3, 'question' => 'Kasus 3: Interogasi', 'instruction' => 'Cek transkrip wawancara saksi ID 14887.', 'hint' => 'Filter tabel interview berdasarkan person_id.', 'setup_html' => '<h4>Tabel: interview</h4>', 'initial_code' => "SELECT * FROM interview WHERE ...", 'correct_answer' => "SELECT * FROM interview WHERE person_id = 14887;"],
                                    ['level' => 4, 'question' => 'Kasus 4: Gym Membership', 'instruction' => 'Pelaku member "gold" DAN namanya mulai "Joe".', 'hint' => 'Gunakan AND. Untuk nama gunakan LIKE "Joe%".', 'setup_html' => '<h4>Tabel: get_fit_now_member</h4>', 'initial_code' => "SELECT * FROM get_fit_now_member WHERE ...", 'correct_answer' => "SELECT * FROM get_fit_now_member WHERE membership_status = 'gold' AND name LIKE 'Joe%';"],
                                    ['level' => 5, 'question' => 'Kasus 5: Tangkap Pelaku', 'instruction' => 'Tampilkan data lengkap ID 28819.', 'hint' => 'Select tabel person where id = 28819.', 'setup_html' => '<h4>Tabel: person</h4>', 'initial_code' => "SELECT * FROM person WHERE ...", 'correct_answer' => "SELECT * FROM person WHERE id = 28819;"],
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Jaringan Komputer', 'slug' => 'jaringan-komputer', 'description' => 'Konsep dasar jaringan komputer dan subnetting.',
                        'games' => [
                            [
                                'title' => 'Subnet Calculator', 'slug' => 'subnet-calculator', 'description' => 'Hitung jumlah host dalam subnet mask.', 'game_type' => 'math',
                                // [MATERI MANUAL]
                                'learning_material' => [
                                    'title' => 'Konsep Subnetting Dasar',
                                    'min_read_seconds' => 10,
                                    'content' => '
                                        <h3>Menghitung Jumlah Host</h3>
                                        <p>Rumus: <strong>(2 ^ n) - 2</strong></p>
                                        <p>Dimana <em>n</em> adalah jumlah bit host (32 - prefix).</p>
                                        <p>Contoh Prefix /24:</p>
                                        <ul>
                                            <li>Bit Network: 24</li>
                                            <li>Bit Host: 32 - 24 = 8</li>
                                            <li>Jumlah Host: (2 pangkat 8) - 2 = 254</li>
                                        </ul>'
                                ],
                                'levels' => [
                                    ['level' => 1, 'question' => 'Subnet /24', 'instruction' => 'Berapa jumlah host yang tersedia di subnet /24?', 'hint' => 'Rumus: (2 pangkat 8) dikurang 2.', 'correct_answer' => '254'],
                                    ['level' => 2, 'question' => 'Subnet /25', 'instruction' => 'Berapa jumlah host yang tersedia di subnet /25?', 'hint' => 'Sisa bit = 32-25 = 7. Hitung (2^7) - 2.', 'correct_answer' => '126'],
                                    ['level' => 3, 'question' => 'Subnet /26', 'instruction' => 'Berapa jumlah host yang tersedia di subnet /26?', 'hint' => 'Sisa bit = 6. Hitung (2^6) - 2.', 'correct_answer' => '62'],
                                    ['level' => 4, 'question' => 'IP Pertama /24', 'instruction' => 'Jika Network ID 192.168.1.0/24, berapa IP valid pertama?', 'hint' => 'IP pertama = Network ID + 1.', 'correct_answer' => '192.168.1.1'],
                                    ['level' => 5, 'question' => 'IP Terakhir /24', 'instruction' => 'Jika Network ID 192.168.1.0/24, berapa IP valid terakhir?', 'hint' => 'IP Broadcast dikurang 1.', 'correct_answer' => '192.168.1.254'],
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Keamanan Siber', 'slug' => 'keamanan-siber', 'description' => 'Dasar-dasar kriptografi dan keamanan informasi.',
                        'games' => [
                            [
                                'title' => 'Caesar Cipher', 'slug' => 'caesar-cipher', 'description' => 'Decrypt pesan rahasia.', 'game_type' => 'logic',
                                // [MATERI MANUAL]
                                'learning_material' => [
                                    'title' => 'Teknik Enkripsi Caesar',
                                    'min_read_seconds' => 8,
                                    'content' => '
                                        <h3>Algoritma Substitusi Sederhana</h3>
                                        <p>Caesar Cipher bekerja dengan menggeser huruf dalam alfabet.</p>
                                        <p>Contoh Geser +1: A menjadi B, B menjadi C.</p>
                                        <p>Untuk memecahkannya (Decrypt), cukup geser ke arah sebaliknya.</p>'
                                ],
                                'levels' => [
                                    ['level' => 1, 'question' => 'Shift -1', 'instruction' => 'Decrypt teks "IFMMP" dengan geser mundur 1 huruf.', 'hint' => 'Huruf sebelum I adalah H, sebelum F adalah E.', 'correct_answer' => 'HELLO'],
                                    ['level' => 2, 'question' => 'Shift -3', 'instruction' => 'Decrypt teks "KHOOR" dengan geser mundur 3 huruf.', 'hint' => 'Hitung mundur 3 langkah di alfabet dari setiap huruf.', 'correct_answer' => 'HELLO'],
                                    ['level' => 3, 'question' => 'Encrypt +1', 'instruction' => 'Encrypt teks "WORLD" dengan geser maju 1 huruf.', 'hint' => 'Ganti setiap huruf dengan huruf depannya (A jadi B, B jadi C).', 'correct_answer' => 'XPSME'],
                                    ['level' => 4, 'question' => 'Decrypt -1', 'instruction' => 'Decrypt teks "MJQQT" dengan geser mundur 1 huruf.', 'hint' => 'M mundur jadi L, J mundur jadi I.', 'correct_answer' => 'LIPPS'],
                                    ['level' => 5, 'question' => 'Encrypt +5', 'instruction' => 'Encrypt teks "SECRET" dengan geser maju 5 huruf.', 'hint' => 'Hitung maju 5 langkah di alfabet.', 'correct_answer' => 'XJHWJY'],
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Sistem Operasi', 'slug' => 'sistem-operasi', 'description' => 'Linux dan command line.',
                        'games' => [
                            [
                                'title' => 'Linux Command', 'slug' => 'linux-command', 'description' => 'Uji pengetahuanmu tentang terminal Linux.', 'game_type' => 'quiz',
                                // [MATERI MANUAL]
                                'learning_material' => [
                                    'title' => 'Perintah Dasar Terminal Linux',
                                    'min_read_seconds' => 5,
                                    'content' => '
                                        <h3>Perintah Wajib:</h3>
                                        <ul>
                                            <li><code>ls</code> : List (lihat isi folder)</li>
                                            <li><code>cd</code> : Change Directory (pindah folder)</li>
                                            <li><code>mkdir</code> : Make Directory (bikin folder)</li>
                                            <li><code>rm</code> : Remove (hapus file)</li>
                                        </ul>'
                                ],
                                'levels' => [
                                    ['level' => 1, 'question' => 'List Directory', 'instruction' => 'Perintah untuk menampilkan isi direktori?', 'hint' => 'Singkatan dari "list".', 'correct_answer' => 'ls'],
                                    ['level' => 2, 'question' => 'Make Directory', 'instruction' => 'Perintah untuk membuat folder baru?', 'hint' => 'Singkatan dari "make directory".', 'correct_answer' => 'mkdir'],
                                    ['level' => 3, 'question' => 'Remove', 'instruction' => 'Perintah untuk menghapus file?', 'hint' => 'Singkatan dari "remove".', 'correct_answer' => 'rm'],
                                    ['level' => 4, 'question' => 'Current Path', 'instruction' => 'Perintah untuk melihat lokasi folder saat ini?', 'hint' => 'Singkatan dari "print working directory".', 'correct_answer' => 'pwd'],
                                    ['level' => 5, 'question' => 'Change Directory', 'instruction' => 'Perintah untuk pindah ke folder lain?', 'hint' => 'Singkatan dari "change directory".', 'correct_answer' => 'cd'],
                                ]
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // 2. ILMU KOMPUTER (HINTS FIXED)
            // ==========================================
            [
                'name' => 'Ilmu Komputer',
                'slug' => 'ilmu-komputer',
                'description' => 'Teori komputasi dan algoritma.',
                'topics' => [
                    [
                        'name' => 'Kalkulus Dasar', 'slug' => 'kalkulus-dasar', 'description' => 'Konsep turunan dan limit.',
                        'games' => [
                            [
                                'title' => 'Derivative Dash', 'slug' => 'derivative-dash', 'description' => 'Kuis cepat turunan fungsi.', 'game_type' => 'math',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Turunan x^2', 'instruction' => 'Turunan dari f(x) = x^2?', 'hint' => 'Pangkat turun ke depan, pangkat dikurang 1.', 'correct_answer' => '2x'],
                                    ['level' => 2, 'question' => 'Turunan 3x^3', 'instruction' => 'Turunan dari f(x) = 3x^3?', 'hint' => 'Kalikan koefisien dengan pangkat lama.', 'correct_answer' => '9x^2'],
                                    ['level' => 3, 'question' => 'Turunan 5x', 'instruction' => 'Turunan dari f(x) = 5x?', 'hint' => 'Turunan dari konstanta kali x adalah konstantanya.', 'correct_answer' => '5'],
                                    ['level' => 4, 'question' => 'Penjumlahan', 'instruction' => 'Turunan dari f(x) = x^2 + 3x?', 'hint' => 'Turunkan masing-masing suku secara terpisah.', 'correct_answer' => '2x + 3'],
                                    ['level' => 5, 'question' => 'Pangkat Tinggi', 'instruction' => 'Turunan dari f(x) = 4x^4 - 2x^2?', 'hint' => 'Terapkan aturan pangkat pada kedua suku.', 'correct_answer' => '16x^3 - 4x'],
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Algoritma', 'slug' => 'algoritma', 'description' => 'Logika pemrograman.',
                        'games' => [
                            [
                                'title' => 'Loop Logic', 'slug' => 'loop-logic', 'description' => 'Tebak output perulangan.', 'game_type' => 'logic',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Simple Loop', 'instruction' => 'Output dari: for(i=0; i<3; i++) print(i)?', 'hint' => 'Loop berjalan dari 0 sampai sebelum 3.', 'correct_answer' => '012'],
                                    ['level' => 2, 'question' => 'Start 1', 'instruction' => 'Output dari: for(i=1; i<=4; i++) print(i)?', 'hint' => 'Perhatikan kondisi <= (kurang dari sama dengan).', 'correct_answer' => '1234'],
                                    ['level' => 3, 'question' => 'Step 2', 'instruction' => 'Output dari: for(i=0; i<5; i+=2) print(i)?', 'hint' => 'Nilai i bertambah 2 setiap putaran.', 'correct_answer' => '024'],
                                    ['level' => 4, 'question' => 'Reverse Loop', 'instruction' => 'Output dari: for(i=5; i>0; i--) print(i)?', 'hint' => 'Loop menghitung mundur.', 'correct_answer' => '54321'],
                                    ['level' => 5, 'question' => 'Multiply', 'instruction' => 'Output dari: for(i=0; i<4; i++) print(i*2)?', 'hint' => 'Kalikan iterator dengan 2 sebelum dicetak.', 'correct_answer' => '0246'],
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Matematika Diskrit', 'slug' => 'matematika-diskrit', 'description' => 'Logika dan bilangan.',
                        'games' => [
                            [
                                'title' => 'Binary Breaker', 'slug' => 'binary-breaker', 'description' => 'Konversi dan logika biner.', 'game_type' => 'math',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Biner ke Desimal', 'instruction' => 'Ubah 101 (biner) ke desimal.', 'hint' => 'Hitung: 1x4 + 0x2 + 1x1.', 'correct_answer' => '5'],
                                    ['level' => 2, 'question' => 'Biner 1100', 'instruction' => 'Ubah 1100 (biner) ke desimal.', 'hint' => 'Posisi bit bernilai 8 dan 4 menyala.', 'correct_answer' => '12'],
                                    ['level' => 3, 'question' => 'Full Bit', 'instruction' => 'Ubah 1111 (biner) ke desimal.', 'hint' => 'Jumlahkan 8+4+2+1.', 'correct_answer' => '15'],
                                    ['level' => 4, 'question' => 'Desimal 8', 'instruction' => 'Ubah 8 (desimal) ke biner.', 'hint' => 'Cari bit yang bernilai 8.', 'correct_answer' => '1000'],
                                    ['level' => 5, 'question' => 'Desimal 10', 'instruction' => 'Ubah 10 (desimal) ke biner.', 'hint' => '10 adalah hasil penjumlahan 8 dan 2.', 'correct_answer' => '1010'],
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Struktur Data', 'slug' => 'struktur-data', 'description' => 'Stack, Queue, dan kawan-kawan.',
                        'games' => [
                            [
                                'title' => 'Data Struct Master', 'slug' => 'data-struct-master', 'description' => 'Operasi struktur data.', 'game_type' => 'logic',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Stack LIFO', 'instruction' => 'Stack: Push(1), Push(2), Pop(). Apa yang keluar?', 'hint' => 'Stack itu LIFO (Last In First Out). Yang terakhir masuk, keluar duluan.', 'correct_answer' => '2'],
                                    ['level' => 2, 'question' => 'Stack Lanjutan', 'instruction' => 'Push(5), Push(10), Push(15), Pop(), Pop(). Apa yang keluar terakhir?', 'hint' => 'Urutan pop: 15, lalu 10.', 'correct_answer' => '10'],
                                    ['level' => 3, 'question' => 'Stack Huruf', 'instruction' => 'Push(A), Push(B), Pop(), Push(C), Pop(). Apa output terakhir?', 'hint' => 'B keluar, C masuk, lalu C keluar.', 'correct_answer' => 'C'],
                                    ['level' => 4, 'question' => 'Queue FIFO', 'instruction' => 'Queue: Enqueue(1), Enqueue(2), Dequeue(). Apa yang keluar?', 'hint' => 'Queue itu FIFO (First In First Out). Yang antri duluan, keluar duluan.', 'correct_answer' => '1'],
                                    ['level' => 5, 'question' => 'Mixed Ops', 'instruction' => 'Stack: Push(X), Push(Y), Pop(), Push(Z), Pop(). Apa output terakhir?', 'hint' => 'Y dipop, Z masuk, Z dipop.', 'correct_answer' => 'Z'],
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Aljabar Linear', 'slug' => 'aljabar-linear', 'description' => 'Matriks dan vektor.',
                        'games' => [
                            [
                                'title' => 'Matrix Magic', 'slug' => 'matrix-magic', 'description' => 'Operasi determinan matriks.', 'game_type' => 'math',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Identitas', 'instruction' => 'Determinan dari [[1,0],[0,1]]?', 'hint' => 'Rumus determinan ordo 2x2: (a*d) - (b*c).', 'correct_answer' => '1'],
                                    ['level' => 2, 'question' => 'Ordo 2x2', 'instruction' => 'Determinan dari [[2,1],[1,2]]?', 'hint' => 'Hitung (2*2) - (1*1).', 'correct_answer' => '3'],
                                    ['level' => 3, 'question' => 'Negatif', 'instruction' => 'Determinan dari [[3,4],[5,6]]?', 'hint' => 'Hitung (3*6) - (4*5).', 'correct_answer' => '-2'],
                                    ['level' => 4, 'question' => 'Ordo 3x3', 'instruction' => 'Determinan dari [[1,2,3],[0,1,4],[5,6,0]]?', 'hint' => 'Gunakan metode sarrus atau kofaktor.', 'correct_answer' => '1'],
                                    ['level' => 5, 'question' => 'Rumus Umum', 'instruction' => 'Tuliskan rumus determinan matriks [[a,b],[c,d]].', 'hint' => 'Diagonal utama dikurang diagonal samping.', 'correct_answer' => 'ad - bc'],
                                ]
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // 3. SISTEM INFORMASI (HINTS FIXED)
            // ==========================================
            [
                'name' => 'Sistem Informasi',
                'slug' => 'sistem-informasi',
                'description' => 'Integrasi teknologi dan bisnis.',
                'topics' => [
                    [
                        'name' => 'Manajemen Proyek', 'slug' => 'manajemen-proyek', 'description' => 'Mengelola timeline proyek.',
                        'games' => [
                            [
                                'title' => 'Project Timeline', 'slug' => 'project-timeline', 'description' => 'Hitung durasi proyek.', 'game_type' => 'math',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Sequential', 'instruction' => 'Task A (3 hari) dilanjut Task B (4 hari). Total durasi?', 'hint' => 'Tugas berurutan, jumlahkan saja.', 'correct_answer' => '7'],
                                    ['level' => 2, 'question' => 'Paralel', 'instruction' => 'Task A (5 hari) dan Task B (3 hari) berjalan bersamaan. Total durasi?', 'hint' => 'Ambil durasi terpanjang di jalur paralel.', 'correct_answer' => '5'],
                                    ['level' => 3, 'question' => 'Jalur Panjang', 'instruction' => 'A(2) -> B(3) -> C(4). Total?', 'hint' => 'Jumlahkan semua.', 'correct_answer' => '9'],
                                    ['level' => 4, 'question' => 'Campuran', 'instruction' => 'A(3) dan B(2) paralel, dilanjut C(4). Total?', 'hint' => 'Max(A, B) + C.', 'correct_answer' => '7'],
                                    ['level' => 5, 'question' => 'Critical Path', 'instruction' => 'Jalur 1: 8 hari. Jalur 2: 7 hari. Berapa critical path?', 'hint' => 'Critical path adalah jalur terpanjang.', 'correct_answer' => '8'],
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Analisis Bisnis', 'slug' => 'analisis-bisnis', 'description' => 'Menghitung performa bisnis.',
                        'games' => [
                            [
                                'title' => 'Biz Analytics', 'slug' => 'biz-analytics', 'description' => 'Hitung metrik dasar.', 'game_type' => 'math',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Profit', 'instruction' => 'Revenue 100, Cost 40. Profit?', 'hint' => 'Pendapatan dikurangi Biaya.', 'correct_answer' => '60'],
                                    ['level' => 2, 'question' => 'Margin', 'instruction' => 'Profit 80, Revenue 200. Berapa persen margin?', 'hint' => '(Profit / Revenue) x 100.', 'correct_answer' => '40'],
                                    ['level' => 3, 'question' => 'Average', 'instruction' => 'Penjualan: 100, 150, 200, 250. Rata-rata?', 'hint' => 'Jumlahkan semua lalu bagi 4.', 'correct_answer' => '175'],
                                    ['level' => 4, 'question' => 'ROI', 'instruction' => 'Untung 50 dari modal 200. Berapa persen ROI?', 'hint' => '(Untung / Modal) x 100.', 'correct_answer' => '25'],
                                    ['level' => 5, 'question' => 'BEP', 'instruction' => 'Biaya Tetap 1000, Margin per unit 4. Berapa unit untuk BEP?', 'hint' => 'Biaya Tetap dibagi Margin per unit.', 'correct_answer' => '250'],
                                ]
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // 4. EKONOMI & BISNIS (HINTS FIXED)
            // ==========================================
            [
                'name' => 'Ekonomi & Bisnis',
                'slug' => 'ekonomi-bisnis',
                'description' => 'Keuangan dan pemasaran.',
                'topics' => [
                    [
                        'name' => 'Akuntansi Dasar', 'slug' => 'akuntansi-dasar', 'description' => 'Persamaan dasar akuntansi.',
                        'games' => [
                            [
                                'title' => 'Balance Sheet', 'slug' => 'balance-sheet', 'description' => 'Seimbangkan neraca.', 'game_type' => 'math',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Modal', 'instruction' => 'Aset 500, Hutang 200. Ekuitas?', 'hint' => 'Aset = Hutang + Ekuitas.', 'correct_answer' => '300'],
                                    ['level' => 2, 'question' => 'Beli Kredit', 'instruction' => 'Beli alat 50 kredit. Hutang tambah berapa?', 'hint' => 'Hutang bertambah senilai barang.', 'correct_answer' => '50'],
                                    ['level' => 3, 'question' => 'Bayar Hutang', 'instruction' => 'Bayar hutang 100. Hutang berkurang berapa?', 'hint' => 'Sesuai yang dibayar.', 'correct_answer' => '100'],
                                    ['level' => 4, 'question' => 'Pendapatan', 'instruction' => 'Terima pendapatan 200. Ekuitas tambah berapa?', 'hint' => 'Pendapatan menambah modal.', 'correct_answer' => '200'],
                                    ['level' => 5, 'question' => 'Prive', 'instruction' => 'Ambil prive 50. Ekuitas berkurang berapa?', 'hint' => 'Prive mengurangi modal.', 'correct_answer' => '50'],
                                ]
                            ]
                        ]
                    ],
                    [
                        'name' => 'Pemasaran', 'slug' => 'pemasaran', 'description' => 'Strategi marketing.',
                        'games' => [
                            [
                                'title' => 'Marketing Mix', 'slug' => 'marketing-mix', 'description' => 'Tebak elemen 4P.', 'game_type' => 'quiz',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Barang', 'instruction' => 'Elemen P yang berkaitan dengan barang/jasa?', 'hint' => 'Sesuatu yang dijual (Bhs Inggris).', 'correct_answer' => 'Product'],
                                    ['level' => 2, 'question' => 'Harga', 'instruction' => 'Elemen P tentang biaya?', 'hint' => 'Uang yang dibayar (Bhs Inggris).', 'correct_answer' => 'Price'],
                                    ['level' => 3, 'question' => 'Lokasi', 'instruction' => 'Elemen P tentang distribusi?', 'hint' => 'Tempat jualan (Bhs Inggris).', 'correct_answer' => 'Place'],
                                    ['level' => 4, 'question' => 'Iklan', 'instruction' => 'Elemen P tentang komunikasi?', 'hint' => 'Cara promosi (Bhs Inggris).', 'correct_answer' => 'Promotion'],
                                    ['level' => 5, 'question' => 'SDM', 'instruction' => 'Elemen P tambahan tentang orang?', 'hint' => 'Manusia yang melayani (Bhs Inggris).', 'correct_answer' => 'People'],
                                ]
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // 5. PSIKOLOGI (HINTS FIXED)
            // ==========================================
            [
                'name' => 'Psikologi',
                'slug' => 'psikologi',
                'description' => 'Ilmu perilaku manusia.',
                'topics' => [
                    [
                        'name' => 'Psikologi Kognitif', 'slug' => 'psikologi-kognitif', 'description' => 'Memori dan persepsi.',
                        'games' => [
                            [
                                'title' => 'Memory Logic', 'slug' => 'memory-logic', 'description' => 'Fakta tentang memori.', 'game_type' => 'quiz',
                                'levels' => [
                                    ['level' => 1, 'question' => 'STM', 'instruction' => 'Berapa detik durasi rata-rata Short Term Memory?', 'hint' => 'Sekitar 20-30 detik.', 'correct_answer' => '20'],
                                    ['level' => 2, 'question' => 'Kapasitas', 'instruction' => 'Berapa "chunk" kapasitas memori jangka pendek?', 'hint' => 'Angka ajaib Miller.', 'correct_answer' => '7'],
                                    ['level' => 3, 'question' => 'Input', 'instruction' => 'Proses memasukkan info ke memori?', 'hint' => 'Istilahnya E...', 'correct_answer' => 'Encoding'],
                                    ['level' => 4, 'question' => 'Simpan', 'instruction' => 'Proses mempertahankan info?', 'hint' => 'S...', 'correct_answer' => 'Storage'],
                                    ['level' => 5, 'question' => 'Output', 'instruction' => 'Proses memanggil ingatan?', 'hint' => 'R...', 'correct_answer' => 'Retrieval'],
                                ]
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // 6. SASTRA INGGRIS (HINTS FIXED)
            // ==========================================
            [
                'name' => 'Sastra Inggris',
                'slug' => 'sastra-inggris',
                'description' => 'Bahasa dan literatur.',
                'topics' => [
                    [
                        'name' => 'Grammar', 'slug' => 'grammar', 'description' => 'Tata bahasa.',
                        'games' => [
                            [
                                'title' => 'Tenses Challenge', 'slug' => 'tenses-challenge', 'description' => 'Lengkapi kalimat.', 'game_type' => 'quiz',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Present', 'instruction' => 'She ___ (read) every day.', 'hint' => 'Tambahkan s/es untuk She.', 'correct_answer' => 'reads'],
                                    ['level' => 2, 'question' => 'Past', 'instruction' => 'They ___ (go) yesterday.', 'hint' => 'Bentuk lampau dari go.', 'correct_answer' => 'went'],
                                    ['level' => 3, 'question' => 'Continuous', 'instruction' => 'He is ___ (sleep) now.', 'hint' => 'Verb-ing.', 'correct_answer' => 'sleeping'],
                                    ['level' => 4, 'question' => 'Perfect', 'instruction' => 'I have ___ (eat).', 'hint' => 'V3 dari eat.', 'correct_answer' => 'eaten'],
                                    ['level' => 5, 'question' => 'Passive', 'instruction' => 'It was ___ (make) in China.', 'hint' => 'V3 dari make.', 'correct_answer' => 'made'],
                                ]
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // 7. HUKUM (HINTS FIXED)
            // ==========================================
            [
                'name' => 'Hukum',
                'slug' => 'hukum',
                'description' => 'Sistem peradilan.',
                'topics' => [
                    [
                        'name' => 'Hukum Pidana', 'slug' => 'hukum-pidana', 'description' => 'Asas dan pasal.',
                        'games' => [
                            [
                                'title' => 'Criminal Logic', 'slug' => 'criminal-logic', 'description' => 'Istilah hukum pidana.', 'game_type' => 'quiz',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Asas Utama', 'instruction' => 'Tiada pidana tanpa aturan sebelumnya. Asas apa?', 'hint' => 'Asas L...', 'correct_answer' => 'Legalitas'],
                                    ['level' => 2, 'question' => 'Niat', 'instruction' => 'Istilah untuk niat jahat/sengaja?', 'hint' => 'Bahasa latin D...', 'correct_answer' => 'Dolus'],
                                    ['level' => 3, 'question' => 'Lalai', 'instruction' => 'Istilah untuk kelalaian?', 'hint' => 'Bahasa latin C...', 'correct_answer' => 'Culpa'],
                                    ['level' => 4, 'question' => 'Pembelaan', 'instruction' => 'Pembelaan terpaksa disebut?', 'hint' => 'Noodweer.', 'correct_answer' => 'Noodweer'],
                                    ['level' => 5, 'question' => 'Pasal', 'instruction' => 'Pasal KUHP pencurian biasa?', 'hint' => 'Angka 362.', 'correct_answer' => '362'],
                                ]
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // 8. TEKNIK SIPIL (HINTS FIXED)
            // ==========================================
            [
                'name' => 'Teknik Sipil',
                'slug' => 'teknik-sipil',
                'description' => 'Infrastruktur dan bangunan.',
                'topics' => [
                    [
                        'name' => 'Statika', 'slug' => 'statika', 'description' => 'Analisis gaya.',
                        'games' => [
                            [
                                'title' => 'Force Balance', 'slug' => 'force-balance', 'description' => 'Hitung keseimbangan.', 'game_type' => 'math',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Reaksi Vertikal', 'instruction' => 'Beban 10kN ke bawah. Reaksi tumpuan?', 'hint' => 'Hukum Newton: Aksi = Reaksi.', 'correct_answer' => '10'],
                                    ['level' => 2, 'question' => 'Momen', 'instruction' => 'Gaya 5kN jarak 2m. Momen?', 'hint' => 'Gaya dikali Jarak.', 'correct_answer' => '10'],
                                    ['level' => 3, 'question' => 'Beban Merata', 'instruction' => 'q=2kN/m sepanjang 4m. Total?', 'hint' => 'q dikali panjang.', 'correct_answer' => '8'],
                                    ['level' => 4, 'question' => 'Tumpuan', 'instruction' => 'Balok 4m, beban tengah 10. Reaksi kiri?', 'hint' => 'Bagi dua.', 'correct_answer' => '5'],
                                    ['level' => 5, 'question' => 'Horizontal', 'instruction' => 'Gaya 20 ke kanan. Reaksi?', 'hint' => '20 ke kiri.', 'correct_answer' => '20'],
                                ]
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // 9. TEKNIK ELEKTRO (HINTS FIXED)
            // ==========================================
            [
                'name' => 'Teknik Elektro',
                'slug' => 'teknik-elektro',
                'description' => 'Listrik dan elektronika.',
                'topics' => [
                    [
                        'name' => 'Rangkaian', 'slug' => 'rangkaian', 'description' => 'Hukum Ohm.',
                        'games' => [
                            [
                                'title' => 'Circuit Solver', 'slug' => 'circuit-solver-2', 'description' => 'Hitung V, I, R.', 'game_type' => 'math',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Arus', 'instruction' => 'V=10, R=2. I?', 'hint' => 'I = V dibagi R.', 'correct_answer' => '5'],
                                    ['level' => 2, 'question' => 'Tegangan', 'instruction' => 'I=3, R=4. V?', 'hint' => 'V = I dikali R.', 'correct_answer' => '12'],
                                    ['level' => 3, 'question' => 'Hambatan', 'instruction' => 'V=24, I=6. R?', 'hint' => 'R = V dibagi I.', 'correct_answer' => '4'],
                                    ['level' => 4, 'question' => 'Seri', 'instruction' => 'R1=3, R2=5. Total?', 'hint' => 'Jumlahkan.', 'correct_answer' => '8'],
                                    ['level' => 5, 'question' => 'Paralel', 'instruction' => 'R1=4, R2=4. Total?', 'hint' => 'Jika sama, bagi jumlahnya dengan 2.', 'correct_answer' => '2'],
                                ]
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // 10. SAINS DATA (HINTS FIXED)
            // ==========================================
            [
                'name' => 'Sains Data',
                'slug' => 'sains-data',
                'description' => 'Analisis dan statistik.',
                'topics' => [
                    [
                        'name' => 'Statistika', 'slug' => 'statistika', 'description' => 'Dasar statistik.',
                        'games' => [
                            [
                                'title' => 'Stats Master', 'slug' => 'stats-master', 'description' => 'Mean, Median, Modus.', 'game_type' => 'math',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Mean', 'instruction' => 'Rata-rata 2, 4, 6?', 'hint' => 'Jumlah data dibagi 3.', 'correct_answer' => '4'],
                                    ['level' => 2, 'question' => 'Median', 'instruction' => 'Nilai tengah 1, 3, 5, 7, 9?', 'hint' => 'Angka di posisi tengah.', 'correct_answer' => '5'],
                                    ['level' => 3, 'question' => 'Mean Lanjut', 'instruction' => 'Rata-rata 10, 20, 30, 40?', 'hint' => 'Jumlah 100 dibagi 4.', 'correct_answer' => '25'],
                                    ['level' => 4, 'question' => 'Median Genap', 'instruction' => 'Median 2, 4, 6, 8?', 'hint' => 'Rata-rata dua angka tengah.', 'correct_answer' => '5'],
                                    ['level' => 5, 'question' => 'Modus', 'instruction' => 'Yang paling sering muncul: 1, 2, 2, 3?', 'hint' => 'Angka 2 muncul dua kali.', 'correct_answer' => '2'],
                                ]
                            ]
                        ]
                    ]
                ]
            ],

            // ==========================================
            // 11. KEDOKTERAN (HINTS FIXED)
            // ==========================================
            [
                'name' => 'Kedokteran', 'slug' => 'kedokteran', 'description' => 'Kesehatan manusia.',
                'topics' => [
                    [
                        'name' => 'Anatomi', 'slug' => 'anatomi', 'description' => 'Organ tubuh.',
                        'games' => [
                            [
                                'title' => 'Organ Quiz', 'slug' => 'organ-quiz', 'description' => 'Tebak fungsi organ.', 'game_type' => 'quiz',
                                'levels' => [
                                    ['level' => 1, 'question' => 'Pompa', 'instruction' => 'Organ pemompa darah?', 'hint' => 'Di dada kiri.', 'correct_answer' => 'Jantung'],
                                    ['level' => 2, 'question' => 'Filter', 'instruction' => 'Organ penyaring racun?', 'hint' => 'Hati/Liver.', 'correct_answer' => 'Hati'],
                                    ['level' => 3, 'question' => 'Nafas', 'instruction' => 'Organ pertukaran udara?', 'hint' => 'Paru-paru.', 'correct_answer' => 'Paru-paru'],
                                    ['level' => 4, 'question' => 'Serap', 'instruction' => 'Tempat penyerapan nutrisi?', 'hint' => 'Usus Halus.', 'correct_answer' => 'Usus Halus'],
                                    ['level' => 5, 'question' => 'Urin', 'instruction' => 'Penyaring darah jadi urin?', 'hint' => 'Ginjal.', 'correct_answer' => 'Ginjal'],
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ];

        // LOGIC LOOPING (JANGAN DIUBAH)
        foreach ($structures as $majorData) {
            $major = Major::updateOrCreate(['slug' => $majorData['slug']], Arr::except($majorData, ['topics']));
            
            foreach ($majorData['topics'] as $topicData) {
                $topic = $major->topics()->updateOrCreate(['slug' => $topicData['slug']], Arr::except($topicData, ['games']));
                
                foreach ($topicData['games'] as $gameData) {
                    // Create Game
                    $game = $topic->games()->updateOrCreate(
                        ['slug' => $gameData['slug']], 
                        Arr::only($gameData, ['title', 'slug', 'description', 'game_type'])
                    );

                    // Create Levels
                    if (isset($gameData['levels'])) {
                        foreach ($gameData['levels'] as $levelData) {
                            GameLevel::updateOrCreate(
                                ['game_id' => $game->id, 'level' => $levelData['level']],
                                Arr::only($levelData, ['question', 'instruction', 'hint', 'initial_code', 'correct_answer', 'setup_html', 'target_answer', 'target_css'])
                            );
                        }
                    }

                    // [LOGIC MATERI: MANUAL VS OTOMATIS]
                    if (isset($gameData['learning_material'])) {
                        LearningMaterial::updateOrCreate(
                            ['game_id' => $game->id],
                            $gameData['learning_material']
                        );
                    } else {
                        // OTOMATIS UNTUK YANG BELUM DIISI (Hukum, Kedokteran, dll)
                        LearningMaterial::updateOrCreate(
                            ['game_id' => $game->id],
                            [
                                'title' => 'Pengantar: ' . $gameData['title'],
                                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder Video
                                'min_read_seconds' => 5,
                                'content' => '
                                    <div class="bg-gray-800 p-6 rounded-xl border border-gray-700">
                                        <h3 class="text-2xl font-bold text-white mb-2">Selamat Datang di ' . $gameData['title'] . '</h3>
                                        <p class="text-gray-300 leading-relaxed">' . $gameData['description'] . '</p>
                                    </div>
                                    <div class="bg-indigo-900/20 p-4 rounded-lg border-l-4 border-indigo-500 mt-4">
                                        <h4 class="font-bold text-white mb-2">Tujuan Pembelajaran:</h4>
                                        <ul class="list-disc list-inside text-gray-300 space-y-1">
                                            <li>Memahami konsep dasar topik ini.</li>
                                            <li>Melatih logika dan pemecahan masalah.</li>
                                        </ul>
                                    </div>
                                '
                            ]
                        );
                    }
                }
            }
        }
    }
}