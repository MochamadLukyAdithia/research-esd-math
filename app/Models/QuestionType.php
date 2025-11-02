<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class QuestionType extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_question_type';

    protected $fillable = [
        'question_type',
    ];

    public function questions()
    {
        return $this->hasMany(Question::class, 'id_question', 'id_question');
    }
}