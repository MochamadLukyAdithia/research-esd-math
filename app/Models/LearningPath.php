<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningPath extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_learning_path';

    protected $fillable = [
        'title',
        'description',
        'grade',
        'category',
        'thumbnail',
        'estimated_minutes',
        'is_published',
    ];

    protected $casts = [
        'is_published'      => 'boolean',
        'grade'             => 'integer',
        'estimated_minutes' => 'integer',
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