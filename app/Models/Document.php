<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi secara massal.
     */
    protected $fillable = [
        'title',
        'content_data',
    ];

    /**
     * Mendefinisikan bahwa satu Document dimiliki oleh satu User.
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}