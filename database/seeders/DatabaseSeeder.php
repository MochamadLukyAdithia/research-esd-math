<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Richie Olajuwon Santoso',
            'email' => 'richieolajuwons@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'user'
        ]);
        User::factory()->create([
            'name' => 'Lexandra Hansen',
            'email' => 'lexandra@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'user'
        ]);
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'admin'
        ]);
        User::factory()->create([
            'name' => 'Admin Question',
            'email' => 'adminquestion@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'question_admin'
        ]);


        $this->call([
            UserSeeder::class,
            TagSeeder::class,
            QuestionTypeSeeder::class,
            QuestionSeeder::class,
            QuestionImageSeeder::class,
            NewsSeeder::class,
            // QuestionRelationSeeder::class,
        ]);
    }
}
