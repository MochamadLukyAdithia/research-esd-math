<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningPathModule extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_module';

    protected $fillable = [
        'id_learning_path',
        'title',
        'type',
        'order_number',
        'is_required',
    ];

    protected $casts = [
        'is_required'  => 'boolean',
        'order_number' => 'integer',
    ];

    // Tipe modul yang valid
    const TYPE_PRE_TEST   = 'pre_test';
    const TYPE_MATERIAL   = 'material';
    const TYPE_ACTIVITY   = 'activity';
    const TYPE_POST_TEST  = 'post_test';
    const TYPE_REFLECTION = 'reflection';

    // ─── Relationships ─────────────────────────────

    public function learningPath(): BelongsTo
    {
        return $this->belongsTo(LearningPath::class, 'id_learning_path', 'id_learning_path');
    }

    public function materials(): HasMany
    {
        return $this->hasMany(LearningMaterial::class, 'id_module', 'id_module')
            ->orderBy('order_number');
    }

    public function moduleQuestions(): HasMany
    {
        return $this->hasMany(ModuleQuestion::class, 'id_module', 'id_module')
            ->orderBy('order_number');
    }

    public function userProgress(): HasMany
    {
        return $this->hasMany(UserModuleProgress::class, 'id_module', 'id_module');
    }

    public function reflections(): HasMany
    {
        return $this->hasMany(UserReflection::class, 'id_module', 'id_module');
    }

    // ─── Scopes ────────────────────────────────────

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    // ─── Helpers ───────────────────────────────────

    public function isTestModule(): bool
    {
        return in_array($this->type, [self::TYPE_PRE_TEST, self::TYPE_POST_TEST]);
    }
}