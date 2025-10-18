<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tag extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_tag';

    public $timestamps = false;

    protected $fillable = [
        'tag_name',
    ];

    public function questions()
    {
        return $this->belongsToMany(Question::class, 'tag_questions', 'id_tag', 'id_question')
                    ->withPivot('id_tag_questions');
    }
}
