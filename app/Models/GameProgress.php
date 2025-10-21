<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameProgress extends Model
{
    use HasFactory;
    protected $table = 'game_progress';
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}