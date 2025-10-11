<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FavoriteQuestion extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_favorite';
    
    public $timestamps = false;

    protected $fillable = [
        'id_question',
        'id_user',
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
}
