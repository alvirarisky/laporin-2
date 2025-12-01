<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// use Illuminate\Database\Eloquent\Relations\BelongsToMany; // Jika pakai pivot

class Game extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'game_type' => 'string',
    ];

    // Relasi: Satu game milik satu topik
    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }

    // Relasi: Satu game punya banyak level
    public function levels(): HasMany
    {
        // Pastikan foreign key di game_levels adalah 'game_id'
        // Urutkan berdasarkan nomor level
        return $this->hasMany(GameLevel::class)->orderBy('level', 'asc');
    }

    // Relasi: Satu game punya banyak progress dari user
    public function progresses(): HasMany
    {
        return $this->hasMany(GameProgress::class);
    }

    // Relasi Many-to-Many via pivot table (jika pakai topic_game_links)
    // public function relevantTopics(): BelongsToMany
    // {
    //     return $this->belongsToMany(Topic::class, 'topic_game_links')
    //                 ->withPivot('relevance_score');
    // }

    /**
     * Override route model binding untuk pakai slug
     */
    public function getRouteKeyName()
    {
        return 'slug'; // Gunakan slug di URL (/questify/{slug})
    }
}
