<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

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
        'id_user',
        'id_question_type',        
        'created_at',
        'updated_at',
        'question_image'
    ];


    protected $casts = [
        'question_image' => 'string',
        'correct_answer' => 'string',
        'longitude' => 'float',
        'latitude' => 'float',
        'grade' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

     public function getQuestionImageUrlAttribute()
    {
        
        if (empty($this->question_image) || $this->question_image === '') {
            return Storage::url('questions/default/default.png');
        }


        if (str_starts_with($this->question_image, 'http')) {
            return $this->question_image;
        }


        return Storage::url($this->question_image);
    }


    public function getQuestionImageFullUrlAttribute()
    {
        if (!$this->question_image) {
            return null;
        }

        return asset(Storage::url($this->question_image));
    }


    public function hasImage()
    {
        return !empty($this->question_image);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function questionType()
    {
        return $this->belongsTo(QuestionType::class, 'id_question_type', 'id_question_type');
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

    public function questionOptions()
    {
        return $this->hasMany(QuestionOption::class, 'id_question', 'id_question');
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
