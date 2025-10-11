<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TagQuestion extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_tag_questions';

    protected $fillable = [
        'id_question',
        'id_tag',
    ];

    // Relationships
    public function question()
    {
        return $this->belongsTo(Question::class, 'id_question', 'id_question');
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class, 'id_tag', 'id_tag');
    }
}
