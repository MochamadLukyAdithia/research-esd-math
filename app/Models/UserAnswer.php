<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserAnswer extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_user_answers';

    protected $fillable = [
        'id_question',
        'id_user',
        'answer',
        'is_correct',
        'answered_at',
    ];

    protected $casts = [
        'answer' => 'float',
        'is_correct' => 'boolean',
        'answered_at' => 'datetime',
    ];

    // Relationships
    public function question()
    {
        return $this->belongsTo(Question::class, 'id_question', 'id_question');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    // Helper Methods
    
    /**
     * Validate answer automatically when saving
     */
    protected static function booted()
    {
        static::creating(function ($userAnswer) {
            if ($userAnswer->question) {
                $userAnswer->is_correct = $userAnswer->question->checkAnswer($userAnswer->answer);
                $userAnswer->answered_at = now();
            }
        });
    }

    /**
     * Manually validate answer
     */
    public function validateAnswer(): bool
    {
        if ($this->question) {
            $this->is_correct = $this->question->checkAnswer($this->answer);
            $this->save();
        }
        return $this->is_correct;
    }

    /**
     * Get score (1 if correct, 0 if incorrect)
     */
    public function getScore(): int
    {
        return $this->is_correct ? 1 : 0;
    }
}
