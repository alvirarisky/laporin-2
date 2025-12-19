<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\LearningMaterial;
use Illuminate\Database\Seeder;

class LearningMaterialSeeder extends Seeder
{
    public function run(): void
    {
        // 1. DAFTAR MATERI SPESIFIK (Manual untuk IT)
        // Kuncinya adalah 'slug' game harus cocok dengan yang ada di DatabaseSeeder
        $specificMaterials = [
            'flexbox-chibi' => [
                'title' => 'Pengenalan Flexbox Layout',
                'video_url' => 'https://www.youtube.com/watch?v=phWxA89Dy94',
                'min_read_seconds' => 10,
                'content' => '
                    <h3>Apa itu Flexbox?</h3>
                    <p>Flexbox (Flexible Box) adalah metode layout CSS untuk mengatur elemen dalam satu dimensi (baris atau kolom).</p>
                    <div class="bg-gray-800 p-4 rounded text-gray-200 mt-2">
                        <strong>Properti Utama:</strong>
                        <ul class="list-disc ml-5 mt-2">
                            <li><code>justify-content</code>: Posisi horizontal (kiri, kanan, tengah).</li>
                            <li><code>align-items</code>: Posisi vertikal (atas, bawah, tengah).</li>
                            <li><code>flex-direction</code>: Arah (baris/row atau kolom/column).</li>
                        </ul>
                    </div>
                    <p class="mt-4">Gunakan logika ini untuk memindahkan Chibi ke target!</p>
                '
            ],
            'sql-detective' => [
                'title' => 'Dasar Perintah SQL: SELECT',
                'video_url' => 'https://www.youtube.com/watch?v=7S_tz1z_5bA',
                'min_read_seconds' => 15,
                'content' => '
                    <h3>SQL (Structured Query Language)</h3>
                    <p>Bahasa standar untuk mengakses database.</p>
                    <hr class="border-gray-600 my-3"/>
                    <h4>1. Mengambil Data</h4>
                    <pre class="bg-black text-green-400 p-3 rounded font-mono text-sm">SELECT * FROM users;</pre>
                    <p class="text-sm mt-1">Tanda <code>*</code> artinya mengambil SEMUA kolom.</p>
                    
                    <h4 class="mt-4">2. Filter Data (WHERE)</h4>
                    <pre class="bg-black text-green-400 p-3 rounded font-mono text-sm">SELECT * FROM users WHERE status = "active";</pre>
                '
            ],
            'subnet-calculator' => [
                'title' => 'Dasar Subnetting & IP Address',
                'min_read_seconds' => 10,
                'content' => '
                    <h3>Rumus Menghitung Host</h3>
                    <p>Untuk mengetahui berapa perangkat yang bisa terhubung dalam satu jaringan:</p>
                    <div class="bg-blue-900/30 border border-blue-500 p-4 rounded my-3 text-center">
                        <span class="text-xl font-bold">(2 <sup>n</sup>) - 2</span>
                    </div>
                    <p>Dimana <strong>n</strong> adalah sisa bit host (32 dikurangi prefix).</p>
                    <p>Contoh /24: Sisa bit = 8. Maka (2^8) - 2 = <strong>254 Host</strong>.</p>
                '
            ],
            'caesar-cipher' => [
                'title' => 'Sejarah & Logika Caesar Cipher',
                'min_read_seconds' => 5,
                'content' => '
                    <h3>Enkripsi Klasik</h3>
                    <p>Algoritma ini digunakan oleh Julius Caesar untuk mengirim pesan rahasia.</p>
                    <p>Caranya sangat sederhana: <strong>Menggeser huruf</strong> dalam alfabet.</p>
                    <ul class="list-disc ml-5 bg-gray-800 p-3 rounded">
                        <li>Geser +1: A -> B, B -> C</li>
                        <li>Geser -1: B -> A, C -> B</li>
                    </ul>
                '
            ],
            'linux-command' => [
                'title' => 'Cheat Sheet Perintah Linux',
                'min_read_seconds' => 5,
                'content' => '
                    <h3>Perintah Wajib Hafal</h3>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <div class="bg-gray-700 p-2 rounded"><code>ls</code> : Lihat isi folder</div>
                        <div class="bg-gray-700 p-2 rounded"><code>cd</code> : Pindah folder</div>
                        <div class="bg-gray-700 p-2 rounded"><code>mkdir</code> : Buat folder</div>
                        <div class="bg-gray-700 p-2 rounded"><code>rm</code> : Hapus file</div>
                    </div>
                '
            ]
        ];

        // 2. AMBIL SEMUA GAME DARI DATABASE
        $games = Game::all();

        foreach ($games as $game) {
            // Hapus materi lama (biar fresh)
            LearningMaterial::where('game_id', $game->id)->delete();

            // Cek apakah game ini punya materi spesifik di array atas?
            if (isset($specificMaterials[$game->slug])) {
                // A. PAKAI MATERI SPESIFIK
                LearningMaterial::create([
                    'game_id' => $game->id,
                    'title' => $specificMaterials[$game->slug]['title'],
                    'content' => $specificMaterials[$game->slug]['content'],
                    'video_url' => $specificMaterials[$game->slug]['video_url'] ?? null,
                    'min_read_seconds' => $specificMaterials[$game->slug]['min_read_seconds'] ?? 10,
                ]);
            } else {
                // B. AUTO-GENERATE MATERI (Fallback untuk Hukum, Kedokteran, dll)
                LearningMaterial::create([
                    'game_id' => $game->id,
                    'title' => 'Modul Belajar: ' . $game->title,
                    'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder Video
                    'min_read_seconds' => 5, // Cepat aja karena materi umum
                    'content' => '
                        <div class="space-y-4">
                            <div class="bg-indigo-900/30 border-l-4 border-indigo-500 p-4">
                                <h3 class="text-lg font-bold text-white">Selamat Datang di ' . $game->title . '</h3>
                                <p class="text-gray-300 mt-1">' . $game->description . '</p>
                            </div>

                            <div class="bg-gray-800 p-4 rounded-lg">
                                <h4 class="font-bold text-white border-b border-gray-600 pb-2 mb-2">Tujuan Pembelajaran:</h4>
                                <ul class="list-disc list-inside text-gray-300 space-y-1">
                                    <li>Memahami konsep dasar dari topik <strong>' . $game->title . '</strong>.</li>
                                    <li>Melatih logika dan pemecahan masalah melalui gamifikasi.</li>
                                    <li>Mempersiapkan diri sebelum masuk ke level permainan.</li>
                                </ul>
                            </div>

                            <p class="text-sm text-gray-400 italic text-center mt-4">
                                *Materi lengkap sedang disusun oleh dosen pengampu. Silakan lanjutkan ke game.*
                            </p>
                        </div>
                    '
                ]);
            }
        }
    }
}