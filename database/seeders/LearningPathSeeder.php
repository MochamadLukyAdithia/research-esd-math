<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LearningPathSeeder extends Seeder
{
    public function run(): void
    {
    //   // =========================================================================
    //     // 1. BUAT SOAL DUMMY (Akan masuk ke tabel questions & question_options)
    // $pgTypeId = DB::table('question_types')
    //     ->where('question_type', 'pilihan_ganda')
    //     ->value('id_question_type');

    // $isianTypeId = DB::table('question_types')
    //     ->where('question_type', 'isian')
    //     ->value('id_question_type');

    // ALTERNATIVE: If you just want to get the first and second record 
    // regardless of column names:
    // if (!$pgTypeId) {
    //     $types = DB::table('question_types')->pluck('id_question_type')->toArray();
    //     $pgTypeId = $types[0] ?? null;
    //     $isianTypeId = $types[1] ?? null;
    // }
        
   
// Soal 1: Pilihan Ganda
// $q1Id = DB::table('questions')->insertGetId([
//     'id_user' => 1, // Assign to yourself (Mochamad Luky Adithia)
//     'title' => 'Persamaan Linear Dasar',
//     'question' => 'Berapa nilai x dari persamaan 2x = 4?',
//     'id_question_type' => $pgTypeId,
//     'points' => 50,
//     'grade' => 7,
//     'correct_answer' => null,
//     'location_name' => 'Alun-alun Jember',
//     'latitude' => -8.172233,
//     'longitude' => 113.700053,
//     'created_at' => now(),
//     'updated_at' => now(),
// ]);
//         DB::table('question_options')->insert([
//             ['id_question' => $q1Id, 'option_text' => '1', 'is_correct' => false],
//             ['id_question' => $q1Id, 'option_text' => '2', 'is_correct' => true],
//             ['id_question' => $q1Id, 'option_text' => '3', 'is_correct' => false],
//             ['id_question' => $q1Id, 'option_text' => '4', 'is_correct' => false],
//         ]);

        // Soal 2: Isian Singkat
        // $q2Id = DB::table('questions')->insertGetId([
        //      'id_user' => 1, // Assign to yourself (Mochamad Luky Adithia)
        //     'title' => 'Mencari Variabel',
        //     'question' => 'Jika x + 3 = 8, maka nilai x adalah...',
        //     'id_question_type' => $isianTypeId,
        //     'points' => 50,
        //     'grade' => 7, // Add this line
        //     'correct_answer' => '5',
        //     'location_name' => 'Kampus Unej',      // Tambahan agar tidak error
        //     'latitude' => -8.163351,               // Tambahan
        //     'longitude' => 113.715372,             // Tambahan
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);

        // Soal 3: Pilihan Ganda
        // $q3Id = DB::table('questions')->insertGetId([
        //      'id_user' => 1, // Assign to yourself (Mochamad Luky Adithia)
        //     'title' => 'Identifikasi Variabel',
        //     'question' => 'Manakah yang merupakan variabel pada persamaan 3y + 5 = 11?',
        //     'id_question_type' => $pgTypeId,
        //     'points' => 50,
        //     'grade' => 7, // Add this line
        //     'correct_answer' => null,
        //     'location_name' => 'Pasar Tanjung',    // Tambahan agar tidak error
        //     'latitude' => -8.170660,               // Tambahan
        //     'longitude' => 113.697424,             // Tambahan
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);
        // DB::table('question_options')->insert([
        //     ['id_question' => $q3Id, 'option_text' => '3', 'is_correct' => false],
        //     ['id_question' => $q3Id, 'option_text' => '5', 'is_correct' => false],
        //     ['id_question' => $q3Id, 'option_text' => 'y', 'is_correct' => true],
        //     ['id_question' => $q3Id, 'option_text' => '11', 'is_correct' => false],
        // ]);

        // Soal 4: Isian Singkat (Soal Cerita Kontekstual)
        // $q4Id = DB::table('questions')->insertGetId([
        //      'id_user' => 1, // Assign to yourself (Mochamad Luky Adithia)
        //     'title' => 'Soal Cerita Aljabar',
        //     'question' => 'Sebuah apel harganya x rupiah. 3 apel harganya Rp6.000. Berapa nilai x?',
        //     'id_question_type' => $isianTypeId,
        //     'points' => 50,
        //     'grade' => 7, // Add this line
        //     'correct_answer' => '2000',
        //     'location_name' => 'Pasar Kreongan',   // Tambahan agar tidak error
        //     'latitude' => -8.156711,               // Tambahan
        //     'longitude' => 113.702206,             // Tambahan
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);
        // =========================================================================
        // 2. BUAT LEARNING PATH & MODULES
        // =========================================================================
        
        // $learningPathId = DB::table('learning_paths')->insertGetId([
        //     'title' => 'Aljabar Linear Dasar untuk SMP',
        //     'description' => 'Mempelajari konsep persamaan linear dengan pendekatan kontekstual ESD.',
        //     'grade' => 7,
        //     'category' => 'Aljabar',
        //     'estimated_minutes' => 120,
        //     'is_published' => true,
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);

        // $modules = [
        //     ['title' => 'Pre-Test Aljabar', 'type' => 'pre_test', 'order' => 1],
        //     ['title' => 'Mengenal Variabel di Alam', 'type' => 'material', 'order' => 2],
        //     ['title' => 'Simulasi Pasar Tradisional', 'type' => 'activity', 'order' => 3],
        //     ['title' => 'Post-Test Aljabar', 'type' => 'post_test', 'order' => 4],
        //     ['title' => 'Refleksi Belajar Mandiri', 'type' => 'reflection', 'order' => 5],
        // ];

        // $moduleIds = [];
        // foreach ($modules as $mod) {
        //     $moduleIds[$mod['type']] = DB::table('learning_path_modules')->insertGetId([
        //         'id_learning_path' => $learningPathId,
        //         'title' => $mod['title'],
        //         'type' => $mod['type'],
        //         'order_number' => $mod['order'],
        //         'is_required' => true,
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ]);
        // }

        // =========================================================================
        // 3. MASUKKAN MATERI & HUBUNGKAN SOAL KE MODUL (PIVOT)
        // =========================================================================

        // Material Content
        // DB::table('learning_materials')->insert([
        //     [
        //         'id_module'    => $moduleIds['material'],
        //         'title'         => 'Video Pengenal Variabel',
        //         'content_type'  => 'video',
        //         'content'       => 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Dummy valid embed
        //         'file_path'     => null,
        //         'order_number'  => 1,
        //         'created_at'    => now(),
        //         'updated_at'    => now(),
        //     ],
        //     [
        //         'id_module'    => $moduleIds['material'],
        //         'title'         => 'Slide Konsep Persamaan',
        //         'content_type'  => 'slide',
        //         'content'       => null,
        //         'file_path'     => 'materials/slides/aljabar_1.pdf',
        //         'order_number'  => 2,
        //         'created_at'    => now(),
        //         'updated_at'    => now(),
        //     ]
        // ]);

        // Assign Soal ke Pre-Test (Soal 1 & 2)
        // DB::table('module_questions')->insert([
        //     ['id_module' => $moduleIds['pre_test'], 'id_question' => $q1Id, 'order_number' => 1, 'created_at' => now(), 'updated_at' => now()],
        //     ['id_module' => $moduleIds['pre_test'], 'id_question' => $q2Id, 'order_number' => 2, 'created_at' => now(), 'updated_at' => now()],
        // ]);

        // Assign Soal ke Post-Test (Soal 3 & 4)
        // DB::table('module_questions')->insert([
        //     ['id_module' => $moduleIds['post_test'], 'id_question' => $q3Id, 'order_number' => 1, 'created_at' => now(), 'updated_at' => now()],
        //     ['id_module' => $moduleIds['post_test'], 'id_question' => $q4Id, 'order_number' => 2, 'created_at' => now(), 'updated_at' => now()],
        // ]);

        // =========================================================================
        // 4. BUAT BADGES
        // =========================================================================
        DB::table('badges')->insert([
            [
                'name' => 'Aljabar Starter',
                'description' => 'Menyelesaikan modul aljabar pertama kali',
                'criteria_type' => 'complete_path',
                'criteria_value' => 1,
                'created_at' => now(),
            ],
            [
                'name' => 'High Scorer',
                'description' => 'Mendapat nilai post-test di atas 90',
                'criteria_type' => 'score_above',
                'criteria_value' => 90,
                'created_at' => now(),
            ]
        ]);

        // =========================================================================
        // 5. CONTOH PROGRESS (Opsional, agar user ID 1 langsung bisa melihat tombol 'Lanjutkan')
        // =========================================================================
    //     $userId = 1;
    //     if (DB::table('users')->where('id_user', $userId)->exists()) {
    //         DB::table('user_learning_path_progress')->insert([
    //             'id_user' => $userId,
    //             'id_learning_path' => $learningPathId,
    //             'pre_test_score' => null, // Dibuat null agar user bisa mengerjakan pre-test
    //             'progress_percentage' => 0,
    //             'status' => 'in_progress',
    //             'started_at' => now(),
    //             'created_at' => now(),
    //         ]);

    //         DB::table('user_module_progress')->insert([
    //             'id_user' => $userId,
    //             'id_module' => $moduleIds['pre_test'],
    //             'status' => 'in_progress', // Modul pre-test sedang terbuka
    //             'completed_at' => null,
    //             'is_synced' => true,
    //         ]);
    //     }
    }
}