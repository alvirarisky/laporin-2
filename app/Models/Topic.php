<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Topic extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    /**
     * Mendefinisikan bahwa satu Topik memiliki banyak Game.
     * Ini sesuai dengan struktur database kita (kolom games.topic_id).
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function games(): HasMany
    {
        return $this->hasMany(Game::class);
    }
}