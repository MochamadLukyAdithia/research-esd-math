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
     * URL file yang siap dipakai di frontend.
     * Mendukung path lokal (Storage) maupun URL eksternal (YouTube embed, Google Slides, dll).
     */
    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) return null;

        if (str_starts_with($this->file_path, 'http')) {
            return $this->file_path;
        }

        return Storage::url($this->file_path);
    }

    /**
     * Cek apakah materi ini punya file yang diupload (bukan URL eksternal).
     */
    public function hasUploadedFile(): bool
    {
        return $this->file_path && !str_starts_with($this->file_path, 'http');
    }

    /**
     * Label tipe konten untuk ditampilkan di UI.
     */
    public function getContentTypeLabelAttribute(): string
    {
        return match ($this->content_type) {
            self::TYPE_SLIDE   => 'Slide / PPT',
            self::TYPE_VIDEO   => 'Video',
            self::TYPE_EXAMPLE => 'Contoh Soal',
            self::TYPE_TEXT    => 'Teks / Penjelasan',
            default            => $this->content_type,
        };
    }
}