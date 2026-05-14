<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LearningPathSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Learning Path
        $learningPathId = DB::table('learning_paths')->insertGetId([
            'title' => 'Aljabar Linear Dasar untuk SMP',
            'description' => 'Mempelajari konsep persamaan linear dengan pendekatan kontekstual ESD.',
            'grade' => 7,
            'category' => 'Aljabar',
            'estimated_minutes' => 120,
            'is_published' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Seed Modules untuk Learning Path tersebut
        $modules = [
            ['title' => 'Pre-Test Aljabar', 'type' => 'pre_test', 'order' => 1],
            ['title' => 'Mengenal Variabel di Alam', 'type' => 'material', 'order' => 2],
            ['title' => 'Simulasi Pasar Tradisional', 'type' => 'activity', 'order' => 3],
            ['title' => 'Post-Test Aljabar', 'type' => 'post_test', 'order' => 4],
            ['title' => 'Refleksi Belajar Mandiri', 'type' => 'reflection', 'order' => 5],
        ];

        $moduleIds = [];
        foreach ($modules as $mod) {
            $moduleIds[$mod['type']] = DB::table('learning_path_modules')->insertGetId([
                'id_learning_path' => $learningPathId,
                'title' => $mod['title'],
                'type' => $mod['type'],
                'order_number' => $mod['order'],
                'is_required' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 3. Seed Learning Materials (untuk module tipe material)
      DB::table('learning_materials')->insert([
    [
        'id_module'    => $moduleIds['material'],
        'title'         => 'Video Pengenal Variabel',
        'content_type'  => 'video', // Enum value
        'content'       => 'https://youtube.com/embed/sample',
        'file_path'     => null,
        'order_number'  => 1,
        'created_at'    => now(),
        'updated_at'    => now(),
    ],
    [
        'id_module'    => $moduleIds['material'],
        'title'         => 'Slide Konsep Persamaan',
        'content_type'  => 'slide', // Enum value
        'content'       => null,
        'file_path'     => 'materials/slides/aljabar_1.pdf',
        'order_number'  => 2,
        'created_at'    => now(),
        'updated_at'    => now(),
    ]
]);

        // 4. Seed Badges
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

        // 5. Contoh Data Transaksional (Opsional - User ID 1 diasumsikan sudah ada)
        $userId = 1; // Pastikan user dengan ID 1 ada di tabel users
        
        if (DB::table('users')->where('id_user', $userId)->exists()) {
            // Progress Path
            DB::table('user_learning_path_progress')->insert([
                'id_user' => $userId,
                'id_learning_path' => $learningPathId,
                'pre_test_score' => 70,
                'progress_percentage' => 40,
                'status' => 'in_progress',
                'started_at' => now(),
                'created_at' => now(),
            ]);

            // Progress Modul
            DB::table('user_module_progress')->insert([
                'id_user' => $userId,
                'id_module' => $moduleIds['pre_test'],
                'status' => 'completed',
                'completed_at' => now(),
                'is_synced' => true,
            ]);

            // Offline Sync Queue (Contoh data yang belum sinkron)
            DB::table('offline_sync_queue')->insert([
                'id_user' => $userId,
                'action_type' => 'submit_reflection',
                'payload' => json_encode([
                    'id_module' => $moduleIds['reflection'],
                    'rating' => 5,
                    'understood_concepts' => 'Konsep variabel X dan Y',
                ]),
                'status' => 'pending',
                'attempts' => 0,
                'acted_at' => Carbon::now()->subMinutes(10),
                'created_at' => now(),
            ]);
        }
    }
}