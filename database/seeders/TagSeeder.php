<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = ['Geometri', 'Aljabar', 'Aritmatika', 'Logika', 'Statistika'];
        foreach ($tags as $tag) {
            DB::table('tags')->insert([
                'tag_name' => $tag,
            ]);
        }
    }
}
