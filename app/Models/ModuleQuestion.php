<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_module',
        'id_question',
        'order_number',
    ];

    protected $casts = [
        'order_number' => 'integer',
    ];

    // ─── Relationships ─────────────────────────────

    public function module(): BelongsTo
    {
        return $this->belongsTo(LearningPathModule::class, 'id_module', 'id_module');
    }

    /**
     * Relasi ke tabel questions yang sudah ada (tabel existing).
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'id_question', 'id_question');
    }
}