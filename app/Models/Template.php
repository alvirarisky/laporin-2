<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Jangan lupa tambahkan ini
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'filepath', 'is_public', 'description'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
