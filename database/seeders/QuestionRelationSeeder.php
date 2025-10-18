<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionRelationSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tag_questions')->insert([
            ['id_question' => 1, 'id_tag' => 1],
            ['id_question' => 1, 'id_tag' => 3],
            ['id_question' => 2, 'id_tag' => 2],
            ['id_question' => 3, 'id_tag' => 1],
            ['id_question' => 4, 'id_tag' => 3],
        ]);

        DB::table('user_answers')->insert([
            [
                'id_question' => 1,
                'id_user' => 2,
                'answer' => 440,
                'is_correct' => true,
                'answered_at' => now(),
            ],
            [
                'id_question' => 2,
                'id_user' => 2,
                'answer' => 30,
                'is_correct' => false,
                'answered_at' => now(),
            ],
        ]);

        DB::table('favorite_questions')->insert([
            ['id_question' => 3, 'id_user' => 2],
            ['id_question' => 1, 'id_user' => 2],
        ]);

        DB::table('hints')->insert([
            [
                'id_question' => 1,
                'image' => 'https://picsum.photos/seed/hint1/300/150',
                'hint_description' => 'Keliling persegi dihitung dengan menjumlahkan panjang keempat sisinya.',
            ]
        ]);
    }
}
