<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Laporan extends Model
{
    use HasFactory;

    // Kolom-kolom yang diperbolehkan diisi (mass assignable)
    protected $fillable = [
        'user_id',
        'report_type',
        'judul',
        'nama',
        'nim',
        'prodi',
        'mata_kuliah',
        'dosen_pembimbing',
        'instansi',
        'kota',
        'tahun_ajaran',
        'logo_path',
        'logo_position',
    ];

    /**
     * Relasi: Laporan memiliki banyak bagian (sections).
     * Method ini mengatasi error "BadMethodCallException: Call to undefined method sections()".
     */
    public function sections(): HasMany
    {
        return $this->hasMany(ReportSection::class);
    }

    /**
     * Relasi: Laporan dimiliki oleh satu User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
