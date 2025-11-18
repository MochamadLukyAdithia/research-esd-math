<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionImageLocalSeeder extends Seeder
{
    /**
     * Run the database seeds dengan local image paths.
     * Gunakan seeder ini jika sudah ada images di folder storage/app/public/questions/
     *
     * @return void
     */
    public function run()
    {
        // Image paths menggunakan storage path (relative ke storage/app/public)
        $imageData = [
            // For Question 1: Alun-Alun Jember (3 images)
            1 => [
                'questions/alun-alun-jember-1.jpg',
                'questions/alun-alun-jember-2.jpg',
                'questions/alun-alun-jember-3.jpg',
            ],
            // For Question 2: Stasiun Jember (2 images)
            2 => [
                'questions/stasiun-jember-1.jpg',
                'questions/stasiun-jember-2.jpg',
            ],
            // For Question 3: Gedung DPR (4 images)
            3 => [
                'questions/gedung-dpr-1.jpg',
                'questions/gedung-dpr-2.jpg',
                'questions/gedung-dpr-3.jpg',
                'questions/gedung-dpr-4.jpg',
            ],
        ];

        // Insert images for each question
        foreach ($imageData as $questionId => $images) {
            foreach ($images as $imagePath) {
                DB::table('question_images')->insert([
                    'question_id' => $questionId,
                    'image_path' => $imagePath,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
