<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $questionId1 = DB::table('questions')->insertGetId([
            'title' => 'Menghitung Keliling Alun-Alun',
            'question' => 'Jika Alun-Alun Jember berbentuk persegi dengan sisi 110 meter, berapakah kelilingnya?',
            'location_name' => 'Alun-Alun Jember',
            'longitude' => 113.702241,
            'latitude' => -8.172458,
            'id_user' => 1,
            'grade' => 5,
            'correct_answer' => '/^440(\s?(m|meter))?$/i',
            'id_question_type' => 2, // isian
            'created_at' => now(),
            'updated_at' => now(),
            'points' => 10,
        ]);

        DB::table('tag_questions')->insert([
            ['id_tag' => 1, 'id_question' => $questionId1, 'created_at' => now(), 'updated_at' => now()], // Geometri
        ]);

        DB::table('hints')->insert([
            [
                'id_question' => $questionId1,
                'image' => null,
                'hint_description' => 'Rumus keliling persegi adalah 4 × sisi',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $questionId2 = DB::table('questions')->insertGetId([
            'title' => 'Estimasi Jarak Rel Kereta',
            'question' => 'Sebuah kereta berangkat dari Stasiun Jember menuju Stasiun Kalisat yang berjarak 20 km. Jika kecepatan rata-rata kereta 60 km/jam, berapa menit waktu yang dibutuhkan?',
            'location_name' => 'Stasiun Jember',
            'longitude' => 113.710983,
            'latitude' => -8.165932,
            'id_user' => 1,
            'grade' => 7,
            'correct_answer' => '/^20(\s?(mnt|menit))?$/i',
            'id_question_type' => 2, // isian
            'created_at' => now(),
            'updated_at' => now(),
            'points' => 15,
        ]);

        DB::table('tag_questions')->insert([
            ['id_tag' => 2, 'id_question' => $questionId2, 'created_at' => now(), 'updated_at' => now()], // Aritmatika
        ]);

        DB::table('hints')->insert([
            [
                'id_question' => $questionId2,
                'image' => null,
                'hint_description' => 'Gunakan rumus: waktu = jarak ÷ kecepatan. Jangan lupa konversi ke menit!',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $questionId3 = DB::table('questions')->insertGetId([
            'title' => 'Persamaan Kuadrat',
            'question' => 'Tentukan akar-akar dari persamaan kuadrat x² + 5x + 6 = 0',
            'location_name' => 'Gedung DPR',
            'longitude' => 113.710983,
            'latitude' => -8.165932,
            'grade' => 9,
            'id_user' => 1,
            'correct_answer' => 'x = -2 atau x = -3',
            'id_question_type' => 1,
            'created_at' => now(),
            'updated_at' => now(),
            'points' => 20,
        ]);

        DB::table('question_options')->insert([
            [
                'id_question' => $questionId3,
                'option_text' => 'x = -2 atau x = -3',
                'is_correct' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_question' => $questionId3,
                'option_text' => 'x = 2 atau x = 3',
                'is_correct' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_question' => $questionId3,
                'option_text' => 'x = -1 atau x = -6',
                'is_correct' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id_question' => $questionId3,
                'option_text' => 'x = 1 atau x = 6',
                'is_correct' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        DB::table('tag_questions')->insert([
            ['id_tag' => 1, 'id_question' => $questionId3, 'created_at' => now(), 'updated_at' => now()], // Aljabar
            ['id_tag' => 2, 'id_question' => $questionId3, 'created_at' => now(), 'updated_at' => now()], // Persamaan
        ]);
    }
}
