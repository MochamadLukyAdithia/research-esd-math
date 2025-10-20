<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_district';
    
    public $timestamps = false;

    protected $fillable = [
        'district_name',
    ];

    // Relationships
    public function questions()
    {
        return $this->hasMany(Question::class, 'id_district', 'id_district');
    }
}
