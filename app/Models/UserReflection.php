<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserReflection extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_reflection';

    protected $fillable = [
        'id_user',
        'id_module',
        'understood_concepts',
        'difficult_parts',
        'most_helpful_activity',
        'rating',
        'is_synced',
    ];

    protected $casts = [
        'rating'    => 'integer',
        'is_synced' => 'boolean',
    ];

    // ─── Relationships ─────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(LearningPathModule::class, 'id_module', 'id_module');
    }
}