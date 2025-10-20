<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['tag_name' => 'Monumen'],
            ['tag_name' => 'Museum'],
            ['tag_name' => 'Taman'],
            ['tag_name' => 'Masjid'],
            ['tag_name' => 'Gereja'],
            ['tag_name' => 'Pasar'],
            ['tag_name' => 'Mall'],
            ['tag_name' => 'Pelabuhan'],
            ['tag_name' => 'Bandara'],
        ];

        // Insert data
        foreach ($tags as $tag) {
            Tag::create($tag);
        }

        $this->command->info('✅ Tags seeded successfully! Total: ' . count($tags));
    }
}
