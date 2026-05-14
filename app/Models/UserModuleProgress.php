<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserModuleProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'id_module',
        'status',
        'completed_at',
        'is_synced',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'is_synced'    => 'boolean',
    ];

    const STATUS_NOT_STARTED = 'not_started';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED   = 'completed';

    // ─── Relationships ─────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(LearningPathModule::class, 'id_module', 'id_module');
    }

    // ─── Scopes ────────────────────────────────────

    public function scopePending($query)
    {
        return $query->where('is_synced', false);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }
}