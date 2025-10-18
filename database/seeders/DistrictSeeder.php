<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DistrictSeeder extends Seeder
{
    public function run(): void
    {
        $districts = ['Sumbersari', 'Patrang', 'Kaliwates', 'Rambipuji', 'Ajung'];
        foreach ($districts as $district) {
            DB::table('districts')->insert([
                'district_name' => $district,
            ]);
        }
    }
}
