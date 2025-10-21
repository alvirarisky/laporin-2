<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'laporan_id', // <-- INI PERBAIKANNYA
        'title',
        'content',
        'order',
    ];

    /**
     * Relasi: Setiap bagian laporan (section) dimiliki oleh satu Laporan.
     */
    public function laporan(): BelongsTo
    {
        // Pastikan foreign key di sini juga benar
        return $this->belongsTo(Laporan::class, 'laporan_id');
    }
}