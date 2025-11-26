<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Mochamad Luky Adithia',
            'email' => 'mochamadlukyadithiawork@gmail.com',
            'password' => bcrypt('MOCHluk2025$$'),
            'role' => 'user'
        ]);
        User::factory()->create([   
            'name' => 'Admin User',
            'email' => 'esdmathpath@gmail.com',
            'password' => bcrypt('EsdMath2025'),
            'role' => 'admin'
        ]);
        User::factory()->create([
            'name' => 'Admin Question',
            'email' => 'userquestion@gmail.com',
            'password' => bcrypt('UserQuestion2025'),
            'role' => 'question_admin'
        ]);


        $this->call([
            UserSeeder::class,
            TagSeeder::class,
            QuestionTypeSeeder::class,
            // QuestionSeeder::class,
            // QuestionImageSeeder::class,
            // NewsSeeder::class,
        ]);
    }
}
