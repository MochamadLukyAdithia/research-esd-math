<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionImageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get all questions
        $questions = DB::table('questions')->get();

        // Image URLs untuk berbagai soal (menggunakan placeholder images)
        $imageData = [
            // For Question 1: Alun-Alun Jember
            1 => [
                'https://via.placeholder.com/800x600?text=Alun-Alun+Jember+1',
                'https://via.placeholder.com/800x600?text=Alun-Alun+Jember+2',
                'https://via.placeholder.com/800x600?text=Alun-Alun+Jember+3',
            ],
            // For Question 2: Stasiun Jember
            2 => [
                'https://via.placeholder.com/800x600?text=Stasiun+Jember+1',
                'https://via.placeholder.com/800x600?text=Stasiun+Jember+2',
            ],
            // For Question 3: Gedung DPR
            3 => [
                'https://via.placeholder.com/800x600?text=Gedung+DPR+1',
                'https://via.placeholder.com/800x600?text=Gedung+DPR+2',
                'https://via.placeholder.com/800x600?text=Gedung+DPR+3',
                'https://via.placeholder.com/800x600?text=Gedung+DPR+4',
            ],
        ];

        // Insert images for each question
        foreach ($questions as $question) {
            $questionIndex = $question->id_question;

            if (isset($imageData[$questionIndex])) {
                foreach ($imageData[$questionIndex] as $imagePath) {
                    DB::table('question_images')->insert([
                        'question_id' => $questionIndex,
                        'image_path' => $imagePath,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            } else {
                // Default image jika tidak ada data khusus
                DB::table('question_images')->insert([
                    'question_id' => $questionIndex,
                    'image_path' => 'https://via.placeholder.com/800x600?text=Question+' . $questionIndex,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
