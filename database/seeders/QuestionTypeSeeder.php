<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('question_types')->insert([
            [
                'id_question_type' => 1,
                'question_type' => 'pilihan_ganda',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_question_type' => 2,
                'question_type' => 'isian',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
