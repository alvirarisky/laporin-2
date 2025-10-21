<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model {
    protected $guarded = ['id'];
    public function topic(): BelongsTo {
        return $this->belongsTo(Topic::class);
    }
    public function levels(): HasMany {
        return $this->hasMany(GameLevel::class);
    }
}