<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hint extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_hint';

    protected $fillable = [
        'id_question',
        'image',
        'hint_description',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class, 'id_question', 'id_question');
    }
}
