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

        // Auto create UserPoint HANYA ketika jawaban benar
        static::created(function ($userAnswer) {
            if ($userAnswer->is_correct) {
                $question = $userAnswer->question;
                if ($question && $question->points > 0) {
                    UserPoint::create([
                        'id_user' => $userAnswer->id_user,
                        'id_question' => $userAnswer->id_question,
                        'points_earned' => $question->points
                    ]);
                }
            }
        });

        // Update UserPoint HANYA ketika berubah dari salah ke benar
        static::updated(function ($userAnswer) {
            // Jika berubah dari salah ke benar
            if ($userAnswer->is_correct && $userAnswer->getOriginal('is_correct') === false) {
                $question = $userAnswer->question;
                if ($question && $question->points > 0) {
                    UserPoint::create([
                        'id_user' => $userAnswer->id_user,
                        'id_question' => $userAnswer->id_question,
                        'points_earned' => $question->points
                    ]);
                }
            }

            // Jika berubah dari benar ke salah, hapus UserPoint
            if (!$userAnswer->is_correct && $userAnswer->getOriginal('is_correct') === true) {
                UserPoint::where('id_user', $userAnswer->id_user)
                    ->where('id_question', $userAnswer->id_question)
                    ->delete();
            }
        });

        // Hapus UserPoint ketika UserAnswer dihapus (jika jawaban benar)
        static::deleted(function ($userAnswer) {
            if ($userAnswer->is_correct) {
                UserPoint::where('id_user', $userAnswer->id_user)
                    ->where('id_question', $userAnswer->id_question)
                    ->delete();
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



/**
 * Check if user answer matches correct answer with normalization
 */
// public static function checkAnswer($userAnswer, $correctAnswer)
// {
//     $normalizedUser = self::normalizeAnswer($userAnswer);
//     $normalizedCorrect = self::normalizeAnswer($correctAnswer);

//     // Exact match setelah normalisasi dasar
//     if ($normalizedUser === $normalizedCorrect) {
//         return true;
//     }

//     // Hapus satuan
//     $pattern = '/\s*(meter|m|cm|km|kg|g|liter|l|detik|s|menit|jam|°|derajat)\s*$/i';

//     $cleanUser = preg_replace($pattern, '', $normalizedUser);
//     $cleanCorrect = preg_replace($pattern, '', $normalizedCorrect);

//     // Hapus spasi berlebihan
//     $cleanUser = preg_replace('/\s+/', ' ', $cleanUser);
//     $cleanCorrect = preg_replace('/\s+/', ' ', $cleanCorrect);

//     // Trim lagi
//     $cleanUser = trim($cleanUser);
//     $cleanCorrect = trim($cleanCorrect);

//     return $cleanUser === $cleanCorrect;
// }

}

