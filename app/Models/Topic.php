<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Topic extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }

    // Relasi: Satu topik punya banyak game
    public function games(): HasMany
    {
        return $this->hasMany(Game::class);
    }

    // Relasi Many-to-Many via pivot table (jika pakai topic_game_links)
    // public function relevantGames(): BelongsToMany
    // {
    //     return $this->belongsToMany(Game::class, 'topic_game_links')
    //                 ->withPivot('relevance_score')
    //                 ->orderBy('pivot_relevance_score', 'desc');
    // }
}
