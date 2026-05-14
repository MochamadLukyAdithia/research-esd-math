<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLearningPathProgress extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_progress';

    protected $fillable = [
        'id_user',
        'id_learning_path',
        'pre_test_score',
        'post_test_score',
        'progress_percentage',
        'status',
        'started_at',
        'completed_at',
        'synced_at',
    ];

    protected $casts = [
        'pre_test_score'      => 'integer',
        'post_test_score'     => 'integer',
        'progress_percentage' => 'integer',
        'started_at'          => 'datetime',
        'completed_at'        => 'datetime',
        'synced_at'           => 'datetime',
    ];

    const STATUS_NOT_STARTED = 'not_started';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED   = 'completed';

    // ─── Relationships ─────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function learningPath(): BelongsTo
    {
        return $this->belongsTo(LearningPath::class, 'id_learning_path', 'id_learning_path');
    }

    // ─── Helpers ───────────────────────────────────

    /**
     * Hitung selisih peningkatan skor pre ke post test.
     */
    public function getScoreImprovementAttribute(): ?int
    {
        if ($this->pre_test_score === null || $this->post_test_score === null) return null;
        return $this->post_test_score - $this->pre_test_score;
    }

    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }
}