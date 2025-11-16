<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionImage extends Model
{
    protected $table = 'question_images';

    protected $primaryKey = 'id_question_image';

    protected $fillable = [
        'question_id',
        'image_path',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id', 'id_question');
    }
}
