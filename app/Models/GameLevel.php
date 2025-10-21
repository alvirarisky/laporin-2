<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameLevel extends Model {
    protected $guarded = ['id'];
    public function game(): BelongsTo {
        return $this->belongsTo(Game::class);
    }
}