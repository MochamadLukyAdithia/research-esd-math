<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningPath extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_learning_path';

   // app/Models/LearningPath.php

protected $fillable = [
    'title',
    'description',
    'capaian_pembelajaran',   // ← baru
    'kompetensi_dasar',       // ← baru
    'metode_penilaian',       // ← baru (JSON)
    'sumber_belajar',         // ← baru (JSON)
    'grade',
    'category',
    'thumbnail',
    'estimated_minutes',
    'is_published',
];

protected $casts = [
    'is_published'         => 'boolean',
    'grade'                => 'integer',
    'estimated_minutes'    => 'integer',
    'metode_penilaian'     => 'array',   // ← auto JSON decode/encode
    'sumber_belajar'       => 'array',   // ← auto JSON decode/encode
];

    // ─── Relationships ─────────────────────────────

    public function modules(): HasMany
    {
        return $this->hasMany(LearningPathModule::class, 'id_learning_path', 'id_learning_path')
            ->orderBy('order_number');
    }

    public function userProgress(): HasMany
    {
        return $this->hasMany(UserLearningPathProgress::class, 'id_learning_path', 'id_learning_path');
    }

    // ─── Scopes ────────────────────────────────────

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeByGrade($query, int $grade)
    {
        return $query->where('grade', $grade);
    }
}