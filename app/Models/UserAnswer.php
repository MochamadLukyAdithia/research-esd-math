<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_question',
        'id_user',
        'answer',
        'is_correct',
        'answered_at',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
        'answered_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::created(function ($userAnswer) {
            // Jika jawabannya benar, buat UserPoint hanya jika belum ada point
            if ($userAnswer->is_correct) {
                $question = $userAnswer->question;

                if (!$question) return;

                $existingPoint = UserPoint::where('id_user', $userAnswer->id_user)
                    ->where('id_question', $userAnswer->id_question)
                    ->first();

                if (!$existingPoint) {
                    UserPoint::create([
                        'id_user' => $userAnswer->id_user,
                        'id_question' => $userAnswer->id_question,
                        'points_earned' => $question->points
                    ]);
                }
            }
        });
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'id_question', 'id_question');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function getScore(): int
    {
        return $this->is_correct ? 1 : 0;
    }
}


