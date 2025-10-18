<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Question extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_question';

    protected $fillable = [
        'title',
        'question',
        'location_name',
        'longitude',
        'latitude',
        'question_image',
        'correct_answer',
        'id_district',
        'id_user',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'longitude' => 'float',
        'latitude' => 'float',
        'correct_answer' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function district()
    {
        return $this->belongsTo(District::class, 'id_district', 'id_district');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'tag_questions', 'id_question', 'id_tag');
    }

    public function hints()
    {
        return $this->hasMany(Hint::class, 'id_question', 'id_question');
    }

    public function userAnswers()
    {
        return $this->hasMany(UserAnswer::class, 'id_question', 'id_question');
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorite_questions', 'id_question', 'id_user');
    }

    // Helper Methods
    public function checkAnswer($userAnswer): bool
    {
        return floatval($userAnswer) === floatval($this->correct_answer);
    }

    public function getTotalAnswers(): int
    {
        return $this->userAnswers()->count();
    }

    public function getCorrectAnswersCount(): int
    {
        return $this->userAnswers()->where('is_correct', true)->count();
    }
}
