<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hint extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_hint';
    
    public $timestamps = false;

    protected $fillable = [
        'id_question',
        'image',
        'hint_description',
    ];

    // Relationships
    public function question()
    {
        return $this->belongsTo(Question::class, 'id_question', 'id_question');
    }
}
