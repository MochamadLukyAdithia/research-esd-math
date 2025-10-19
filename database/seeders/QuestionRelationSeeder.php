<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionRelationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tag_questions')->insert([
            ['id_question' => 1, 'id_tag' => 1], ['id_question' => 1, 'id_tag' => 3],
            ['id_question' => 2, 'id_tag' => 3],
            ['id_question' => 3, 'id_tag' => 1],
            ['id_question' => 4, 'id_tag' => 3],
            ['id_question' => 5, 'id_tag' => 3], ['id_question' => 5, 'id_tag' => 4],
            ['id_question' => 6, 'id_tag' => 3],
            ['id_question' => 7, 'id_tag' => 1], ['id_question' => 7, 'id_tag' => 3],
            ['id_question' => 8, 'id_tag' => 3],
            ['id_question' => 9, 'id_tag' => 5],
            ['id_question' => 10, 'id_tag' => 1],
        ]);

        DB::table('user_answers')->insert([
            [
                'id_question' => 1, 'id_user' => 2, 'answer' => '440 meter',
                'is_correct' => true, 'answered_at' => now()->subDays(2),
            ],
            [
                'id_question' => 2, 'id_user' => 2, 'answer' => '30',
                'is_correct' => false, 'answered_at' => now()->subDays(1),
            ],
            [
                'id_question' => 3, 'id_user' => 1, 'answer' => '1200 m',
                'is_correct' => false, 'answered_at' => now()->subHours(5),
            ],
             [
                'id_question' => 4, 'id_user' => 1, 'answer' => '180',
                'is_correct' => true, 'answered_at' => now()->subHours(3),
            ],
        ]);

        DB::table('favorite_questions')->insert([
            ['id_question' => 5, 'id_user' => 1],
            ['id_question' => 9, 'id_user' => 1],

            ['id_question' => 1, 'id_user' => 2],
            ['id_question' => 3, 'id_user' => 2],
            ['id_question' => 7, 'id_user' => 2],
        ]);

        DB::table('hints')->insert([
            [
                'id_question' => 1, 'image' => null,
                'hint_description' => 'Keliling sebuah bangun datar adalah total panjang semua sisinya.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id_question' => 1, 'image' => null,
                'hint_description' => 'Karena alun-alun berbentuk persegi, maka keempat sisinya memiliki panjang yang sama.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id_question' => 1, 'image' => 'https://picsum.photos/seed/hint-rumus-persegi/400/200',
                'hint_description' => 'Rumus untuk keliling persegi adalah 4 dikali panjang salah satu sisinya (K = 4 x s).',
                'created_at' => now(), 'updated_at' => now(),
            ],

            [
                'id_question' => 2, 'image' => 'https://picsum.photos/seed/hint-segitiga-jkw/400/200',
                'hint_description' => 'Gunakan rumus dasar kecepatan: Waktu = Jarak / Kecepatan.',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id_question' => 2, 'image' => null,
                'hint_description' => 'Hasil perhitungan akan dalam satuan jam. Jangan lupa mengubahnya menjadi menit (1 jam = 60 menit).',
                'created_at' => now(), 'updated_at' => now(),
            ],

            [
                'id_question' => 6, 'image' => null,
                'hint_description' => 'Pertama, hitung besar potongan harga. Diskon 20% dari Rp 150.000 adalah berapa?',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'id_question' => 6, 'image' => 'https://picsum.photos/seed/hint-diskon/400/200',
                'hint_description' => 'Harga akhir adalah Harga Awal dikurangi besar potongan harga.',
                'created_at' => now(), 'updated_at' => now(),
            ],
        ]);
    }
}
