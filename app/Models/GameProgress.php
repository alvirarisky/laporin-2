<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameProgress extends Model
{
    use HasFactory;

    protected $table = 'game_progresses';
    protected $guarded = ['id'];
    protected $casts = [
        'score' => 'integer',
    ];

    // Relasi: Progress milik satu user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relasi: Progress milik satu game
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    // Relasi: Progress terkait satu level
    public function level(): BelongsTo // Nama method 'level' singular
    {
        return $this->belongsTo(GameLevel::class); // Relasi ke GameLevel
    }
}
