<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningMaterial extends Model
{
    use HasFactory;
    protected $guarded = []; // Biar bisa mass assignment (create/updateOrCreate)

    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}