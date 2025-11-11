<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserPoint extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_user_point';

    protected $fillable = [
        'id_user',
        'id_question',
        'points_earned'
    ];

    protected $casts = [
        'points_earned' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'id_question', 'id_question');
    }

    public static function getTotalPoints($userId)
    {
        return self::where('id_user', $userId)->sum('points_earned');
    }
}
