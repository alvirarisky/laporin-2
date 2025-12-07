<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReportSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'laporan_id',
        'parent_id',
        'title',
        'content',
        'order',
    ];

    /**
     * Relasi: Setiap bagian laporan (section) dimiliki oleh satu Laporan.
     */
    public function laporan(): BelongsTo
    {
        return $this->belongsTo(Laporan::class, 'laporan_id');
    }

    /**
     * Relasi: Parent section (untuk nested structure)
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(ReportSection::class, 'parent_id');
    }

    /**
     * Relasi: Child sections (sub-bab)
     */
    public function children(): HasMany
    {
        return $this->hasMany(ReportSection::class, 'parent_id')->orderBy('order');
    }

    /**
     * Scope: Ambil hanya root sections (tidak punya parent)
     */
    public function scopeRootSections($query)
    {
        return $query->whereNull('parent_id');
    }
}
