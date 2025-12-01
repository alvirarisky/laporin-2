<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Laporan extends Model
{
    use HasFactory;

    protected $fillable = [/* ... field laporan lainnya ... */ 'mata_kuliah', 'topic_id']; // Tambah topic_id jika ada

    public function sections(): HasMany
    {
        return $this->hasMany(ReportSection::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // --- BARU: Relasi ke Topik ---
    // Opsi 1: Jika ada foreign key 'topic_id' di tabel laporans
    // public function topic(): BelongsTo
    // {
    //    return $this->belongsTo(Topic::class);
    // }

    // Opsi 2: Jika hanya ada string 'mata_kuliah', kita buat accessor
    public function getRelevantGameAttribute()
    {
        // Cari topik yang namanya cocok (case-insensitive)
        $topic = Topic::whereRaw('LOWER(name) = ?', [strtolower($this->mata_kuliah)])->first();

        if ($topic) {
            // Ambil game yang paling relevan untuk topik ini
            // Asumsi: Game langsung berelasi ke Topic (game punya topic_id)
            return Game::where('topic_id', $topic->id)
                       // ->where('relevance_score', '>', 0.7) // Contoh filter relevansi
                ->orderBy('created_at', 'desc') // Atau logic lain
                ->first();
            // Jika pakai pivot table topic_game_links:
            // return $topic->relevantGames()->first();
        }

        return null; // Tidak ada game relevan
    }
}
