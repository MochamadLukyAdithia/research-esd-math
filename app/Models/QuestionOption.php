<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class QuestionOption extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_question_option';

    protected $fillable = [
        'option_text',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function questions()
    {
        return $this->belongsTo(Question::class, 'id_question', 'id_question');
    }
}