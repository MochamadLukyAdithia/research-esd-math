<?php

namespace Database\Seeders;

use App\Models\District;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $districts = [
            ['district_name' => 'Asemrowo'],
            ['district_name' => 'Benowo'],
            ['district_name' => 'Bulak'],
            ['district_name' => 'Kenjeran'],
            ['district_name' => 'Krembangan'],
            ['district_name' => 'Pabean Cantian'],
            ['district_name' => 'Semampir'],
            ['district_name' => 'Simokerto'],
        ];

        // Insert data
        foreach ($districts as $district) {
            District::create($district);
        }

        $this->command->info('✅ Tags seeded successfully! Total: ' . count($districts));
    }
}
