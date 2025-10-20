<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('questions')->insert([
            [
                'title' => 'Menghitung Keliling Alun-Alun',
                'question' => 'Jika Alun-Alun Jember berbentuk persegi dengan sisi 110 meter, berapakah kelilingnya?',
                'location_name' => 'Alun-Alun Jember',
                'longitude' => 113.702241, 'latitude' => -8.172458,
                'question_image' => 'https://picsum.photos/seed/alun-alun/400/200',
                'id_district' => 3,
                'id_user' => 1,
                'grade' => 5,
                'correct_answer' => '/^440(\s?meter)?$/i', 
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'title' => 'Estimasi Jarak Rel Kereta',
                'question' => 'Sebuah kereta berangkat dari Stasiun Jember menuju Stasiun Kalisat yang berjarak 20 km. Jika kecepatan rata-rata kereta 60 km/jam, berapa menit waktu yang dibutuhkan?',
                'location_name' => 'Stasiun Jember',
                'longitude' => 113.710983, 'latitude' => -8.165932,
                'question_image' => 'https://picsum.photos/seed/stasiun/400/200',
                'id_district' => 2,
                'id_user' => 1,
                'grade' => 7,
                'correct_answer' => '/^20(\s?menit)?$/i',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'title' => 'Luas Area Parkir',
                'question' => 'Area parkir di depan Double Way UNEJ memiliki panjang 150 meter dan lebar 8 meter. Berapa meter persegi total luas area parkir tersebut?',
                'location_name' => 'Universitas Jember',
                'longitude' => 113.723437, 'latitude' => -8.164839,
                'question_image' => 'https://picsum.photos/seed/unej/400/200',
                'id_district' => 1,
                'id_user' => 2,
                'grade' => 4,
                'correct_answer' => '/^1200(\s?(m2|meter\s?persegi))?$/i',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'title' => 'Kapasitas Studio Bioskop',
                'question' => 'Satu studio bioskop di Lippo Plaza Jember memiliki 12 baris kursi. Jika setiap baris berisi 15 kursi, berapa total kapasitas penonton dalam satu studio?',
                'location_name' => 'Lippo Plaza Jember',
                'longitude' => 113.720001, 'latitude' => -8.156568,
                'question_image' => 'https://picsum.photos/seed/lippo/400/200',
                'id_district' => 1,
                'id_user' => 2,
                'grade' => 3,
                'correct_answer' => '/^180(\s?(orang|penonton|kursi))?$/i',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'title' => 'Pembagian Nasi Kotak',
                'question' => 'Masjid Jami\' Al Baitul Amien menerima 500 kotak nasi untuk buka puasa. Jika nasi tersebut akan dibagikan ke 25 baris (shaf) jamaah, berapa kotak nasi yang didapat setiap baris?',
                'location_name' => 'Masjid Jami\' Al Baitul Amien',
                'longitude' => 113.701815, 'latitude' => -8.173024,
                'question_image' => 'https://picsum.photos/seed/masjid-jami/400/200',
                'id_district' => 3,
                'id_user' => 1,
                'grade' => 4,
                'correct_answer' => '/^20(\s?kotak)?$/i',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'title' => 'Harga Diskon Baju',
                'question' => 'Harga sebuah baju di Roxy Square adalah Rp 150.000. Jika mendapat diskon 20%, berapa harga baju setelah diskon?',
                'location_name' => 'Roxy Square Jember',
                'longitude' => 113.721540, 'latitude' => -8.161131,
                'question_image' => 'https://picsum.photos/seed/roxy-jember/400/200',
                'id_district' => 1,
                'id_user' => 2,
                'grade' => 6,
                'correct_answer' => '/^(Rp\.?\s?)?120\.?000(,\d+)?$/i',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'title' => 'Luas Lapangan Bulu Tangkis',
                'question' => 'Lapangan bulu tangkis di GOR PKPSO Kaliwates memiliki panjang 13,4 meter dan lebar 6,1 meter. Berapa meter persegi luas total lapangan tersebut?',
                'location_name' => 'GOR PKPSO Kaliwates',
                'longitude' => 113.708811, 'latitude' => -8.181152,
                'question_image' => 'https://picsum.photos/seed/gor-kaliwates/400/200',
                'id_district' => 2,
                'id_user' => 1,
                'grade' => 6,
                'correct_answer' => '/^81[,.]74(\s?(m2|meter\s?persegi))?$/i',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'title' => 'Jumlah Warung di Papuma',
                'question' => 'Di area wisata Pantai Papuma, ada 5 area pedagang. Setiap area memiliki rata-rata 8 warung. Berapa perkiraan total warung yang ada di Pantai Papuma?',
                'location_name' => 'Pantai Papuma',
                'longitude' => 113.554032, 'latitude' => -8.428511,
                'question_image' => 'https://picsum.photos/seed/papuma/400/200',
                'id_district' => 3,
                'id_user' => 2,
                'grade' => 3,
                'correct_answer' => '/^40(\s?warung)?$/i',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'title' => 'Rata-rata Pengunjung Taman',
                'question' => 'Dalam 4 hari, jumlah pengunjung Taman Botani Sukorambi adalah 150, 200, 180, dan 230 orang. Berapa rata-rata pengunjung per hari?',
                'location_name' => 'Taman Botani Sukorambi',
                'longitude' => 113.681120, 'latitude' => -8.148002,
                'question_image' => 'https://picsum.photos/seed/botani-sukorambi/400/200',
                'id_district' => 2,
                'id_user' => 1,
                'grade' => 6,
                'correct_answer' => '/^190(\s?orang)?$/i',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'title' => 'Menghitung Sudut Simpang Tiga',
                'question' => 'Simpang tiga Tugu Adipura Jember (lampu merah) membentuk tiga sudut jalan. Jika sudut pertama 110 derajat dan sudut kedua 130 derajat, berapa derajat sudut ketiga?',
                'location_name' => 'Tugu Adipura Jember',
                'longitude' => 113.703550, 'latitude' => -8.170010,
                'question_image' => 'https://picsum.photos/seed/tugu-adipura/400/200',
                'id_district' => 3,
                'id_user' => 2,
                'grade' => 7,
                'correct_answer' => '/^120(\s?derajat|°)?$/i',
                'created_at' => now(), 'updated_at' => now(),
            ],
        ]);
    }
}
