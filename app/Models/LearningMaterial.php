<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class LearningMaterial extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_material';

    protected $fillable = [
        'id_module',
        'title',
        'content_type',
        'content',
        'file_path',
        'order_number',
    ];

    protected $casts = [
        'order_number' => 'integer',
    ];

    const TYPE_SLIDE   = 'slide';
    const TYPE_VIDEO   = 'video';
    const TYPE_EXAMPLE = 'example';
    const TYPE_TEXT    = 'text';

    // ─── Relationships ─────────────────────────────

    public function module(): BelongsTo
    {
        return $this->belongsTo(LearningPathModule::class, 'id_module', 'id_module');
    }

    // ─── Accessors ─────────────────────────────────

    /**
     * Mengembalikan URL file (lokal atau eksternal).
     */
    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) return null;

        return str_starts_with($this->file_path, 'http')
            ? $this->file_path
            : Storage::url($this->file_path);
    }
}