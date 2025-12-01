<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameLevel extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Relasi: Satu level milik satu game
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
