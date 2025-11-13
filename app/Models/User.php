<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Filament\Models\Contracts\FilamentUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Filament\Panel;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens, Notifiable;

    protected $primaryKey = 'id_user';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ===== FILAMENT =====
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->role === 'admin';
    }

    // ===== RELATIONSHIPS =====
    public function questions()
    {
        return $this->hasMany(Question::class, 'id_user', 'id_user');
    }

    public function favoriteQuestions()
    {
        return $this->belongsToMany(Question::class, 'favorite_questions', 'id_user', 'id_question');
    }

    public function userAnswers()
    {
        return $this->hasMany(UserAnswer::class, 'id_user', 'id_user');
    }

    public function points()
    {
        return $this->hasMany(UserPoint::class, 'id_user', 'id_user');
    }

    // ===== ATTRIBUTE ACCESSORS =====
    public function getTotalPointsAttribute()
    {
        return $this->points()->sum('points_earned');
    }

    public function getAccuracyRateAttribute()
    {
        $totalAnswers = $this->userAnswers()->count();
        $correctAnswers = $this->userAnswers()->where('is_correct', true)->count();

        return $totalAnswers > 0 ? round(($correctAnswers / $totalAnswers) * 100, 1) : 0;
    }

    public function getQuestionsSolvedAttribute()
    {
        return $this->points()->count();
    }

    public function getLastActivityAttribute()
    {
        return $this->userAnswers()->latest()->first()?->created_at?->diffForHumans() ?? '-';
    }
}
