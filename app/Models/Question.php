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
        'points', // Tambahkan points ke fillable
        'id_user',
        'id_question_type',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'correct_answer' => 'string',
        'longitude' => 'float',
        'latitude' => 'float',
        'grade' => 'integer',
        'points' => 'integer', // Cast untuk points
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Tambahkan attribute appends jika ingin mengakses relasi points
    protected $appends = ['total_user_points'];

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

    // Relasi dengan user yang membuat question
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    // Relasi dengan user points (user yang mendapatkan points dari question ini)
    public function userPoints()
    {
        return $this->hasMany(UserPoint::class, 'id_question', 'id_question');
    }


    // Accessor untuk total points yang diberikan dari question ini
    public function getTotalUserPointsAttribute()
    {
        return $this->userPoints()->sum('points_earned');
    }

    // Method untuk menambahkan points ke user
    public function awardPointsToUser($userId, $points = null)
    {
        $pointsToAward = $points ?? $this->points;

        return UserPoint::create([
            'id_user' => $userId,
            'id_question' => $this->id_question,
            'points_earned' => $pointsToAward
        ]);
    }

    public function questionType()
    {
        return $this->belongsTo(QuestionType::class, 'id_question_type', 'id_question_type');
    }

    public function questionImages()
    {
        return $this->hasMany(QuestionImage::class, 'question_id', 'id_question');
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
//
}

