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
        'grade',
        'id_district',
        'id_user',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'longitude' => 'float',
        'latitude' => 'float',
        'grade' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

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

    public function getTotalAnswers(): int
    {
        return $this->userAnswers()->count();
    }

    public function getCorrectAnswersCount(): int
    {
        return $this->userAnswers()->where('is_correct', true)->count();
    }

    public function getAccuracyRate(): float
    {
        $total = $this->getTotalAnswers();
        if ($total === 0) {
            return 0;
        }
        return ($this->getCorrectAnswersCount() / $total) * 100;
    }
}
