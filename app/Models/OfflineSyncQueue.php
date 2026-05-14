<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfflineSyncQueue extends Model
{
    use HasFactory;

    protected $table = 'offline_sync_queue';

    protected $fillable = [
        'id_user',
        'action_type',
        'payload',
        'status',
        'attempts',
        'error_message',
        'acted_at',
    ];

    protected $casts = [
        'payload'   => 'array',   // otomatis encode/decode JSON
        'acted_at'  => 'datetime',
        'attempts'  => 'integer',
    ];

    const ACTION_ANSWER_QUESTION  = 'answer_question';
    const ACTION_COMPLETE_MODULE  = 'complete_module';
    const ACTION_COMPLETE_MATERIAL= 'complete_material';
    const ACTION_SUBMIT_REFLECTION= 'submit_reflection';

    const STATUS_PENDING = 'pending';
    const STATUS_SYNCED  = 'synced';
    const STATUS_FAILED  = 'failed';

    // ─── Relationships ─────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    // ─── Scopes ────────────────────────────────────

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }

    // ─── Helpers ───────────────────────────────────

    public function markSynced(): void
    {
        $this->update(['status' => self::STATUS_SYNCED]);
    }

    public function markFailed(string $errorMessage): void
    {
        $this->update([
            'status'        => self::STATUS_FAILED,
            'error_message' => $errorMessage,
            'attempts'      => $this->attempts + 1,
        ]);
    }
}