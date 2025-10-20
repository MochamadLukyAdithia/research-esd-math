<?php

namespace Database\Seeders;

use App\Models\Tag;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // // Create admin user
        // User::factory()->create([
        //     'name' => 'Admin User',
        //     'email' => 'admin@gmail.com',
        //     'password' => bcrypt('12345678'),
        //     'role' => 'admin'
        // ]);

        // // Create regular user
        // User::factory()->create([
        //     'name' => 'Regular User',
        //     'email' => 'user@gmail.com',
        //     'password' => bcrypt('12345678'),
        //     'role' => 'user'
        // ]);
        $this->call([
            DistrictSeeder::class,
            TagSeeder::class
        ]);

        $this->command->info('🎉 Database seeding completed successfully!');
    }
}
