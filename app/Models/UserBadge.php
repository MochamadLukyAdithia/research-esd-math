<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserBadge extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'id_badge',
        'earned_at',
    ];

    protected $casts = [
        'earned_at' => 'datetime',
    ];

    // ─── Relationships ─────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function badge(): BelongsTo
    {
        return $this->belongsTo(Badge::class, 'id_badge', 'id_badge');
    }
}