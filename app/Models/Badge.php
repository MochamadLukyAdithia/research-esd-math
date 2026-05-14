<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Badge extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_badge';

    protected $fillable = [
        'name',
        'description',
        'image_path',
        'criteria_type',
        'criteria_value',
    ];

    protected $casts = [
        'criteria_value' => 'integer',
    ];

    // Tipe kriteria yang tersedia
    const CRITERIA_COMPLETE_PATH = 'complete_path'; // selesaikan N learning path
    const CRITERIA_SCORE_ABOVE   = 'score_above';   // post_test_score >= N
    const CRITERIA_PERFECT_SCORE = 'perfect_score'; // post_test_score = 100

    // ─── Relationships ─────────────────────────────

    public function userBadges(): HasMany
    {
        return $this->hasMany(UserBadge::class, 'id_badge', 'id_badge');
    }
}